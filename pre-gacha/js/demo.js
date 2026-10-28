$(document).ready(function () {
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
  $(document).on("click", ".btn-login", function () {
    console.log("偵測到點擊: A按鈕 (Nav)");
    loginSource = "nav";
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
  $(".btn-logout").on("click", function () {
    updateLoginStateWithSync(false);
    setGlobalAwardState(false);
    isParticipated = false; // 登出重置
  });

  // 預約送出按鈕 (模擬預約成功)
  // 預約送出按鈕 (模擬預約成功)
  $(document).on("click", ".yySubmit", function () {
    // 1. 關閉當前彈窗
    $("#regressmodal").modal("hide");

    // 2. 模擬登入與狀態更新
    updateLoginStateWithSync(true);
    setGlobalAwardState(true);

    // 3. 顯示預約成功彈窗
    setTimeout(function () {
      $("#successmodal").modal("show");
    }, 300); // 延遲避免與前一個 Modal 動畫衝突
  });

  function updateLoginState(login) {
    var $loginArea = $(".login");
    var $coinNum = $(".coin_num");
    var $yyBtn = $(".yyBtn");

    if (login) {
      $loginArea.find(".btn-login").hide();
      $loginArea.find(".task-user-info").css("display", "flex");
      $coinNum.text("888,888,888"); // 登入顯示金額

      // yyBtn 變為 active，並取消彈窗
      $yyBtn.addClass("active").removeAttr("data-toggle");
    } else {
      $loginArea.find(".btn-login").show();
      $loginArea.find(".task-user-info").hide();
      $coinNum.text("尚未登入"); // 登出顯示提示

      // yyBtn 變回原樣，並恢復彈窗
      $yyBtn.removeClass("active").attr("data-toggle", "modal");
    }
  }

  // 5. 統一監聽：當 #popAward 即將開啟時，強制更新狀態
  $("#popAward").on("show.bs.modal", function (e) {
    // console.log("Modal opening, updating state to: " + (isAwardActive ? "ON" : "OFF"));
    updateAwardState(isAwardActive);
  });

  // 6. 統一監聽：當 #popYyLottery 即將開啟時，根據 isAwardActive 決定顯示中獎或未中獎
  $("#popYyLottery").on("show.bs.modal", function (e) {
    var $modal = $(this);
    var $winDiv = $modal.find(".popLotteryWinning");
    var $loseDiv = $modal.find(".popLotteryLosing");
    var $btn = $modal.find(".popBtn");

    $modal.find(".popBtnsTip, .popBtns").show();

    if (isAwardActive) {
      // 中獎狀態
      $winDiv.show();
      $loseDiv.hide();

      // 還原顯示 (中獎時顯示)
      // $modal.find(".popBtnsTip, .popBtns").show();

      //$btn.empty().addClass("btn-LotteryGet"); // 使用 CSS 背景圖，不再插入 img

      // 設定中獎時的 Tip 與 Button
      $modal.find(".popBtnsTip").text("分享專屬連結邀請好友預約可獲得更多抽獎機會！");
      $btn.off("click").on("click", function () {
        window.openOnlyModal("#popShare");
      });
    } else {
      // 未中獎狀態
      $winDiv.hide();
      $loseDiv.show();

      // 隱藏 Tip 與 Button
      // $modal.find(".popBtnsTip, .popBtns").hide();

      // 設定未中獎時的 Tip 與 Button (雖然看不見，但邏輯保留)
      $modal.find(".popBtnsTip").text("分享專屬連結邀請好友預約可獲得更多抽獎機會！");

      // 直接切換 Class 用 CSS 背景顯示
      // $btn.empty().addClass("btn-pop-invite");
      $btn.off("click").on("click", function () {
        window.openOnlyModal("#popShare");
      });
    }
  });

  // 7. 統一監聽：當 #popLottery 即將開啟時
  $("#popLottery").on("show.bs.modal", function (e) {
    var $modal = $(this);
    var $winDiv = $modal.find(".popLotteryWinning");
    var $loseDiv = $modal.find(".popLotteryLosing");
    var $noChanceDiv = $modal.find(".popLotteryNoChance");
    var $tip = $modal.find(".popBtnsTip");
    var $btn = $modal.find(".popBtn");

    // 重置顯示
    $winDiv.hide();
    $loseDiv.hide();
    $noChanceDiv.hide();
    $tip.show();
    $btn.show().removeClass("btn-pop-invite btn-LotteryGet").empty(); // 清空並移除特定 class

    if (mapLotteryCount > 0) {
      // 還有抽獎次數
      if (isAwardActive) {
        // 獎勵 ON -> 中獎
        $winDiv.show();
        $winDiv.find(".des").show(); // 顯示隱藏的中獎文案
        $tip.text("請前往獎勵查詢");
        $btn
          .addClass("btn-LotteryGet")
          .off("click")
          .on("click", function () {
            window.openOnlyModal("#popLotteryGet");
          });
      } else {
        // 獎勵 OFF -> 未中獎
        $loseDiv.show();
        $tip.text("分享您的推薦連結，邀請好友預約，獲得更多方斯！");
        $btn
          .addClass("btn-pop-invite")
          .off("click")
          .on("click", function () {
            window.openOnlyModal("#popShare");
          });
      }
      $modal.find(".popBtnsTip, .popBtns").show();
    } else {
      // 次數用完 (No Chance)
      $noChanceDiv.show();
      // 顯示提示與按鈕
      $modal.find(".popBtnsTip, .popBtns").show();
      $tip.text("分享您的推薦連結，邀請好友預約，獲得更多方斯！");
      $btn
        .addClass("btn-pop-invite")
        .off("click")
        .on("click", function () {
          window.openOnlyModal("#popShare");
        });
    }
  });

  // --- 測試按鈕區域 ---
  // 測試：無獎勵
  $("#btnTestNoReward").on("click", function () {
    updateAwardState(false);
    window.openOnlyModal("#popAward");
  });
  // 測試：有獎勵
  $("#btnTestHasReward").on("click", function () {
    updateLoginStateWithSync(true); // 模擬已登入
    updateAwardState(true);
    window.openOnlyModal("#popAward");
  });
  
  // $("#btn_go").on("click", function () {
  //   window.openOnlyModal("#popStore");
  // });
  function openStoreModal(storeType) {
    var $storeModal = $("#popStore");
    var showCb = storeType === "cb";

    $storeModal.find(".cb").toggle(showCb);
    $storeModal.find(".ob").toggle(!showCb);
    window.openOnlyModal("#popStore");
  }

  $("#btn_go").on("click", function () {
    openStoreModal("ob");
  });

  $("#btn_go_store").on("click", function () {
    openStoreModal("cb");
  });

  // $("#btn_share_card").on("click", function () {
  //   window.openOnlyModal("#viewCardModal");
  // });

  $(".btn_awards").on("click", function () {
    window.openOnlyModal("#popAwards");
  });

  /**
   * 更新獎勵彈窗 (#popAward) 的狀態
   */
  function updateAwardState(hasReward) {
    var $modal = $("#popAward");
    var $tip = $("#popAwardTip");
    var $tableGetBtns = $modal.find(".type-list .btn-award-get");
    var $footerActionBtn = $modal.find(".popBtns > .btn-award-invite");
    var $notRewards = $modal.find(".notRewards");

    // 重置按鈕基礎狀態
    $tableGetBtns
      .hide()
      .removeClass("btn-popLoginBtn btn-LotteryGet btn-pop-invite")
      .off("click");
    $footerActionBtn
      .hide()
      .removeClass("btn-popLoginBtn btn-LotteryGet btn-pop-invite")
      .off("click");

    if (!isUserLoggedIn) {
      // [未登入狀態]
      $modal.find(".type-list").hide();
      $modal.find(".type-empty").css("display", "flex");
      // $notRewards.text("請先登入以查詢獲獎紀錄");
      $notRewards.addClass("state-not-login");
      $tip.text("登入後可查看您的專屬獎勵！");

      // 未登入時底部固定按鈕作為登入入口
      $footerActionBtn.show().addClass("btn-popLoginBtn").on("click", function () {
        window.openOnlyModal("#regressmodal");
      });
    } else if (hasReward) {
      // [已登入 & 有獎勵]
      $modal.find(".type-list").show();
      $modal.find(".type-empty").hide();
      // $tip.text("※請於獲獎15天內完成填寫，超過期限恕不予以補發。");
      $tip.empty().text("分享專屬連結邀請好友預約可獲得更多抽獎機會!");

      // 有獎勵時：領獎按鈕放在 table 內
      $tableGetBtns.show().addClass("btn-LotteryGet").on("click", function () {
        window.openOnlyModal("#popLotteryGet");
      });

      $footerActionBtn.show().addClass("btn-pop-invite").on("click", function () {
        window.openOnlyModal("#popShare");
      });

    } else {
      // [已登入 & 無獎勵]
      $modal.find(".type-list").hide();
      $modal.find(".type-empty").css("display", "flex");
      // $notRewards.text("暫未查詢到您的中獎記錄");
      $notRewards.removeClass("state-not-login").addClass("state-no-reward");
      $tip.empty().text("分享專屬連結邀請好友預約可獲得更多抽獎機會!");

      // 顯示分享按鈕
      // $btn.addClass("btn-pop-invite").on("click", function () {
      //   window.openOnlyModal("#popShare");
      // });
      $footerActionBtn.show().addClass("btn-pop-invite").on("click", function () {
        window.openOnlyModal("#popShare");
      });
    }
  }



  // 8. 地圖上的抽獎按鈕邏輯
  // 8. 地圖上的抽獎按鈕邏輯
  $(".event_lottery_btn").on("click", function () {
    if (mapLotteryCount > 0) {
      // 有次數 -> 播放動畫
      $(".modal").modal("hide");
      setTimeout(function () {
        $("#popLotteryAnimation").modal({
          backdrop: "static",
          keyboard: false,
          show: true,
        });
      }, 300);

      setTimeout(function () {
        window.openOnlyModal("#popLottery");
        mapLotteryCount--;
      }, 2000);
    } else {
      // 沒次數 -> 直接顯示結果 (NoChance)
      window.openOnlyModal("#popLottery");
    }
  });
  // 通用：任何帶有 .btn-pop-invite 的按鈕點擊時開啟分享彈窗
  $(document).on("click", ".btn-pop-invite", function () {
    window.openOnlyModal("#popShare");
  });

  // 提交資料按鈕
  $(document).on("click", ".btn-send-data", function () {
    // $("#popMsg .popMsgCont p").text("提交成功");
    $("#popMsg .popMsgCont p").addClass("state-submit-success");
    window.openOnlyModal("#popMsg");
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
      // $hint.removeClass("none"); // 不再連動隱藏，以便時間OFF時也能點擊
      $btn.text("時間ON");
      // 顯示 Hint 圖片
      $pics.addClass("show_hint");

      // 顯示 Hint 圖片
      $pics.addClass("show_hint");
    } else {
      // 目前為 ON -> 切換為 OFF
      $targetDesk.addClass("none");
      // $hint.addClass("none"); // 不再連動隱藏
      $btn.text("時間OFF");
      // 顯示 原本圖片
      $pics.removeClass("show_hint");

      // 顯示 原本圖片
      $pics.removeClass("show_hint");

      // 若當前正顯示 desk_double_yy，強制切換至 A1
      if ($targetDesk.is(":visible")) {
        $targetDesk.removeClass("desk_anim_in").hide();
        $(".desk_A1").show().addClass("desk_anim_in");
      }
    }
  });

  // 初始化呼叫
  updateDoubleYYBtnState();

  // [New] .event_main_btn 點擊事件：顯示 "活動尚未開啟"
  $(document).on("click", ".event_main_btn", function () {
    $("#popMsg .popMsgCont p").text("活動尚未開啟");
    openOnlyModal("#popMsg");
  });
});
