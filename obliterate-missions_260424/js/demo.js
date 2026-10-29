$(document).ready(function () {
  console.log("demo.js loaded and ready");
  // --- 全域狀態變數 ---
  var isAwardActive = true; // 預設為 ON (有獎勵/已預約雙平台)
  var isUserLoggedIn = false; // 預設為 OFF (未登入)
  var isTimeOn = true; // 預設為 ON (時間狀態)
  var isParticipated = false; // 模擬：是否已完成預約(假的紀錄)

  // 雙平台按鈕專用狀態
  var lotteryCount = 1; // 預約成功後獲得 1 次抽獎機會 (初始假設)
  var mapLotteryCount = 3; // 地圖抽獎按鈕：預設 3 次機會

  // 初始化：讀取 desk.js 的 ViewObj 並渲染內容
  // 初始化：讀取 desk.js 的 ViewObj 並渲染內容
  (function renderDeskContent() {
    if (typeof ViewObj === "undefined") {
      return;
    }

    var data = ViewObj;
    var deskIds = ["B1", "B2", "B3", "B4", "B5", "C1", "C2", "C3"];

    deskIds.forEach(function (id) {
      // 檢查是否有對應的 iteam_name 屬性
      if (data[id + "_iteam_name"]) {
        var $content = $(".desk_" + id + " .desk_content");
        if ($content.length > 0) {
          // 若內容為空或非標準結構，注入模板
          if ($content.find(".desk_content_top").length === 0) {
            var template = `
                            <div class="desk_content_top">
								<span>{${id}_iteam_name}</span>
								<div class="buy_coin"><span class="coin_quantity">{${id}_iteam_coin}</span></div>
							</div>
							<div class="desk_content_main">
									<div class="desk_content_info">
										<p class="info_title">※商店資訊：</p>
										<div class="info_text">
											<ul>
												<li>{${id}_iteam_info}</li>
											</ul>
										</div>
									</div>
									<div class="desk_content_rule">
										<p class="rule_title">※商店規範：</p>
										<div class="rule_text">
											<ul>
												<li>{${id}_iteam_rule}</li>
											</ul>
										</div>
									</div>
							</div>	
							<button class="desk_buy_btn" type="button"></button>
                         `;
            $content.html(template);
          }

          var html = $content.html();

          var infoVal = data[id + "_iteam_info"];
          var ruleVal = data[id + "_iteam_rule"];

          // 處理陣列轉 HTML List
          if (Array.isArray(infoVal)) infoVal = infoVal.join("</li><li>");
          if (Array.isArray(ruleVal)) ruleVal = ruleVal.join("</li><li>");

          // 取代佔位符
          html = html
            .replace(`{${id}_iteam_name}`, data[id + "_iteam_name"])
            .replace(`{${id}_iteam_coin}`, data[id + "_iteam_coin"])
            .replace(`{${id}_iteam_info}`, infoVal)
            .replace(`{${id}_iteam_rule}`, ruleVal);
          $content.html(html);
        }
      }
    });
  })();

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
          // 注意：因為外層可能有 <ol> 或 <ul>，這裡我們假設 {privacy_list} 被包在 <li> 裡面，
          // 根據 index.html 結構： <ol><li>{privacy_list}</li></ol>
          // 如果我們替換 {privacy_list} 為 "text1</li><li>text2"，結果會是 <li>text1</li><li>text2</li>，這是正確的。
        }
        $(this).html(html.replace("{privacy_list}", privacyListContent));
      }
    });
  }

  // 初始化切換按鈕文字
  $(".event_awardBtn").text("獎勵ON");

  // helper: 統一設定獎勵狀態與按鈕外觀
  function setGlobalAwardState(isActive) {
    isAwardActive = isActive;
    var $btn = $(".event_awardBtn");
    if (isAwardActive) {
      $btn.text("獎勵ON").css("opacity", "1");
    } else {
      $btn.text("獎勵OFF").css("opacity", "0.6");
    }
    updateDoubleYYBtnState(); // 同步更新雙平台按鈕狀態
  }

  // 4. 狀態切換按鈕 (.event_awardBtn)
  $(".event_awardBtn").on("click", function () {
    setGlobalAwardState(!isAwardActive); // 切換狀態
  });

  // --- 登入狀態邏輯 (直接點擊切換) ---

  // --- 登入狀態邏輯 (直接點擊切換) ---
  var loginSource = "default";

  // 監聽彈窗開啟，判斷是 A 還是 B
  // Simulate Login Click
  $(document).on("click", ".btn-login", function () {
    // Open Login Modal (regressmodal)
    openOnlyModal("#regressmodal");
  });

  $(document).on(
    "click",
    ".event_main_btn, .yyBtn, .double_yyBtn",
    function () {
      console.log("偵測到點擊: B按鈕系列 (Main/Map)");
      loginSource = "main";
    },
  );

  $("#regressmodal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    if (button.length > 0) {
      if (button.hasClass("btn-login")) {
        console.log("Modal開啟來源: A按鈕 (via relatedTarget)");
        loginSource = "nav"; // A 按鈕
      } else {
        console.log("Modal開啟來源: B按鈕系列 (via relatedTarget)");
        loginSource = "main"; // B 按鈕或其他
      }
    }
  });

  // 登錄狀態更新函數 (增強版)
  function updateLoginStateWithSync(login) {
    isUserLoggedIn = login;
    window.isLogin = login; // 同步給 off_line.js
    updateLoginState(login);
  }

  // 登出行為
  // 登出行為
  // $(".btn-logout").on("click", function () {
  //   updateLoginStateWithSync(false);
  //   setGlobalAwardState(false);
  //   isParticipated = false; // 登出重置
  // });

  // 預約送出按鈕 (模擬預約成功)
  // 預約送出按鈕 (模擬預約成功)
  // 預約送出按鈕 (模擬預約成功)
  // $(document).on("click", ".yySubmit", function () {
  //   // 1. 關閉當前彈窗
  //   $("#regressmodal").modal("hide");

  //   // 2. 模擬登入與狀態更新
  //   updateLoginStateWithSync(true);
  //   setGlobalAwardState(true);

  //   // 3. 顯示預約成功彈窗
  //   setTimeout(function () {
  //     $("#successmodal").modal("show");
  //   }, 300); // 延遲避免與前一個 Modal 動畫衝突
  // });

  function updateLoginState(login) {
    var $loginArea = $(".login");
    var $coinNum = $(".coin_num");
    var $yyBtn = $(".yyBtn");

    if (login) {
      $loginArea.find(".btn-login").hide();
      $loginArea
        .find(".task-user-info")
        .removeClass("d-none")
        .css("display", "flex");
      $coinNum.text("888,888,888"); // 登入顯示金額

      // yyBtn 變為 active，並取消彈窗
      $yyBtn.addClass("active").removeAttr("data-toggle");
    } else {
      $loginArea.find(".btn-login").show();
      $loginArea.find(".task-user-info").addClass("d-none").hide();
      $coinNum.text("尚未登入"); // 登出顯示提示

      // yyBtn 變回原樣，並恢復彈窗
      $yyBtn.removeClass("active").attr("data-toggle", "modal");
    }
    updateDoubleYYBtnState(); // 同步更新雙平台按鈕狀態
  }

  // --- 雙平台按鈕狀態機 ---
  function updateDoubleYYBtnState() {
    var $btn = $(
      ".event_double_yy .event_double_yy_btn, .desk_double_yy .event_double_yy_btn",
    );
    $btn.removeClass("login yy lottery lottery_done").off("click");

    // 1. 優先判斷：抽完獎
    if (lotteryCount <= 0) {
      $btn.addClass("lottery_done");
      $btn.on("click", function () {
        if (window.switchPage) window.switchPage(".event_main");
      });
      return;
    }

    // 2. 判斷：未登入
    if (!isUserLoggedIn) {
      $btn.addClass("yy");
      $btn.on("click", function () {
        $("#regressmodal").modal("show", this);
      });
      return;
    }

    // 3. 核心邏輯
    if (!isTimeOn && !isAwardActive) {
      // Rule 1: 時間 OFF 且 獎勵 OFF -> 顯示 .yy
      $btn.addClass("yy");
      $btn.on("click", function () {
        alert("恭喜！您已成功完成雙平台預約。(模擬通知)");
        // 測試提示：請手動切換至 時間ON 測試抽獎
      });
    } else if (isTimeOn) {
      // Rule 2 & 3: 時間 ON (不論獎勵 ON/OFF) -> 顯示 .lottery
      $btn.addClass("lottery");
      $btn.on("click", function () {
        $(".modal").modal("hide");
        setTimeout(function () {
          $("#popLotteryAnimation").modal({
            backdrop: "static",
            keyboard: false,
            show: true,
          });
        }, 300);

        setTimeout(function () {
          lotteryCount--;
          // 根據 isAwardActive 自動導向中獎或沒中獎畫面
          openOnlyModal("#popLottery");
          updateDoubleYYBtnState();
        }, 2000);
      });
    } else {
      // 預設 (例如 時間 OFF 但 獎勵 ON)，顯示 .yy 作為保底
      $btn.addClass("yy");
    }
  }

  // 5. 統一監聽：當 #popAward 即將開啟時，強制更新狀態
  // 5. 統一監聽：當 #popAward 即將開啟時，強制更新狀態
  // $("#popAward").on("show.bs.modal", function (e) {
  //   // console.log("Modal opening, updating state to: " + (isAwardActive ? "ON" : "OFF"));
  //   updateAwardState(isAwardActive);
  // });

  // 6. 統一監聽：當 #popYyLottery 即將開啟時，根據 isAwardActive 決定顯示中獎或未中獎
  // 6. 統一監聽：當 #popYyLottery 即將開啟時，根據 isAwardActive 決定顯示中獎或未中獎
  // Removed redundant #popYyLottery listener

  // 7. 統一監聽：當 #popLottery 即將開啟時
  // 7. 統一監聽：當 #popLottery 即將開啟時
  // $("#popLottery").on("show.bs.modal", function (e) {
  //   var $modal = $(this);
  //   var $winDiv = $modal.find(".popLotteryWinning");
  //   var $loseDiv = $modal.find(".popLotteryLosing");
  //   var $noChanceDiv = $modal.find(".popLotteryNoChance");
  //   var $tip = $modal.find(".popBtnsTip");
  //   var $btn = $modal.find(".popBtn");

  //   // 重置顯示
  //   $winDiv.hide();
  //   $loseDiv.hide();
  //   $noChanceDiv.hide();
  //   $tip.show();
  //   $btn.show().removeClass("btn-pop-invite btn-LotteryGet").empty(); // 清空並移除特定 class

  //   if (mapLotteryCount > 0) {
  //     // 還有抽獎次數
  //     if (isAwardActive) {
  //       // 獎勵 ON -> 中獎
  //       $winDiv.show();
  //       $winDiv.find(".des").show(); // 顯示隱藏的中獎文案
  //       $tip.text("");
  //       $btn
  //         .addClass("btn-LotteryGet")
  //         .off("click")
  //         .on("click", function () {
  //           openOnlyModal("#popLotteryGet");
  //         });
  //     } else {
  //       // 獎勵 OFF -> 未中獎
  //       $loseDiv.show();
  //       $tip.text("分享您的推薦連結，邀請好友預約，獲得更多方斯！");
  //       $btn
  //         .addClass("btn-pop-invite")
  //         .off("click")
  //         .on("click", function () {
  //           openOnlyModal("#popShare");
  //         });
  //     }
  //     $modal.find(".popBtnsTip, .popBtns").show();
  //   } else {
  //     // 次數用完 (No Chance)
  //     $noChanceDiv.show();
  //     // 顯示提示與按鈕
  //     $modal.find(".popBtnsTip, .popBtns").show();
  //     $tip.text("分享您的推薦連結，邀請好友預約，獲得更多方斯！");
  //     $btn
  //       .addClass("btn-pop-invite")
  //       .off("click")
  //       .on("click", function () {
  //         openOnlyModal("#popShare");
  //       });
  //   }
  // });

  // --- 測試按鈕區域 ---
  // 測試：無獎勵
  $("#btnTestNoReward").on("click", function () {
    updateAwardState(false);
    openOnlyModal("#popAward");
  });
  // 測試：有獎勵
  $("#btnTestHasReward").on("click", function () {
    updateAwardState(true);
    openOnlyModal("#popAward");
  });

  /**
   * 更新獎勵彈窗 (#popAward) 的狀態
   */
  function updateAwardState(hasReward) {
    var $modal = $("#popAward");
    var $tip = $("#popAwardTip");
    var $btn = $modal.find(".popBtn");
    var $notRewards = $modal.find(".notRewards");

    // 重置按鈕基礎狀態
    $btn
      .show()
      .removeClass("btn-popLoginBtn btn-LotteryGet btn-pop-invite")
      .empty()
      .off("click");

    if (!isUserLoggedIn) {
      // [未登入狀態]
      $modal.find(".type-list").hide();
      $modal.find(".type-empty").css("display", "flex");
      $notRewards.text("請先登入以查詢獲獎紀錄");
      $tip.text("登入後可查看您的專屬獎勵！");

      // 顯示登入按鈕
      $btn.addClass("btn-popLoginBtn").on("click", function () {
        openOnlyModal("#regressmodal");
      });
    } else if (hasReward) {
      // [已登入 & 有獎勵]
      $modal.find(".type-list").show();
      $modal.find(".type-empty").hide();
      $tip.text("※請於獲獎15天內完成填寫，超過期限恕不予以補發。");

      // 顯示領獎按鈕 (填寫資料)
      $btn.addClass("btn-LotteryGet").on("click", function () {
        openOnlyModal("#popLotteryGet");
      });
    } else {
      // [已登入 & 無獎勵]
      $modal.find(".type-list").hide();
      $modal.find(".type-empty").css("display", "flex");
      $notRewards.text("暫未查詢到您的獲獎紀錄");
      $tip.text("分享您的推薦連結，邀請好友預約，獲得更多方斯！");

      // 顯示分享按鈕
      $btn.addClass("btn-pop-invite").on("click", function () {
        openOnlyModal("#popShare");
      });
    }
  }

  // 定義 openOnlyModal (重複定義? 原本 demo.js 好像沒有? off_line.js 有嗎?
  // 不，原 demo.js 有定義 openOnlyModal。需要補上。)
  function openOnlyModal(targetId) {
    $(".modal").modal("hide");
    setTimeout(function () {
      $(targetId).modal("show");
    }, 300);
  }

  // 8. 地圖上的抽獎按鈕邏輯
  // 8. 地圖上的抽獎按鈕邏輯
  // 8. 地圖上的抽獎按鈕邏輯
  // $(".event_lottery_btn").on("click", function () {
  //   if (mapLotteryCount > 0) {
  //     // 有次數 -> 播放動畫
  //     $(".modal").modal("hide");
  //     setTimeout(function () {
  //       $("#popLotteryAnimation").modal({
  //         backdrop: "static",
  //         keyboard: false,
  //         show: true,
  //       });
  //     }, 300);

  //     setTimeout(function () {
  //       openOnlyModal("#popLottery");
  //       mapLotteryCount--;
  //     }, 2000);
  //   } else {
  //     // 沒次數 -> 直接顯示結果 (NoChance)
  //     openOnlyModal("#popLottery");
  //   }
  // });
  // 通用：任何帶有 .btn-pop-invite 的按鈕點擊時開啟分享彈窗
  // 通用：任何帶有 .btn-pop-invite 的按鈕點擊時開啟分享彈窗
  // $(document).on("click", ".btn-pop-invite", function () {
  //   openOnlyModal("#popShare");
  // });

  // 提交資料按鈕
  // 提交資料按鈕
  $(document).on("click", ".btn-send-data", function () {
    $("#popMsg .popMsgCont p").text("提交成功");
    openOnlyModal("#popMsg");
  });

  // 9. 時間開關按鈕 (.event_timeBtn)
  // 9. 時間開關按鈕 (改為 .time_hint)
  // $(".time_hint, .event_timeBtn")
  //   .css("cursor", "pointer")
  //   .on("click", function () {
  //     console.log("Time toggle clicked");
  //     var $btn = $(this);

  //     if ($btn.hasClass("state_off")) {
  //       // 目前為 OFF -> 切換為 ON
  //       $btn.removeClass("state_off");
  //       $btn.html("<span>23:59</span>");

  //       // 標記 Time ON (控制 hint 顯示)
  //       $(".event_main").addClass("is_time_on");

  //       // 更新規則文字 (ON)
  //       updateAllRuleText(true);
  //     } else {
  //       // 目前為 ON -> 切換為 OFF
  //       $btn.addClass("state_off");
  //       $btn.html("<span>23:59</span>");

  //       // 標記 Time OFF
  //       $(".event_main").removeClass("is_time_on");

  //       // 更新規則文字 (OFF - 恢復一般文字)
  //       updateAllRuleText(false);
  //     }
  //   });

  /**
   * 根據時間狀態更新所有規則內容
   * @param {boolean} isOn - 是否為時間 ON
   */
  function updateAllRuleText(isOn) {
    if (typeof ViewObj === "undefined") return;

    var deskIds = ["B1", "B2", "B3", "B4", "B5", "C1", "C2", "C3"];
    deskIds.forEach(function (id) {
      // Helper function to build list content
      function buildList(ruleVal) {
        if (!ruleVal) return "";
        if (Array.isArray(ruleVal)) {
          return ruleVal
            .map(function (item) {
              return `<li>${item}</li>`;
            })
            .join("");
        } else {
          return `<li>${ruleVal}</li>`;
        }
      }

      // Update Rule 1 (iteam_rule)
      var $rule1 = $(`.content_${id} .desk_content_rule .rule_text`);
      var val1 =
        (ViewObj[id] ? ViewObj[id].iteam_rule : ViewObj[id + "_iteam_rule"]) ||
        "";
      $rule1.html(`<ul>${buildList(val1)}</ul>`);

      // Update Rule 2 (iteam_rule_2)
      var $rule2 = $(`.content_${id} .desk_content_rule_2 .rule_text`);
      var val2 =
        (ViewObj[id]
          ? ViewObj[id].iteam_rule_2
          : ViewObj[id + "_iteam_rule_2"]) || "";
      $rule2.html(`<ul>${buildList(val2)}</ul>`);
    });
  }

  // 初始化 desk_pic 的 Overlay 圖片 (靜態)
  function initDeskPicHints() {
    $(
      ".event_main .desk .desk_base:not(.desk_A1):not(.desk_A2) .desk_pic",
    ).each(function () {
      // 清除舊的 hint / overlay
      $(this).find(".hint, .time_overlay").remove();

      // 加入新的靜態 Overlay 結構 (如果沒有的話)
      if ($(this).find(".desk_tt").length === 0) {
        $(this).append('<div class="desk_tt"></div>');
      }
    });

    // 預設狀態: Time ON
    // $(".event_main").addClass("is_time_on");
    // $(".time_hint").html("<span>23:59</span>").removeClass("state_off");
    // console.log("time_hint initialized");
  }
  initDeskPicHints();

  // 初始化呼叫
  // updateDoubleYYBtnState();
  // updateAllRuleText(!$(".desk_double_yy").hasClass("none"));
  // 自動開啟提示彈窗
  // 自動開啟提示彈窗 (改用事件監聽)
  // $(document).on("pageTransitionComplete", function () {
  //   // 確保只執行一次 (如果需要)
  //   if (!window.hasShownHint) {
  //     // openOnlyModal("#popWindowHint");
  //     // window.hasShownHint = true;
  //   }
  // });
  // 初始化活動規則 (pop_rule)
  function initPopRule() {
    if (typeof ViewObj === "undefined") return;

    var $ruleContainer = $("#pop_rule_list");
    if ($ruleContainer.length === 0) return;

    // 直接獲取陣列，不反轉
    var ruleList = ViewObj.pop_rule || [];

    var ruleContent = ruleList
      .map(function (item) {
        return `<li>${item}</li>`;
      })
      .join("");

    $ruleContainer.html(ruleContent);
  }
  initPopRule();

  // --- Refactored Modal Triggers (Moved from index.html) ---
  // Open Privacy Modal from Regress Modal
  $("#btn_open_privacy")
    .css("cursor", "pointer")
    .on("click", function () {
      openOnlyModal("#privacymodal");
    });

  // Close Privacy Modal and return to Regress Modal (Top Button)
  $("#btn_close_privacy_top").on("click", function () {
    openOnlyModal("#regressmodal");
  });

  // Close Privacy Modal and return to Regress Modal (Bottom Link)
  $("#btn_close_privacy_bottom").on("click", function () {
    openOnlyModal("#regressmodal");
  });
  // --- Hamburger Menu Toggle ---
  // --- Hamburger Menu Toggle with Animation ---
  $(".menu_toggle").on("click", function () {
    var $nav = $(".nav");
    if ($nav.hasClass("menu-open")) {
      // Closing
      $nav.addClass("menu-closing").removeClass("menu-open");
      // Wait for animation to finish then remove closing class
      setTimeout(function () {
        $nav.removeClass("menu-closing");
      }, 300); // 300ms matches CSS animation duration
    } else {
      // Opening
      $nav.addClass("menu-open");
    }
  });

  // Close menu when clicking items in the menu (except login container itself, logic handles internal buttons, and .music toggle)
  $(
    ".nav .topRight > button:not(.music), .nav .topRight .login .btn-login, .nav .topRight .login .btn-logout",
  ).on("click", function () {
    if ($(".nav").hasClass("menu-open")) {
      $(".nav").addClass("menu-closing").removeClass("menu-open");
      setTimeout(function () {
        $(".nav").removeClass("menu-closing");
      }, 300);
    }
  });

  // Close menu when clicking outside (optional but good UX)
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest(".menu_toggle").length &&
      !$(e.target).closest(".topRight").length
    ) {
      if ($(".nav").hasClass("menu-open")) {
        $(".nav").addClass("menu-closing").removeClass("menu-open");
        setTimeout(function () {
          $(".nav").removeClass("menu-closing");
        }, 300);
      }
    }
  });
});
