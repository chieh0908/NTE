$(document).ready(function () {
  console.log("off_line.js 開始執行");
  // alert("off_line.js 腳本執行開始");

  // 攔截手機原生捲動，確保滑動自定義切換流暢
  window.addEventListener(
    "touchmove",
    function (e) {
      // 檢查目前是否在全螢幕區塊，且不在自定義捲動區塊內
      const $target = $(e.target);
      if (
        $target.closest(".cus-scroll").length > 0 ||
        $target.closest(".modal-body").length > 0
      ) {
        return; // 允許內部捲動區塊或彈窗內容正常運作
      }

      // 當目前顯示的是主頁面區塊時，防止瀏覽器原生捲動/回彈行為
      const anyEventVisible =
        $(".event_index:visible, .event_index2:visible, .event_map:visible")
          .length > 0;
      if (anyEventVisible) {
        if (e.cancelable) e.preventDefault();
      }
    },
    { passive: false },
  ); // 必須設為 non-passive 才能使用 preventDefault()

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

    // 如果不是 column (未展開/電腦版橫版展開)，可以視需求保留 reflow (目前跑馬燈全改 JS，其實不一定要 reflow，但保留以防萬一)
    var $award = $(".content_A2 .board .lottery_award");
    if ($award.length && $award.css("flex-direction") !== "column") {
      $award.css({ transition: "none", transform: "translate3d(0,0,0)" });
    }

    e.stopPropagation();
  });

  // 地圖全螢幕 (Zoom) 功能
  $(document).on("click", ".mapZoom", function (e) {
    console.log("[mapZoom] 點擊觸發！");
    $(".event_map").toggleClass("is_zoomed");
    e.stopPropagation();
  });

  // 定義一個函數來處理彈窗互斥邏輯
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
  // 1. 活動規則按鈕
  $(".rule").on("click", function () {
    openOnlyModal("#popRule");
  });

  // 2. 分享按鈕
  $(".share").on("click", function () {
    openOnlyModal("#popShare");
  });

  // 3. 獎勵按鈕
  $(".award").on("click", function () {
    openOnlyModal("#popAward");
  });

  // 監聽獎勵彈窗開啟時，重設分頁
  $("#popAward").on("show.bs.modal", function () {
    $(".popTab .standard_tab")
      .addClass("active")
      .siblings()
      .removeClass("active");
    $(".standard_award").show();
    $(".yy_award").hide();
  });

  // 獎勵彈窗分頁切換
  $(document).on("click", ".popTab .tab_btn", function () {
    $(this).addClass("active").siblings().removeClass("active");
    if ($(this).hasClass("standard_tab")) {
      $(".standard_award").show();
      $(".yy_award").hide();
    } else {
      $(".standard_award").hide();
      $(".yy_award").show();
    }
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

  // 網頁剛開啟時往往會被瀏覽器阻擋自動播放，因此綁定第一次點擊事件來觸發
  var firstInteractionHandler = function () {
    if ($(".music").hasClass("off")) {
      $(".music").removeClass("off");
      bgMusic.audio.play();
    }
    // 觸發後立刻移除監聽，確保只執行一次
    $(document.body).off("click touchstart", firstInteractionHandler);
  };
  $(document.body).on("click touchstart", firstInteractionHandler);

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

  // --- [新增] 全螢幕翻頁系統變數 ---
  const scrollPages = [".event_index", ".event_index2", ".event_map"];
  let currentScrollIndex = 0;
  let isPageSwitching = false;
  let isIndex2UIReady = false; // [新增] 用於追蹤 index2 UI 動畫是否播放完畢

  // [新增] 專門處理 index2 解鎖動畫完成的函式
  function unlockIndex2UI() {
    const $target = $(".event_index2");
    if (!$target.hasClass("is-active")) {
      $target.addClass("is-active");
    }
    // 解鎖後，等 1 秒（動畫播完）才開放翻頁
    if (window.index2ReadyTimer) clearTimeout(window.index2ReadyTimer);
    window.index2ReadyTimer = setTimeout(function () {
      isIndex2UIReady = true;
      console.log("[ScrollNav] index2 UI 已就緒，開放翻頁");
    }, 1000); // 這裡的 1000ms 對應 CSS 的淡入動畫時間
  }

  // [新增] 翻頁處理函式
  function handlePageScroll(direction) {
    // [新增] 如果目前有彈窗開啟，則禁止翻頁
    if (
      $(".modal.show").length > 0 ||
      $(document.body).hasClass("modal-open")
    ) {
      return;
    }

    if (isPageSwitching) return;

    // [優化限制] 如果在 index2 頁面且要向下翻到地圖：必須等到 UI 動畫播完 (isIndex2UIReady)
    if (
      scrollPages[currentScrollIndex] === ".event_index2" &&
      direction === 1
    ) {
      if (!isIndex2UIReady) {
        console.log("[ScrollNav] index2 動畫播映中，攔截向下滾動");
        return;
      }
    }

    const nextIndex = currentScrollIndex + direction;
    if (nextIndex >= 0 && nextIndex < scrollPages.length) {
      isPageSwitching = true;

      // [新增邏輯] 判斷是否需要載入畫面 (只有 從 index2 切到 map 才要加)
      let noLoading = true;
      if (
        scrollPages[currentScrollIndex] === ".event_index2" &&
        scrollPages[nextIndex] === ".event_map"
      ) {
        noLoading = false;
      }

      switchPage(scrollPages[nextIndex], undefined, noLoading);
    }
  }

  // [新增] PC 滾輪監聽
  $(window).on("wheel", function (e) {
    const currentPage = scrollPages[currentScrollIndex];
    if ($(currentPage).is(":visible")) {
      if (e.originalEvent.deltaY > 50) handlePageScroll(1);
      else if (e.originalEvent.deltaY < -50) handlePageScroll(-1);
    }
  });

  // [新增] 手機滑動監聽
  let touchStartX = 0; // [新增]
  $(window).on("touchstart", function (e) {
    if (e.originalEvent.touches) {
      touchStartY = e.originalEvent.touches[0].pageY;
      touchStartX = e.originalEvent.touches[0].pageX;
    }
  });
  $(window).on("touchend", function (e) {
    if (!e.originalEvent.changedTouches) return;
    const touchEndY = e.originalEvent.changedTouches[0].pageY;
    const touchEndX = e.originalEvent.changedTouches[0].pageX;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // [優化] 只有垂直滑動距離明顯大於水平滑動時，才觸發翻頁 (避免與 Swiper 衝突)
    if (Math.abs(diffY) > Math.abs(diffX) * 1.5) {
      const currentPage = scrollPages[currentScrollIndex];
      if ($(currentPage).is(":visible")) {
        if (diffY > 80) handlePageScroll(1);
        else if (diffY < -80) handlePageScroll(-1);
      }
    }
  });

  // [新增] 加入 noLoading 參數，支援快速切換模式
  function switchPage(targetPage, targetDesk, noLoading) {
    console.log(
      "[switchPage] 跳轉至:",
      targetPage,
      "攜帶目標櫃檯:",
      targetDesk,
    );
    // 定義所有的 event 頁面
    // [更新] 加入 .event_index2 確保轉場時被正確隱藏
    const allPages = [
      ".event_index",
      ".event_index2",
      ".event_map",
      ".event_loading",
    ];

    // [新增] 同步更新滾動索引，確保點擊按鈕後滾輪不會跳號
    const newIdx = scrollPages.indexOf(targetPage);
    if (newIdx !== -1) {
      currentScrollIndex = newIdx;
    }

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

    // [新增邏輯] 判斷是否需要載入畫面 (Loading Page)
    // --- 一般流程：顯示 Loading 並延遲跳轉 ---
    if (!noLoading) {
      // 1. 先顯示 Loading 頁並隱藏其他頁面
      allPages.forEach(function (page) {
        if (page !== ".event_loading") {
          $(page).hide();
        }
      });
      $(".event_loading").css("display", "block");

      // 2. 0.8秒後顯示目標頁面
      setTimeout(function () {
        $(".event_loading").fadeOut(300, function () {
          performFinalSwitch();
        });
      }, 800);
    } else {
      // --- 快速流程：不顯示 Loading，直接淡入切換 ---
      allPages.forEach(function (page) {
        if (page !== targetPage) {
          $(page).hide();
        }
      });
      performFinalSwitch();
    }

    // [新增函數] 將最終的頁面切換邏輯抽離出來，以利 noLoading 模式複用
    function performFinalSwitch() {
      // [新增] 轉場完成，解鎖滾動觸發
      isPageSwitching = false;

      // 如果進入的是 event_index2，設定 2 秒後自動移除模糊與藝術字
      if (targetPage === ".event_index2") {
        // 先重置所有狀態
        $(targetPage).removeClass("is-active");
        isIndex2UIReady = false;
        if (window.index2Timer) clearTimeout(window.index2Timer);
        if (window.index2ReadyTimer) clearTimeout(window.index2ReadyTimer);

        window.index2Timer = setTimeout(function () {
          unlockIndex2UI(); // 呼叫統一的解鎖與延遲邏輯
        }, 2000);
      }

      // 如果目標是地圖頁 (.event_map)，執行初始化
      if (targetPage === ".event_map") {
        // 重置地圖縮放 (is_zoomed) 狀態
        $(".event_map").removeClass("is_zoomed");

        // 重置地圖收合狀態
        $(".map_collapse_btn")
          .removeClass("state_close")
          .addClass("state_open");
        $(".map_desk").removeClass("collapsed");

        $(
          ".event_map .map_desk .mapbtn, .event_map .map_desk .mapbtn_big",
        ).removeClass("active");
        $(".event_map .desk .desk_base")
          .hide()
          .removeClass("desk_anim_in desk_anim_out");

        // 判斷初始顯示頁面
        if (targetDesk) {
          $(targetDesk).css("display", "flex").addClass("desk_anim_in");
        } else {
          // 預設顯示 desk_hint
          $(".event_map .desk .desk_hint")
            .css("display", "flex")
            .addClass("desk_anim_in");
        }

        // 重置 Tab 為 Daily (如果有的話)
        $(".tab_switch .daily_tab").trigger("click");
      }

      // [新增] Navbar 樣式切換邏輯
      if (targetPage === ".event_index2" || targetPage === ".event_map") {
        $(".nav").addClass("style2");
      } else {
        $(".nav").removeClass("style2");
      }

      // 顯示目標頁面
      $(targetPage).fadeIn(300, function () {
        // 頁面切換完成，觸發自定義事件
        $(document).trigger("pageTransitionComplete");
      });
    }
  }
  window.switchPage = switchPage;

  let redirectToDeskHintAfterSuccess = false;
  let pendingPlatformUrl = ""; // 用於暫存平台按鈕的連結
  let loginSource = ""; // 用於記錄登入來源: 'ios', 'android', 'default'

  // 點擊 index 按鈕 → 回到首頁 (不顯示 loading)
  $(".index").on("click", function () {
    switchPage(".event_index", undefined, true);
  });

  // 新增 - index2 手機/PC 點擊切換分解特效 (觸發對象改為父層以連動按鈕)
  $(document).on("click", ".index2Swiper", function () {
    // 點擊後改為單向添加 is-active，且清除所有計時器
    if (window.index2Timer) clearTimeout(window.index2Timer);
    unlockIndex2UI(); // 呼叫統一的解鎖與延遲邏輯
  });

  // 新增 - event_map_btn 點擊切換到 event_map (index2 -> map，顯示 loading)
  $(".event_map_btn").on("click", function () {
    switchPage(".event_map");
  });

  // 1. yyBtn (一般預約) -> 開啟彈窗
  // $(".yyBtn").on("click", function () {
  //   $("#regressmodal").modal("show", this);
  // });

  // 2. double_yyBtn & event_main_btn -> 判斷登入
  // 未登入 -> 彈窗; 已登入 -> 跳轉 event_index
  // 2. double_yyBtn -> 判斷登入 (僅彈窗，不跳轉)
  $(".double_yyBtn").on("click", function () {
    if (!isLogin) {
      $("#regressmodal").modal("show", this);
    }
    // 已登入不動作
  });

  // 監聽 #successmodal 關閉事件
  // 監聽 #successmodal 關閉事件
  // 監聽 #successmodal 關閉事件
  $("#successmodal").on("hidden.bs.modal", function () {
    // 彈窗關閉後，重置 loginSource，確保下次開啟如果是預設流程能正常顯示全按鈕
    loginSource = "";

    if (redirectToDeskHintAfterSuccess) {
      // 2. 如果是一般登入流程
      redirectToDeskHintAfterSuccess = false;
    }
  });

  // 0205新增 - 雙平台下載按鈕邏輯
  // 點擊後判斷登入:
  // 未登入 -> 開彈窗 -> 完成登入 -> 開連結 (不開success modal)
  // 已登入 -> 直接開連結
  // 0205新增 - 雙平台下載按鈕邏輯
  // 點擊後判斷登入:
  // 未登入 -> 開彈窗 -> 完成登入 -> 開 success modal (且不開連結)
  // 已登入 -> 直接開連結
  $(".platform-link").on("click", function (e) {
    // 阻止默認跳轉 (雖然已經是 void(0))
    e.preventDefault();

    var url = $(this).data("url");

    // 判定點擊來源
    if ($(this).closest(".urban_icon_ios").length > 0) {
      loginSource = "ios";
    } else if ($(this).closest(".urban_icon_android").length > 0) {
      loginSource = "android";
    } else {
      loginSource = "default";
    }

    if (window.isLogin) {
      // 已登入：直接開啟連結
      window.open(url, "_blank");
      // 重置 loginSource (雖然直接開啟不需要彈窗，但保持狀態乾淨)
      loginSource = "";
    } else {
      // 未登入：僅開啟登入彈窗
      // pendingPlatformUrl = url; // 移除此行 (不自動開啟連結)
      $("#regressmodal").modal("show", this);
    }
  });

  $("#successmodal").on("show.bs.modal", function (e) {
    // 1. 重置：先顯示所有按鈕
    var $modal = $(this);
    $modal.find(".urban_icon_ios").show();
    $modal.find(".urban_icon_android").show();

    // 2. 根據 loginSource 篩選顯示
    if (loginSource === "ios") {
      $modal.find(".urban_icon_android").hide();
    } else if (loginSource === "android") {
      $modal.find(".urban_icon_ios").hide();
    }
    // 'default' 或其他情況則維持都顯示
  });

  // 攔截 #successmodal 的顯示 (針對平台按鈕流程)
  // 由於 Bootstrap modal show 事件無法輕易完全取消並保證後續邏輯
  // 我們改為監聽 show 事件，如果是平台按鈕流程，則立刻關閉它並觸發連結開啟
  // 或者更好的方式：在 demo.js 觸發 successmodal 的地方做判斷。
  // 但既然 demo.js 是共用庫，我們在此處做 show 事件攔截：

  // 點擊 event_mapBtn (Demo用/無需登入) -> 直接進主活動頁 (不顯示 loading)
  $(".event_mapBtn").on("click", function () {
    switchPage(".event_map", undefined, true);
  });

  // 點擊 event_double_yyBtn (雙平台按鈕) → 切換到首頁 (不顯示 loading)
  $(".event_double_yyBtn").on("click", function () {
    switchPage(".event_index", undefined, true);
  });

  // 點擊 mapChara_hint (地圖人物) -> 回到 desk_hint (不播放 Loading)
  $(".mapChara_hint").on("click", function () {
    // 0. 如果目前是全螢幕，點擊角色後縮小地圖
    $(".event_main").removeClass("is_zoomed");

    // 1. 檢查是否已經在 .desk_hint 且可見
    if ($(".event_main").is(":visible") && $(".desk_hint").is(":visible")) {
      console.log("[mapChara_hint] 已經在 desk_hint，不執行任何動作");
      return;
    }

    // 2. 執行快速切換 (不透過 switchPage 的 Loading 延遲)
    console.log("[mapChara_hint] 執行快速切換至 desk_hint");

    // 隱藏所有頁面，顯示 event_main
    $(".event").hide();
    $(".event_main").show();

    // 處理內部的 Desk 切換邏輯 (仿照地圖按鈕的切換方式)
    var $targetDesk = $(".event_main .desk .desk_hint");
    var $currentDesk = $(".event_main .desk .desk_base:visible").not(
      ".desk_anim_out",
    );

    if ($currentDesk.length > 0 && !$targetDesk.is($currentDesk)) {
      $currentDesk.removeClass("desk_anim_in").addClass("desk_anim_out");
      setTimeout(function () {
        $currentDesk.hide().removeClass("desk_anim_out");
      }, 800);
    }

    $targetDesk.removeClass("desk_anim_out").hide();
    requestAnimationFrame(() => {
      $targetDesk.show().addClass("desk_anim_in");
    });

    // 重置地圖按鈕狀態
    $(
      ".event_main .map_desk .mapbtn, .event_main .map_desk .mapbtn_big",
    ).removeClass("active");
  });

  // 點擊 event_loadingBtn → 切換到 Loading 頁面
  $(".event_loadingBtn").on("click", function () {
    switchPage(".event_loading");
  });

  // Mock Login System
  function updateLoginState() {
    if (window.isLogin) {
      // Show User Info, Hide Login Btn
      $(".btn-login").hide();
      $(".task-user-info").css("display", "flex"); // Force flex display
    } else {
      // Hide User Info, Show Login Btn
      $(".btn-login").show();
      $(".task-user-info").hide();
    }
  }

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
    ".event_map .desk .desk_hint, .event_map .map_desk",
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
                ".mapbtn_B6",
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
                          // startLoopAnimation(1500); // 角色間隔 3秒 (User requested to disable)
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
        ".event_map .map_desk .mapbtn, .event_map .map_desk .mapbtn_big",
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

      var $targetDesk = $(".event_map .desk ." + targetId);
      var $currentDesk = $(".event_map .desk .desk_base:visible").not(
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

  // // --- 全域跑馬燈 (JS Universal Marquee) ---
  // // 取代所有 CSS `animation`。會自動根據 flex-direction 切換橫向 / 直向捲動。
  // (function initUniversalMarquee() {
  //   var $award = $(".event_main .content_A2 .board .lottery_award");
  //   if ($award.length === 0) return;

  //   // 先停止所有傳統 CSS 動畫，避免打架
  //   $award.css("animation", "none");

  //   // 取得原始的 5 個獎項 DOM
  //   var $originalItems = $award.children(".lottery_item").clone();

  //   // 為了達到無縫循環且預備畫面（播放到第三個就有實體銜接），我們直接複製 2 份，產生 3 份獎項陣列
  //   // [1,2,3,4,5] [1,2,3,4,5] [1,2,3,4,5]
  //   $award.append($originalItems.clone());
  //   $award.append($originalItems.clone());

  //   var currentPos = 0;
  //   var lastTime = null;
  //   var reqId = null;
  //   var isRunning = true; // 預設直接跑

  //   // 快取目前的維度與方向
  //   var baseWidth = 0;
  //   var baseHeight = 0;
  //   var currentAxis = "X"; // "X" (row) or "Y" (column)

  //   function calcSize() {
  //     // 更新目前的方向
  //     if ($award.css("flex-direction") === "column") {
  //       currentAxis = "Y";
  //       var $firstItem = $award.children().first();
  //       baseHeight = $firstItem.length ? $firstItem.outerHeight(true) * 5 : 0; // 一組 5 個的總高度
  //     } else {
  //       currentAxis = "X";
  //       var $firstItem = $award.children().first();
  //       baseWidth = $firstItem.length ? $firstItem.outerWidth(true) * 5 : 0; // 一組 5 個的總寬度
  //     }
  //   }

  //   function animate(time) {
  //     reqId = requestAnimationFrame(animate);
  //     if (!lastTime) lastTime = time;
  //     var dt = (time - lastTime) / 1000;
  //     lastTime = time;

  //     if ($award.data("paused")) return;
  //     if (dt > 0.5) return; // 避免切換分頁太久產生的暴衝

  //     if (baseWidth === 0 && baseHeight === 0) calcSize();

  //     if (currentAxis === "Y") {
  //       if (baseHeight <= 0) return;
  //       // 直向：由下往上捲動 (Bottom to Top)，相當於 translateY 向負值增加
  //       // 速度: 約每 3 秒捲動一個獎項高度 => 一個 baseHeight 有 5 個獎項 = 15 秒跑完 baseHeight
  //       var speedY = baseHeight / 15;
  //       currentPos += speedY * dt;

  //       if (currentPos >= baseHeight) {
  //         currentPos -= baseHeight;
  //       }
  //       $award.css({
  //         transition: "none",
  //         transform: `translate3d(0, -${currentPos}px, 0)`,
  //       });
  //     } else {
  //       if (baseWidth <= 0) return;
  //       // 橫向：由右往左捲動 (Right to Left)，相當於 translateX 向負值增加
  //       // 速度: 假設每 3 秒捲動一個獎項寬度 => 一個 baseWidth 有 5 個獎項 = 15 秒跑完 baseWidth
  //       var speedX = baseWidth / 15;
  //       currentPos += speedX * dt;

  //       if (currentPos >= baseWidth) {
  //         currentPos -= baseWidth;
  //       }
  //       $award.css({
  //         transition: "none",
  //         transform: `translate3d(-${currentPos}px, 0, 0)`,
  //       });
  //     }
  //   }

  //   $(window).on("resize orientationchange", () => {
  //     setTimeout(() => {
  //       var oldAxis = currentAxis;
  //       calcSize();
  //       // 如果方向旋轉（例如手機打開地圖），重置位置確保不奇怪
  //       if (oldAxis !== currentAxis) {
  //         currentPos = 0;
  //       }
  //     }, 100);
  //   });

  //   // 展開/收合按鈕也會引發版型變更
  //   $(document).on("click", ".map_collapse_btn", () => {
  //     setTimeout(() => {
  //       var oldAxis = currentAxis;
  //       calcSize();
  //       if (oldAxis !== currentAxis) {
  //         currentPos = 0;
  //       }
  //     }, 50);
  //   });

  //   // 初始化與啟動
  //   calcSize();
  //   if (window.ResizeObserver) {
  //     new ResizeObserver(() => {
  //       calcSize();
  //     }).observe($award[0]);
  //   }

  //   $award.on("mouseenter", () => {
  //     var isMobile =
  //       /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
  //         navigator.userAgent.toLowerCase(),
  //       );
  //     if (!isMobile) $award.data("paused", true);
  //   });
  //   $award.on("mouseleave", () => {
  //     $award.data("paused", false);
  //   });

  //   reqId = requestAnimationFrame(animate);
  // })();

  // 初始進入網頁時，直接切換到首頁 (不顯示 loading)
  setTimeout(() => {
    $(".once_tab").trigger("click");
    switchPage(".event_index", undefined, true);
  }, 100);

  /* ------------------ 導覽功能結束 ------------------ */

  // --- Swiper 背景輪播初始化 (event_index2) ---
  if ($(".index2Swiper").length) {
    const locations = [
      "台北101 異象發生!",
      "逢甲夜市 異象發生!",
      "駁二藝術特區 異象發生!",
      "維多利亞港 異象發生!",
    ];
    const index2Swiper = new Swiper(".index2Swiper", {
      loop: true,
      effect: "fade", // 漸變效果，適合背景
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 5000, // 5秒換一張
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // 滑鼠移上去後停止
      },
      speed: 1000, // 切換速度 1秒
      // 輪播分頁條&地區名
      pagination: {
        el: ".swiper-pagination-horizontal",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper_right",
        prevEl: ".swiper_left",
      },
      on: {
        slideChange: function () {
          const $info = $(".swiper_info");
          const $name = $info.find(".location_name");
          const newIndex = this.realIndex;

          // 如果文字已經一樣則不處理 (初始化或重複觸發)
          if ($name.text() === locations[newIndex]) return;

          // 觸發淡出動畫 (透過 CSS .is-changing)
          $info.addClass("is-changing");

          setTimeout(() => {
            $name.text(locations[newIndex]);
            $info.removeClass("is-changing");
          }, 400); // 這裡的時間需與 master.css 中的 transition 時間對應
        },
      },
    });
  }

  /* --------------------------------------------------------------------------
   * 活動地圖核心功能 (Event Map Logic)
   * --------------------------------------------------------------------------
   */
  const mapData = {
    currentRegion: "tw", // 'tw' or 'hk'
    states: {
      tw: {
        missions: [false, false, false, false, false],
        currentProgress: 0, // 0-4
        viewStage: 0, // 當前回溯查看的階段 (0-4)
      },
      hk: {
        missions: [false, false, false, false, false],
        currentProgress: 0,
        viewStage: 0,
      },
    },
    // 進度寬度對映表 (對應 CSS .step[data-step="X"] { left: ... })
    // 完成 0, 1, 2, 3, 4 個任務對應的寬度
    progressWidths: [0, 24, 47, 70, 92],
  };

  // 預載圖片函式：提前載入所有地區與階段的圖片到快取 (同時包含 PC 與手機版)
  function preloadMapImages(region) {
    const ids = region === "tw" ? [1, 2, 3] : [1];
    const stages = [0, 1, 2, 3, 4];
    ids.forEach((id) => {
      stages.forEach((stage) => {
        const stateSuffix = `-${stage}`;
        // 預載 PC 版
        const imgSrcPC = `https://rests-nte.iwplay.com.tw/events/obliterate-missions_260424/images/swiper_bg_${region}${id}${stateSuffix}.webp`;
        const imgPC = new Image();
        imgPC.src = imgSrcPC;
        // 預載手機版
        const imgSrcM = `https://rests-nte.iwplay.com.tw/events/obliterate-missions_260424/images/swiper_bg_${region}_m${id}${stateSuffix}.webp`;
        const imgM = new Image();
        imgM.src = imgSrcM;
      });
    });
  }

  // 更新 UI 顯示函數
  function updateMapUI() {
    const region = mapData.currentRegion;
    const state = mapData.states[region];

    // 1. 切換顯示區域 (進度條 / 任務區 / 背景區)
    $(".switch_bar").addClass("d-none");
    $(`.switch_bar.${region}`).removeClass("d-none");

    $(".map_site").addClass("d-none");
    $(`.map_site.${region}`).removeClass("d-none");

    $(".map_bg_tw, .map_bg_hk").addClass("d-none");
    $(`.map_bg_${region}`).removeClass("d-none");

    // 2. 更新任務按鈕狀態 (泯除/完成)
    $(`.map_site.${region} .map_site_item`).each(function () {
      // 修正：支援 Swiper Loop 模式下的邏輯索引
      let logicalIndex = $(this)
        .closest(".swiper-slide")
        .attr("data-swiper-slide-index");
      if (logicalIndex === undefined) {
        logicalIndex = $(this)
          .closest(".map_site")
          .find(".map_site_item")
          .index(this);
      } else {
        logicalIndex = parseInt(logicalIndex);
      }

      if (state.missions[logicalIndex]) {
        $(this).css("background-position", "bottom");
        $(this).addClass("done");
      } else {
        $(this).css("background-position", "top");
        $(this).removeClass("done");
      }
    });

    // 3. 任務進度條寬度 (永遠反映真實完成進度，不隨回溯點位移動)
    const actualProgress = state.currentProgress;
    const width = mapData.progressWidths[actualProgress];
    $(`.switch_bar.${region} .track-fill`).css("width", width + "%");

    // 4. 更新進度點位狀態 (Done/Active)
    $(`.switch_bar.${region} .step`).each(function (index) {
      const stepIdx = index + 1; // data-step 0 對應完成 1 個任務 (25%)
      $(this).removeClass("done active clickable");

      if (stepIdx <= state.currentProgress) {
        $(this).addClass("done clickable"); // 已達成的點位可以點擊回溯
      }

      if (stepIdx === state.viewStage) {
        $(this).addClass("active"); // 當前正在「查看」的點位
      }
    });

    // 5. 更新輪播圖背景 與 狀態效果 (Status 0-4)
    $(`.map_bg_${region} .carousel-img`).each(function () {
      const imgId = $(this).data("id");
      const stage = state.viewStage;
      const isMobile = window.innerWidth < 1024;
      const assetSuffix = ""; // 手機版也使用 PC 橫式圖

      // 根據地區、手機/PC、圖片 ID 與階段(0-4) 組合圖片檔名
      let stateSuffix = `-${stage}`;
      let imgSrc = `https://rests-nte.iwplay.com.tw/events/obliterate-missions_260424/images/swiper_bg_${region}${assetSuffix}${imgId}${stateSuffix}.webp`;

      // 優化：檢查目前的背景圖片是否已經是目標圖片，避免重複設定造成閃爍
      const currentBg = $(this).css("background-image");
      if (!currentBg.includes(imgSrc)) {
        $(this).css({
          "background-image": `url("${imgSrc}")`,
          filter: "none",
        });
      }
    });
  }

  // 地區切換點擊
  $(document).on("click", ".map_switch_btn", function () {
    const region = $(this).hasClass("tw") ? "tw" : "hk";
    if (mapData.currentRegion === region) return;

    $(".map_switch_btn").removeClass("active");
    $(this).addClass("active");

    mapData.currentRegion = region;
    preloadMapImages(region); // 切換地區時預載該區圖片
    updateMapUI();
  });

  // 任務日期對應表
  const missionDates = {
    // 台灣地區
    tp_street: "5/1起",
    bus: "4/24起",
    tp_mrt: "4/24起",
    zx_st: "4/24起",
    ks_mrt: "4/24起",
    // 港澳地區
    tea_hk: "4/29起",
    mail_hk: "4/24起",
    seven_hk: "5/6起",
    mrt_lightbox_hk: "5/1起",
    bus_lightbox_hk: "5/1起",
  };

  // 任務按鈕 PC 版 Hover 提示框
  $(document).on("mouseenter", ".map_site_item", function () {
    // 僅在 PC 版執行邏輯內容生成
    if (!document.body.classList.contains("is-mobile")) {
      const $item = $(this);
      const missionName = $item.data("mission-name");
      if (!missionName) return;

      const isDone = $item.hasClass("done"); // 判斷 .done 類名
      const statusHtml = isDone
        ? '<span class="status_done">已泯除</span>'
        : '<span class="status_not">尚未泯除</span>';

      const missionId = $item.attr("id");
      const datePrefix = missionDates[missionId] || "4/24起";
      const content = `${datePrefix}<br>${missionName}<br>${statusHtml}`;
      $item.find(".map_site_item_tip").html(content);
    }
  });
  //---------------------demo點及任務直接完成 可關掉---------------------
  // 任務按鈕點擊
  $(document).on("click", ".map_site_item", function () {
    const region = mapData.currentRegion;
    const state = mapData.states[region];

    // 修正過的索引抓取方式：
    // 如果在 Swiper 內，優先抓取 Swiper 分配的邏輯索引 (支援 Loop)，否則抓取在父層中的位置
    let index = $(this)
      .closest(".swiper-slide")
      .attr("data-swiper-slide-index");
    if (index === undefined) {
      // PC 版或尚未 Swiper 化時：找到自己在同一區域內所有按鈕中的排行
      index = $(this).closest(".map_site").find(".map_site_item").index(this);
    } else {
      index = parseInt(index);
    }

    // 切換任務狀態
    state.missions[index] = !state.missions[index];

    //重新計算當前總進度 (最多 4 個任務算滿)
    const completedCount = state.missions.filter((m) => m).length;
    state.currentProgress = Math.min(completedCount, 4);

    // 預設將查看階段同步到最新進度
    state.viewStage = state.currentProgress;

    updateMapUI();

    // 手機版 點擊任務按鈕彈窗功能
    if (document.body.classList.contains("is-mobile")) {
      const missionName = $(this).attr("data-mission-name");
      const isCompleted = state.missions[index];

      const missionId = $(this).attr("id");
      const datePrefix = missionDates[missionId] || "4/24起";
      let statusHtml = `<div class="mission-status-title">${datePrefix}<br> ${missionName}</div>`;

      if (isCompleted) {
        statusHtml += `
          <div class="mission-status-text completed">已泯除</div>
          <div class="mission-status-note">※請至<span class="open-award-pop" style="text-decoration: underline; cursor: pointer;">已獲得獎勵</span>查看獎勵序號，並於遊戲上市後進入遊戲領取。</div>
        `;
      } else {
        statusHtml += `
          <div class="mission-status-text pending">尚未泯除</div>
        `;
      }

      $("#popMission .popMissionCont").html(statusHtml);
      openOnlyModal("#popMission");
    }
  });
  // ------------------點擊任務完成demo end-------------------------

  // 手機版任務彈窗：點擊「已獲得獎勵」文字跳轉至獎勵彈窗
  $(document).on("click", ".open-award-pop", function () {
    openOnlyModal("#popAward");
  });

  // 進度點位點擊 (回溯查看)
  $(document).on("click", ".step.clickable", function () {
    const region = mapData.currentRegion;
    const state = mapData.states[region];
    const targetStage = parseInt($(this).data("step")) + 1;

    state.viewStage = targetStage;
    updateMapUI();
  });

  // 放大鏡功能
  $(document).on("click", ".map_magnifier", function () {
    const region = mapData.currentRegion;
    // 優先找當前區域下 .active 的圖，如果沒設 active 就找第一張
    let $activeImg = $(`.map_bg_${region} .carousel-img.active`);
    if ($activeImg.length === 0) {
      $activeImg = $(`.map_bg_${region} .carousel-img`).first();
    }

    const bgImg = $activeImg.css("background-image");
    // 更穩健的 Regex: 支援有引號或無引號的情況
    const imgSrc = bgImg.replace(/^url\(['"]?(.+?)['"]?\)/, "$1");

    console.log("[map_magnifier] 抓取圖片路徑:", imgSrc);

    if (imgSrc && imgSrc !== "none") {
      $(".map_lightbox .full_img").attr("src", imgSrc);
      $(".map_lightbox").removeClass("d-none");
    }
  });

  // ---------------------------------------------------------
  // 任務按鈕 Swiper 輪播化 (手機版動態注入)
  // ---------------------------------------------------------
  let swiperInstances = {};

  function initMissionSwiper() {
    if (window.innerWidth >= 1024) return; // 僅手機版執行

    // 顯示左右導覽按鈕
    $(".mission_swiper_btn").removeClass("d-none");

    $(".map_site").each(function () {
      const $site = $(this);
      const region = $site.hasClass("tw") ? "tw" : "hk";

      // 避免重複初始化
      if ($site.hasClass("swiper-initialized")) return;

      // --- 動態包裹結構 ---
      // 1. 先將每個點位項目包進 swiper-slide
      $site.children(".map_site_item").each(function () {
        $(this).wrap('<div class="swiper-slide"></div>');
      });
      // 2. 將所有 slide 包進 swiper-wrapper
      $site
        .children(".swiper-slide")
        .wrapAll('<div class="swiper-wrapper"></div>');
      // 3. 父層加上 swiper 類別
      $site.addClass("swiper missionSwiper");

      // --- 初始化 Swiper ---
      swiperInstances[region] = new Swiper(this, {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 10, // 控制按鈕之間的間距
        loop: true, // 開啟無限輪迴
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: ".map_mission_swiper_right",
          prevEl: ".map_mission_swiper_left",
        },
        on: {
          init: function () {
            console.log(`[Swiper] ${region} 任務輪播已初始化`);
          },
        },
      });

      $site.addClass("swiper-initialized");
    });
  }

  // 修改 updateMapUI 使其能觸發 Swiper 更新
  const originalUpdateMapUI = window.updateMapUI;
  window.updateMapUI = function (region) {
    if (typeof originalUpdateMapUI === "function") {
      originalUpdateMapUI(region);
    }

    // 如果是手機版，確保 Swiper 正確切換
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        if (swiperInstances[region]) {
          swiperInstances[region].update();
          swiperInstances[region].slideTo(0, 0);
        }
      }, 50);
    }
  };

  // 初始化執行
  $(document).ready(function () {
    initMissionSwiper();
  });

  // 關閉燈箱邏輯
  $(document).on("click", ".lightbox_close, .map_lightbox", function (e) {
    if (document.body.classList.contains("is-mobile")) {
      // 手機版：點擊任意處（包含圖片）皆可關閉
      $(".map_lightbox").addClass("d-none");
    } else {
      // PC 版：只有點擊背景或關閉按鈕才關閉
      if (e.target !== this && !$(this).hasClass("lightbox_close")) return;
      $(".map_lightbox").addClass("d-none");
    }
  });

  // 初始化 UI 與預載圖片
  preloadMapImages("tw");
  preloadMapImages("hk");
  updateMapUI();

  // --- 輪播圖自動播放邏輯 ---
  setInterval(() => {
    const region = mapData.currentRegion;
    const $imgs = $(`.map_bg_${region} .carousel-img`);
    if ($imgs.length <= 1) return;

    let currentIndex = $imgs.index($imgs.filter(".active"));
    let nextIndex = (currentIndex + 1) % $imgs.length;

    $imgs.removeClass("active").eq(nextIndex).addClass("active");
  }, 6000);

  // --- 手機版：地圖任務區塊收合功能 (點擊切換) ---
  $(document).on("click", ".map_banner", function () {
    // 僅在手機版執行收合邏輯
    if (document.body.classList.contains("is-mobile")) {
      var $mission = $(this).closest(".map_mission");
      $mission.toggleClass("collapsed");
      $(this)
        .siblings(".map_site_cont, .map_tt, .nanally, .rat")
        .slideToggle(300);
    }
  });

  // 手機版：根據 map_bg 高度動態調整輪播圖 background-position-y
  if (document.body.classList.contains("is-mobile")) {
    var mapBg = document.querySelector(".map_bg");
    if (mapBg && window.ResizeObserver) {
      new ResizeObserver(function () {
        var imgs = document.querySelectorAll(
          ".map_bg_tw .carousel-img[data-id='2'], .map_bg_tw .carousel-img[data-id='3']",
        );
        var h = mapBg.clientHeight;

        // 設定計算高度範圍
        var maxH = 800; // 長螢幕高度基準
        var minH = 300; // 短螢幕高度基準
        var ratio = Math.min(Math.max((h - minH) / (maxH - minH), 0), 1);

        // 當 h 越小 (短螢幕)，ratio 越接近 0
        // 當 h 越大 (長螢幕)，ratio 越接近 1
        var posY = 33 + ratio * 17; // 33% ~ 50%

        imgs.forEach(function (img) {
          img.style.backgroundPositionY = posY + "%";
        });
      }).observe(mapBg);
    }
  }

  /* --------------------------------------------------------------------------

   * ^^^^ 活動地圖核心功能 end ^^^^(Event Map Logic)
   * --------------------------------------------------------------------------
   */
});
