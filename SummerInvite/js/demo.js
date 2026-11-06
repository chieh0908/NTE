$(function () {
  // 1. 點擊登入按鈕 -> 隱藏登入按鈕，顯示網址輸入區塊與會員按鈕
  $(".login").on("click", function () {
    $(this).hide();
    $(".url_input_flow").show();
    $(".url_input_flow").css("display", "flex"); // 確保維持 flex 排版
    $(".btn_member").show(); // 登入後顯示會員按鈕
  });

  // 2. 點擊確認彈窗的「是」 -> 隱藏輸入區塊並進入刮卡準備
  $("#popConfirmSubmit .btn-yes").on("click", function () {
    $(".url_input_flow").hide();

    // 進入準備刮卡的階段，強制關閉 3D 特效以防座標跑掉！
    window.destroyVanillaTilt();

    // 把透明擋板隱藏，正式允許玩家刮開銀漆，且自訂游標恢復顯示！
    $(".scratch_blocker").hide();

    // 呼叫 main.js 中的刮刮卡銀漆換圖函式，隨機更換為 gold 或 purple
    if (typeof window.randomizeScratchCard === "function") {
      window.randomizeScratchCard();
    }

    // 金漆或紫漆換好後，顯示出文字提示 (用 fadeIn 平滑)
    $(".tt1").fadeIn();
  });
});
