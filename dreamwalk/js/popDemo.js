$(function() {
    // 狀態管理: 'initial' | 'selectState' | 'state1' | 'state2' | 'state3'
    var currentState = 'initial';
    var btnBoxOriginal = null; // 快取初始 button_box 內容

    // 回復初始狀態（不關彈窗）
    function resetToInitial() {
        currentState = 'initial';
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
    $("#bookedmodal").on("show.bs.modal", function() {
        var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
        if (!btnBoxOriginal && $btnBox.length) {
            btnBoxOriginal = $btnBox.html();
        }
        resetToInitial();
    });

    // 點擊「下一步」→ 進入選擇狀態
    $(document).on("click", "#phoneNextBtn", function() {
        currentState = 'selectState';
        $("#phoneNextBtn").addClass("d-none");
        $("#demoState1").removeClass("d-none");
        $("#demoState2").removeClass("d-none");
        $("#back_button").removeClass("d-none");
        console.log("[popDemo] 下一步 → 顯示狀態選擇按鈕");
    });

    // 狀態一：簡訊驗證碼登入
    $(document).on("click", "#demoState1", function() {
        currentState = 'state1';
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
    $(document).on("click", "#demoState2", function() {
        currentState = 'state2';
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
    $(document).on("click", "#demoState3", function() {
        if (currentState === 'state3') {
            resetToInitial();
            return;
        }
        currentState = 'state3';
        var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
        var btnBoxRole =
            '<div class="row">' +
                '<a class="btn btn-secondary" id="select_role_button"></a>' +
                '<a class="btn btn-secondary" id="back_role_button"></a>' +
            '</div>';
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
    $(document).on("click", "#back_role_button", function() {
        resetToInitial();
        console.log("[popDemo] 從角色選擇返回 → 回初始狀態");
    });

    // 角色選擇區「登入」按鈕
    $(document).on("click", "#select_role_button", function() {
        var selectedRole = $("#role_select").val();
        console.log("[popDemo] 角色選擇登入，選擇角色:", selectedRole);
        if (window.mockProductList) {
            window.mockProductList();
        }
        $("#bookedmodal").modal("hide");
    });

    // 返回按鈕
    $(document).on("click", "#back_button", function() {
        if (currentState === 'selectState') {
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
    $(document).on("click", "#back_sms_button", function() {
        // 隱藏密碼相關
        $(".phone_password").addClass("d-none");
        $("#back_sms_button").addClass("d-none");
        // 顯示狀態一：簡訊驗證碼 + 圖形驗證碼
        $(".phone_verification_code").removeClass("d-none");
        $(".graphic_verification_code").removeClass("d-none");
        currentState = 'state1';
        console.log("[popDemo] 切換到狀態一：簡訊登入");
    });

    // 點擊登入按鈕
    $(document).on("click", "#booked_button", function() {
        if (window.mockProductList) {
            window.mockProductList();
        }
        $("#bookedmodal").modal("hide");
        console.log("[popDemo] 登入 → 關閉彈窗");
    });
});

window.mockProductList = function() {
    window.mockLogin && window.mockLogin();
    var list = [{ "Money": 170, "GoodsType": "100", "Unit": "NT$", "CurrencyCode": "TWD", "PayChannel": "MYCARD", "ProductID": "tw.com.iwplay.nte.monthly", "GemCount": "0", "GemName": "異晶開採憑證", "OtherContext": "...\r\n", "DenomKind": "GIFT", "AgreementMoney": 170, "type": 3, "order": 10 }, { "Money": 30, "GoodsType": "1", "Unit": "NT$", "CurrencyCode": "TWD", "PayChannel": "MYCARD", "ProductID": "tw.com.iwplay.nte.mc.a", "GemCount": "0", "GemName": "54異晶", "OtherContext": "...\r\n", "DenomKind": "NORMAL", "AgreementMoney": 30, "type": 1, "order": 0 }];
    var itemTpl = document.getElementById("recharge-item-temp")?.innerHTML;
    if (!itemTpl) return;

    var $rechargePanel = $(".office-recharge-panel");
    var $listPanel = $rechargePanel.find(".list-panel");
    var itemHtml = list.map(function(item) {
        return itemTpl.replace(/\{\{productId\}\}/g, item.ProductID).replace(/\{\{groupName\}\}/g, String(item.type || "1")).replace(/\{\{finalTitle\}\}/g, item.GemName).replace(/\{\{userPrice\}\}/g, item.Unit + " " + item.Money);
    }).join("");

    $listPanel.html(itemHtml).show();
    $(".office-recharge-panel").removeClass("unlogin");
    console.log("[mockProductList] 已模擬注入商品清單");
};

window.mockLogin = function(userInfo) {
    $(".office-header-board .base-btn.user.login").removeClass("hide");
    $(".office-header-board .base-btn.user.unlogin").addClass("hide");
    $(".office-user-panel").removeClass("unlogin");
    if (window.setLoginState) {
        window.setLoginState(true);
    }
    console.log("[mockLogin] 已切換為已登入狀態");
};

window.mockLogout = function() {
    $(".office-header-board .base-btn.user.login").addClass("hide");
    $(".office-header-board .base-btn.user.unlogin").removeClass("hide");
    $(".office-user-panel").addClass("unlogin");
    $(".office-recharge-panel").addClass("unlogin");
    $(".office-recharge-panel .list-panel").empty().hide();
    $(".office-recharge-panel .nav-panel").empty();
    if (window.setLoginState) {
        window.setLoginState(false);
    }
    console.log("[mockLogout] 已切換為未登入狀態");
};

$(document).on("click", ".office-header-board .base-btn.user.login .user-panel .btn", function() {
    window.mockLogout();
});
