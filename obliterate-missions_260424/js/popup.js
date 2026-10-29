$(function () {
    // #popAward yy/dl 狀態切換（demo 用）
    var awardState = "yy";
    $(document).on("click", "#toggleAwardState", function () {
        if (awardState === "yy") {
            $(".popAwardPlatform_tit.yy, .popAwardPlatform.yy").hide();
            $(".popAwardPlatform_tit.dl, .popAwardPlatform.dl").show();
            $(this).text("切換至 yy 狀態");
            awardState = "dl";
        } else {
            $(".popAwardPlatform_tit.dl, .popAwardPlatform.dl").hide();
            $(".popAwardPlatform_tit.yy, .popAwardPlatform.yy").show();
            $(this).text("切換至 dl 狀態");
            awardState = "yy";
        }
    });

    // #popAward 有獎項/無獎項切換（demo 用）
    $(document).on("click", "#toggleAwardEmpty", function () {
        var $empty = $("#popAward .type-empty");
        var $list = $("#popAward .type-list");
        if ($empty.hasClass("d-none")) {
            $empty.removeClass("d-none");
            $list.addClass("d-none");
            $(this).text("切換有獎項");
        } else {
            $empty.addClass("d-none");
            $list.removeClass("d-none");
            $(this).text("切換無獎項");
        }
    });
});