// 以螢幕短邊判斷平板（iPad mini 短邊 744px，iPhone 最大 430px）
var isTabletDevice = navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) >= 600;

var nav = urlParams.nav;
if (nav) {
  document.addEventListener("DOMContentLoaded", function () {
    $(".headerNav button[index='" + nav + "']").click();
  });
}

$("video").on("contextmenu", function () {
  return false;
});

function renderOtherPlatform() {
  var otherPlatformSort2 =
    '<a class="platform_facebook publicGoogleAnalytics" type="pcGotoFB_default_click" href="https://www.facebook.com/325581947301814" target="_blank"></a>' +
    '<a class="platform_youtube publicGoogleAnalytics" type="pcGotoYT_default_click" href="https://www.youtube.com/channel/UCP363wgDiNGwXynMKNWAF8Q?sub_confirmation=1" target="_blank"></a>' +
    '<a class="platform_discord publicGoogleAnalytics" type="pcGotoDC_default_click" href="https://discord.gg/pAWyEmpd8X" target="_blank"></a>' +
    '<a class="platform_ins publicGoogleAnalytics" type="pcGotoins_default_click" href="https://www.instagram.com/iwntezh/" target="_blank"></a>' +
    '<a class="platform_twitter publicGoogleAnalytics" type="pcGotoX_default_click" href="https://x.com/NTE_ZH" target="_blank"></a>' +
    '<a class="platform_ps publicGoogleAnalytics" type="pcGotoX_default_click" href="https://nte.pse.is/828787" target="_blank"></a>';

  $(".menu_otherPlatform").html(otherPlatformSort2);
}

renderOtherPlatform();

if (!isMobile()) {
  $(".header_menu").on("click", function () {
    var $pageMenu = $(".page_menu");
    var isOpen = $pageMenu.is(":visible");

    $(this).toggleClass("off", !isOpen);
    isOpen ? $pageMenu.stop(true).slideUp() : $pageMenu.stop(true).slideDown();
  });
}

$(".page_menu").on("click", "button", function () {
  var $pageMenu = $(".page_menu");
  $(".header_menu").removeClass("off");
  isMobile() ? $pageMenu.hide() : $pageMenu.stop(true).slideUp();
});

var beforeNavIndex = 0;
$(".headerNav button").on("click", function () {
  $(".footer").is(":visible") && ((wrapSwiper.allowSlidePrev = !0), $(".footer").stop(!0).slideUp()),
    (beforeNavIndex = $(".headerNav button.active").index());
  var index = $(this).index();
  $(this).addClass("active").siblings().removeClass("active"),
    index < wrapSwiper.slides.length && wrapSwiper.slideTo(index, 1e3, !1);
    isMobile() && ($(".page_menu").hide(), $(".header_menu").removeClass("off"));
});

// 主體
var wrapSwiper = new Swiper(".wrapSwiper", {
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  mousewheel: true,
  allowTouchMove: false,
  observer: true,
  observeParents: true,
  preventClicks: false,
  on: {
    slideChange: function () {
      var activeIndex = this.activeIndex,
          activeNav = $(".headerNav button").eq(activeIndex),
          activeSlide = this.slides[this.activeIndex],
          isCityPage = $(activeSlide).hasClass("pageCity");
        activeNav.addClass("active").siblings("button").removeClass("active"),
          $(activeSlide).hasClass("pageRole")
            ? $(".roleNav .swiper-slide").css("pointer-events", "auto")
            : $(".roleNav .swiper-slide").css("pointer-events", "none"),
          $(activeSlide).hasClass("pageView")
            ? (pageView ? pageViewResume() : pageViewInit())
            : (pageViewPause && pageViewPause());

      isCityPage
        ? $(".footer").is(":visible") && $(".footer").stop(!0).slideUp()
        : ($(".footer").is(":visible") && $(".footer").stop(!0).slideUp(), (wrapSwiper.allowSlidePrev = !0));

      // 觸發手機影片檢查
      if (typeof window.mobileVideoFix !== 'undefined') {
        setTimeout(function() {
          window.mobileVideoFix.check();
        }, 200);
      }
    },
    transitionEnd: function() {
      // 轉場結束後檢查影片
      if (typeof window.mobileVideoFix !== 'undefined') {
        setTimeout(function() {
          window.mobileVideoFix.check();
        }, 100);
      }
    },
  },
});


// 情報速遞
$(function () {
  // 角色介紹觸發滾動時，阻止頁面切換
  if (!isMobile()) {
    $(".role_text").on("wheel", function (e) {
      e.stopPropagation();
    });
  }
  /*▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
            新聞頁
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀*/
  /*------NEWS------*/
  $(".banner").load(
    "https://nte.iwplay.com.tw/CmsBanner/ubanner_A.html",
    function () {
      //renew ads logic
      const now = new Date();

      //pc
      let innerList = document.querySelectorAll(
        `#ubanner_A > div > .carousel-inner > div`
      );
      let indicatorsList = document.querySelectorAll(
        `#ubanner_A > div > .carousel-indicators > li`
      );
      for (let i = 0; i < innerList.length; i++) {
        let onTime = new Date(innerList[i].getAttribute("on"));
        let offTime = new Date(innerList[i].getAttribute("off"));
        if (now < onTime || now > offTime) {
          if (innerList[i].classList.contains("active")) {
            innerList[i + 1].classList.add("active");
            indicatorsList[i + 1].classList.add("active");
          }
          innerList[i].remove();
          indicatorsList[i].remove();
        }
      }

      // 清掉過期 slides 後，剩餘 indicators 的 data-slide-to 仍是原始值
      // 需重新從 0 連續編號，否則 Bootstrap 找不到對應 slide 而不切換
      document.querySelectorAll(`#ubanner_A > div > .carousel-indicators > li`)
        .forEach(function(li, index) {
          li.setAttribute('data-slide-to', index);
        });

      $('#ubanner_A').carousel({ interval: 3000 });

      var $firstLi = $('#ubanner_A .carousel-indicators li.active')[0];
      if ($firstLi) {
        $firstLi.style.setProperty('--progress-duration', '0s');
        $firstLi.style.setProperty('--progress', '0%');
        void $firstLi.offsetWidth;
        $firstLi.style.setProperty('--progress-duration', '3s');
        $firstLi.style.setProperty('--progress', '100%');
      }

      $('#ubanner_A').on('slide.bs.carousel', function (e) {
        var $next = $(e.relatedTarget).index();
        var $indicators = $('#ubanner_A .carousel-indicators li');
        $indicators.each(function (i) {
          if (i !== $next) {
            this.style.setProperty('--progress-duration', '0s');
            this.style.setProperty('--progress', '0%');
          }
        });
        var nextLi = $indicators[$next];
        if (nextLi) {
          nextLi.style.setProperty('--progress-duration', '0s');
          nextLi.style.setProperty('--progress', '0%');
          void nextLi.offsetWidth;
          nextLi.style.setProperty('--progress-duration', '3s');
          nextLi.style.setProperty('--progress', '100%');
        }
      });
    }
  );

  /*------NEWS_右邊tab------*/
  $(".news_info .news_right_box .news_nav_tab").click(function () {
    var list = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    $(".news_info .news_right_box .news_r_con_box")
      .eq(list)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });

  $("#news_list_1").load("https://nte.iwplay.com.tw/news/indexS.html");
  $("#news_list_2").load("https://nte.iwplay.com.tw/news/indexS_1.html");
  $("#news_list_3").load("https://nte.iwplay.com.tw/news/indexS_3.html");
  $("#news_list_4").load("https://nte.iwplay.com.tw/news/indexS_2.html");
});

// 角色介紹
(function () {
  var factionsNavDirection = (!isMobile() || isTabletDevice) ? "vertical" : "horizontal",
    factions_role =
      (new Swiper(".factions_nav", {
        direction: factionsNavDirection,
        loop: !0,
        slidesPerView: "auto",
        slideToClickedSlide: !0,
        navigation: { prevEl: ".factionsPrev", nextEl: ".factionsNext" },
        on: {
          slideChange: function () {
            var realIndex = this.realIndex;
            setTimeout(function () {
              factions_role.slideToLoop(realIndex, 1e3, !1);
            }, 0);
          },
        },
      }),
      new Swiper(".roleSwiper", {
        loop: !0,
        allowTouchMove: !1,
        effect: "fade",
        fadeEffect: { crossFade: !0 },
      }));
  isMobile()
    ? ($(".roleDesText .cont").on("wheel", function (e) {
        e.stopPropagation();
      }),
      $(".roleDesText .cont").on("touchstart", function (e) {
        e.stopPropagation();
      }),
      $(".roleDesText .cont").on("touchmove", function (e) {
        e.stopPropagation();
      }),
      $(".roleMoreDes").on("click", function () {
        $(this).toggleClass("on"),
          $(this).hasClass("on")
            ? ($(".roleNav").hide(), $(".roleDesText").show())
            : ($(".roleNav").show(), $(".roleDesText").hide());
      }))
    : $(".role_text").on("wheel", function (e) {
        e.stopPropagation();
      });
})();

// 世界全景
var pageView = !1;
var pageViewResume = null;
var pageViewPause = null;
function pageViewInit() {
  if (!pageView) {
    isMobile() &&
      $(".plateMore").on("touchstart touchmove", function (e) {
        e.stopPropagation();
      });
      $(".plateDes").on("wheel", function (e) {
        e.stopPropagation();
      });
    var plateIndex = 0;
    var brandSelectors = [
      ".brand3_swiper",
      ".brand4_swiper",
      ".brand5_swiper",
      ".brand6_swiper",
      ".brand7_swiper",
    ];
    var brandSwiperInstances = [];

    brandSelectors.forEach(function (sel, index) {
      var slideCount = $(sel + " .swiper-wrapper .swiper-slide").length;
      $(sel + " .total").text(slideCount);

      var instance = new Swiper(sel + " .swiper", {
        loop: !0,
        autoplay: { delay: 5000, disableOnInteraction: !1 },
        pagination: { el: sel.replace("_swiper", "_pagination"), clickable: !0 },
        allowTouchMove: !isMobile(),
        on: {
          init: function () {
            $(sel + " .curr").text(this.realIndex + 1);
          },
          slideChange: function () {
            $(sel + " .curr").text(this.realIndex + 1);
            $(sel + " .location img").hide().eq(this.realIndex).show();
          },
        },
      });
      brandSwiperInstances[index] = instance;
    });

    $(".brand").on("mouseenter", function () {
      brandSwiperInstances[plateIndex].autoplay.stop();
    }).on("mouseleave", function () {
      brandSwiperInstances[plateIndex].autoplay.start();
    });

    function showPlate(index) {
      brandSwiperInstances.forEach(function (inst) {
        inst.autoplay.stop();
      });
      $(".brandSwiper").hide();
      $(brandSelectors[index]).show();
      var inst = brandSwiperInstances[index];
      inst.slideToLoop(0, 0, false);
      $(brandSelectors[index] + " .curr").text(1);
      $(brandSelectors[index] + " .location img").hide().first().show();
      setTimeout(function () {
        inst.autoplay.start();
      }, 50);
    }

    showPlate(0);

    $(".plateLeft").on("click", function () {
      plateIndex = plateIndex > 0 ? plateIndex - 1 : brandSelectors.length - 1;
      showPlate(plateIndex);
    });
    $(".plateRight").on("click", function () {
      plateIndex = plateIndex < brandSelectors.length - 1 ? plateIndex + 1 : 0;
      showPlate(plateIndex);
    });

    pageViewResume = function () {
      brandSwiperInstances[plateIndex].autoplay.start();
    };
    pageViewPause = function () {
      brandSwiperInstances[plateIndex].autoplay.stop();
    };

    (pageView = !0);
  }
}
$(".plateMore").on("click", function () {
  $(".plateinfo").toggleClass("open");
});

// 都市映像
var citySwiper = new Swiper(".citySwiper", {
  loop:!0,
  autoplay:{delay:3e3,disableOnInteraction:!1},
  navigation: { prevEl: ".citySlidePrev", nextEl: ".citySlideNext" },
  pagination: { el: ".cityPagination", clickable: !0 },
});
function showFooter(direction) {
  direction > 0
    ? $(".footer").is(":visible") ||
      $(".footer")
        .stop(!0)
        .slideDown()
    : direction < 0 &&
      $(".footer").is(":visible") &&
      $(".footer")
        .stop(!0)
        .slideUp();
}
$(".pageCity").on("wheel", function (e) {
  var deltaY = e.originalEvent && "number" == typeof e.originalEvent.deltaY ? e.originalEvent.deltaY : 0;
  if (0 === deltaY) {
    return;
  }

  if (deltaY > 0 && !$(".footer").is(":visible")) {
    showFooter(1);
    e.preventDefault();
    e.stopPropagation();
    return !1;
  }

  if (deltaY < 0 && $(".footer").is(":visible")) {
    showFooter(-1);
    e.preventDefault();
    e.stopPropagation();
    return !1;
  }
});
if ($.fn.touchMove) {
  $(".pageCity").touchMove({
    endCallback: function (res, e) {
      var y = res.offsetXY.y;
      y > 50 && showFooter(-1), y < -50 && showFooter(1);
    },
  });
} else {
  var _touchStartY = 0;
  $(".pageCity")[0].addEventListener("touchstart", function (e) {
    _touchStartY = e.touches[0].clientY;
    // footer 顯示時鎖住 Swiper，避免同時換頁
    if ($(".footer").is(":visible")) {
      wrapSwiper.allowTouchMove = false;
    }
  }, { passive: true });
  $(".pageCity")[0].addEventListener("touchend", function (e) {
    var dy = _touchStartY - e.changedTouches[0].clientY;
    if (dy < -50) showFooter(-1);
    if (dy > 50) showFooter(1);
    wrapSwiper.allowTouchMove = true;
  }, { passive: true });
}

// iPad/平板觸控，改為垂直滑動 
if (isTabletDevice) {
  wrapSwiper.changeDirection('vertical');
  wrapSwiper.allowTouchMove = true;

  // instagram-video-fix.js 的 isMobileDevice() 誤判 iPad Chrome（UA含iPad），補強制 autoplay
  document.querySelectorAll('video').forEach(function (v) {
    v.setAttribute('playsinline', '');
    v.play().catch(function () {});
  });
}

// iPad 直式提示轉向（觸控裝置才執行）
if (navigator.maxTouchPoints > 0) {
  var rotateHint = document.createElement('div');
  rotateHint.id = 'rotateHint';
  rotateHint.style.cssText = [
    'position: fixed',
    'top: 0', 'right: 0', 'bottom: 0', 'left: 0',
    'background: #000 url(./260513/images/rotate_tip.png) no-repeat center center / 2.9rem auto',
    'z-index: 9999',
    'display: none'
  ].join(';');
  document.body.prepend(rotateHint);

  function handleRotateHint() {
    var isPortrait = window.innerWidth < window.innerHeight;
    if (isTabletDevice) {
      // iPad/平板：直式顯示提示（應轉橫式）
      if (isPortrait) {
        rotateHint.style.backgroundSize = '2.9rem auto';
        rotateHint.style.display = 'block';
      } else {
        rotateHint.style.display = 'none';
      }
    } else {
      // 手機：橫式顯示提示（應轉直式），圖示縮小
      if (!isPortrait) {
        rotateHint.style.backgroundSize = '1.4rem auto';
        rotateHint.style.display = 'block';
      } else {
        rotateHint.style.display = 'none';
      }
    }
  }
  handleRotateHint();
  window.addEventListener('resize', handleRotateHint);
}

// 手機版（排除平板，避免 Chrome for iPad UA 誤判）
if (isMobile() && !isTabletDevice) {
  wrapSwiper.changeDirection();

  wrapSwiper.allowTouchMove = true;
  wrapSwiper.update();

  (function () {
    const videoAll = document.querySelectorAll("video");
    videoAll.forEach(function (video) {
      const src = video.src;
      if (src && video.className.includes("viewM")) {
        fetch(src)
          .then((response) => {
            return response.arrayBuffer();
          })
          .then((response) => {
            const blob = new Blob([response], { type: "video/mp4" });
            const blobUrl = URL.createObjectURL(blob);
            video.src = blobUrl;
          });
      }
    });
  })();

  var otherPlatformSort2 = (function () {
    var str = "";
    str +=
      '<a class="platform_facebook publicGoogleAnalytics" type="pcGotoFB_default_click" href="https://www.facebook.com/325581947301814" target="_blank"></a>' +
      '<a class="platform_youtube publicGoogleAnalytics" type="pcGotoYT_default_click" href="https://www.youtube.com/channel/UCP363wgDiNGwXynMKNWAF8Q?sub_confirmation=1" target="_blank"></a>' +
      '<a class="platform_discord publicGoogleAnalytics" type="pcGotoDC_default_click" href="https://discord.gg/pAWyEmpd8X" target="_blank"></a>' +
      '<a class="platform_ins publicGoogleAnalytics" type="pcGotoins_default_click" href="https://www.instagram.com/iwntezh/" target="_blank"></a>' +
      '<a class="platform_twitter publicGoogleAnalytics" type="pcGotoX_default_click" href="https://x.com/NTE_ZH" target="_blank"></a>' +
      '<a class="platform_ps publicGoogleAnalytics" type="pcGotoX_default_click" href="https://nte.pse.is/828787" target="_blank"></a>';
    return str;
  })();
  $(".indexAside").html(otherPlatformSort2);
}

// ?nav= 指定初始頁面（放最後，確保 pageView 等變數全部初始化完畢）
$(function () {
  var navParam = new URLSearchParams(location.search).get("nav");
  if (navParam === null) return;
  var index = parseInt(navParam, 10) - 1;
  if (isNaN(index) || index < 0 || index >= wrapSwiper.slides.length) return;
  wrapSwiper.slideTo(index, 0, false);
});