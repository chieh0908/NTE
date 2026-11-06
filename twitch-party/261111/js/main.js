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

// footer 載入
$(".footer").load("https://ids.iwplay.com.tw/includ/footer/12b_nte.html");

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
