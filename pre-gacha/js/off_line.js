$(document).ready(function () {
  console.log("off_line.js 開始執行");
  // alert("off_line.js 腳本執行開始");

  // 地圖展開/收合功能 (放到最上方確保優先執行)
  $(document).on("click", ".map_collapse_btn", function (e) {
    console.log("[map_collapse_btn] 點擊觸發！類名：", this.className);

    var $btn = $(this);
    var $mapDesk = $(".map_desk");

    if ($btn.hasClass("state_open")) {
      // 切換為收合狀態 (close)
      console.log("[map_collapse_btn] 執行收合動畫");
      $btn.removeClass("state_open").addClass("state_close");
      $mapDesk.addClass("collapsed");
    } else {
      // 切換為展開狀態 (open)
      console.log("[map_collapse_btn] 執行展開動畫");
      $btn.removeClass("state_close").addClass("state_open");
      $mapDesk.removeClass("collapsed");
    }
    e.stopPropagation();
  });

  // 地圖全螢幕 (Zoom) 功能
  $(document).on("click", ".mapZoom", function (e) {
    console.log("[mapZoom] 點擊觸發！");
    $(".event_main").toggleClass("is_zoomed");
    e.stopPropagation();
  });

  function openOnlyModal(targetId) {
    // 1. 關閉所有目前顯示的 modal
    // 這裡使用 Bootstrap 的 modal('hide') 方法
    $(".modal").modal("hide");

    // 2. 短暫延遲後開啟目標 modal (避免動畫衝突)
    // Bootstrap modal 有時在關閉動畫同時開起另一個會有問題，稍微延遲會比較穩
    setTimeout(function () {
      $(targetId).modal("show");
    }, 300); // 300ms 讓上一個彈窗有時間消失
  }
  window.openOnlyModal = openOnlyModal; // 指派為全域函數供 demo.js 使用

  // 補充：全域文字替換 (模擬樣板引擎行為)
  // 確保 ViewObj 存在，且 DOM 載入後執行
  if (typeof ViewObj !== "undefined") {
    // 替換 {privacy}
    $("label, p, div, span, a").each(function () {
      var text = $(this).text();
      if (text.indexOf("{privacy}") > -1) {
        $(this).text(text.replace("{privacy}", ViewObj.privacy));
      }
    });

    // 替換 {privacy_list} (支援 HTML 內容)
    $("li, div, p").each(function () {
      var html = $(this).html();
      if (html.indexOf("{privacy_list}") > -1) {
        var privacyListContent = ViewObj.privacy_list;
        // 如果是陣列，轉換為 li 格式
        if (Array.isArray(privacyListContent)) {
          privacyListContent = privacyListContent.join("</li><li>");
        }
        $(this).html(html.replace("{privacy_list}", privacyListContent));
      }
    });
  }
  // 1. 活動規則按鈕
  $(".rule").on("click", function () {
    openOnlyModal("#popRule");
  });

  // 2. 分享按鈕 (等待後台串接)
  // $(".share").on("click", function () {
  //   openOnlyModal("#popShare");
  // });

  // 3. 獎勵按鈕
  $(".award").on("click", function () {
    openOnlyModal("#popAward");
  });

  // 預約登錄按鈕 (.pr)
  $(".pr").on("click", function () {
    openOnlyModal("#regressmodal");
  });
  
  // 4. 道具背包
  $(".prize_bag").on("click", function () {
    openOnlyModal("#popItemBag");
  });

  // 背景音樂
  var bgMusic = new BgMusic({
    src: "https://rests-nte.iwplay.com.tw/media/nte_gw_bgm_20250514.mp3",
    on: function () {
      //支援自動播放
      $(".music").removeClass("off");
    },
    off: function () {
      //不支援自動播放
      $(".music").addClass("off");
    },
  });
  $(".music").on("click", function (e) {
    if ($(this).hasClass("off")) {
      $(this).removeClass("off");
      bgMusic.audio.play();
    } else {
      $(this).addClass("off");
      bgMusic.audio.pause();
    }
  });

  // login-iw
  $(".yy_platform button").on("click", function () {
    $(".yy_platform button").removeClass("on");
    $(this).toggleClass("on");
  });
  function getSystems() {
    var arr = [];
    $(".yy_platform button.on").each(function () {
      arr.push($(this).attr("system"));
    });
    return arr;
  }

  // footer
  $(".footer").load("https://ids.iwplay.com.tw/includ/footer/12b_nte_new.html");

  // Page Interaction - 頁面切換系統
  // 建立一個通用的頁面切換函數，避免重複程式碼

  /**
   * 切換頁面函數
   * @param {string} targetPage - 要顯示的目標頁面（class 選擇器，例如：'.event_index'）
   */
  window.isLogin = false;
  function switchPage(targetPage, targetDesk) {
    console.log(
      "[switchPage] 跳轉至:",
      targetPage,
      "攜帶目標櫃檯:",
      targetDesk,
    );
    // 定義所有的 event 頁面
    const allPages = [".event_main", ".event_loading", ".event_index", ".event_city_card_custom", ".event_item_market"];

    // 特殊情況：如果目標就是 Loading 頁面，直接顯示就好，不用過場
    if (targetPage === ".event_loading") {
      allPages.forEach(function (page) {
        if (page !== targetPage) {
          $(page).hide();
        }
      });
      $(targetPage).show();
      return;
    }

    // 1. 先顯示 Loading 頁並隱藏其他頁面，同時也隱藏 footer (由下往下滑出)
    allPages.forEach(function (page) {
      if (page !== ".event_loading") {
        $(page).hide(); // 立即隱藏其他頁面
      }
    });

    $(".footer").removeClass("show"); 
    $(".event_loading").css("display", "block"); // 確保 Loading 顯示 (如果它是 flex/block)

    // 2. 0.8秒後顯示目標頁面
    setTimeout(function () {
      // 隱藏 Loading
      $(".event_loading").fadeOut(300, function () {
        // 如果目標是主活動頁，先重置狀態
        if (targetPage === ".event_main") {
          $(
            ".event_main .map_desk .mapbtn, .event_main .map_desk .mapbtn_big",
          ).removeClass("active");
          $(".event_main .desk .desk_base")
            .hide()
            .removeClass("desk_anim_in desk_anim_out");

          // 判斷初始顯示頁面
          if (targetDesk) {
            $(targetDesk).css("display", "flex").addClass("desk_anim_in");
          } else if ($(".desk_double_yy").hasClass("none")) {
            // 時間OFF (.none) -> 顯示 A1
            $(".event_main .desk .desk_A1")
              .css("display", "flex")
              .addClass("desk_anim_in");
          } else {
            // 時間ON (預設) -> 顯示 desk_double_yy (延遲顯示，晚於地圖出現)
            setTimeout(function () {
              $(".event_main .desk .desk_double_yy")
                .css("display", "flex")
                .addClass("desk_anim_in");
            }, 800);
          }

          // 重置 Tab 為 Daily (如果有的話)
          $(".tab_switch .daily_tab").trigger("click");
        }

        // 顯示目標頁面
        $(targetPage).fadeIn(300, function() {
            // 如果目標是首頁，則顯示 footer (由下往上滑入)
            if (targetPage === ".event_index") {
                $(".footer").addClass("show");
            }
        });
      });
    }, 800);
  }
  window.switchPage = switchPage;

  // 導覽跳轉：跳轉至 event_index
  $(".index").on("click", function () {
    switchPage(".event_index");
  });

  // [New] Index 頁面按鈕跳轉
  $(document).on("click", ".city_card_custom_btn", function () {
    switchPage(".event_city_card_custom");
  });

  $(document).on("click", ".item_market_btn", function () {
    switchPage(".event_item_market");
  });

  // 查看市民卡按鈕 (修改處：同步 #btn_go_card 的行為)
  $(document).on("click", ".check_card, #btn_go_card", function () {
    const isSaved = localStorage.getItem("nte_card_is_saved");

    if (isSaved) {
      // 有保存過(成功製作)的身分卡，開啟 customSuccessModal
      if (typeof completeCard === "function") {
        completeCard(); // 這會同步資料並開啟 #customSuccessModal
      } else {
        window.openOnlyModal("#customSuccessModal");
      }
    } else {
      // 尚未製作市民卡，前往定製頁面
      switchPage(".event_city_card_custom");
    }
  });


  $(".yyBtn").on("click", function () {
    $("#regressmodal").modal("show", this);
  });

  // 2. double_yyBtn & event_main_btn -> 判斷登入已移至 demo.js
  // 已由 demo.js 處理 double_yyBtn 點擊事件

  // 點擊 event_main_btn -> 已停用
  // $(".event_main_btn").on("click", function () { ... });


  // 點擊 event_mapBtn (Demo用/無需登入) -> 直接進主活動頁
  $(".event_mapBtn").on("click", function () {
    switchPage(".event_main");
  });



  // 點擊 mapChara_hint (地圖人物) -> 根據時間狀態切換
  $(".mapChara_hint").on("click", function () {
    // 如果目前是全螢幕，點擊角色後縮小地圖
    $(".event_main").removeClass("is_zoomed");

    if (window.switchPage) {
      // 如果時間是 OFF，則開啟 desk_hint 櫃檯
      if ($(".event_timeBtn").text() === "時間OFF") {
        window.switchPage(".event_main", ".desk_hint");
      }
    }
  });

  // 點擊 event_loadingBtn → 切換到 Loading 頁面
  $(".event_loadingBtn").on("click", function () {
    switchPage(".event_loading");
  });

  // 9. 時間開關按鈕 (.event_timeBtn)
  $(".event_timeBtn").on("click", function () {
    var $targetDesk = $(".desk_double_yy");
    var $hint = $(".event_main .map_desk .mapChara_hint");
    var $btn = $(this);
    var $pics = $(
      ".event_main .desk .desk_base:not(.desk_A1):not(.desk_A2) .desk_pic",
    );

    if ($targetDesk.hasClass("none")) {
      // 目前為 OFF -> 切換為 ON
      $targetDesk.removeClass("none");
      $btn.text("時間ON");
      $pics.addClass("show_hint");
      $pics.addClass("show_hint");
    } else {
      // 目前為 ON -> 切換為 OFF
      $targetDesk.addClass("none");
      $btn.text("時間OFF");
      $pics.removeClass("show_hint");
      $pics.removeClass("show_hint");

      // 若當前正顯示 desk_double_yy，強制切換至 A1
      if ($targetDesk.is(":visible")) {
        $targetDesk.removeClass("desk_anim_in").hide();
        $(".desk_A1").show().addClass("desk_anim_in");
      }
    }
  });

  // [New] .event_main_btn 點擊事件：顯示 "活動尚未開啟"
  $(document).on("click", ".event_main_btn", function () {
    $("#popMsg .popMsgCont p").text("活動尚未開啟");
    window.openOnlyModal("#popMsg");
  });

  // Tab Switch (content_A1)
  $(".tab_switch .tab_btn").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");

    var $container = $(this).closest(".desk_content");
    var $onceList = $container.find(".task_list.once_task");
    var $dailyList = $container.find(".task_list.daily_task");
    var $timeHint = $container.find(".time_hint");

    if ($(this).hasClass("daily_tab")) {
      $onceList.hide();
      $dailyList.show();
      $timeHint.show(); // Show 23:59 hint
    } else {
      $dailyList.hide();
      $onceList.show();
      $timeHint.hide(); // Hide hint
    }
  });

  // Init Tab State (Default Daily)
  $(".tab_switch .daily_tab").first().trigger("click");

  // --- Scroll Animation (IntersectionObserver) ---
  const invItems = document.querySelectorAll(
    ".event_main .desk .desk_hint, .event_main .map_desk",
  );
  let mapTimers = []; // 用於管理 mapChara 和按鈕的動畫計時器

  if (invItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 進入畫面 → 淡入並滑入
            entry.target.classList.add("fade_in");

            // 如果是 map_desk，執行序列進場動畫
            if (entry.target.classList.contains("map_desk")) {
              // 1. 定義要執行動畫的元素順序
              const selectors = [
                ".mapbtn_A1",
                ".mapbtn_A2",
                ".mapbtn_B1",
                ".mapbtn_B2",
                ".mapbtn_B3",
                ".mapbtn_B4",
                ".mapbtn_B5",
                ".mapbtn_C1",
                ".mapbtn_C2",
                ".mapbtn_C3",
                ".mapChara",
              ];
              const elements = [];

              // 2. 收集 DOM 元素並初始化狀態 (隱藏)
              selectors.forEach((sel) => {
                const el = entry.target.querySelector(sel);
                if (el) {
                  el.classList.add("op-0"); // 先隱藏
                  el.classList.remove(
                    "bounce-in-top",
                    "jello-loop",
                    "jello-vertical",
                  ); // 清除舊動畫
                  void el.offsetWidth; // 強制重繪
                  elements.push({
                    el: el,
                    isBig: sel.includes("mapbtn_A"), // 大按鈕
                    isChara: sel.includes("mapChara"), // 角色
                  });
                }
              });

              // 3. 設定序列動畫
              // 需等地圖進場動畫完成 (0.5s delay + 0.8s transition = 1.3s)
              const mapEntranceTime = 1300;

              const startDropTimer = setTimeout(() => {
                if (!entry.target.classList.contains("fade_in")) return;

                const totalDuration = 250;
                const interval =
                  elements.length > 1
                    ? totalDuration / (elements.length - 1)
                    : 0;

                elements.forEach((item, index) => {
                  const delay = index * interval;

                  // 進場 timer
                  const t1 = setTimeout(() => {
                    if (!entry.target.classList.contains("fade_in")) return;

                    item.el.classList.remove("op-0");
                    item.el.classList.add("bounce-in-top");

                    // 如果需要循環動畫 (大按鈕 或 角色)
                    if (item.isBig || item.isChara) {
                      // 彈跳結束後 (1.5s) 切換循環
                      const t2 = setTimeout(() => {
                        if (!entry.target.classList.contains("fade_in")) return;

                        item.el.classList.remove("bounce-in-top");

                        // 定義循環動畫邏輯
                        const startLoopAnimation = (intervalTime) => {
                          const doLoop = () => {
                            if (!entry.target.classList.contains("fade_in"))
                              return;
                            item.el.classList.add("jello-vertical");

                            const t3 = setTimeout(() => {
                              item.el.classList.remove("jello-vertical");
                              const t4 = setTimeout(doLoop, intervalTime);
                              mapTimers.push(t4);
                            }, 900);
                            mapTimers.push(t3);
                          };
                          // 啟動第一次延遲
                          const tStart = setTimeout(doLoop, intervalTime);
                          mapTimers.push(tStart);
                        };

                        // 根據類型設定不同的循環間隔
                        if (item.isBig) {
                          // 大按鈕：直接加上 class，讓 CSS infinite 自己跑
                          item.el.classList.add("jello-loop");
                        }
                        if (item.isChara) {
                          startLoopAnimation(1500); // 角色間隔 3秒
                        }
                      }, 1500);
                      mapTimers.push(t2);
                    }
                  }, delay);
                  mapTimers.push(t1);
                });
              }, mapEntranceTime);

              mapTimers.push(startDropTimer);
            }
          } else {
            // 離開畫面 → 淡出並重置位置
            entry.target.classList.remove("fade_in");

            // 清除所有 map_desk 相關的計時器與動畫
            if (entry.target.classList.contains("map_desk")) {
              mapTimers.forEach((t) => clearTimeout(t));
              mapTimers = []; // 清空陣列

              // 重置所有子元素 class
              const allChilds = entry.target.querySelectorAll(
                ".mapbtn, .mapbtn_big, .mapChara",
              );
              allChilds.forEach((el) => {
                el.classList.remove(
                  "bounce-in-top",
                  "jello-loop",
                  "jello-vertical",
                  "op-0",
                );
              });
            }
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    invItems.forEach((item) => observer.observe(item));
  }

  // --- 地圖按鈕點擊事件 ---
  $(document).on(
    "click",
    ".event_main .map_desk .mapbtn, .event_main .map_desk .mapbtn_big",
    function () {
      // 如果目前是全螢幕，點擊按鈕後縮小地圖
      $(".event_main").removeClass("is_zoomed");

      // 移除其他按鈕的 active 樣式
      $(
        ".event_main .map_desk .mapbtn, .event_main .map_desk .mapbtn_big",
      ).removeClass("active");
      // 為當前點擊的按鈕加上 active 樣式
      $(this).addClass("active");

      // 解析目標 Desk ID
      var classes = $(this).attr("class").split(/\s+/);
      var targetId = "";
      $.each(classes, function (index, cls) {
        if (cls.indexOf("mapbtn_") === 0 && cls !== "mapbtn_big") {
          targetId = cls.replace("mapbtn_", "desk_");
        }
      });

      if (!targetId) return;

      var $targetDesk = $(".event_main .desk ." + targetId);
      var $currentDesk = $(".event_main .desk .desk_base:visible").not(
        ".desk_anim_out",
      );

      if ($targetDesk.is($currentDesk)) return;

      // 執行切換動畫
      if ($currentDesk.length > 0) {
        $currentDesk.removeClass("desk_anim_in").addClass("desk_anim_out");
        setTimeout(function () {
          $currentDesk.hide().removeClass("desk_anim_out");
        }, 800);
      }

      $targetDesk.removeClass("desk_anim_out").hide();
      requestAnimationFrame(() => {
        $targetDesk.show().addClass("desk_anim_in");
      });
    },
  );

  // --- 任務面板 Tab 切換事件 ---
  $(document).on("click", ".tab_btn", function () {
    // 按鈕樣式切換
    $(this).siblings(".tab_btn").removeClass("active");
    $(this).addClass("active");

    // 內容切換
    if ($(this).hasClass("once_tab")) {
      $(".once_task").show();
      $(".daily_task").hide();
    } else if ($(this).hasClass("daily_tab")) {
      $(".once_task").hide();
      $(".daily_task").show();
    }
  });

  // 5. 市民卡定製介面互動邏輯
  // ------------------------------------------------------------------------

  // 儲存定製狀態
  // 初始化：顯示目標頁面 (.event_index)
  setTimeout(() => {
    $(".once_tab").trigger("click");
    switchPage(".event_index");
  }, 100);
});
