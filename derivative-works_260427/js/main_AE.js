new WOW().init();
//nav
document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", () => {
    const targetId = el.dataset.target;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// mobile menu
$(".mobile_menu").click(function () {
  $(this).toggleClass("open_btn");
  $(".Menu").toggleClass("open_menu");
  $("body").toggleClass("no-scroll");
});

$(".Menu li").click(function (e) {
  e.preventDefault();

  const targetId = $(this).data("target");
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    $(".Menu").removeClass("open_menu");
    $(".mobile_menu").removeClass("open_btn");
    $("body").removeClass("no-scroll");

    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
});

document.querySelectorAll('[data-bs-target="#notice_modal"], [data-bs-target="#notice_rule_modal"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    lastOpenedModalId = btn.getAttribute("data-opened-from") || null;
  });
});

["notice_modal", "notice_rule_modal"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("hidden.bs.modal", function () {
      if (lastOpenedModalId) {
        const previousModalEl = document.getElementById(lastOpenedModalId);
        if (previousModalEl) {
          const previousModal = new bootstrap.Modal(previousModalEl);
          previousModal.show();
        }
        lastOpenedModalId = null;
      }
    });
  }
});

document.querySelectorAll(".upload-group").forEach((group) => {
  const fileInput = group.querySelector(".realFileInput");
  const label = group.querySelector(".upload-label");
  const previewImg = group.querySelector(".previewImage");

  label.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});

// footer 載入
$(".footer").load("https://ids.iwplay.com.tw/includ/footer/12b_nte_new.html");

$(function () {
  $(".copy_btn").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("act");
    $(".footer").toggleClass("show_copy");
  });
});

//login
$(".t_btn div").click(function () {
  $(".t_btn div").removeClass("active");
  $(this).toggleClass("active");
});

//vote
$(".left_btn ul li").click(function () {
  $(this).siblings("li").removeClass("active");
  $(this).addClass("active");
});

$(".type_btn > div").click(function () {
  $(".type_btn > div").removeClass("active");
  $(this).addClass("active");

  if ($(this).hasClass("pic_btn")) {
    $(".pic_con").fadeIn(600);
    $(".video_con, .cosplay_con").hide();
  } else if ($(this).hasClass("video_btn")) {
    $(".video_con").fadeIn(600);
    $(".pic_con, .cosplay_con").hide();
  } else if ($(this).hasClass("cosplay_btn")) {
    $(".cosplay_con").fadeIn(600);
    $(".pic_con, .video_con").hide();
  }
});

$(".vote_btn").click(function () {
  if ($(this).hasClass("vote_off")) return;
  $(this).addClass("vote_off").text("已投票");
});

$(".page_con ul li").click(function () {
  $(this).siblings("li").removeClass("active");
  $(this).addClass("active");
});

// award
$(".mobile_type_btn >div").click(function () {
  var $awardBox = $(this).closest(".award_box");
  $(this).siblings("").removeClass("active");
  $(this).addClass("active");
  
  $awardBox.find(".type_box").removeClass("active");
  
  if ($(this).hasClass("pic_btn")) {
    $awardBox.find(".award_pic").addClass("active");
  } else if ($(this).hasClass("video_btn")) {
    $awardBox.find(".award_video").addClass("active");
  } else if ($(this).hasClass("cosplay_btn")) {
    $awardBox.find(".award_cosplay").addClass("active");
  }
});

// PC 版 award 分頁切換 (繪圖/影片/cosplay)
$(".pc_type_btn > div").click(function () {
  var $awardBox = $(this).closest(".award_box");
  // 更新所有 pc_type_btn 內的按鈕 active 狀態
  $awardBox.find(".pc_type_btn > div").removeClass("active");
  // 先隱藏所有 type_box
  $awardBox.find(".type_box").removeClass("active");

  if ($(this).hasClass("pic_btn")) {
    $awardBox.find(".pc_type_btn .pic_btn").addClass("active");
    $awardBox.find(".award_pic").addClass("active");
  } else if ($(this).hasClass("video_btn")) {
    $awardBox.find(".pc_type_btn .video_btn").addClass("active");
    $awardBox.find(".award_video").addClass("active");
  } else if ($(this).hasClass("cosplay_btn")) {
    $awardBox.find(".pc_type_btn .cosplay_btn").addClass("active");
    $awardBox.find(".award_cosplay").addClass("active");
  }
});

// award carousel (滑動窗口輪播，2行×5欄，顯示3欄，無限循環)
$(function () {
  $(".award_carousel").each(function () {
    var $carousel = $(this);
    var $list = $carousel.find(".list");
    var $allItems = $list.find(".item");

    // 依 CSS order 值排序取得視覺順序
    var sortedItems = $allItems.toArray().sort(function (a, b) {
      return (parseInt($(a).css("order")) || 0) - (parseInt($(b).css("order")) || 0);
    });

    var totalItems = sortedItems.length;
    var currentCol = 0;

    function updateDisplay() {
      $(sortedItems).hide();
      var isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // 手機版：每頁顯示 3 個項目
        var visibleItemsCount = 3;
        for (var i = 0; i < visibleItemsCount; i++) {
          var index = (currentCol + i) % totalItems;
          $(sortedItems[index]).show();
        }
      } else {
        // PC 版：顯示 3 欄 (共 6 個項目)
        var cols = totalItems / 2;
        var visibleCols = 3;
        for (var i = 0; i < visibleCols; i++) {
          var col = (currentCol + i) % cols;
          $(sortedItems[col]).show();           // 第1行
          $(sortedItems[col + cols]).show();     // 第2行
        }
      }
    }

    // 初始化
    updateDisplay();
    $(window).resize(updateDisplay);

    $carousel.find(".next_btn").click(function () {
      var isMobile = window.innerWidth <= 768;
      if (isMobile) {
        currentCol = (currentCol + 3) % totalItems;
      } else {
        var cols = totalItems / 2;
        currentCol = (currentCol + 1) % cols;
      }
      updateDisplay();
    });

    $carousel.find(".prev_btn").click(function () {
      var isMobile = window.innerWidth <= 768;
      if (isMobile) {
        currentCol = (currentCol - 3 + totalItems) % totalItems;
      } else {
        var cols = totalItems / 2;
        currentCol = (currentCol - 1 + cols) % cols;
      }
      updateDisplay();
    });
  });
});

// info 繪圖 影片 cosplay 頁籤切換
$(function () {
  $(".info_tabs > div").click(function () {
    const index = $(this).index();
    const tabs = $(".info_tabs > div");
    const steps = $(".step_box .step");
    const submitBtn = $(".submit_btn");

    tabs.removeClass("active");
    $(this).addClass("active");

    steps.removeClass("active");
    steps.eq(index).addClass("active");

    if (index === 0) {
      submitBtn.attr("data-bs-target", "#pic_modal");
    } else if (index === 1) {
      submitBtn.attr("data-bs-target", "#video_modal");
    } else if (index === 2) {
      submitBtn.attr("data-bs-target", "#cosplay_modal");
    }
  });
});

