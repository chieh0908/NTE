(function () {
  // 是否為行動端
  var isMobile =
    /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
      navigator.userAgent.toLowerCase(),
    );

  // rem單位設定
  var pageStyle = document.querySelector("#pageStyle");
  var popupStyle = document.querySelector("#popupStyle");
  var docEl = document.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
  function recalc() {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    
    // 如果是行動端，或者螢幕寬度小於 768px，則載入行動端樣式
    var activeMobile = isMobile || clientWidth < 768;
    
    if (activeMobile) {
      var wid = 100 * (clientWidth / 750);
      pageStyle.setAttribute("href", "./css/master_m.css");
      if (popupStyle) {
        popupStyle.setAttribute("href", "./css/popup_m.css");
      }
      if (document.body) {
        document.body.classList.add("is-mobile");
        document.body.classList.remove("is-pc");
      }
    } else {
      var wid = 100 * (clientWidth / 2560);
      pageStyle.setAttribute("href", "./css/master.css");
      if (popupStyle) {
        popupStyle.setAttribute("href", "./css/popup.css");
      }
      if (document.body) {
        document.body.classList.add("is-pc");
        document.body.classList.remove("is-mobile");
      }
    }
    docEl.style.fontSize = wid + "px";
    var wrapper = document.querySelector("#wrapper");
    if (wrapper) {
      wrapper.style.display = "block";
    }
  }
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  document.addEventListener("DOMContentLoaded", recalc, false);
})();
