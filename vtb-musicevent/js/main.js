// ==========================================
// 1. 頁面導航與全域彈窗控制
// ==========================================
function openOnlyModal(targetId) {
  if (
    document.activeElement &&
    typeof document.activeElement.blur === "function"
  ) {
    document.activeElement.blur();
  }
  $(".modal").modal("hide");
  setTimeout(function () {
    $(targetId).modal("show");
  }, 300);
}
window.openOnlyModal = openOnlyModal;

// ==========================================
// 2. 主要邏輯 (頁面加載後執行)
// ==========================================
$(document).ready(function () {
  // btn_go_rules (滑動至節目表)
  $(".header .go_rules").click(function (e) {
    e.preventDefault();
    $("html,body").animate(
      {
        scrollTop: $(".event_schedule").offset().top,
      },
      600,
    );
  });

  // btn_go_vote (滑動至人氣投票)
  $(".header .go_vote").click(function (e) {
    e.preventDefault();
    $("html,body").animate(
      {
        scrollTop: $(".event_vote").offset().top,
      },
      600,
    );
  });

  // 啟動 WOW.js
  if (typeof WOW !== "undefined") {
    new WOW().init();
  }

  // 載入頁尾
  $(".footer").load("https://ids.iwplay.com.tw/includ/footer/15b_nte_new.html");

  // ==========================================
  // 3. 人氣投票區塊邏輯
  // ==========================================
  var isVoted = false;

  $(".vote_item").click(function () {
    if (isVoted) return;

    var $frame = $(this).find(".vt_frame");
    var $btn = $(this).find(".btn_choose");

    // 如果已經選了，就取消選擇
    if ($btn.hasClass("active")) {
      $frame.removeClass("active");
      $btn.removeClass("active");
    } else {
      // 如果還沒選，檢查是否已經選滿 3 個
      if ($(".btn_choose.active").length >= 3) {
        // 選滿 3 個，不做任何事 (使用者要求)
        return;
      }
      $frame.addClass("active");
      $btn.addClass("active");
    }
  });

  $(".btn_submit_vote").click(function () {
    if (isVoted) return;

    if ($(".btn_choose.active").length === 0) {
      // 一個都沒選，跳出通用彈窗提示
      $("#popMsg p").html("請選擇您要投票的人選至多三位");
      $("#popMsg .popBtnsTip").hide();
      openOnlyModal("#popMsg");
      return;
    }

    openOnlyModal("#popConfirmVote");
  });

  $(".btn_submit_confirm").click(function () {
    // 鎖死投票
    isVoted = true;

    // 切換確認投票按鈕到 active 狀態
    $(".btn_submit_vote").addClass("active");
    $(".vote_item").css("cursor", "default");

    // 顯示登出按鈕
    $(".btn_logout").removeClass("d-none");

    // 動態修改通用彈窗並顯示成功訊息
    $("#popMsg p").html("投票成功，感謝您的參與!");
    $("#popMsg .popBtnsTip").html("※獎勵將於 24 小時內發放至遊戲內信箱").show();
    openOnlyModal("#popMsg");
  });

  // ==========================================
  // 4. 演出名單跑馬燈效果
  // ==========================================
  (function initCastMarquee() {
    var $track = $(".cast_list_track");
    if ($track.length === 0) return;

    $track.css("animation", "none");
    $track.css("cursor", "grab");

    // 實現跑馬燈首尾相接無限循環
    var $originalItems = $track.children(".cast_item").clone();
    if ($originalItems.length === 0) return;

    // 複製兩組來確保拖曳與滾動的無縫銜接
    $track.append($originalItems.clone());
    $track.append($originalItems.clone());

    var currentPos = 0;
    var lastTime = null;
    var reqId = null;

    var baseWidth = 0;

    // 拖曳狀態變數
    var isDragging = false;
    var startMouseX = 0;
    var startPosAnimation = 0;

    function calcSize() {
      var $firstItem = $track.children().eq(0);
      var $clonedFirstItem = $track.children().eq($originalItems.length);
      if ($firstItem.length && $clonedFirstItem.length) {
        // 利用第一組與第二組的物理距離來計算，能完美包含 flex gap 的間距
        baseWidth = $clonedFirstItem.offset().left - $firstItem.offset().left;
      }
    }

    function updateTransform(pos) {
      $track.css({
        transition: "none",
        transform: `translate3d(-${pos}px, 0, 0)`,
      });
    }

    function normalizePos(pos, base) {
      if (base <= 0) return 0;
      var nPos = pos % base;
      if (nPos < 0) {
        nPos += base;
      }
      return nPos;
    }

    function animate(time) {
      reqId = requestAnimationFrame(animate);
      if (!lastTime) lastTime = time;
      var dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isDragging) return;
      if ($track.data("paused")) return;
      if (dt > 0.5) return;

      if (baseWidth === 0) calcSize();
      if (baseWidth <= 0) return;

      // 跑馬燈控制X軸速度 (數值越小跑越快)
      var speedX = baseWidth / 35;
      currentPos += speedX * dt;
      currentPos = normalizePos(currentPos, baseWidth);
      updateTransform(currentPos);
    }

    $(window).on("resize orientationchange", () => {
      setTimeout(() => {
        calcSize();
      }, 100);
    });

    // 初始計算尺寸
    setTimeout(calcSize, 100);

    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        calcSize();
      }).observe($track[0]);
    }

    // 滑鼠與觸控事件 (拖曳邏輯)
    function onDragStart(e) {
      // 若點擊的是 .cast_item 裡面的 a 標籤 (社群按鈕)，不要阻擋預設行為
      if ($(e.target).closest("a").length) return;

      var event = e.originalEvent;
      var isTouch = event.type.indexOf("touch") >= 0;
      var pointer = isTouch ? event.touches[0] : event;

      isDragging = true;
      startMouseX = pointer.clientX;
      startPosAnimation = currentPos;

      $track.css("cursor", "grabbing");
      if (!isTouch) e.preventDefault();
    }

    function onDragMove(e) {
      if (!isDragging) return;
      var event = e.originalEvent;
      var isTouch = event.type.indexOf("touch") >= 0;
      var pointer = isTouch ? event.touches[0] : event;

      var deltaX = pointer.clientX - startMouseX;

      if (baseWidth === 0) calcSize();

      currentPos = normalizePos(startPosAnimation - deltaX, baseWidth);
      updateTransform(currentPos);
    }

    function onDragEnd() {
      if (isDragging) {
        isDragging = false;
        $track.css("cursor", "grab");
      }
    }

    $track.on("mousedown touchstart", onDragStart);
    $(window).on("mousemove touchmove", onDragMove);
    $(window).on("mouseup touchend", onDragEnd);

    // Hover 暫停邏輯
    $track.on("mouseenter", () => {
      var isMobile =
        /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
          navigator.userAgent.toLowerCase(),
        );
      if (!isMobile) $track.data("paused", true);
    });
    $track.on("mouseleave", () => {
      $track.data("paused", false);
    });

    reqId = requestAnimationFrame(animate);
  })();
});
