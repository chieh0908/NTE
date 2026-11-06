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
    var clientWidth = window.innerWidth || docEl.clientWidth;
    var clientHeight = window.innerHeight || docEl.clientHeight;
    if (!clientWidth) return;

    // 判斷是否為直式螢幕 (當視窗高度大於寬度時，isPortrait 為 true)
    var isPortrait = clientHeight > clientWidth;

    var availableWidth;
    var availableHeight;
    var rotation;

    if (isPortrait) {
      availableWidth = clientHeight;
      availableHeight = clientWidth;
      rotation = 90;
    } else {
      availableWidth = clientWidth;
      availableHeight = clientHeight;
      rotation = 0;
    }

    // Always use master.css
    if (pageStyle) {
      pageStyle.setAttribute("href", "./css/master.css");
    }

    if (wrapper) {
      wrapper.style.display = "block";
    }

    // Calculate REM fontSize based on rotated dimensions
    var wid = 100 * Math.min(availableWidth / 2560, availableHeight / 1440);
    docEl.style.fontSize = wid + "px";

    // wrapper (#top) 處理
    if (wrapper) {
      if (rotation !== 0) {
        // 手機直式：強制旋轉 90 度，給予橫向的長寬
        wrapper.style.position = "absolute";
        wrapper.style.left = "50%";
        wrapper.style.top = "50%";
        wrapper.style.width = availableWidth + "px";
        wrapper.style.height = ""; // 不強制設定高度，讓它跟 PC 版一樣自然包覆內容，避免背景被垂直拉伸變成「滿版」
        wrapper.style.transformOrigin = "center center";
        wrapper.style.transform =
          "translate(-50%, -50%) rotate(" + rotation + "deg)";
        wrapper.style.overflow = "hidden"; // 避免旋轉時產生多餘捲軸
      } else {
        // PC 或橫式時：完全清除，交還給原本的 master.css 排版
        // 配合 body 的 flexbox 自動達到垂直置中，且能讓 logo/footer 填滿左右
        wrapper.style.position = "";
        wrapper.style.left = "";
        wrapper.style.top = "";
        wrapper.style.width = "";
        wrapper.style.height = "";
        wrapper.style.transformOrigin = "";
        wrapper.style.transform = "";
        wrapper.style.overflow = "";
      }
    }

    // Modal Wrapper 處理(手機版彈窗)
    var modalWrapper = document.getElementById("modal_wrapper");
    if (modalWrapper) {
      if (rotation !== 0) {
        modalWrapper.style.position = "absolute";
        modalWrapper.style.left = "50%";
        modalWrapper.style.top = "50%";
        modalWrapper.style.width = availableWidth + "px";
        modalWrapper.style.height = availableHeight + "px"; // 強制設定滿版長寬
        modalWrapper.style.transformOrigin = "center center";
        modalWrapper.style.transform =
          "translate(-50%, -50%) rotate(" + rotation + "deg)";
      } else {
        modalWrapper.style.position = "";
        modalWrapper.style.left = "";
        modalWrapper.style.top = "";
        modalWrapper.style.width = "";
        modalWrapper.style.height = "";
        modalWrapper.style.transformOrigin = "";
        modalWrapper.style.transform = "";
      }
    }
  }

  if (!document.addEventListener) return;
  // 延遲執行，確保螢幕轉向後能抓到正確尺寸
  window.addEventListener(
    resizeEvt,
    function () {
      setTimeout(recalc, 100);
    },
    false,
  );

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

  // 監聽 Bootstrap 產生的 modal-backdrop，將其移入 modal_wrapper 以維持正確的 z-index 層級
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1 && node.classList.contains("modal-backdrop")) {
          var wrapper = document.getElementById("modal_wrapper");
          if (wrapper && node.parentNode !== wrapper) {
            wrapper.appendChild(node);
          }
        }
      });
    });
  });
  // 等待 DOM 準備好後開始監聽 body
  document.addEventListener("DOMContentLoaded", function () {
    observer.observe(document.body, { childList: true });
  });
})();
