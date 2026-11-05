// ==========================================
// 1. 全域變數與 ViewObj (隱私權條款)
// ==========================================
var ViewObj = {
  privacy: "同意艾玩天地依照個人資料處理辦法蒐集、處理及利用您的個人資料",
  privacy_list: [
    "使用者進入艾玩天地互動娛樂股份有限公司及所屬相關遊戲網頁時，並不需要輸入個人資料，例如姓名或電子郵件地址等，除非明確告知，我們不會在使用者不知情的情況下，取得使用者此等個人資料。在某些情況下，例如當使用者要求加入會員、訂閱電子報、使用電子郵件服務或其他服務、或參加其他活動時，我們的相關網站或其合作對象可能會要求使用者登錄個人資料，以便於和使用者聯繫、完成交易、提供服務、或處理訂閱程序。在此等情況下，本網站及相關網站或其合作對象將明白告知使用者此等事實，如果使用者選擇不接收任何廣告或聯繫資訊，本網站將完全予以尊重。",
    "本網站及相關網站所取得的個人資料，都僅供本網站於其內部、依照原來所說明的使用目的和範圍加以使用，除非事先說明、或依照相關法律規定，否則本網站不會將使用者個人資料提供給第三人、或移作其他目的使用。",
    "使用者個人資料有變更、或發現個人資料不正確的時候，可以隨時在本網站中要求更正，包括要求停止寄發相關訊息等。",
    "請妥善保密您的網路密碼及個人資料，不要將任何個人資料，尤其是網路密碼提供給任何人。在您使用完本網站所提供的各項服務功能後，務必記得登出帳戶，若您是與他人共享電腦或使用公共電腦，切記要關閉瀏覽器視窗。",
    "我們會記錄使用者上站之位址以及在相關網站內的瀏覽活動等資料，但是這些資料僅供作流量分析和網路行為調查，以便於改善本網站相關網站的服務品質，這些資料也只是總量上的分析，不會和特定個人相連繫。",
    "本網站相關網站或網頁都可能包含其他網站或網頁的連結，對於此等不屬於本網站之網站或網頁，不論關於其內容或隱私權政策，均與本網站無關。",
    "艾玩天地互動娛樂股份有限公司可能會使用 cookie 。 Cookies 是伺服端為了區別使用者的不同，經由瀏覽器寫入使用者硬碟的一些簡短資訊。只有原設置 cookie 的網站能讀取其內容。艾玩天地互動娛樂股份有限公司使用 cookies 大多基於輔助作用，例如儲存您偏好的特定種類資料，或儲存相關密碼以方便您上網至本公司網站時不必每次再輸入密碼。Cookie 並不含任何資料足使他人透過電話、電子郵件與您聯絡。您可在您的網站瀏覽器上設定功能以獲知何時 cookies 被記錄或避免 cookies 的設置。",
    "我們會將有權存取您個人資料之員工限於我們合理相信是為了向您提供產品或服務或為了完成工作而需要取得這些資料的員工。我們已採取符合法規要求的實體、電子和程序防護措施，以保護您個人資料的安全。",
    "本網站將可不時修訂本政策。當我們在個人資料的處理上有重大變更時，會將通知傳送到您指定的主要電子郵件地址，或在我們的網站上張貼告示。",
  ],
};

// $(".header .yyBtn").click(function (e) {
//   e.preventDefault();
//   $("html,body").animate(
//     {
//       // scrollTop: $(".kv_zone").offset().top + $(".kv_zone").outerHeight(),
//       scrollTop: $(".event_item_market").offset().top,
//     },
//     600,
//   );
// });

//點擊滾動到跑馬燈遊戲區塊
$(".header .yyBtn").click(function (e) {
  e.preventDefault();
  $("html,body").animate(
    {
      scrollTop: $(".event_item_market .content").offset().top - 35,
    },
    600,
  );
});
// 滾動到跑馬燈遊戲區塊nav背景轉黑
$(window).on("scroll", function () {
  var targetTop = $(".event_item_market").offset().top - 20;

  if ($(window).scrollTop() >= targetTop) {
    $(".nav").css("background-color", "rgba(0, 0, 0, 0.9)");
  } else {
    $(".nav").css("background-color", "");
  }
});
// ==========================================
// 2. 背景音樂 (BgMusic)
// ==========================================
var bgMusic = new BgMusic({
  src: "https://res1-nte.iwplay.com.tw/media/nte_gw_bgm_20250514.mp3",
  on: function () {
    $(".music").removeClass("off");
  },
  off: function () {
    $(".music").addClass("off");
  },
});
$(".music").on("click", function (e) {
  if ($(this).hasClass("off")) {
    $(this).removeClass("off");
    bgMusic.audio.play();
  } else {
    $(this).addClass("off");
    bgMusic.audio.pause();
  }
});

// ==========================================
// 3. 頁面導航與全域彈窗控制
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

// function switchPage(targetPage) {
//   console.log("[switchPage] 跳轉至:", targetPage);
//   const allPages = [".event_loading", ".event_item_market"];

//   if (allPages.indexOf(targetPage) === -1) {
//     console.warn("[switchPage] 無效的跳轉目標 (主目錄未包含該頁面):", targetPage);
//     return;
//   }

//   if (targetPage === ".event_loading") {
//     allPages.forEach(function (page) {
//       if (page !== targetPage) $(page).hide();
//     });
//     $(targetPage).show();
//     return;
//   }

//   allPages.forEach(function (page) {
//     if (page !== ".event_loading") $(page).hide();
//   });
//   $(".footer").removeClass("show");

//   var $loader = $(".event_loading");
//   if ($loader.length === 0) {
//     $(targetPage).fadeIn(300, function() {
//       $(".footer").addClass("show");
//     });
//   } else {
//     $loader.css("display", "block");
//     setTimeout(function () {
//       $loader.fadeOut(300, function () {
//         $(targetPage).fadeIn(300, function() {
//           $(".footer").addClass("show");
//         });
//       });
//     }, 800);
//   }
// }
// window.switchPage = switchPage;

// ==========================================
// 4. 主要邏輯 (頁面加載後執行)
// ==========================================
$(document).ready(function () {
  // 替換隱私政策文字
  if (typeof ViewObj !== "undefined") {
    $("label, p, div, span, a").each(function () {
      var text = $(this).text();
      if (text.indexOf("{privacy}") > -1) {
        $(this).text(text.replace("{privacy}", ViewObj.privacy));
      }
    });
    $("li, div, p").each(function () {
      var html = $(this).html();
      if (html.indexOf("{privacy_list}") > -1) {
        var privacyListContent = ViewObj.privacy_list;
        if (Array.isArray(privacyListContent)) {
          privacyListContent = privacyListContent.join("</li><li>");
        }
        $(this).html(html.replace("{privacy_list}", privacyListContent));
      }
    });
  }

  // 載入頁尾
  $(".footer").load("https://ids.iwplay.com.tw/includ/footer/12b_nte_new.html");

  // ------------------------------------------
  // A. 狀態與模擬邏輯 (demo.js)
  // ------------------------------------------
  var isAwardActive = true;
  var isUserLoggedIn = false;
  var lotteryCount = 1;
  var mapLotteryCount = 3;
  var loginSource = "default";

  $(document).on("click", ".btn-login", function () {
    loginSource = "nav";
  });
  $(document).on("click", ".yyBtn", function () {
    loginSource = "main";
  });
  $("#regressmodal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    if (button.length > 0) {
      if (button.hasClass("btn-login")) {
        loginSource = "nav";
      } else {
        loginSource = "main";
      }
    }
  });

  // 登入行為更新
  function updateLoginState(login) {
    isUserLoggedIn = login;
    var $loginArea = $(".task-user-info");
    var $btnLogin = $(".btn-login");
    var $btnLogout = $(".btn-logout");
    // var $yyBtn = $(".yyBtn");

    if (login) {
      $btnLogin.addClass("d-none");
      $loginArea.removeClass("d-none").css("display", "flex");
      $btnLogout.removeClass("d-none");
      // $yyBtn.addClass("active").removeAttr("data-toggle");
    } else {
      $btnLogin.removeClass("d-none").show();
      $loginArea.addClass("d-none").hide();
      // $yyBtn.removeClass("active").attr("data-toggle", "modal");
    }
  }
  window.setLoginState = function (login, awardActive) {
    if (typeof awardActive !== "undefined") {
      isAwardActive = awardActive;
    }
    updateLoginState(login);
  };

  // 登出行為
  $(".btn-logout").on("click", function () {
    updateLoginState(false);
    isAwardActive = false;
    if (window.mockLogout) {
      window.mockLogout();
    }
  });

  // 預約送出 (模擬成功)
  $(document).on("click", ".yySubmit", function () {
    $("#regressmodal").modal("hide");
    updateLoginState(true);
    isAwardActive = true;
    // setTimeout(function () {
    //   $("#successmodal").modal("show");
    // }, 300);
  });
  $(document).on("click", ".btn-login", function () {
    $("#bookedmodal").modal("show");
    // setTimeout(function () {
    //   $("#successmodal").modal("show");
    // }, 300);
  });

  // 商店彈窗觸發
  function openStoreModal(storeType) {
    var $storeModal = $("#popStore");
    var showCb = storeType === "cb";
    $storeModal.find(".cb").toggle(showCb);
    $storeModal.find(".ob").toggle(!showCb);
    openOnlyModal("#popStore");
  }

  $("#btn_go").on("click", function () {
    openOnlyModal("#bookedmodal");
  });
  // $("#btn_go_store").on("click", function () {
  //   openOnlyModal("#popStore");
  // });

  // 規則、獎勵與背包開啟
  $(".rule,.btn_open_rules").on("click", function () {
    openOnlyModal("#popRule");
  });
  $(".award").on("click", function () {
    openOnlyModal("#popAward_v1");
  });

  // 提交收件人資訊
  $(document).on("click", ".btn-send-data", function () {
    // $("#popMsg .popMsgCont p").addClass("state-submit-success");
    $("#popMsg .popMsgCont p").text("提交成功");
    openOnlyModal("#popMsg");
  });

  // ------------------------------------------
  // B. 道具網格與背包抽取 (card_demo.js)
  // ------------------------------------------
  var allItems = [
    {
      id: "item_01",
      name: "PS5 PRO遊戲主機",
      img: "./images/lottery/lottery_backpack_gift_item1.webp",
    },
    {
      id: "item_02",
      name: "謝謝參與",
      img: "./images/lottery/lottery_backpack_gift_item2.webp",
    },
    {
      id: "item_03",
      name: "異環-角色壓克力立牌(隨機)",
      img: "./images/lottery/lottery_backpack_gift_item3.webp",
    },
    {
      id: "item_04",
      name: "異環專屬卡-170點",
      img: "./images/lottery/lottery_backpack_gift_item4.webp",
    },
    {
      id: "item_05",
      name: "異環專屬卡-500點",
      img: "./images/lottery/lottery_backpack_gift_item5.webp",
    },
    {
      id: "item_06",
      name: "異環專屬卡-500點",
      img: "./images/lottery/lottery_backpack_gift_item6.webp",
    },
    {
      id: "item_07",
      name: "異環專屬卡-170點",
      img: "./images/lottery/lottery_backpack_gift_item7.webp",
    },
    {
      id: "item_08",
      name: "異環專屬卡-3290點",
      img: "./images/lottery/lottery_backpack_gift_item8.webp",
    },
    {
      id: "item_09",
      name: "異環專屬卡-170點",
      img: "./images/lottery/lottery_backpack_gift_item9.webp",
    },
    {
      id: "item_10",
      name: "謝謝參與",
      img: "./images/lottery/lottery_backpack_gift_item10.webp",
    },
  ];
  var obtainedItems = {};
  var confirmSlots = [];
  var drawnIndices = [];
  var isMarqueeRunning = false;

  // 定義每個獎品所屬的共用池與最大數量限制
  var itemPools = {
    item_01: { poolId: "pool_01", max: 1 },
    item_02: { poolId: "pool_02", max: 250000 },
    item_10: { poolId: "pool_02", max: 250000 }, // 與 02 共用
    item_03: { poolId: "pool_03", max: 20 },
    item_04: { poolId: "pool_04", max: 100 },
    item_07: { poolId: "pool_04", max: 100 }, // 與 04 共用
    item_09: { poolId: "pool_04", max: 100 }, // 與 04 共用
    item_05: { poolId: "pool_05", max: 3 },
    item_06: { poolId: "pool_05", max: 3 }, // 與 05 共用
    item_08: { poolId: "pool_08", max: 1 },
  };

  // 記錄各個共用池已抽取次數的進度
  var poolProgress = {
    pool_01: 0,
    pool_02: 0,
    pool_03: 0,
    pool_04: 0,
    pool_05: 0,
    pool_08: 0,
  };

  // 方便偵錯，掛載到 window，可在 F12 Console 直接輸入查詢
  window.poolProgress = poolProgress;
  window.itemPools = itemPools;
  window.drawnIndices = drawnIndices;

  // 初始化道具網格
  function initMainMarketGrid() {
    var $grid = $(".reward_grid");
    if (!$grid.length) return;
    $grid.empty();
    var items = [
      { img: "./images/lottery/lottery_gift_1.webp" },
      { img: "./images/lottery/lottery_gift_2.webp" },
      { img: "./images/lottery/lottery_gift_3.webp" },
      { img: "./images/lottery/lottery_gift_4.webp" },
      { img: "./images/lottery/lottery_gift_5.webp" },
      null,
      { img: "./images/lottery/lottery_gift_6.webp" },
      { img: "./images/lottery/lottery_gift_7.webp" },
      { img: "./images/lottery/lottery_gift_8.webp" },
      { img: "./images/lottery/lottery_gift_9.webp" },
      { img: "./images/lottery/lottery_gift_10.webp" },
    ];

    items.forEach(function (item) {
      if (item === null) {
        $grid.append(
          '<div class="reward_draw_center">' +
            '<div class="btn_draw_wrap">' +
            '<div class="dot"></div>' +
            '<button class="btn_draw_item" type="button"></button>' +
            "</div>" +
            '<div class="draw_remain">剩餘抽取次數：<span class="item_market_count">X</span></div>' +
            "</div>",
        );
      } else {
        $grid.append(
          '<div class="reward_item">' +
            '<div class="reward_item_icon" style="background-image: url(' +
            item.img +
            ');"></div>' +
            "</div>",
        );
      }
    });
  }

  function addItemToBag(item) {
    var name = item.name;
    if (obtainedItems[name] === undefined) {
      obtainedItems[name] = 0;
    }
    obtainedItems[name]++;
  }

  function countInSlotsByName(name) {
    var count = 0;
    for (var i = 0; i < confirmSlots.length; i++) {
      if (confirmSlots[i] === name) count++;
    }
    return count;
  }

  function renderObtainedGrid() {
    var $grid = $("#bagObtainedGrid");
    if (!$grid.length) return;
    $grid.empty();

    var uniqueItems = [];
    var names = [];
    allItems.forEach(function (baseItem) {
      if (names.indexOf(baseItem.name) === -1) {
        names.push(baseItem.name);
        uniqueItems.push(baseItem);
      }
    });

    uniqueItems.forEach(function (item) {
      var name = item.name;
      var qty = obtainedItems[name];

      if (!qty) return;

      var usedCount = countInSlotsByName(name);
      var remaining = qty - usedCount;
      var isAllUsed = remaining <= 0;

      $grid.append(
        '<div class="bag_item' +
          (isAllUsed ? " selected" : "") +
          '" data-name="' +
          name +
          '">' +
          (remaining > 1
            ? '<div class="bag_qty">×' + remaining + "</div>"
            : "") +
          '<div class="bag_item_icon" style="background-image: url(' +
          item.img +
          ');"></div>' +
          "</div>",
      );
    });
  }

  function renderConfirmGrid() {
    var $grid = $("#bagConfirmGrid");
    if (!$grid.length) return;
    $grid.empty();
    for (var i = 0; i < 6; i++) {
      if (i < confirmSlots.length) {
        var name = confirmSlots[i];
        var item = allItems.find(function (it) {
          return it.name === name;
        });
        $grid.append(
          '<div class="bag_slot filled" data-index="' +
            i +
            '" data-name="' +
            name +
            '">' +
            '<div class="bag_remove_btn">×</div>' +
            '<div class="bag_item_icon" style="background-image: url(' +
            item.img +
            ');"></div>' +
            "</div>",
        );
      } else {
        $grid.append('<div class="bag_slot empty"><span></span></div>');
      }
    }
  }

  $(document).on("click", ".bag_item:not(.selected)", function () {
    var name = $(this).data("name");
    if (confirmSlots.length >= 6) {
      $("#popMsg .popMsgCont p").addClass("state-bag-limit").text("");
      openOnlyModal("#popMsg");
      return;
    }
    var remaining = obtainedItems[name] - countInSlotsByName(name);
    if (remaining <= 0) return;
    confirmSlots.push(name);
    renderObtainedGrid();
    renderConfirmGrid();
  });

  $(document).on("click", ".bag_slot.filled", function () {
    var idx = $(this).data("index");
    confirmSlots.splice(idx, 1);
    renderObtainedGrid();
    renderConfirmGrid();
  });

  // 小瑪莉跑燈
  function getClockwiseOrder() {
    return [0, 1, 2, 3, 5, 9, 8, 7, 6, 4];
  }

  function runMarqueeAnimation(targetIndex, onComplete) {
    if (isMarqueeRunning) return;
    isMarqueeRunning = true;

    var $items = $(".reward_grid .reward_item");
    var order = getClockwiseOrder();
    var totalItems = order.length;
    var targetPosInOrder = order.indexOf(targetIndex);
    if (targetPosInOrder === -1) {
      targetPosInOrder = Math.floor(Math.random() * totalItems);
    }

    var totalLoops = 2;
    var totalSteps = totalLoops * totalItems + targetPosInOrder + 1;
    var step = 0;

    function getDelay(currentStep, maxSteps) {
      var progress = currentStep / maxSteps;
      if (progress < 0.6) {
        return 60;
      } else {
        var slowProgress = (progress - 0.6) / 0.4;
        return 60 + slowProgress * slowProgress * 190;
      }
    }

    function lightUp() {
      $items.removeClass("marquee-active");
      if (step >= totalSteps) {
        isMarqueeRunning = false;
        if (onComplete) onComplete();
        return;
      }
      var currentIndex = order[step % totalItems];
      $items.eq(currentIndex).addClass("marquee-active");
      step++;
      var delay = getDelay(step, totalSteps);
      setTimeout(lightUp, delay);
    }
    lightUp();
  }

  // 點擊抽取道具
  $(document).on("click", ".btn_draw_item", function () {
    if (isMarqueeRunning) return;

    var order = getClockwiseOrder();
    var availableIndices = order.filter(function (idx) {
      return drawnIndices.indexOf(idx) === -1;
    });

    if (availableIndices.length === 0) {
      alert("所有獎勵都已抽取完畢！");
      return;
    }

    var winnerIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    runMarqueeAnimation(winnerIndex, function () {
      var randomItem = allItems[winnerIndex % allItems.length];
      addItemToBag(randomItem);

      // 更新對應池的抽取次數
      var itemId = randomItem.id;
      var poolConf = itemPools[itemId];
      if (poolConf) {
        poolProgress[poolConf.poolId]++;
        // 測試用
        console.log(
          "【抽獎記錄】抽中項目：" +
            itemId +
            " (" +
            randomItem.name +
            ") | 該池：" +
            poolConf.poolId +
            " 進度：" +
            poolProgress[poolConf.poolId] +
            " / " +
            poolConf.max,
        );

        // 檢查該池是否已抽完
        if (poolProgress[poolConf.poolId] >= poolConf.max) {
          // 測試用
          console.log("【抽獎記錄】池 " + poolConf.poolId + " 已完全抽完！");
          // 找出屬於該池的所有 item，並將其在網格中的 index 加入 drawnIndices，並切換雪碧圖到底部
          allItems.forEach(function (itm, idx) {
            if (
              itemPools[itm.id] &&
              itemPools[itm.id].poolId === poolConf.poolId
            ) {
              if (drawnIndices.indexOf(idx) === -1) {
                drawnIndices.push(idx);
                var $itmEl = $(".reward_grid .reward_item").eq(idx);
                $itmEl.addClass("is-drawn");
                $itmEl
                  .find(".reward_item_icon")
                  .css("background-position", "bottom");
              }
            }
          });
        }
      }

      var $pop = $("#popGetAward");
      $pop
        .find(".pop-award-item")
        .css("background-image", "url(" + randomItem.img + ")");
      $pop.find(".popAwardCont p").text(randomItem.name);
      $pop.modal("show");
    });
  });

  $(document).on("click", ".btn-awardBag", function () {
    $("#popGetAward").modal("hide");
    renderObtainedGrid();
    renderConfirmGrid();
    $("#popAward_v1").modal("show");
  });

  $(document).on("click", ".btn_confirm_receive", function () {
    $("#bookedmodal").modal("show");
  });

  // SDK預約成功
  // $(document).on("click", ".booked_button", function () {
  //   $("#popMsg .popMsgCont p")
  //     .removeClass("state-submit-success")
  //     .addClass("state-receive2");
  //   $("#popMsg .popBtns").addClass("popBtns_receive2").removeClass("popBtns");
  //   $("#popMsg .popBtns_receive2 button")
  //     .addClass("btn_popup_linkaccount")
  //     .removeClass("btn-msg-confirm");
  //   $("#popMsg .popBtns_receive2").show();
  //   $("#popMsg").modal("show");
  // });

  $(document).on("click", ".btn_popup_linkaccount", function () {
    $("#popMsg").modal("hide");
    updateLoginState(true);
    isAwardActive = true;
  });

  $(document).on("click", ".btn_open_bag", function () {
    renderObtainedGrid();
    renderConfirmGrid();
    $("#popAward_v1").modal("show");
  });

  // ------------------------------------------
  // C. 初始化調用
  // ------------------------------------------
  initMainMarketGrid();

  // --- Hamburger Menu Toggle with Animation ---
  // scroll-lock：開選單時記住位置，關閉時還原，避免頁面跳回頂部
  var _menuScrollY = 0;
  function lockScroll() {
    _menuScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = "-" + _menuScrollY + "px";
    $("body").addClass("no-scroll");
  }
  function unlockScroll() {
    $("body").removeClass("no-scroll");
    document.body.style.top = "";
    window.scrollTo(0, _menuScrollY);
  }

  $(".menu_toggle").on("click", function () {
    var $nav = $(".nav");
    if ($nav.hasClass("menu-open")) {
      // Closing
      $nav.addClass("menu-closing").removeClass("menu-open");
      unlockScroll();
      // Wait for animation to finish then remove closing class
      setTimeout(function () {
        $nav.removeClass("menu-closing");
      }, 300); // 300ms matches CSS animation duration
    } else {
      // Opening
      $nav.addClass("menu-open");
      lockScroll();
    }
  });

  // Close menu when clicking items in the menu (except login container itself, logic handles internal buttons, and .music toggle)
  $(
    ".nav .topRight > button:not(.music), .nav .topRight .login .btn-login, .nav .topRight .login .btn-logout",
  ).on("click", function () {
    if ($(".nav").hasClass("menu-open")) {
      $(".nav").addClass("menu-closing").removeClass("menu-open");
      unlockScroll();
      setTimeout(function () {
        $(".nav").removeClass("menu-closing");
      }, 300);
    }
  });

  // Close menu when clicking outside (optional but good UX)
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest(".menu_toggle").length &&
      !$(e.target).closest(".topRight").length
    ) {
      if ($(".nav").hasClass("menu-open")) {
        $(".nav").addClass("menu-closing").removeClass("menu-open");
        unlockScroll();
        setTimeout(function () {
          $(".nav").removeClass("menu-closing");
        }, 300);
      }
    }
  });

  // --- popAward_v1 狀態切換與複製按鈕監聽 ---
  $(document).on("click", "#toggleAwardState_v1", function () {
    $(
      "#popAward_v1 .popAwardPlatform_v1.yy, #popAward_v1 .popAwardPlatform_tit_v1.yy",
    ).toggle();
    $(
      "#popAward_v1 .popAwardPlatform_v1.dl, #popAward_v1 .popAwardPlatform_tit_v1.dl",
    ).toggle();
    var isDl = $("#popAward_v1 .popAwardPlatform_v1.dl").is(":visible");
    $(this).text(isDl ? "切換至 yy 狀態" : "切換至 dl 狀態");
  });

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
        // alert("複製成功：" + serialText);
      })
      .catch(function (err) {
        // 降級複製方案
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(serialText).select();
        document.execCommand("copy");
        $temp.remove();
        // alert("複製成功：" + serialText);
      });
  });

  $(document).on("click", "#popAward_v1 .serial-get-btn", function () {
    openOnlyModal("#popLotteryGet");
  });

});
