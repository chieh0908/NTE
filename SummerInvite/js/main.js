// ==========================================
// Swiper 垂直分頁獨立管理模組
// ==========================================
const SwiperPageManager = {
  swiper: null,
  init: function () {
    const swiperEl = document.querySelector(".mySwiper");
    if (!swiperEl) return;

    // 如果沒有 Swiper 核心檔案，則不執行
    if (typeof Swiper === "undefined") {
      console.warn(
        "Swiper is not defined. Please include swiper-bundle.min.js",
      );
      return;
    }

    // --- 1. 動態判斷 ---
    // (已改為 inline 直接判斷)

    // 避免電腦版滑鼠拖曳時觸發預設的反白圈選行為 (取代 Swiper 原本的防護)
    swiperEl.style.userSelect = "none";
    swiperEl.style.webkitUserSelect = "none";

    this.swiper = new Swiper(".mySwiper", {
      direction: "vertical", // 永遠保持 vertical 以支援 PC 滑鼠滾輪
      allowTouchMove: false, // 關閉 Swiper 內建觸控，全面交由我們自訂的 pointer 事件接管
      mousewheel: true, // 支援 PC 滾輪切換
      speed: 600, // 切換速度
      effect: "fade", // 開啟淡入淡出效果
      fadeEffect: {
        crossFade: true, // 讓前後頁面同時漸變，效果更平滑
      },
      on: {
        init: function () {
          // 初始化時根據第一頁設定背景
          const wrapper = document.querySelector(".wrapper");
          if (wrapper) {
            wrapper.style.backgroundImage =
              "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/home_page/kv_bg.webp)";
          }
        },
        slideChange: function () {
          SwiperPageManager.updateNavButtons(this.activeIndex);

          // 根據分頁切換背景圖與 Logo
          const wrapper = document.querySelector(".wrapper");
          const logo = document.querySelector(".logo");
          if (wrapper) {
            if (this.activeIndex === 0) {
              wrapper.style.backgroundImage =
                "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/home_page/kv_bg.webp)";
              if (logo)
                logo.style.backgroundImage =
                  "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/logo.png)";
            } else {
              wrapper.style.backgroundImage =
                "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/bg.webp)";
              if (logo)
                logo.style.backgroundImage =
                  "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/logo_b.png)";
            }
          }

          // 當切換到第三頁 (Lottery, index 2) 時，觸發進場動畫與物件動畫
          if (this.activeIndex === 2) {
            if (typeof triggerCardAnimation === "function") {
              triggerCardAnimation();
            }
            if (typeof triggerLotteryObjAnimation === "function") {
              triggerLotteryObjAnimation();
            }
          }

          // 當切換到第二頁 (Task, index 1) 時，觸發任務物件動畫
          if (this.activeIndex === 1) {
            if (typeof triggerTaskObjAnimation === "function") {
              triggerTaskObjAnimation();
            }
          }
        },
      },
    });

    this.bindEvents();
  },
  bindEvents: function () {
    const navBtns = document.querySelectorAll(".tap_panel .nav_btn");
    navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
        if (!isNaN(index) && this.swiper) {
          this.swiper.slideTo(index);
        }
      });
    });

    // --- 攔截 mySwiper 外圍的滾輪與滑動事件(由於swiper切換分頁被固定比例所以當寬度過大時背景區塊會變寬而超出swiper區塊，
    //     如果在超出區塊滑動/滾動會觸發不了，所以在此重新綁定事件) ---
    // 1. 監聽全螢幕滑鼠滾輪 (PC)
    window.addEventListener("wheel", (e) => {
      // 檢查是否滑動在 mySwiper 範圍之外，且沒有開啟任何彈窗 (.modal)
      if (
        !e.target.closest(".mySwiper") &&
        !e.target.closest(".modal") &&
        !e.target.closest(".gift-overlay") &&
        !document.body.classList.contains("modal-open")
      ) {
        if (!this.swiper) return;
        // 避免連續觸發，確認前一個翻頁動畫已播完
        if (this.swiper.animating) return;

        if (e.deltaY > 0) {
          this.swiper.slideNext();
        } else if (e.deltaY < 0) {
          this.swiper.slidePrev();
        }
      }
    });

    // --- 2. 統整全螢幕滑動的自訂監聽器 (完美支援手機轉向) ---
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPointerDown = false;

    window.addEventListener("pointerdown", (e) => {
      isPointerDown = false; // 每次點擊先初始化狀態

      // 避免點擊到彈窗 或 內部有獨立滾動的區塊(.swiper-no-swiping) 時觸發換頁
      if (
        !e.target.closest(".modal") &&
        !e.target.closest(".gift-overlay") &&
        !e.target.closest(".swiper-no-swiping")
      ) {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        isPointerDown = true;
      }
    });

    window.addEventListener("pointerup", (e) => {
      // 確保只有從合法區域開始的滑動才會執行
      if (!isPointerDown) return;
      isPointerDown = false; // 絕對重置狀態，避免幽靈觸控卡死

      // 檢查放開時是否也沒有碰到彈窗或禁止滑動區塊
      if (
        !e.target.closest(".modal") &&
        !e.target.closest(".gift-overlay") &&
        !e.target.closest(".swiper-no-swiping") &&
        !document.body.classList.contains("modal-open")
      ) {
        if (!this.swiper || this.swiper.animating) {
          return;
        }

        let deltaVal = 0;
        const currentIsPortrait = window.innerHeight > window.innerWidth;

        if (currentIsPortrait) {
          // 直式(旋轉 90 度)：視覺往上滑 = 物理往右滑 = X 增加。
          let pointerEndX = e.clientX;
          deltaVal = pointerEndX - pointerStartX;
        } else {
          // 橫式(無旋轉)：視覺往上滑 = 物理往上滑 = Y 減少。
          let pointerEndY = e.clientY;
          deltaVal = pointerStartY - pointerEndY;
        }

        // 設定滑動的閥值 (至少滑動 30px 才算數)
        if (deltaVal > 30) {
          this.swiper.slideNext();
        } else if (deltaVal < -30) {
          this.swiper.slidePrev();
        }
      }
    });
    // --------------------------------------------------------
  },
  updateNavButtons: function (activeIndex) {
    const navBtns = document.querySelectorAll(".tap_panel .nav_btn");
    navBtns.forEach((btn, idx) => {
      if (idx === activeIndex) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },
};

// 網頁載入完成後初始化 Swiper
$(function () {
  SwiperPageManager.init();
});

// ==========================================
// 蓋版獎勵列表跑馬燈效果
// ==========================================
$(function () {
  (function initUniversalMarquee() {
    var $award = $(".gift-overlay .content_A2 .board .lottery_award");
    if ($award.length === 0) return;

    $award.css("animation", "none");
    // 設定預設游標樣式為 grab 抓取樣式
    $award.css("cursor", "grab");
    // 實現跑馬燈首尾相接無限循環
    // 先把獎品複製下來
    var $originalItems = $award.children(".lottery_item").clone();
    // 在後面貼上第一份複製的獎品
    $award.append($originalItems.clone());
    // 在後面貼上第二份複製的獎品
    $award.append($originalItems.clone());

    var currentPos = 0;
    var lastTime = null;
    var reqId = null;

    var baseWidth = 0;
    var baseHeight = 0;
    var currentAxis = "X";

    // 拖曳狀態變數
    var isDragging = false;
    var startMouseX = 0;
    var startMouseY = 0;
    var startPosAnimation = 0;

    function calcSize() {
      if ($award.css("flex-direction") === "column") {
        currentAxis = "Y";
        var $firstItem = $award.children().first();
        // 會察看根據獎品數量精準抓取重製距離
        baseHeight = $firstItem.length
          ? $firstItem.outerHeight(true) * $originalItems.length
          : 0;
      } else {
        currentAxis = "X";
        var $firstItem = $award.children().first();
        baseWidth = $firstItem.length
          ? $firstItem.outerWidth(true) * $originalItems.length
          : 0;
      }
    }

    function updateTransform(pos) {
      if (currentAxis === "Y") {
        $award.css({
          transition: "none",
          transform: `translate3d(0, -${pos}px, 0)`,
        });
      } else {
        $award.css({
          transition: "none",
          transform: `translate3d(-${pos}px, 0, 0)`,
        });
      }
    }

    function normalizePos(pos, base) {
      // 處理超過 base 的情況 (正向或負向拖曳)
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

      // 如果正在拖曳，暫停自動滾動
      if (isDragging) return;

      if ($award.data("paused")) return;
      if (dt > 0.5) return;

      if (baseWidth === 0 && baseHeight === 0) calcSize();

      if (currentAxis === "Y") {
        if (baseHeight <= 0) return;
        // 跑馬燈控制Y軸速度
        var speedY = baseHeight / 25;
        currentPos += speedY * dt;
        currentPos = normalizePos(currentPos, baseHeight);
        updateTransform(currentPos);
      } else {
        if (baseWidth <= 0) return;
        // 跑馬燈控制X軸速度
        var speedX = baseWidth / 25;
        currentPos += speedX * dt;
        currentPos = normalizePos(currentPos, baseWidth);
        updateTransform(currentPos);
      }
    }

    $(window).on("resize orientationchange", () => {
      setTimeout(() => {
        var oldAxis = currentAxis;
        calcSize();
        if (oldAxis !== currentAxis) currentPos = 0;
      }, 100);
    });

    calcSize();
    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        calcSize();
      }).observe($award[0]);
    }

    // 滑鼠與觸控事件 (拖曳邏輯)
    function onDragStart(e) {
      var event = e.originalEvent;
      var isTouch = event.type.indexOf("touch") >= 0;
      var pointer = isTouch ? event.touches[0] : event;

      isDragging = true;
      startMouseX = pointer.clientX;
      startMouseY = pointer.clientY;
      startPosAnimation = currentPos;

      $award.css("cursor", "grabbing");
      // 避免拖曳時選取到圖片等元素
      if (!isTouch) e.preventDefault();
    }

    function onDragMove(e) {
      if (!isDragging) return;
      var event = e.originalEvent;
      // 判斷觸發的是不是 touch (觸控) 事件
      var isTouch = event.type.indexOf("touch") >= 0;
      // 如果是觸控，就抓取第一根手指的座標；如果是滑鼠，就直接抓滑鼠座標
      var pointer = isTouch ? event.touches[0] : event;

      var deltaX = pointer.clientX - startMouseX;
      var deltaY = pointer.clientY - startMouseY;

      // 如果畫面被 reset.js 旋轉了 90 度，拖曳座標必須對應轉換
      var isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait) {
        var tempX = deltaX;
        deltaX = deltaY;
        deltaY = -tempX;
      }

      if (baseWidth === 0 && baseHeight === 0) calcSize();

      if (currentAxis === "Y") {
        // 往下滑動 (deltaY > 0) 代表內容往上，所以 currentPos 減少
        currentPos = normalizePos(startPosAnimation - deltaY, baseHeight);
      } else {
        // 往右滑動 (deltaX > 0) 代表內容往左，所以 currentPos 減少
        currentPos = normalizePos(startPosAnimation - deltaX, baseWidth);
      }
      updateTransform(currentPos);
    }

    function onDragEnd() {
      if (isDragging) {
        isDragging = false;
        $award.css("cursor", "grab");
      }
    }

    $award.on("mousedown touchstart", onDragStart);
    $(window).on("mousemove touchmove", onDragMove); // 綁在 window 確保拖曳出邊界也能更新
    $(window).on("mouseup touchend", onDragEnd);

    // 原本的 Hover 暫停邏輯
    $award.on("mouseenter", () => {
      var isMobile =
        /iphone|ipad|ipod|android|webos|blackberry|iemobile|mobile/i.test(
          navigator.userAgent.toLowerCase(),
        );
      if (!isMobile) $award.data("paused", true);
    });
    $award.on("mouseleave", () => {
      $award.data("paused", false);
    });

    reqId = requestAnimationFrame(animate);
  })();
});
// ----------
// 會員資訊區塊切換邏輯
$(document).on("click", ".btn_member", function (e) {
  $(".member_info_block").toggleClass("show");
});

// 會員資訊區塊隱藏
$(document).on("click", function (e) {
  // 如果點擊的目標不是在 .member_info_block 裡面，也不是 .btn_member 本身
  if (
    !$(e.target).closest(".member_info_block").length &&
    !$(e.target).closest(".btn_member").length
  ) {
    $(".member_info_block").removeClass("show");
  }
});

// Gift Overlay 開關 Logic
$(function () {
  // 1. 開啟蓋版：點擊「獎勵一覽」按鈕
  $(".lottery_giftlist_btn").on("click", function () {
    $("#gift-overlay").fadeIn(300);
  });

  // 2. 關閉蓋版：點擊右上角 X 按鈕
  $(".gift-overlay-close").on("click", function () {
    $("#gift-overlay").fadeOut(300);
  });

  // 3. 關閉蓋版：點擊黑色半透明背景
  $("#gift-overlay").on("click", function (e) {
    if ($(e.target).closest(".desk_content").length === 0) {
      $("#gift-overlay").fadeOut(300);
    }
  });
});

// ==========================================
// 收件資訊按鈕與彈窗狀態流程
// ==========================================
function initInfoFlow() {
  var isInfoSubmitted = false;

  // 1. 提交資料成功時
  $("#popLotteryGet .btn-send-data").on("click", function () {
    // 取得所有欄位的值
    var name = $("#lottery_name").val().trim();
    var phoneCode = $("#lottery_phone_code").val();
    var phone = $("#lottery_phone_number").val().trim();
    var email = $("#lottery_email").val().trim();

    // 檢查是否有漏填 (防呆機制)
    if (!name || phoneCode === "-1" || !phone || !email) {
      $("#popMsg .popMsgCont p").html("請完整填寫所有收件資訊！");
      $("#popMsg").modal("show");
      return; // 中斷執行，不讓填寫彈窗關閉
    }

    // 如果全部都填寫了，開啟確認彈窗：
    $("#popLotteryGet").modal("hide");
    setTimeout(function () {
      $("#popConfirmSubmit").modal("show");
    }, 300);
  });

  // 1-1. 二次確認：確定提交
  $("#popConfirmSubmit .btn-yes").on("click", function () {
    isInfoSubmitted = true;
    $("#popConfirmSubmit").modal("hide");

    setTimeout(function () {
      $("#popMsg .popMsgCont p").html("提交成功！");
      $("#popMsg").modal("show");

      $(".fill_info_btn").hide();
      $(".check_info_btn").show();
    }, 300);
  });

  // 1-2. 二次確認：返回修改
  $("#popConfirmSubmit .btn-no").on("click", function () {
    setTimeout(function () {
      $("#popLotteryGet").modal("show");
    }, 300);
  });

  // 2. 彈窗關閉時檢查是否未提交
  $("#popLotteryGet").on("hidden.bs.modal", function () {
    if (!isInfoSubmitted) {
      $(".fill_info_btn").show();
    }
  });

  // 3. 點擊「填寫收件資訊」
  $(".fill_info_btn").on("click", function () {
    // 若按鈕在獎勵紀錄彈窗內，先隱藏
    if ($(this).closest("#popAward_v1").length) {
      $("#popAward_v1").modal("hide");
    }

    setTimeout(function () {
      $(
        "#lottery_name, #lottery_phone_number, #lottery_email, #lottery_address, #lottery_phone_code",
      ).prop("disabled", false);
      // 顯示提交按鈕 這邊用visibility為了佔有原本空間並且隱藏不能點擊
      $("#popLotteryGet .btn-send-data").css("visibility", "visible");

      // 恢復輸入框預設的 padding-left
      $("#popLotteryGet .form-control").css("padding-left", "");
      $("#popLotteryGet .form-select").css("padding-left", "");

      // 恢復填寫時的提示文字
      $("#popLotteryGet .popBtnsTip").html(
        "請核對您的收件資訊準確無誤，一旦提交無法更改。",
      );

      $("#popLotteryGet").modal("show");
    }, 300);
  });

  // 4. 點擊「查看收件資訊」
  $(".check_info_btn").on("click", function () {
    // 若按鈕在獎勵紀錄彈窗內，先隱藏
    if ($(this).closest("#popAward_v1").length) {
      $("#popAward_v1").modal("hide");
    }

    setTimeout(function () {
      $(
        "#lottery_name, #lottery_phone_number, #lottery_email, #lottery_address, #lottery_phone_code",
      ).prop("disabled", true);
      // 隱藏提交按鈕
      $("#popLotteryGet .btn-send-data").css("visibility", "hidden");

      // 將輸入框 padding-left 改為 0
      $("#popLotteryGet .form-control").css("padding-left", "0");
      $("#popLotteryGet .form-select").css("padding-left", "0");

      // 將提示文字改為已提交後的說明
      $("#popLotteryGet .popBtnsTip").html(
        "客服將與您聯繫完成後續發獎，請鑒定師注意相關資訊",
      );

      $("#popLotteryGet").modal("show");
    }, 300);
  });
}

// ==========================================
// 聯絡資料按鈕與彈窗狀態流程
// ==========================================
function initContactDataFlow() {
  // 提交聯絡資料時
  $("#popContactData .btn-send-data").on("click", function () {
    // 取得所有欄位的值
    var name = $("#contact_name").val().trim();
    var phoneCode = $("#contact_phone_code").val();
    var phone = $("#contact_phone_number").val().trim();
    var email = $("#contact_email").val().trim();

    // 檢查是否有漏填 (防呆機制)
    if (!name || phoneCode === "-1" || !phone || !email) {
      $("#popMsg .popMsgCont p").html("請完整填寫所有聯絡資訊！");
      $("#popMsg").modal("show");
      return; // 中斷執行，不讓填寫彈窗關閉
    }

    // 如果全部都填寫了：
    // 1. 關閉聯絡資料彈窗
    $("#popContactData").modal("hide");

    // 2. 修改通用彈窗的文字
    $("#popMsg .popMsgCont p").html("提交成功！");
    // 3. 顯示通用彈窗
    $("#popMsg").modal("show");
  });
}

// 啟動流程
$(function () {
  initInfoFlow();
  initContactDataFlow();
  initLuckyDrawFlow();
  initPopAwardFlow();
  initPartnerTaskFlow();
});

// ==========================================
// 獎勵紀錄彈窗 (popAward_v1)
// ==========================================
function initPopAwardFlow() {
  $(document).on("click", "#toggleAwardEmpty_v1", function () {
    $("#popAward_v1 .popAwardCont_v1 .type-empty").toggleClass("d-none");
    $("#popAward_v1 .popAwardCont_v1 .type-list").toggleClass("d-none");
    var isEmpty = $("#popAward_v1 .popAwardCont_v1 .type-empty").hasClass(
      "d-none",
    );
    $(this).text(isEmpty ? "切換無獎項" : "切換有獎項");
  });

  $(document).on("click", "#popAward_v1 .serial-copy-btn", function () {
    var serialText = $(this).siblings(".serial-code").text().trim();
    if (!serialText) return;
    navigator.clipboard
      .writeText(serialText)
      .then(function () {
        alert("複製成功：" + serialText);
      })
      .catch(function (err) {
        // 降級複製方案
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(serialText).select();
        document.execCommand("copy");
        $temp.remove();
        alert("複製成功：" + serialText);
      });
  });

  $(document).on("click", "#popAward_v1 .serial-get-btn", function () {
    $("#popAward_v1").modal("hide");
    setTimeout(function () {
      $("#popLotteryGet").modal("show");
    }, 300);
  });
}

// ==========================================
// 幸運抽取 3D 動畫與洗牌邏輯
// ==========================================
function initLuckyDrawFlow() {
  // 幸運抽取資訊按鈕點擊事件 (切換提示文字顯示/隱藏)
  $(".btn_lucky_info").on("click", function () {
    const hint = $(".lucky_draw_hint");
    if (hint.css("opacity") == "0") {
      hint.css("opacity", "1");
    } else {
      hint.css("opacity", "0");
    }
  });

  let remainingChances = 5;
  let isAnimating = false;

  // 網頁載入時，自動將剩餘抽獎次數同步到畫面上所有標示 .draw_count 的地方
  const chanceDisplays = document.querySelectorAll(".draw_count");
  chanceDisplays.forEach((el) => (el.innerText = remainingChances));

  // 獎品圖庫 (6 種) 及對應的大圖案編號 (不重複抽取)
  let availableGifts = [
    {
      id: 1,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift1.webp",
    },
    {
      id: 2,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift2.webp",
    },
    {
      id: 3,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift3.webp",
    },
    {
      id: 4,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift4.webp",
    },
    {
      id: 5,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift5.webp",
    },
    {
      id: 6,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift6.webp",
    },
    {
      id: 7,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift7.webp",
    },
    {
      id: 8,
      img: "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift8.webp",
    },
  ];

  $(".lottery_btn").on("click", function () {
    if (isAnimating) return;
    if (remainingChances <= 0) {
      alert("您的抽獎次數已用盡！");
      return;
    }

    const $parent = $(this).closest(".lucky_draw_wrapper");
    const gridContainer = $parent.find(".lucky_draw_cards")[0];
    const cards = $parent.find(".card").toArray();
    // 這裡直接沿用全域宣告的 chanceDisplays (因為它抓的是 NodeList，如果動態新增元素可能需要重抓，但這裡是靜態的所以可以，不過為了安全還是重抓一次 class)
    const currentChanceDisplays = document.querySelectorAll(".draw_count");

    // 1. 上鎖全域狀態與扣除次數
    isAnimating = true;
    remainingChances--;
    currentChanceDisplays.forEach((el) => (el.innerText = remainingChances));

    // 如果抽完次數歸零，將按鈕加上 disabled 狀態
    if (remainingChances <= 0) {
      $(".lottery_btn").addClass("disabled");
    }

    // 2. 隨機決定要翻哪張卡片與抽中哪個獎品
    const randomIndex = Math.floor(Math.random() * cards.length);
    const targetCard = cards[randomIndex];

    // 從獎品中隨機抽出一項
    const drawIndex = Math.floor(Math.random() * availableGifts.length);
    const selectedGift = availableGifts[drawIndex];

    const randomGift = selectedGift.img;
    const popupGift =
      "https://rests-nte.iwplay.com.tw/events/SummerInvite/image/lottery_page/lucky_draw_card_gift" +
      selectedGift.id +
      ".webp";

    // 將獎品圖設定到該卡片的背面
    const cardBackImg = targetCard.querySelector(".card-back img");
    if (cardBackImg) cardBackImg.src = randomGift;

    // 執行翻開特效
    targetCard.classList.add("is-flipped");

    // 3. 翻牌動畫後直接觸發「獲得獎勵」彈窗
    setTimeout(() => {
      // 替換第二段 #popGetAward 裡面的圖片並顯示
      $("#popGetAward .pop-award-item").css(
        "background-image",
        `url(${popupGift})`,
      );

      // 確保抽取獎勵彈窗標題為 pop_award_tt.webp
      $("#popGetAward .popAwardTit").css(
        "background-image",
        "url(https://rests-nte.iwplay.com.tw/events/SummerInvite/image/pop/pop_award_tt.webp)",
      );

      $("#popGetAward").modal("show");

      // 監聽獲得獎勵彈窗關閉事件 (手動點擊叉叉或背景)
      $("#popGetAward").one("hidden.bs.modal", function () {
        closeModalAndShuffle(targetCard, gridContainer, cards);
      });
    }, 500);
  });

  // 關閉彈窗後執行蓋牌與洗牌動畫
  function closeModalAndShuffle(targetCard, gridContainer, cards) {
    // 彈窗完全消失後，卡片蓋回背面
    targetCard.classList.remove("is-flipped");

    // 等待蓋牌動畫 0.6 秒結束後，執行大洗牌
    setTimeout(() => {
      executeShuffle(gridContainer, cards);
    }, 600);
  }

  // 核心洗牌邏輯
  function executeShuffle(gridContainer, cards) {
    if (!gridContainer || cards.length === 0) return;

    // 改用相對父容器的尺寸，忽略外部旋轉
    const gridCenterX = gridContainer.clientWidth / 2;
    const gridCenterY = gridContainer.clientHeight / 2;

    // 第一階段：所有卡牌飛向中心點
    cards.forEach((card, index) => {
      // 改用 offsetLeft/offsetTop 取得相對於 gridContainer 的原始局部位置
      const cardCenterX = card.offsetLeft + card.clientWidth / 2;
      const cardCenterY = card.offsetTop + card.clientHeight / 2;

      // 計算每張卡牌距離網格中心的局部偏移量
      const translateX = gridCenterX - cardCenterX;
      const translateY = gridCenterY - cardCenterY;
      // 加上隨機旋轉角度，模擬真實疊牌的參差不齊感
      const randomRotate = (Math.random() - 0.5) * 45;

      card.style.zIndex = 10 + index; // 確保在上方疊放
      card.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${randomRotate}deg)`;
    });

    // 第二階段：洗牌完畢，重新發牌回到原位
    setTimeout(() => {
      cards.forEach((card) => {
        card.style.transform = `translate(0px, 0px) rotate(0deg)`;
        card.style.zIndex = 1;
      });

      // 發牌動畫結束後，解鎖全域狀態
      setTimeout(() => {
        isAnimating = false;
      }, 500); // 對應 CSS 的平移動畫時間 0.5s
    }, 800); // 在中心疊放停留 0.8 秒
  }
}
// ==========================================

$(function () {
  // 解決多重彈窗時，通用彈窗的黑色半透明遮罩被蓋住的問題
  $("#popMsg").on("show.bs.modal", function () {
    // 稍微延遲一下，確保 Bootstrap 已經產生出背景遮罩 div
    setTimeout(function () {
      // 抓取畫面上「最新產生」的那一個遮罩，把它調到 1069
      $(".modal-backdrop").last().css("z-index", 1069);
    }, 10);
  });

  // 首頁「前往任務」按鈕點擊事件
  $(".home_page .btn_kv_go").on("click", function () {
    if (window.SwiperPageManager && window.SwiperPageManager.swiper) {
      window.SwiperPageManager.swiper.slideTo(1);
    } else {
      // 備案：模擬點擊上方的 nav 按鈕
      $(".tap_panel .nav_btn.task").click();
    }
  });

  // 任務頁前往抽獎按鈕 (切換到第三個 Slide - lottery)
  $(document).on("click", ".go_lottery_btn", function () {
    if (window.SwiperPageManager && window.SwiperPageManager.swiper) {
      window.SwiperPageManager.swiper.slideTo(2);
    } else {
      $(".tap_panel .nav_btn.lottery").click();
    }
  });

  // 活躍邀請任務按鈕點擊 (雪碧圖狀態切換)
  $(document).on("click", ".active_reward_btn.state_claimable", function () {
    // 切換為已領取狀態
    $(this).removeClass("state_claimable").addClass("state_claimed");
    // 若需要跳出提示彈窗，可將下面這行解開註解：
    $("#popMsg .popMsgCont p").html("領取成功");
    $("#popMsg").modal("show");
  });

  // ==========================================
  // 任務頁籤切換邏輯 (回歸邀請 / 活躍邀請)
  // ==========================================
  // $(".partner_tab").on("click", function () {
  //   $(".partner_tab").removeClass("active");
  //   $(this).addClass("active");

  //   const target = $(this).attr("data-bs-target");
  //   $(".tab_content").hide();
  //   $(target).show();

  //   if (target === "#content_task") {
  //     // 回歸邀請
  //     $(".return_only").show();
  //     $(".active_only").hide();
  //     if (
  //       typeof triggerTaskObjAnimation === "function" &&
  //       $(".swiper-slide.task_page").hasClass("swiper-slide-active")
  //     ) {
  //       triggerTaskObjAnimation();
  //     }
  //   } else if (target === "#content_active") {
  //     // 活躍邀請
  //     $(".return_only").hide();
  //     $(".active_only").show();
  //     // 使用 flex 顯示底部操作區
  //     $(".active_bottom_action.active_only").css("display", "flex");
  //     if (
  //       typeof triggerTaskObjAnimation === "function" &&
  //       $(".swiper-slide.task_page").hasClass("swiper-slide-active")
  //     ) {
  //       triggerTaskObjAnimation();
  //     }
  //   }
  // });

  // 網頁載入時，自動觸發一次 active 的頁籤來初始化顯示狀態
  // if ($(".partner_tab.active").length) {
  //   $(".partner_tab.active").click();
  // }
  // ====================================

  // 防止在任務列表區塊內滾動時，觸發 Swiper 分頁切換
  $(".task_container").on("wheel mousewheel DOMMouseScroll", function (e) {
    e.stopPropagation();
  });
});

// ==========================================
// 回歸/活躍任務區塊物件動畫
// ==========================================
let hasPlayedReturnAnimation = false;
let hasPlayedActiveAnimation = false;

function triggerTaskObjAnimation() {
  if ($("#content_task").is(":visible") && !hasPlayedReturnAnimation) {
    hasPlayedReturnAnimation = true;
    // 回歸邀請：obj1(下彈)、obj3(先上彈)、obj2(後上彈)
    $(".task_obj.obj1").addClass("animated bounceInDown");
    $(".task_obj.obj3").addClass("animated bounceInUp");
    $(".task_obj.obj2").addClass("animated bounceInUp");

    // 動畫播完後移除 class，這樣以後 display: none -> block 就不會再觸發
    setTimeout(() => {
      $(".task_obj.obj1, .task_obj.obj2, .task_obj.obj3").removeClass(
        "animated bounceInDown bounceInUp",
      );
    }, 1500);
  } else if ($("#content_active").is(":visible") && !hasPlayedActiveAnimation) {
    hasPlayedActiveAnimation = true;
    // 活躍邀請：obj4(先下彈)、obj5(後下彈)
    $(".task_obj.obj4").addClass("animated bounceInDown");
    $(".task_obj.obj5").addClass("animated bounceInDown");

    setTimeout(() => {
      $(".task_obj.obj4, .task_obj.obj5").removeClass("animated bounceInDown");
    }, 1500);
  }
}

// ==========================================
// 幸運抽獎區塊物件動畫
// ==========================================
let hasPlayedLotteryAnimation = false;

function triggerLotteryObjAnimation() {
  if (!hasPlayedLotteryAnimation) {
    hasPlayedLotteryAnimation = true;
    $(".lottery_page .obj6").addClass("animated bounceInUp");
    $(".lottery_page .obj7").addClass("animated bounceInUp");
    $(".lottery_page .obj8").addClass("animated bounceInDown");

    setTimeout(() => {
      $(".lottery_page .obj6, .lottery_page .obj7").removeClass(
        "animated bounceInUp",
      );
      $(".lottery_page .obj8").removeClass("animated bounceInDown");
    }, 1500);
  }
}

// ==========================================
// 任務區塊按鈕領取功能
// ==========================================
function initPartnerTaskFlow() {
  $("#content_task .btn_im_task").on("click", function () {
    const bgPos = $(this).css("background-position");
    // 如果背景是 center bottom (已領取)，或是帶有 task_done_btn，則不執行任何動作
    if (
      bgPos === "50% 100%" ||
      bgPos === "center bottom" ||
      $(this).hasClass("task_done_btn")
    ) {
      return;
    }

    $("#popMsg .popMsgCont p").html("連結已複製，快去分享吧！");
    $("#popMsg").modal("show");
  });
}

// footer
$(".footer").load(
  "https://ids.iwplay.com.tw/includ/footer/15b_nte_new.html",
  function () {
    // 載入完成後顯示
    $(".footer").addClass("show");
  },
);

// ==========================================
// SDK彈窗 (#bookedmodal)
// 狀態管理: 'initial' | 'selectState' | 'state1' | 'state2' | 'state3'
// ==========================================
$(function () {
  var currentState = "initial";
  var btnBoxOriginal = null; // 快取初始 button_box 內容

  // 回復初始狀態（不關彈窗）
  function resetToInitial() {
    currentState = "initial";
    // 按鈕
    $("#phoneNextBtn").removeClass("d-none");
    $("#back_button").addClass("d-none");
    $("#booked_button").addClass("d-none");
    $("#back_sms_button").addClass("d-none");
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    // 表單欄位
    $(".phone_verification_code").addClass("d-none");
    $(".phone_password").addClass("d-none");
    $(".graphic_verification_code").addClass("d-none");
    // 狀態三相關：還原表單 + button_box + 第三方登入
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    if (btnBoxOriginal && $btnBox.length) {
      $btnBox.html(btnBoxOriginal);
    }
    $("#select_role").addClass("d-none");
    $("#bookedForm").removeClass("d-none");
    $("#other_login").removeClass("d-none");
    $("#demoState3").text("狀態三（角色選擇）");
    console.log("[popDemo] 回復初始狀態");
  }

  // 彈窗開啟時確保初始狀態，並快取 button_box 原始內容
  $("#bookedmodal").on("show.bs.modal", function () {
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    if (!btnBoxOriginal && $btnBox.length) {
      btnBoxOriginal = $btnBox.html();
    }
    resetToInitial();
  });

  // 點擊「下一步」→ 進入選擇狀態
  $(document).on("click", "#phoneNextBtn", function () {
    currentState = "selectState";
    $("#phoneNextBtn").addClass("d-none");
    $("#demoState1").removeClass("d-none");
    $("#demoState2").removeClass("d-none");
    $("#back_button").removeClass("d-none");
    console.log("[popDemo] 下一步 → 顯示狀態選擇按鈕");
  });

  // 狀態一：簡訊驗證碼登入
  $(document).on("click", "#demoState1", function () {
    currentState = "state1";
    // 顯示驗證碼欄位 + 圖形驗證碼 + 登入按鈕
    $(".phone_verification_code").removeClass("d-none");
    $(".graphic_verification_code").removeClass("d-none");
    $("#booked_button").removeClass("d-none");
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    console.log("[popDemo] 狀態一：簡訊驗證碼登入");
  });

  // 狀態二：密碼登入
  $(document).on("click", "#demoState2", function () {
    currentState = "state2";
    // 顯示密碼欄位 + 登入 + 簡訊登入按鈕
    $(".phone_password").removeClass("d-none");
    $("#booked_button").removeClass("d-none");
    $("#back_sms_button").removeClass("d-none");
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    console.log("[popDemo] 狀態二：密碼登入");
  });

  // 狀態三：角色選擇
  $(document).on("click", "#demoState3", function () {
    if (currentState === "state3") {
      resetToInitial();
      return;
    }
    currentState = "state3";
    var $btnBox = $("#bookedmodal .pop_booked_form > .button_box");
    var btnBoxRole =
      '<div class="row">' +
      '<a class="btn btn-secondary" id="select_role_button"></a>' +
      '<a class="btn btn-secondary" id="back_role_button"></a>' +
      "</div>";
    // 隱藏登入表單 + 第三方登入，顯示角色選擇
    $("#bookedForm").addClass("d-none");
    $("#other_login").addClass("d-none");
    $("#select_role").removeClass("d-none");
    $btnBox.html(btnBoxRole);
    // 隱藏狀態按鈕
    $("#demoState1").addClass("d-none");
    $("#demoState2").addClass("d-none");
    $(this).text("狀態三（返回登入）");
    console.log("[popDemo] 狀態三：角色選擇");
  });

  // 角色選擇區「返回」按鈕 → 回初始狀態
  $(document).on("click", "#back_role_button", function () {
    resetToInitial();
    console.log("[popDemo] 從角色選擇返回 → 回初始狀態");
  });

  // 角色選擇區「登入」按鈕
  $(document).on("click", "#select_role_button", function () {
    var selectedRole = $("#role_select").val();
    console.log("[popDemo] 角色選擇登入，選擇角色:", selectedRole);
    if (window.mockProductList) {
      window.mockProductList();
    }
    $("#bookedmodal").modal("hide");
  });

  // 返回按鈕
  $(document).on("click", "#back_button", function () {
    if (currentState === "selectState") {
      // 從選擇狀態返回 → 回初始 + 關彈窗
      resetToInitial();
      $("#bookedmodal").modal("hide");
      console.log("[popDemo] 從選擇狀態返回 → 關閉彈窗");
    } else {
      // 從 state1/state2/state3 返回 → 回初始狀態
      resetToInitial();
    }
  });

  // 簡訊登入按鈕（從密碼狀態切換到狀態一）
  $(document).on("click", "#back_sms_button", function () {
    // 隱藏密碼相關
    $(".phone_password").addClass("d-none");
    $("#back_sms_button").addClass("d-none");
    // 顯示狀態一：簡訊驗證碼 + 圖形驗證碼
    $(".phone_verification_code").removeClass("d-none");
    $(".graphic_verification_code").removeClass("d-none");
    currentState = "state1";
    console.log("[popDemo] 切換到狀態一：簡訊登入");
  });

  // 點擊登入按鈕
  $(document).on("click", "#booked_button", function () {
    if (window.mockProductList) {
      window.mockProductList();
    }
    $("#bookedmodal").modal("hide");
    console.log("[popDemo] 登入 → 關閉彈窗");
  });
});
