// main.js

$(document).ready(function () {
  // 解決手機版虛擬鍵盤收起後，底部留白/跑版的問題
  $("input, select, textarea").on("blur", function () {
    setTimeout(function () {
      window.scrollTo(0, 0);

      // 【強制重繪魔法】
      // 故意隱藏再瞬間顯示，強迫手機瀏覽器重新計算真正的網頁高度
      var body = document.body;
      var originalDisplay = body.style.display;
      body.style.display = "none";
      body.offsetHeight; // 讀取 offsetHeight 會觸發瀏覽器立刻重新計算排版
      body.style.display = originalDisplay;
    }, 100);
  });

  // 點擊會員按鈕切換顯示/隱藏會員資訊區塊
  $(".btn_member").on("click", function (e) {
    e.stopPropagation();
    // 取得畫面上唯一的會員區塊
    var $block = $(".member_info_block");
    // 如果目前不在這顆按鈕後面，就搬移過去並顯示
    if ($block.prev()[0] !== this) {
      $block.insertAfter(this).show();
    } else {
      // 否則就單純切換顯示/隱藏
      $block.toggle();
    }
  });

  // 點擊畫面其他地方自動隱藏會員資訊區塊
  $(document).on("click", function () {
    $(".member_info_block").hide();
  });

  // 點擊會員資訊區塊內部不觸發隱藏
  $(".member_info_block").on("click", function (e) {
    e.stopPropagation();
  });

  // 載入 footer 內容
  $(".footer").load(
    "https://ids.iwplay.com.tw/includ/footer/15b_nte_new.html",
    function () {
      // 載入完成後顯示
      $(".footer").addClass("show");
    },
  );

  // ==========================================
  // 切換頁面的函式
  // ==========================================
  window.switchPage = function (targetClass) {
    // 隱藏所有 event 頁面
    $(".event").hide();

    // 顯示目標頁面
    $(targetClass).css("display", "flex");

    // 如果不是首頁、任務與抽獎頁面，隱藏 footer
    if (targetClass !== ".event_home" && targetClass !== ".event_main") {
      $(".footer").removeClass("show");
    } else {
      $(".footer").addClass("show");
    }

    // 當切換到任務與抽獎首頁時，預設隱藏所有簽署與蓋版 (避免污染正常畫面)
    if (targetClass === ".event_main") {
      $(".initial_signing_modal").hide();
      $(".back_player_overlay").hide();
      $(".new_player_overlay").hide();
      $(".demo_btn_group").show();
    } else {
      $(".demo_btn_group").hide();
    }
  };

  // 綁定「登入」按鈕點擊事件
  $(".btn_go_partner").on("click", function () {
    // 使用 switchPage 邏輯
    switchPage(".event_main");
  });

  // 綁定「返回首頁」按鈕點擊事件
  $(".btn_return").on("click", function () {
    // 使用 switchPage 邏輯
    switchPage(".event_home");
  });

  // ==========================================
  // Demo 模擬登入功能
  // ==========================================

  window.currentDemoPlayer = "";

  // 模擬一般玩家登入(無狀態)
  $(".demo_normal_player").on("click", function () {
    switchPage(".event_main");
    window.currentDemoPlayer = "";
    // 不顯示遮罩，不顯示彈窗
    $(".back_player_overlay").hide();
    $(".new_player_overlay").hide();
    $(".award_player_overlay").hide();
    $(".initial_signing_modal").hide().addClass("closed");
  });

  // 模擬回流玩家登入
  $(".demo_back_player").on("click", function () {
    // 確保回到主畫面 (因為是強制回到主畫面)
    switchPage(".event_main");
    window.currentDemoPlayer = "back";
    // 先把回流或新玩家專屬遮罩藏起(等待簽署後才顯示)
    $(".back_player_overlay").hide();
    $(".new_player_overlay").hide();
    $(".award_player_overlay").hide();
    // 顯示簽署彈窗，清除可能殘留的狀態
    $(".initial_signing_modal")
      .css("display", "flex")
      .removeClass("closed bound");
    $(".initial_signing_modal .modal_content").removeClass("bound");
    $(".initial_signing_modal .modal_invite_area").removeClass("bound");
    $(".initial_signing_modal .modal_input_wrapper").removeClass("bound");
  });

  // 模擬新玩家登入
  $(".demo_new_player").on("click", function () {
    // 確保回到主畫面 (因為是強制回到主畫面)
    switchPage(".event_main");
    window.currentDemoPlayer = "new";
    // 先把回流或新玩家專屬遮罩藏起(等待簽署後才顯示)
    $(".new_player_overlay").hide();
    $(".back_player_overlay").hide();
    $(".award_player_overlay").hide();
    // 顯示簽署彈窗，清除可能殘留的狀態
    $(".initial_signing_modal")
      .css("display", "flex")
      .removeClass("closed bound");
    $(".initial_signing_modal .modal_content").removeClass("bound");
    $(".initial_signing_modal .modal_invite_area").removeClass("bound");
    $(".initial_signing_modal .modal_input_wrapper").removeClass("bound");
  });

  // ==========================================
  // 點擊回流玩家&新玩家遮罩蓋版中的「邀約綁定」按鈕
  // ==========================================
  $(".btn_invite_bind").on("click", function () {
    // 隱藏目前所在的遮罩蓋版
    $(this).closest(".task_block_overlay").hide();

    // 再次顯示簽署彈窗，清除可能殘留的狀態
    $(".initial_signing_modal")
      .css("display", "flex")
      .removeClass("closed bound");
    $(".initial_signing_modal .modal_content").removeClass("bound");
    $(".initial_signing_modal .modal_invite_area").removeClass("bound");
    $(".initial_signing_modal .modal_input_wrapper").removeClass("bound");
  });

  // ==========================================
  // 點擊「邀請狀態」按鈕顯示邀請紀錄 / 獎勵紀錄彈窗
  // ==========================================
  $(".invitation_status, .btn_time").on("click", function () {
    $("#popInviteLog").modal("show");
  });

  // ==========================================
  // 邀請紀錄 / 獎勵紀錄 雙分頁切換邏輯
  // ==========================================
  $("#popInviteLog .click_area").on("click", function () {
    const $btn = $(this);
    if ($btn.hasClass("active")) return; // 已經是當前分頁則不動作

    // 1. 切換啟動狀態 class
    $btn.siblings(".click_area").removeClass("active");
    $btn.addClass("active");

    // 2. 替換上方顯示的按鈕圖片
    const newImgSrc = $btn.data("img");
    $btn.siblings(".tab_active_img").attr("src", newImgSrc);

    // 3. 切換對應的內容區塊
    const target = $btn.data("target");
    const $modal = $btn.closest(".pop-bg");
    $modal.find(".tab-pane-content").hide();
    $modal.find(target).fadeIn(200);
  });

  // 點擊「分享邀請碼」或「分享連結」按鈕顯示提示訊息彈窗
  $(".share_code_btn, #popLottery .share_btn3").on("click", function () {
    $("#popMsg .popMsgCont p").html("複製成功快去分享吧!");
    $("#popMsg").modal("show");
  });

  // 點擊「分享專屬連結」按鈕顯示提示訊息彈窗
  $(".btn_share_link").on("click", function () {
    $("#popMsg .popMsgCont p").html("複製成功快去分享吧!");

    // 找出當前所在的彈窗
    var $currentModal = $(this).closest(".modal");
    if ($currentModal.length > 0) {
      // 如果是在彈窗內點擊的：先關閉當前彈窗，延遲 0.4 秒等動畫結束再顯示新彈窗
      $currentModal.modal("hide");
      setTimeout(function () {
        $("#popMsg").modal("show");
      }, 400);
    } else {
      // 如果是在主畫面上直接點擊的：不需要等待，直接秒開
      $("#popMsg").modal("show");
    }
  });

  // 幸運抽取資訊按鈕點擊事件 (切換提示文字顯示/隱藏)
  $(".btn_lucky_info").on("click", function () {
    const hint = $(".lucky_draw_hint");
    if (hint.css("opacity") == "0") {
      hint.css("opacity", "1");
    } else {
      hint.css("opacity", "0");
    }
  });

  // ==========================================
  // 任務列表任務領取功能
  // ==========================================

  // 任務1
  $(".share_btn_1").on("click", function () {
    const bgPos = $(this).css("background-position");

    // 如果已經是 bottom (或 100%)，代表已領取，直接 return 不執行後續動作
    if (bgPos.includes("bottom") || bgPos.includes("100%")) {
      return;
    }

    // 改變按鈕背景圖位置為 bottom (切換為已點擊/已領取狀態)，並將游標改為 default
    $(this).css({
      "background-position": "center bottom",
      cursor: "default",
    });

    // 更改彈窗文字並顯示
    $("#popMsg .popMsgCont p").html("複製成功快去分享吧!");
    $("#popMsg").modal("show");
  });

  // ==========================================
  // 回流邀請進度&新人邀請進度領取功能
  // ==========================================
  $(".task_btn_type1, .task_btn_type2").on("click", function () {
    const $btn = $(this);
    const status = $btn.attr("data-status");

    // 狀態 0(不可領) 或 2(已領取) 則不動作
    if (status !== "1") return;

    // 判斷是回流任務(type1)還是新人任務(type2)，決定獎勵圖片
    const isType1 = $btn.hasClass("task_btn_type1");
    const giftImgUrl = isType1
      ? "https://rests-nte.iwplay.com.tw/events/BlackBird/image/pop/task_gift_1.webp"
      : "https://rests-nte.iwplay.com.tw/events/BlackBird/image/pop/task_gift_2.webp";

    // 動態替換彈窗內的獎品圖片
    $("#popGetAward .pop-award-item").css(
      "background-image",
      `url('${giftImgUrl}')`,
    );

    // 顯示「恭喜獲得」彈窗
    $("#popGetAward").modal("show");

    // 領取完成後，將該按鈕狀態切換為 2 (已領取)
    $btn.attr("data-status", "2");
  });

  // ==========================================
  // 邀請紀錄/獎勵紀錄 - 無資料狀態切換測試按鈕
  // ==========================================
  $("#toggleAwardEmpty_v1").on("click", function () {
    // 找出兩個分頁裡面的列表與空狀態
    const $listBody = $("#popInviteLog .invite-list-body");
    const $emptyData = $("#popInviteLog .empty-data");

    // 互相切換顯示/隱藏
    $listBody.toggle();
    $emptyData.toggle();
  });

  // ==========================================
  // 幸運抽取 3D 動畫與彈窗邏輯
  // ==========================================
  let remainingDraws = 5; // 紀錄剩餘抽獎次數
  let totalDraws = 0; // 紀錄已抽獎次數
  let isAnimating = false; // 動畫鎖定狀態

  // 初始化畫面上的剩餘次數
  $("#draw_count").text(remainingDraws + "次");

  // 前 5 抽保證獲得的「卡背」陣列 (1~5 不重複)，可打亂順序
  let guaranteedCardBacks = [1, 2, 3, 4, 5];

  // 簡單洗牌讓前 5 抽卡背順序隨機
  for (let i = guaranteedCardBacks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [guaranteedCardBacks[i], guaranteedCardBacks[j]] = [
      guaranteedCardBacks[j],
      guaranteedCardBacks[i],
    ];
  }

  // 1. 點擊主畫面抽獎按鈕 -> 打開彈窗
  $(".lottery_btn").on("click", function () {
    if (remainingDraws <= 0) {
      // 抽獎次數已用盡，使用通用彈窗顯示訊息
      $("#popMsg .popMsgCont p").html("抽獎次數已用盡！");
      $("#popMsg").modal("show");
      return; // 終止執行，不打開抽獎彈窗
    }

    // 每次打開彈窗時，先將卡片重置為初始狀態
    resetLotteryModal();
    $("#popLottery").modal("show");
  });

  // 2. 點擊彈窗內任意卡片背面的互動
  $("#popLottery .lottery_card_item").on("click", function () {
    // 動畫中，或是該卡片已經翻開了，或是已有其他卡片翻開，皆禁止再次點擊
    if (
      isAnimating ||
      $(this).hasClass("is-flipped") ||
      $("#popLottery .lottery_card_item.is-flipped").length > 0
    )
      return;

    // 雙重保險，翻牌前最後檢查，如果抽獎次數為 0，則攔截繼續抽獎的動作
    if (remainingDraws <= 0) {
      $("#popMsg .popMsgCont p").html("抽獎次數已用盡！");
      $("#popMsg").modal("show");
      return;
    }

    isAnimating = true;

    totalDraws++; // 增加抽獎次數
    remainingDraws--; // 扣除剩餘次數
    $("#draw_count").text(remainingDraws + "次"); // 更新首頁次數顯示

    let cardBackIndex;

    // 獎品圖 (右側顯示的獎勵)：永遠是全隨機 (1~5)，沒有保底
    let prizeIndex = Math.floor(Math.random() * 5) + 1;

    // 卡背圖 (翻開的卡片圖案)：前 5 次保底不重複，第 6 次以後全隨機 (1~5)
    if (totalDraws <= 5) {
      cardBackIndex = guaranteedCardBacks.pop();
    } else {
      cardBackIndex = Math.floor(Math.random() * 5) + 1;
    }

    const cardBackImg = `https://rests-nte.iwplay.com.tw/events/BlackBird/image/pop/lucky_draw_card_gift_${cardBackIndex}.webp`;
    const prizeImg = `https://rests-nte.iwplay.com.tw/events/BlackBird/image/pop/gift_${prizeIndex}.webp`;

    const $clickedCard = $(this);
    const $otherCards = $("#popLottery .lottery_card_item").not($clickedCard);

    // 將抽中的圖片設置到該卡片的背面上
    $clickedCard.find(".card-back img").attr("src", cardBackImg);
    // 將右側中獎資訊的獎品圖替換
    $("#popLottery .award_gift").attr("src", prizeImg);

    // 第一階段動畫：翻轉點擊的卡片，淡出其他兩張卡片
    $clickedCard.addClass("is-flipped");
    $otherCards.addClass("fade-out");

    // 第二階段動畫：等待翻轉結束(約0.5秒)後，卡片左移，中獎資訊滑入
    setTimeout(() => {
      $clickedCard.addClass("move-left-scale");
      $("#popLottery .lottery_award_info").addClass("slide-in-right");

      // 替換底部提示字
      $("#popLottery .lottery_hint_text").hide();
      $("#popLottery .lottery_close_text").show();

      // 此時讓背景可以點擊關閉 (啟用原生的關閉機制)
      $("#popLottery .lottery_close_area").show();

      // 動畫結束，解開鎖定狀態 (但彈窗不重置，等待使用者關閉或點擊繼續)
      isAnimating = false;
    }, 500);
  });

  // 3. 點擊「繼續占卜」按鈕
  $("#popLottery .continue_btn").on("click", function () {
    if (isAnimating) return; // 防呆：如果還在重置或翻牌，禁止點擊

    // 如果抽獎次數為 0，則攔截繼續抽獎的動作
    if (remainingDraws <= 0) {
      $("#popMsg .popMsgCont p").html("抽獎次數已用盡！");
      $("#popMsg").modal("show");
      return; // 終止執行，不重置卡片
    }

    resetLotteryModal();
  });

  // 4. 當彈窗完全關閉時重置
  $("#popLottery").on("hidden.bs.modal", function () {
    resetLotteryModal();
  });

  // 重置彈窗回到 3 張牌初始狀態的共用函式
  function resetLotteryModal() {
    isAnimating = true; // 1. 一進入重置階段，立刻鎖死所有點擊

    // 移除所有動畫 Class
    $("#popLottery .lottery_card_item").removeClass(
      "is-flipped fade-out move-left-scale",
    );
    $("#popLottery .lottery_award_info").removeClass("slide-in-right");

    // 文字與關閉區塊還原
    $("#popLottery .lottery_hint_text").show();
    $("#popLottery .lottery_close_text").hide();
    $("#popLottery .lottery_close_area").hide(); // 隱藏防誤觸背景關閉

    // 延遲 500 毫秒 (等待卡片翻回背面、歸位完畢) 後，才解除鎖定
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
});

// 邀約綁定簽屬蓋版輪播
$(document).ready(function () {
  // 初始化邀約綁定簽屬蓋版的輪播
  if ($(".modal_swiper").length > 0) {
    new Swiper(".modal_swiper", {
      loop: true,
      autoplay: {
        delay: 3000, // 3秒跳下一張
        disableOnInteraction: false, // 讓使用者點擊或滑動後，依然會自動輪播
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // 點擊「合約簽署」彈窗中的「不簽署」按鈕
  $(".btn_modal_notsign").on("click", function () {
    // 1. 根據目前 Demo 身分，重新顯示原本的背景遮罩 (不套用淡入動畫)
    if (window.currentDemoPlayer === "back") {
      $(".back_player_overlay").show();
    } else if (window.currentDemoPlayer === "new") {
      $(".new_player_overlay").show();
    }

    // 2. 立刻關閉簽署彈窗 (直接 hide 不使用 fadeOut 免延遲)
    $(".initial_signing_modal").hide().addClass("closed");
  });

  // 點擊「合約簽署」彈窗的右上角關閉按鈕
  $(".initial_signing_modal .close_signing_modal").on("click", function () {
    if ($(".initial_signing_modal .modal_content").hasClass("bound")) {
      // 狀態2：已綁定，關閉彈窗並顯示 award_player_overlay
      $(".initial_signing_modal").hide().addClass("closed");
      $(".award_player_overlay").show();
    } else {
      // 狀態1：未綁定，同 btn_modal_notsign，顯示原本的蓋板
      if (window.currentDemoPlayer === "back") {
        $(".back_player_overlay").show();
      } else if (window.currentDemoPlayer === "new") {
        $(".new_player_overlay").show();
      }
      $(".initial_signing_modal").hide().addClass("closed");
    }
  });

  // 點擊邀約綁定簽屬蓋版的「確認」按鈕 -> 跳出二次確認彈窗
  $(".btn_modal_confirm").on("click", function () {
    const inputVal = $("#modal_invitee_code_input").val().trim();
    if (inputVal) {
      // 顯示二次確認彈窗
      $("#popBindingConfirm").modal("show");
    }
  });

  // 在二次確認彈窗點擊「確認」後 -> 切換為已綁定狀態
  $("#popBindingConfirm .btn-msg-confirm").on("click", function () {
    const inputVal = $("#modal_invitee_code_input").val().trim();
    if (inputVal) {
      // 將文字填入顯示專用的 span
      $(".initial_signing_modal #modal_invitee_code_display .role_id").text(
        inputVal,
      );
      // 為彈窗內容和區域加上 bound class 觸發 CSS 變化
      $(".initial_signing_modal .modal_content").addClass("bound");
      $(".initial_signing_modal .modal_invite_area").addClass("bound");
      $(".initial_signing_modal .modal_input_wrapper").addClass("bound");

      // 切換主畫面確認按鈕的狀態
      $("#btn_confirm_signing").addClass("confirmed");
    }

    // 等待 0.4 秒關閉動畫結束後，跳出成功回歸獎勵彈窗
    setTimeout(function () {
      $("#popReturnAward").modal("show");
    }, 400);
  });
});
// ----------------------------------------------

// 確認綁定彈窗 的 static backdrop 點擊動畫
$(document).on("click", '.modal[data-backdrop="static"]', function (e) {
  // 確定點擊的是外層黑色遮罩(modal 本身)，而不是裡面的內容(modal-dialog 等)
  if ($(e.target).hasClass("modal")) {
    var $modal = $(this);
    $modal.addClass("modal-static");
    // 300 毫秒後移除 class，這樣下次點擊才會再次觸發動畫
    setTimeout(function () {
      $modal.removeClass("modal-static");
    }, 600);
  }
});

// ==========================================
// SDK彈窗 (#bookedmodal)
// 狀態管理: 'initial' | 'selectState' | 'state1' | 'state2' | 'state3'
// ==========================================
$(function () {
  var currentState = "initial";
  var btnBoxOriginal = null; // 快取初始 button_box 內容

  // 回復初始狀態（不關彈窗）
  function resetToInitial() {
    currentState = "initial";
    // 按鈕
    $("#phoneNextBtn").removeClass("d-none");
    $("#back_button").addClass("d-none");
    $("#booked_button").addClass("d-none");
    $("#back_sms_button").addClass("d-none");
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    // 表單欄位
    $(".phone_verification_code").addClass("d-none");
    $(".phone_password").addClass("d-none");
    $(".graphic_verification_code").addClass("d-none");
    // 狀態三相關：還原表單 + button_box + 第三方登入
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    if (btnBoxOriginal && $btnBox.length) {
      $btnBox.html(btnBoxOriginal);
    }
    $("#select_role").addClass("d-none");
    $("#bookedForm").removeClass("d-none");
    $("#other_login").removeClass("d-none");
    $("#demoState3").text("狀態三（角色選擇）");
    console.log("[popDemo] 回復初始狀態");
  }

  // 彈窗開啟時確保初始狀態，並快取 button_box 原始內容
  $("#bookedmodal").on("show.bs.modal", function () {
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    if (!btnBoxOriginal && $btnBox.length) {
      btnBoxOriginal = $btnBox.html();
    }
    resetToInitial();
  });

  // 點擊「下一步」→ 進入選擇狀態
  $(document).on("click", "#phoneNextBtn", function () {
    currentState = "selectState";
    $("#phoneNextBtn").addClass("d-none");
    $("#demoState1").removeClass("d-none");
    $("#demoState2").removeClass("d-none");
    $("#back_button").removeClass("d-none");
    console.log("[popDemo] 下一步 → 顯示狀態選擇按鈕");
  });

  // 狀態一：簡訊驗證碼登入
  $(document).on("click", "#demoState1", function () {
    currentState = "state1";
    // 顯示驗證碼欄位 + 圖形驗證碼 + 登入按鈕
    $(".phone_verification_code").removeClass("d-none");
    $(".graphic_verification_code").removeClass("d-none");
    $("#booked_button").removeClass("d-none");
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    console.log("[popDemo] 狀態一：簡訊驗證碼登入");
  });

  // 狀態二：密碼登入
  $(document).on("click", "#demoState2", function () {
    currentState = "state2";
    // 顯示密碼欄位 + 登入 + 簡訊登入按鈕
    $(".phone_password").removeClass("d-none");
    $("#booked_button").removeClass("d-none");
    $("#back_sms_button").removeClass("d-none");
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    console.log("[popDemo] 狀態二：密碼登入");
  });

  // 狀態三：角色選擇
  $(document).on("click", "#demoState3", function () {
    if (currentState === "state3") {
      resetToInitial();
      return;
    }
    currentState = "state3";
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    var btnBoxRole =
      '<div class="row">' +
      '<a class="btn btn-secondary" id="select_role_button"></a>' +
      '<a class="btn btn-secondary" id="back_role_button"></a>' +
      "</div>";
    // 隱藏登入表單 + 第三方登入，顯示角色選擇
    $("#bookedForm").addClass("d-none");
    $("#other_login").addClass("d-none");
    $("#select_role").removeClass("d-none");
    $btnBox.html(btnBoxRole);
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    $(this).text("狀態三（返回登入）");
    console.log("[popDemo] 狀態三：角色選擇");
  });

  // 角色選擇區「返回」按鈕 → 回初始狀態
  $(document).on("click", "#back_role_button", function () {
    resetToInitial();
    console.log("[popDemo] 從角色選擇返回 → 回初始狀態");
  });

  // 角色選擇區「登入」按鈕
  $(document).on("click", "#select_role_button", function () {
    var selectedRole = $("#role_select").val();
    console.log("[popDemo] 角色選擇登入，選擇角色:", selectedRole);
    if (window.mockProductList) {
      window.mockProductList();
    }
    $("#bookedmodal").modal("hide");
  });

  // 返回按鈕
  $(document).on("click", "#back_button", function () {
    if (currentState === "selectState") {
      // 從選擇狀態返回 → 回初始 + 關彈窗
      resetToInitial();
      $("#bookedmodal").modal("hide");
      console.log("[popDemo] 從選擇狀態返回 → 關閉彈窗");
    } else {
      // 從 state1/state2/state3 返回 → 回初始狀態
      resetToInitial();
    }
  });

  // 簡訊登入按鈕（從密碼狀態切換到狀態一）
  $(document).on("click", "#back_sms_button", function () {
    // 隱藏密碼相關
    $(".phone_password").addClass("d-none");
    $("#back_sms_button").addClass("d-none");
    // 顯示狀態一：簡訊驗證碼 + 圖形驗證碼
    $(".phone_verification_code").removeClass("d-none");
    $(".graphic_verification_code").removeClass("d-none");
    currentState = "state1";
    console.log("[popDemo] 切換到狀態一：簡訊登入");
  });

  // 點擊登入按鈕
  $(document).on("click", "#booked_button", function () {
    if (window.mockProductList) {
      window.mockProductList();
    }
    $("#bookedmodal").modal("hide");
    console.log("[popDemo] 登入 → 關閉彈窗");
  });

  // ==========================================
  // 修正 Bootstrap 多重彈窗 (Modal 疊加) 遮罩層級問題
  // ==========================================
  $(document).on("show.bs.modal", ".modal", function () {
    // 根據目前畫面上已經打開的彈窗數量，動態往上增加層級 (預設 1050 起跳)
    var zIndex = 1050 + 10 * $(".modal:visible").length;
    $(this).css("z-index", zIndex);

    // Bootstrap 是非同步產生遮罩的，稍微等待一下再抓取最新的遮罩並提高層級
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);
  });

  // 當彈窗關閉時，如果畫面上還有其他彈窗開著，確保 body 的 modal-open 樣式不會消失（防止背景可以捲動）
  $(document).on("hidden.bs.modal", ".modal", function () {
    if ($(".modal:visible").length > 0) {
      $("body").addClass("modal-open");
    }
  });
});
