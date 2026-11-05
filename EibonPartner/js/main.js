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

  // 載入 footer 內容，因為 off_line.js 被註解了所以移到這裡
  $(".footer").load(
    "https://ids.iwplay.com.tw/includ/footer/12b_nte_new.html",
    function () {
      // 載入完成後顯示
      $(".footer").addClass("show");
    },
  );

  // 綁定「登入」按鈕點擊事件
  $(".btn_go_partner").on("click", function () {
    // 使用 switchPage 邏輯
    switchPage(".event_partner_action");
  });

  // 綁定「Demo」切換按鈕的點擊 (合夥人行動頁面 / 受邀人簽署頁面)
  $(".demo_switch_btn").on("click", function () {
    var $partner = $(".event_partner_action");
    var $invitee = $(".event_invitee_signing");

    if ($partner.is(":visible")) {
      switchPage(".event_invitee_signing");
    } else if ($invitee.is(":visible")) {
      switchPage(".event_partner_action");
    }
  });

  // 綁定合夥人行動的頁籤切換
  $(".partner_tab").on("click", function () {
    var $parent = $(this).closest(".event");
    // 移除當前外層容器內所有頁籤的 active 狀態
    $parent.find(".partner_tab").removeClass("active");
    // 為當前點擊的頁籤加上 active
    $(this).addClass("active");

    // 隱藏當前外層容器內所有的內容區塊
    $parent.find(".tab_content").hide();
    // 顯示對應的內容區塊
    var target = $(this).data("target");
    $(target).fadeIn(200);

    // 任務備註：只在「合夥人任務」頁籤時顯示
    var $note = $parent.find(".task_note");
    if (target === "#content_task" || target === "#content_task_signing") {
      $note.show();
    } else {
      $note.hide();
    }
  });

  // 點擊「邀請狀態」按鈕顯示邀請紀錄彈窗
  $(".invitation_status").on("click", function () {
    $("#popInviteLog").modal("show");
  });

  // 點擊「複製」/ 「分享專屬連結」按鈕顯示提示訊息彈窗
  $(".btn_copy, .btn_share_link,.btn_lucky_share").on("click", function () {
    $("#popMsg .popMsgCont p").html(
      "複製成功快去分享吧!<br><span style='font-size: 0.45em; display: inline-block;'>※邀請獎勵將於回歸的鑒定師登錄後隔日11:00進行更新。<br/>※請您於隔日進行獎勵確認。</span>",
    );

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
  // 合夥人任務按鈕領取功能
  // ==========================================
  $("#content_task .btn_im_task").on("click", function () {
    const $btn = $(this);
    const bgPos = $btn.css("background-position");

    // 檢查背景位置是否為 center center 或 50% 50% (代表可領取)
    if (bgPos === "50% 50%" || bgPos === "center center") {
      // 點擊第幾個任務
      const taskIndex = $btn.closest(".im_task").index();

      // 對應的獎勵圖片 (1 到 6 的任務，對應獎勵: 1, 2, 3, 3, 3, 6)
      let giftNum = 1;
      if (taskIndex === 0) giftNum = 1;
      else if (taskIndex === 1) giftNum = 2;
      else if (taskIndex === 2 || taskIndex === 3 || taskIndex === 4)
        giftNum = 3;
      else if (taskIndex === 5) giftNum = 6;

      // 更新獲得獎勵彈窗內容
      $("#popGetAward .pop-award-item").css(
        "background-image",
        `url(https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/partner_gift${giftNum}.webp)`,
      );

      // 更新獲得獎勵彈窗標題為 pop_get_tt.webp
      $("#popGetAward .popAwardTit").css(
        "background-image",
        "url(https://rests-nte.iwplay.com.tw/events/EibonPartner/images/pop/pop_get_tt.webp)",
      );

      // 顯示彈窗
      $("#popGetAward").modal("show");

      // 點擊後更新狀態為已領取 (center bottom)
      $btn.css("background-position", "center bottom");
    }
    // 狀態 2：檢查背景位置是否為 center top 或 50% 0% (代表任務尚未完成)
    else if (bgPos === "50% 0%" || bgPos === "center top") {
      // 當任務還沒完成時被點擊，統一跳出提示訊息彈窗
      $("#popMsg .popMsgCont p").html(
        "複製成功快去分享吧!<br><span style='font-size: 0.45em; display: inline-block;'>※回歸的鑒定師登錄後，您的獎勵將於隔天11:00進行更新。<br/>※請您於隔日進行獎勵確認。</span>",
      );
      $("#popMsg").modal("show");

      // 檢查目前點擊的是不是任務 1 或 2
      // 如果是的話，點擊後立刻將背景圖切換至 center center (代表變成可領取狀態)
      // 而任務 3、4、5、6 (沒有這個 class) 則不會受到影響，維持原本的 center top (未完成狀態)
      if ($btn.hasClass("btn_task_share")) {
        $btn.css("background-position", "center center");
      }
    }
  });

  // ==========================================
  // 幸運抽取 3D 動畫與洗牌邏輯
  // ==========================================
  let remainingChances = 5;
  let isAnimating = false;
  // gridContainer and cards will be dynamically scoped on click

  // 獎品圖庫 (5 種) 及對應的大圖案編號 (不重複抽取)
  let availableGifts = [
    {
      id: 1,
      img: "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/lucky_draw_card_gift1.webp",
    },
    {
      id: 2,
      img: "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/lucky_draw_card_gift2.webp",
    },
    {
      id: 3,
      img: "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/lucky_draw_card_gift3.webp",
    },
    {
      id: 4,
      img: "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/lucky_draw_card_gift4.webp",
    },
    {
      id: 5,
      img: "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/lucky_draw_card_gift5.webp",
    },
  ];
  let modalTimer = null;

  $(".btn_lucky_draw").on("click", function () {
    if (isAnimating) return;
    if (remainingChances <= 0) {
      alert("您的抽獎次數已用盡！");
      return;
    }

    const $parent = $(this).closest(".event");
    const gridContainer = $parent.find(".lucky_draw_cards")[0];
    const cards = $parent.find(".card").toArray();
    const chanceDisplays = document.querySelectorAll("#draw_count");

    // 1. 上鎖全域狀態與扣除次數
    isAnimating = true;
    remainingChances--;
    chanceDisplays.forEach((el) => (el.innerText = remainingChances));

    // 2. 隨機決定要翻哪張卡片與抽中哪個獎品
    const randomIndex = Math.floor(Math.random() * cards.length);
    const targetCard = cards[randomIndex];

    // 從剩餘獎品中隨機抽出一項，並從可用清單中移除以防重複
    const drawIndex = Math.floor(Math.random() * availableGifts.length);
    const selectedGift = availableGifts.splice(drawIndex, 1)[0];

    const randomGift = selectedGift.img;
    const popupGift =
      "https://rests-nte.iwplay.com.tw/events/EibonPartner/images/event_partner_action/get_gift" +
      selectedGift.id +
      ".webp";

    // 將獎品圖設定到該卡片的背面
    const cardBackImg = targetCard.querySelector(".card-back img");
    if (cardBackImg) cardBackImg.src = randomGift;

    // 執行翻開特效
    targetCard.classList.add("is-flipped");

    // 3. 翻牌動畫後先觸發第一段「展示獎勵」彈窗
    setTimeout(() => {
      // 設定第一段展示彈窗內的獎品圖並顯示 (使用卡牌背面圖)
      $parent.find(".modal_gift_img").attr("src", randomGift);
      $parent.find(".modal_bg, .modal_content_wrapper").fadeIn(300);

      // 儲存進度狀態，防止重複執行
      let firstModalClosed = false;
      function proceedToSecondModal() {
        if (firstModalClosed) return;
        firstModalClosed = true;

        if (modalTimer) {
          clearTimeout(modalTimer);
          modalTimer = null;
        }

        // 淡出第一段展示彈窗
        $.when(
          $parent.find(".modal_bg").fadeOut(300),
          $parent.find(".modal_content_wrapper").fadeOut(300),
        ).done(function () {
          // 替換第二段 #popGetAward 裡面的圖片並顯示
          $("#popGetAward .pop-award-item").css(
            "background-image",
            `url(${popupGift})`,
          );

          // 確保抽取獎勵彈窗標題為 pop_award_tt.webp (因為 btn_task_get 可能會將其改為 pop_get_tt)
          $("#popGetAward .popAwardTit").css(
            "background-image",
            "url(https://rests-nte.iwplay.com.tw/events/EibonPartner/images/pop/pop_award_tt.webp)",
          );

          $("#popGetAward").modal("show");

          // 監聽第二段獲得獎勵彈窗關閉事件 (手動點擊叉叉或背景)
          $("#popGetAward").one("hidden.bs.modal", function () {
            closeModalAndShuffle(targetCard, gridContainer, cards);
          });
        });
      }

      // 第一段展示彈窗自動 1.5 秒後進入第二段「獲得獎勵」彈窗
      modalTimer = setTimeout(() => {
        proceedToSecondModal();
      }, 1500);

      // 如果玩家點擊了第一段展示彈窗，也可以提早進入第二段
      $parent
        .find(".modal_bg, .modal_content_wrapper")
        .off("click")
        .on("click", function () {
          proceedToSecondModal();
        });
    }, 500);
  });

  // 關閉彈窗後執行蓋牌與洗牌動畫
  function closeModalAndShuffle(targetCard, gridContainer, cards) {
    // 彈窗完全消失後，卡片蓋回背面
    targetCard.classList.remove("is-flipped");

    // 等待蓋牌動畫 0.6 秒結束後，執行大洗牌
    setTimeout(() => {
      executeShuffle(gridContainer, cards);
    }, 600);
  }

  // 核心洗牌邏輯
  function executeShuffle(gridContainer, cards) {
    if (!gridContainer || cards.length === 0) return;

    const gridRect = gridContainer.getBoundingClientRect();
    const gridCenterX = gridRect.left + gridRect.width / 2;
    const gridCenterY = gridRect.top + gridRect.height / 2;

    // 第一階段：所有卡牌飛向中心點
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // 計算每張卡牌距離網格中心的偏移量
      const translateX = gridCenterX - cardCenterX;
      const translateY = gridCenterY - cardCenterY;
      // 加上隨機旋轉角度，模擬真實疊牌的參差不齊感
      const randomRotate = (Math.random() - 0.5) * 45;

      card.style.zIndex = 10 + index; // 確保在上方疊放
      card.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${randomRotate}deg)`;
    });

    // 第二階段：洗牌完畢，重新發牌回到原位
    setTimeout(() => {
      cards.forEach((card) => {
        card.style.transform = `translate(0px, 0px) rotate(0deg)`;
        card.style.zIndex = 1;
      });

      // 發牌動畫結束後，解鎖全域狀態
      setTimeout(() => {
        isAnimating = false;
      }, 500); // 對應 CSS 的平移動畫時間 0.5s
    }, 800); // 在中心疊放停留 0.8 秒
  }

  // ==========================================
  // 受邀人簽署頁面：確認按鈕點擊
  // ==========================================
  $("#btn_confirm_signing").on("click", function () {
    const $btn = $(this);
    if ($btn.hasClass("confirmed")) return;

    const inputVal = $("#invitee_code_input").val().trim();
    if (!inputVal) return; // 如果沒輸入字則不執行

    // 切換按鈕背景到下半部
    $btn.addClass("confirmed");

    // 隱藏輸入框，顯示固定文字
    $("#invitee_code_input").hide();
    $("#invitee_code_display").text(inputVal).show();
  });
});

// 切換頁面的函式
window.switchPage = function (targetClass) {
  // 隱藏所有 event 頁面
  $(".event").hide();

  // 顯示目標頁面
  $(targetClass).css("display", "flex");

  // 如果不是首頁、合夥人行動頁或受邀人簽署頁，顯示 Demo 切換鈕，並隱藏 footer
  if (
    targetClass !== ".event_home" &&
    targetClass !== ".event_partner_action" &&
    targetClass !== ".event_invitee_signing"
  ) {
    $(".demo_switch_btn").show();
    $(".footer").removeClass("show");
  } else {
    if (
      targetClass === ".event_partner_action" ||
      targetClass === ".event_invitee_signing"
    ) {
      $(".demo_switch_btn").show(); // 暫時保留 Demo 按鈕讓使用者切換
    } else {
      $(".demo_switch_btn").hide();
    }
    $(".footer").addClass("show");
  }

  // 初始簽署彈窗：只有在切換到受邀人簽署頁，且尚未被手動關閉過時才顯示
  if (targetClass === ".event_invitee_signing") {
    if (!$(".initial_signing_modal").hasClass("closed")) {
      $(".initial_signing_modal").css("display", "flex");
    }
  } else {
    $(".initial_signing_modal").hide();
  }
};

// 受邀人合約簽屬彈窗輪播
$(document).ready(function () {
  // 初始化受邀人合約簽屬彈窗的輪播
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

  // 點擊受邀人合約簽屬彈窗的「不簽署」按鈕
  $(".btn_modal_notsign").on("click", function () {
    $(".initial_signing_modal").fadeOut(300).addClass("closed");
  });

  // 點擊受邀人合約簽屬彈窗的「確認」按鈕
  $(".btn_modal_confirm").on("click", function () {
    const inputVal = $("#modal_invitee_code_input").val().trim();
    if (inputVal) {
      // 隱藏原本的輸入框
      $("#invitee_code_input").hide();
      // 將文字填入顯示專用的 span 並顯示出來
      $("#invitee_code_display").text(inputVal).show();
      // 切換主畫面確認按鈕的狀態 (背景圖會切換到下半部)
      $("#btn_confirm_signing").addClass("confirmed");
    }
    $(".initial_signing_modal").fadeOut(300).addClass("closed");
  });
});

// ----------------------------------------------

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
});
