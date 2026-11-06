// js/login_demo.js — bookedmodal 狀態管理 + privacymodal 返回鏈（含 DEMO 測試觸發）
// 註：#bookedmodal 的完整結構（first_row / second_row / select_role2 + #select_role 角色選擇區）
//     已比照 events/common 放進 index.html 正式 HTML，本檔不再注入結構，只切換 d-none。
$(function () {

  // ============================================================
  // === FLOW：登入流程 ===
  // ============================================================

  var currentState = "initial";

  function resetToInitial() {
    currentState = "initial";
    $("#phoneNextBtn").removeClass("d-none");
    $("#back_button, #booked_button, #back_sms_button").addClass("d-none");
    $(".phone_verification_code, .phone_password, .graphic_verification_code").addClass("d-none");
    // 還原按鈕列：顯示登入兩列、隱藏角色選擇列與角色選擇區
    $("#first_row, #second_row").removeClass("d-none");
    $("#select_role2, #select_role").addClass("d-none");
    $("#bookedForm").removeClass("d-none");
    $("#other_login").removeClass("d-none");
  }

  $("#bookedmodal").on("show.bs.modal", function () {
    resetToInitial();
  });

  // 下一步
  $(document).on("click", "#phoneNextBtn", function () {
    currentState = "selectState";
    $("#phoneNextBtn").addClass("d-none");
    $("#back_button").removeClass("d-none");
    // DEMO：顯示狀態切換按鈕（見 DEMO 區塊）
  });

  // 返回（從選擇狀態退出關彈窗；其他狀態退回初始）
  $(document).on("click", "#back_button", function () {
    if (currentState === "selectState") {
      resetToInitial();
      bootstrap.Modal.getInstance(document.getElementById("bookedmodal")).hide();
    } else {
      resetToInitial();
    }
  });

  // 切換到簡訊登入（從密碼狀態）
  $(document).on("click", "#back_sms_button", function () {
    $(".phone_password, #back_sms_button").addClass("d-none");
    $(".phone_verification_code, .graphic_verification_code").removeClass("d-none");
    currentState = "state1";
  });

  // 提交登入
  $(document).on("click", "#booked_button", function () {
    bootstrap.Modal.getInstance(document.getElementById("bookedmodal")).hide();
  });

  // 確認選角 → 關彈窗
  $(document).on("click", "#select_role_button", function () {
    bootstrap.Modal.getInstance(document.getElementById("bookedmodal")).hide();
  });

  // 角色選擇返回 → 回初始狀態
  $(document).on("click", "#back_role_button", function () {
    resetToInitial();
  });

  // 登入成功 → 切換 btn_login ↔ btn_logout
  var loginSuccess = false;
  $(document).on("click", "#booked_button, #select_role_button", function () {
    loginSuccess = true;
  });
  $("#bookedmodal").on("hidden.bs.modal", function () {
    if (!loginSuccess) return;
    loginSuccess = false;
    var $btn = $(".btn_login");
    if ($btn.length) {
      $btn.removeClass("btn_login")
          .addClass("btn_logout")
          .removeAttr("data-bs-toggle")
          .removeAttr("data-bs-target");
    }
  });
  $(document).on("click", ".btn_logout", function () {
    $(this).removeClass("btn_logout")
           .addClass("btn_login")
           .attr("data-bs-toggle", "modal")
           .attr("data-bs-target", "#bookedmodal");
  });

  // privacymodal 返回鏈 — 動態設定返回目標
  $("#privacymodal").on("show.bs.modal", function (e) {
    if (!e.relatedTarget) return;
    var src = $(e.relatedTarget).closest(".modal");
    if (!src.length || src.attr("id") === "privacymodal") return;
    var id = "#" + src.attr("id");
    $("#privacymodal .popClose, #privacymodal .popup_close").attr("data-bs-target", id);
  });


  // ============================================================
  // === DEMO：測試用觸發 / 狀態切換 ===
  //
  // 只注入「測試觸發」結構（右下角 DEMO 面板 + #demoState1/2/3 切換鈕）。
  // #bookedmodal 的角色選擇結構（#select_role2 / #select_role）已在正式 HTML，
  // 本區塊只切換 d-none，不注入結構、不覆寫 .button_box。
  //
  // 正式上線時：刪除整個 DEMO 區塊即可（HTML 不需動），
  // 狀態切換改由伺服器回應自動觸發（例如驗證碼送出後自動顯示 state1）。
  // ============================================================

  // 1) 右下角 DEMO 測試面板
  $("body").append(
    '<div class="demo_btns">' +
      '<div class="demo_toggle">DEMO<\/div>' +
      '<div class="demo_list">' +
        '<button data-bs-toggle="modal" data-bs-target="#notice_modal">活動規則<\/button>' +
        '<button data-bs-toggle="modal" data-bs-target="#eventAlertModal">通用提示<\/button>' +
        '<button data-bs-toggle="modal" data-bs-target="#bookedmodal">帳號登入<\/button>' +
        '<button data-bs-toggle="modal" data-bs-target="#privacymodal">隱私權<\/button>' +
      '<\/div>' +
    '<\/div>'
  );
  $(document).on("click", ".demo_toggle", function () {
    $(".demo_list").toggleClass("show");
  });

  // 2) bookedmodal 內狀態切換鈕（放在 popClose 之後、popCont1 之前）
  $("#bookedmodal .popCont1.pop_booked_form").before(
    '<div class="demo-state-btns">' +
      '<button class="btn btn-outline-light btn-sm d-none" id="demoState1">狀態一<\/button>' +
      '<button class="btn btn-outline-light btn-sm d-none" id="demoState2">狀態二<\/button>' +
      '<button class="btn btn-outline-light btn-sm" id="demoState3">狀態三(角色選擇)<\/button>' +
    '<\/div>'
  );

  // 開窗時重置 DEMO 狀態按鈕
  $("#bookedmodal").on("show.bs.modal", function () {
    $("#demoState1, #demoState2").addClass("d-none");
    $("#demoState3").removeClass("d-none").text("狀態三(角色選擇)");
  });

  // phoneNextBtn 觸發時顯示 demo 狀態按鈕
  $(document).on("click", "#phoneNextBtn", function () {
    $("#demoState1, #demoState2").removeClass("d-none");
  });

  // 狀態一：簡訊驗證碼登入
  $(document).on("click", "#demoState1", function () {
    currentState = "state1";
    $(".phone_verification_code, .graphic_verification_code, #booked_button").removeClass("d-none");
    $("#demoState1, #demoState2").addClass("d-none");
  });

  // 狀態二：密碼登入
  $(document).on("click", "#demoState2", function () {
    currentState = "state2";
    $(".phone_password, #booked_button, #back_sms_button").removeClass("d-none");
    $("#demoState1, #demoState2").addClass("d-none");
  });

  // 狀態三：角色選擇（切換按鈕列，不覆寫 .button_box）
  $(document).on("click", "#demoState3", function () {
    currentState = "state3";
    $("#bookedForm, #other_login").addClass("d-none");
    $("#select_role").removeClass("d-none");
    $("#first_row, #second_row").addClass("d-none");
    $("#select_role2").removeClass("d-none");
    $("#demoState1, #demoState2").addClass("d-none");
    $(this).text("狀態三(返回登入)");
  });

  // DEMO：角色選擇返回時一併重置 demoState3 文字
  $(document).on("click", "#back_role_button", function () {
    $("#demoState3").text("狀態三(角色選擇)");
  });

});
