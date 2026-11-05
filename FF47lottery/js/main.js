// ==========================================
// 3D 傾斜效果 (Vanilla-Tilt) 獨立管理模組
// ==========================================
const TiltEffectManager = {
  init: function () {
    const card = document.querySelector(".card_main");
    if (!card || card.vanillaTilt) return;

    VanillaTilt.init(card, {
      max: 2, // 最大傾斜角度
      speed: 1000, // 回復速度
      glare: false, // 關閉反光效果
    });
  },
  destroy: function () {
    const card = document.querySelector(".card_main");
    if (card && card.vanillaTilt) {
      card.vanillaTilt.destroy(); // 銷毀實體
      $(".card_main").css("transform", "none"); // 確保歸零
    }
  },
};

// 為了相容其他檔案 (如 demo.js) 的呼叫，將模組功能暴露到全域
window.initVanillaTilt = TiltEffectManager.init;
window.destroyVanillaTilt = TiltEffectManager.destroy;

// ==========================================
// 刮刮卡功能
// ==========================================
$(function () {
  // 取得目前網頁文件物件
  var doc = document,
    cvs = doc.getElementById("j-cvs"), // 取得刮刮卡的 canvas 畫布元素
    ctx, // 準備儲存畫布的 2D 渲染環境 (context)
    config = {
      w: 400, // 刮刮卡畫布寬度
      h: 360, // 刮刮卡畫布高度
    },
    // 記錄滑鼠是否處於按下狀態，預設為 false
    mouseDown = false,
    // 記錄刮刮卡是否已經結算(達到50%)
    isCleared = false;

  // 簡易的除錯訊息輸出函式，將訊息顯示在頁面的 #debug 元素內
  var debug = function (msg) {
    var obj = doc.getElementById("debug");
    obj.innerHTML += msg + "<br>";
  };

  // 獲取事件在元素內的本地座標
  function getLocalCoords(elem, ev) {
    var rect = elem.getBoundingClientRect();
    var scaleX = elem.width / rect.width;
    var scaleY = elem.height / rect.height;

    if ("changedTouches" in ev) {
      var first = ev.changedTouches[0];
      return {
        x: (first.clientX - rect.left) * scaleX,
        y: (first.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (ev.clientX - rect.left) * scaleX,
        y: (ev.clientY - rect.top) * scaleY,
      };
    }
  }

  // 計算畫布上透明像素的比例並執行回調
  function diffTransSize(cxt, threshold, callback) {
    if ((!"getImageData") in ctx) return; // 不支援 getImageData 的情況，主要針對IE8及以下版本
    threshold = threshold || 0.5;
    if (threshold > 1 || threshold < 0) threshold = 1;
    var imageData = ctx.getImageData(0, 0, cvs.width, cvs.height),
      pix = imageData.data,
      pixLength = pix.length,
      pixelSize = pixLength * 0.25;
    var i = 1,
      k,
      l = 0;
    for (; i <= pixelSize; i++) {
      if (0 === pix[4 * i - 1]) l++;
    }
    if (l > pixelSize * threshold) {
      callback.apply(ctx, [l]);
    }
  }

  // 繪製刮刮卡的刮除效果
  function scratchLine(cvs, x, y, fresh) {
    ctx = cvs.getContext("2d");
    // 設定全局合成操作為 destination-out，實現擦除效果
    ctx.globalCompositeOperation = "destination-out";

    ctx.lineWidth = 45;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    if (fresh) {
      ctx.beginPath();
      ctx.moveTo(x + 0.1, y); // 修復 WebKit/Opera/IE9 的 bug
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    // 修復三星瀏覽器的 bug
    var style = cvs.style;
    style.lineHeight = style.lineHeight == "1" ? "1.1" : "1";

    // 刮除進度70%時，自動清空畫布並跳出彈窗
    if (!isCleared) {
      diffTransSize(ctx, 0.7, function () {
        if (!isCleared) {
          isCleared = true;
          // 自動清空剩餘的所有銀漆
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          // 移除 is-scratching，讓掃光特效重新在卡片上無限循環
          $(".scratch_box").removeClass("is-scratching");

          // 延遲 0.8 秒 (800毫秒) 後再跳出指定的中獎彈窗，讓玩家有時間看清楚獎品
          setTimeout(function () {
            // 刮除完成，重新啟動 3D 特效，讓露出的獎品圖有立體感
            if (typeof window.initVanillaTilt === "function") {
              window.initVanillaTilt();
            }
            $("#popGetAward").modal("show");
          }, 800);
        }
      });
    }
  }

  // 初始化畫布並設置事件處理器
  function setupCanvases() {
    cvs.width = config.w;
    cvs.height = config.h;
    var ctx = cvs.getContext("2d");
    // 添加遮罩
    // ctx.fillStyle = '#CCC';
    // ctx.fillRect(0, 0, cvs.width, cvs.height);

    // 允許跨網域載入刮刮卡圖片 避免canvas被汙染(從相對路徑改成絕對路徑)
    var img = new Image();
    img.crossOrigin = "anonymous";

    // 預設一開始為 basic.webp 刮刮卡銀漆
    var imgName = "basic";
    img.src =
      "https://rests-nte.iwplay.com.tw/events/FF47lottery/image/" +
      imgName +
      ".webp";
    img.onload = function () {
      // 圖片載入完成後，將圖片畫滿整個 canvas
      ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    };

    // 給外部呼叫的重新隨機更換刮刮卡銀漆圖片(gold或purple)與獎品邏輯
    window.randomizeScratchCard = function () {
      // 允許跨網域載入刮刮卡圖片 避免canvas被汙染(從相對路徑改成絕對路徑)
      var newImg = new Image();
      newImg.crossOrigin = "anonymous";

      // 隨機金漆或紫漆
      var randomOptions = ["gold", "purple"];
      var randomName =
        randomOptions[Math.floor(Math.random() * randomOptions.length)];

      // 根據漆的顏色決定獎品編號
      var prizeNum;
      if (randomName === "gold") {
        // 金漆隨機 1 ~ 5
        prizeNum = Math.floor(Math.random() * 5) + 1;
      } else {
        // 紫漆隨機 6 ~ 9
        prizeNum = Math.floor(Math.random() * 4) + 6;
      }

      // 1. 替換刮刮卡底層的獎品圖
      $("#prize_result_img").attr(
        "src",
        "https://rests-nte.iwplay.com.tw/events/FF47lottery/image/card_gift_item" +
          prizeNum +
          ".webp",
      );

      // 2. 預先替換「恭喜獲得」彈窗裡面的獎品圖 (相對於 html 的路徑)
      $("#popGetAward .pop-award-item").css(
        "background-image",
        "url('https://rests-nte.iwplay.com.tw/events/FF47lottery/image/pop/get_gift" +
          prizeNum +
          ".webp')",
      );

      newImg.src =
        "https://rests-nte.iwplay.com.tw/events/FF47lottery/image/" +
        randomName +
        ".webp";
      newImg.onload = function () {
        // 重置結算狀態
        isCleared = false;
        // 切換回覆蓋模式
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(newImg, 0, 0, cvs.width, cvs.height);
      };
    };
    // 處理鼠標按下事件
    var mousedown_handler = function (e) {
      var local = getLocalCoords(cvs, e);
      mouseDown = true;
      // 當開始刮的時候，加上 is-scratching class 以隱藏掃光特效
      $(".scratch_box").addClass("is-scratching");
      scratchLine(cvs, local.x, local.y, true);
      if (e.cancelable) {
        e.preventDefault();
      }
      return false;
    };
    // 處理鼠標移動事件
    var mousemove_handler = function (e) {
      if (!mouseDown) {
        return true;
      }
      var local = getLocalCoords(cvs, e);
      scratchLine(cvs, local.x, local.y, false);
      if (e.cancelable) {
        e.preventDefault();
      }
      return false;
    };
    // 處理鼠標鬆開事件
    var mouseup_handler = function (e) {
      if (mouseDown) {
        mouseDown = false;
        if (e.cancelable) {
          e.preventDefault();
        }
        return false;
      }
      return true;
    };
    // 綁定事件
    on(cvs, "mousedown", mousedown_handler);
    on(cvs, "touchstart", mousedown_handler);
    on(window, "mousemove", mousemove_handler);
    on(window, "touchmove", mousemove_handler);
    on(window, "mouseup", mouseup_handler);
    on(window, "touchend", mouseup_handler);
  }

  // 將事件綁定到元素
  function on(E, N, FN) {
    E.addEventListener
      ? E.addEventListener(N, FN, !1)
      : E.attachEvent("on" + N, FN);
  }

  // 初始化畫布
  setupCanvases();
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

// 綁定獎勵一覽按鈕點擊事件，開啟獎勵蓋板並把黑色透明底圖變更黑
$(document).on("click", ".lottery_giftlist_btn", function () {
  $("#gift-overlay").addClass("dark-bg").fadeIn(300);
});

// 會員資訊區塊切換邏輯
$(document).on("click", ".btn_member", function (e) {
  $(".member_info_block").toggleClass("show");
  $(".audit_rules_block").removeClass("show");
});

// 審核規範區塊切換邏輯
$(document).on("click", ".btn_audit_rules", function (e) {
  $(".audit_rules_block").toggleClass("show");
  $(".member_info_block").removeClass("show");
});

// 會員資訊與審核規範區塊隱藏
$(document).on("click", function (e) {
  // 如果點擊的目標不是在 .member_info_block 裡面，也不是 .btn_member 本身
  if (
    !$(e.target).closest(".member_info_block").length &&
    !$(e.target).closest(".btn_member").length
  ) {
    $(".member_info_block").removeClass("show");
  }

  // 如果點擊的目標不是在 .audit_rules_block 裡面，也不是 .btn_audit_rules 本身
  if (
    !$(e.target).closest(".audit_rules_block").length &&
    !$(e.target).closest(".btn_audit_rules").length
  ) {
    $(".audit_rules_block").removeClass("show");
  }
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

    // 如果全部都填寫了：
    isInfoSubmitted = true;
    // 1. 關閉填寫資料彈窗
    $("#popLotteryGet").modal("hide");

    // 2. 修改通用彈窗的文字
    $("#popMsg .popMsgCont p").html("提交成功！");
    // 3. 顯示通用彈窗
    $("#popMsg").modal("show");

    $(".fill_info_btn").hide();
    $(".check_info_btn").show();
  });

  // 2. 彈窗關閉時檢查是否未提交
  $("#popLotteryGet").on("hidden.bs.modal", function () {
    if (!isInfoSubmitted) {
      $(".fill_info_btn").show();
    }
  });

  // 3. 點擊「填寫收件資訊」
  $(".fill_info_btn").on("click", function () {
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
  });

  // 4. 點擊「查看收件資訊」
  $(".check_info_btn").on("click", function () {
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

// ==========================================
// 網址提交與確認彈窗流程
// ==========================================
function initUrlSubmitFlow() {
  // 點擊網址旁邊的 submit 按鈕
  $(".submit_btn").on("click", function () {
    // 不管有沒有輸入網址，都跳出確認彈窗
    $("#popConfirmSubmit").modal("show");
  });

  // 點擊確認彈窗的「是」按鈕
  $("#popConfirmSubmit .btn-yes").on("click", function () {
    // 關閉確認彈窗
    $("#popConfirmSubmit").modal("hide");

    // 顯示提交成功彈窗 (如果需要的話，這會蓋在上面，關閉後就可以開始刮)
    $("#popMsg .popMsgCont p").html("提交成功！");
    $("#popMsg").modal("show");
  });
}

// 啟動流程
$(function () {
  initInfoFlow();
  initContactDataFlow();
  initUrlSubmitFlow();
});

// Gift Overlay Close Logic
$(function () {
  // 中獎彈窗關閉後，接著自動跳出填寫資料彈窗
  $("#popGetAward").on("hidden.bs.modal", function () {
    $("#popLotteryGet").modal("show");
  });

  // 一開始先隱藏主卡片和卡片前景，避免動畫前被看到
  $(".card_main").css("opacity", 0);
  $(".card_mae").css("opacity", 0);

  // 記錄卡片是否已經進場過
  var hasCardAnimated = false;

  // 關閉蓋版頁判斷
  $("#gift-overlay").on("click", function (e) {
    // 判斷：如果點擊的目標不是在 .desk_content（獎品區塊）裡面
    if ($(e.target).closest(".desk_content").length === 0) {
      $("#gift-overlay").fadeOut(300, function () {
        // 移除蓋版更黑的透明底圖
        $(this).removeClass("dark-bg");
        // 判斷：如果卡片還沒進場過，才執行彈跳動畫
        if (!hasCardAnimated) {
          hasCardAnimated = true;

          // 1. 蓋板完全消失後，先觸發主卡片的彈跳動畫
          $(".card_main").css("opacity", 1).addClass("animated bounceIn");

          // 2. 延遲 600 毫秒（等主卡片快跳完時），讓前景圖片從上往下彈出來
          setTimeout(function () {
            $(".card_mae").css("opacity", 1).addClass("animated bounceInDown");

            // 3. 等待所有進場動畫都跑完後 (約1秒)，把動畫 class 拔掉，並啟動 Vanilla-Tilt
            // (因為 animated class 會鎖死 transform，導致 Vanilla-Tilt 失效)
            setTimeout(function () {
              $(".card_main").removeClass("animated bounceIn");
              if (typeof window.initVanillaTilt === "function") {
                window.initVanillaTilt();
              }
            }, 1000);
          }, 300);
        }
      });
    }
  });

  // 解決多重彈窗時，通用彈窗的黑色半透明遮罩被蓋住的問題
  $("#popMsg").on("show.bs.modal", function () {
    // 稍微延遲一下，確保 Bootstrap 已經產生出背景遮罩 div
    setTimeout(function () {
      // 抓取畫面上「最新產生」的那一個遮罩，把它調到 1069
      $(".modal-backdrop").last().css("z-index", 1069);
    }, 10);
  });
});

// footer
$(".footer").load(
  "https://ids.iwplay.com.tw/includ/footer/12b_nte_new.html",
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
