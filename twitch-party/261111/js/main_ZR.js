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

//popup
let lastOpenedModalId = null;

document.querySelectorAll('[data-bs-target="#notice_modal"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    lastOpenedModalId = btn.getAttribute("data-opened-from") || null;
  });
});

const noticeModalEl = document.getElementById("notice_modal");
noticeModalEl.addEventListener("hidden.bs.modal", function () {
  if (lastOpenedModalId) {
    const previousModalEl = document.getElementById(lastOpenedModalId);
    const previousModal = new bootstrap.Modal(previousModalEl);
    previousModal.show();
    lastOpenedModalId = null;
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

// footer 載入（與 cover.html 一致：共用 footer 片段，樣式由共用 footer.css 處理；常駐顯示、無收合）
$(".footer").load("https://ids.iwplay.com.tw/includ/footer/15b_nte_new.html");

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
    $(".video_con").hide();
  } else if ($(this).hasClass("video_btn")) {
    $(".video_con").fadeIn(600);
    $(".pic_con").hide();
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

// demo 彈窗按鈕
$(".demo_toggle").click(function () {
  $(".demo_list").toggleClass("show");
});

// scroll top
var scrollTopBtn = document.getElementById("scrollTop");
window.addEventListener("scroll", function () {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});
scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// streams 語言 tab 切換（手機版）
$(".lang_tab").click(function () {
  $(".lang_tab").removeClass("active");
  $(this).addClass("active");
  var lang = $(this).data("lang");
  $(".stream_section").removeClass("active");
  if (lang === "zh") {
    $(".stream_zh").addClass("active");
  } else {
    $(".stream_other").addClass("active");
  }
});
