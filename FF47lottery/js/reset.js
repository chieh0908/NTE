(function () {
  // 是否為行動端
  var isMobile =
    /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
      navigator.userAgent.toLowerCase(),
    );

  // rem單位設定
  var pageStyle = document.querySelector("#pageStyle");
  var docEl = document.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";

  function recalc() {
    var wrapper = document.querySelector("#top");
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    var clientHeight = docEl.clientHeight;

    // Check orientation: Portrait if height > width
    var isPortrait = clientHeight > clientWidth;

    if (isMobile) {
      if (isPortrait) {
        // Mobile Portrait: Show Overlay (master_m.css)
        var wid = 100 * (clientWidth / 750);
        if (pageStyle) {
          pageStyle.setAttribute(
            "href",
            "https://rests-nte.iwplay.com.tw/events/FF47lottery/css/master_m.css",
          );
        }
        if (wrapper) wrapper.style.display = "none";
      } else {
        // Mobile Landscape: Show Content (master.css)
        var wid = 100 * Math.min(clientWidth / 2560, clientHeight / 1440); // 改為 2560x1440 基準
        if (pageStyle) {
          pageStyle.setAttribute(
            "href",
            "https://rests-nte.iwplay.com.tw/events/FF47lottery/css/master.css",
          );
        }
        if (wrapper) wrapper.style.display = "block";
      }
    } else {
      // PC: Always Show Content
      var wid = 100 * Math.min(clientWidth / 2560, clientHeight / 1440); // 改為 2560x1440 基準
      if (pageStyle) {
        pageStyle.setAttribute(
          "href",
          "https://rests-nte.iwplay.com.tw/events/FF47lottery/css/master.css",
        );
      }
      if (wrapper) wrapper.style.display = "block";
    }
    docEl.style.fontSize = wid + "px";

    if (wrapper && !isPortrait) {
      wrapper.style.display = "block";
    } else if (wrapper && isPortrait && isMobile) {
      wrapper.style.display = "none";
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
