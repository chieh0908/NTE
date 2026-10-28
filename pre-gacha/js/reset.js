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
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    var clientHeight = docEl.clientHeight;

    // Check orientation: Portrait if height > width
    var isPortrait = clientHeight > clientWidth;

    if (isMobile) {
      if (isPortrait) {
        // Mobile Portrait: Show Overlay (master_m.css)
        var wid = 100 * (clientWidth / 750);
        // pageStyle.setAttribute("href", "https://rests-nte.iwplay.com.tw/events/urban-missions/css/master_m.css");
        pageStyle.setAttribute(
          "href",
          "./css/master_m.css",
        );
        if (wrapper) wrapper.style.display = "none"; // Ensure valid display property
      } else {
        // Mobile Landscape: Show Content (master.css)
        var wid = 100 * (clientWidth / 2560); // Use desktop base for landscape mobile
        // pageStyle.setAttribute("href", "https://rests-nte.iwplay.com.tw/events/urban-missions/css/master.css");
        pageStyle.setAttribute(
          "href",
          "./css/master.css",
        );
        if (wrapper) wrapper.style.display = "flex";
      }
    } else {
      // PC: Always Show Content
      var wid = 100 * (clientWidth / 2560);
      // pageStyle.setAttribute("href", "https://rests-nte.iwplay.com.tw/events/urban-missions/css/master.css");
      pageStyle.setAttribute(
        "href",
        "./css/master.css",
      );
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
