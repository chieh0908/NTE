(function () {
  // 是否為行動端
  var isMobile =
    /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
      navigator.userAgent.toLowerCase(),
    );

  // rem單位設定
  var pageStyle = document.querySelector("#pageStyle");
  var docEl = document.documentElement;
  var resizeEvt =
    "orientationchange" in window ? "orientationchange" : "resize";
  var lastOrientation = null; // 記錄上一次的方向狀態

  function recalc() {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    var clientHeight = docEl.clientHeight;

    var isPortrait = clientHeight > clientWidth;

    if (isMobile) {
      // Mobile: Always Show Portrait Content (master_m.css)
      // 使用 Math.min 確保就算轉成橫式，依然用手機短邊來計算比例，避免 rem 整體變形放太大
      var baseWidth = Math.min(clientWidth, clientHeight);
      var wid = 100 * (baseWidth / 750);
      var targetHref = "./css/master_m.css";
      if (pageStyle.getAttribute("href") !== targetHref) {
        pageStyle.setAttribute("href", targetHref);
      }
      if (wrapper) wrapper.style.display = "flex";
    } else {
      // PC: Always Show Content
      var wid = 100 * (clientWidth / 2560);
      var targetHref = "./css/master.css";
      if (pageStyle.getAttribute("href") !== targetHref) {
        pageStyle.setAttribute("href", targetHref);
      }
      if (wrapper) wrapper.style.display = "flex";
    }
    docEl.style.fontSize = wid + "px";
    var wrapper = document.querySelector("#wrapper");
    if (wrapper) {
      wrapper.style.display = "flex";
    }
  }
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      recalc();
      if (isMobile) {
        document.body.classList.add("is-mobile");
        document.body.classList.remove("is-pc");
      } else {
        document.body.classList.add("is-pc");
        document.body.classList.remove("is-mobile");
      }
    },
    false,
  );
})();
