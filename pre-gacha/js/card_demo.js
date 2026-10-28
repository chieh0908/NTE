/**
 * card_demo.js
 * 市民卡定製功能 — 本地 Demo 模組
 * 涵蓋：Canvas 下載、重置卡片、社群分享
 */

$(function () {
  // ---------------------------------------------------------------
  // 工具：載入圖片 Promise
  // ---------------------------------------------------------------
  function loadImageAsync(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // ---------------------------------------------------------------
  // 初始化：首頁道具集市網格
  // ---------------------------------------------------------------
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
      null, // 中間格 (span 2)
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
            // '<img src="' + item.img + '" alt="">' +
            '<div class="reward_item_icon" style="background-image: url(' +
            item.img +
            ');"></div>' +
            // '<span>' + item.qty + '</span>' +
            "</div>",
        );
      }
    });
  }

  // ---------------------------------------------------------------
  // 道具背包系統
  // ---------------------------------------------------------------
  var allItems = [
    {
      id: "item_01",
      name: "捏造骰子X1",
      img: "./images/lottery/lottery_backpack_gift_item1.webp",
    },
    {
      id: "item_02",
      name: "方斯X3000",
      img: "./images/lottery/lottery_backpack_gift_item2.webp",
    },
    {
      id: "item_03",
      name: "無彩染劑X3",
      img: "./images/lottery/lottery_backpack_gift_item3.webp",
    },
    {
      id: "item_04",
      name: "甲硬幣X6000",
      img: "./images/lottery/lottery_backpack_gift_item4.webp",
    },
    {
      id: "item_05",
      name: "甲硬幣X6000",
      img: "./images/lottery/lottery_backpack_gift_item10.webp",
    },
    {
      id: "item_06",
      name: "資深獵人攻略X3",
      img: "./images/lottery/lottery_backpack_gift_item5.webp",
    },
    {
      id: "item_07",
      name: "無彩染劑X3",
      img: "./images/lottery/lottery_backpack_gift_item9.webp",
    },
    {
      id: "item_08",
      name: "資深獵人攻略X3",
      img: "./images/lottery/lottery_backpack_gift_item8.webp",
    },
    {
      id: "item_09",
      name: "A級弧盤-被遺忘者X1",
      img: "./images/lottery/lottery_backpack_gift_item7.webp",
    },
    {
      id: "item_10",
      name: "方斯X3000",
      img: "./images/lottery/lottery_backpack_gift_item2.webp",
    },
  ];
  var obtainedItems = {}; // 移除固定初始值，初始化為空物件
  var confirmSlots = [];
  var drawnIndices = []; // 追蹤 reward_item 已經被抽中的索引

  function addItemToBag(item) {
    var name = item.name;
    if (obtainedItems[name] === undefined) {
      obtainedItems[name] = 0;
    }
    obtainedItems[name]++;
  }
  // 計算某名稱的道具已被選到右側幾個
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

    // 按名稱去重，以便按名稱顯示
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

      if (!qty) return; // 沒拿到就不顯示

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

  // 左側點擊：加入右側（檢查剩餘數量）
  $(document).on("click", ".bag_item:not(.selected)", function () {
    var name = $(this).data("name");
    if (confirmSlots.length >= 6) {
      $("#popMsg .popMsgCont p").addClass("state-bag-limit").text("");
      // $("#popMsg .popBtns").show();
      $("#popMsg").modal("show");
      return;
    }
    // 檢查是否還有剩餘
    var remaining = obtainedItems[name] - countInSlotsByName(name);
    if (remaining <= 0) return;
    confirmSlots.push(name);
    renderObtainedGrid();
    renderConfirmGrid();
  });

  // 右側點擊：移除該道具
  $(document).on("click", ".bag_slot.filled", function () {
    var idx = $(this).data("index");
    confirmSlots.splice(idx, 1);
    renderObtainedGrid();
    renderConfirmGrid();
  });

  // ---------------------------------------------------------------
  // 抽取邏輯
  // ---------------------------------------------------------------
  function performLottery(onResultReady) {
    // 模擬動畫
    setTimeout(function () {
      onResultReady();
      $("#popYyLottery").modal("show");
    }, 1000);
  }

  // ---------------------------------------------------------------
  // 小瑪莉跑燈動畫
  // ---------------------------------------------------------------
  var isMarqueeRunning = false;

  /**
   * 取得 reward_item 順時針繞圈的順序索引
   * Grid layout (4 cols × 3 rows):
   *   [0] [1] [2] [3]        ← reward_item 0~3
   *   [4] [CENTER ] [5]      ← reward_item 4, center(span2), reward_item 5
   *   [6] [7] [8] [9]        ← reward_item 6~9
   * 順時針: 0→1→2→3→5→9→8→7→6→4→(repeat)
   */
  function getClockwiseOrder() {
    return [0, 1, 2, 3, 5, 9, 8, 7, 6, 4];
  }

  function runMarqueeAnimation(targetIndex, onComplete) {
    if (isMarqueeRunning) return;
    isMarqueeRunning = true;

    var $items = $(".reward_grid .reward_item");
    var order = getClockwiseOrder();
    var totalItems = order.length; // 10

    // 找出 targetIndex 在 order 陣列中的位置
    var targetPosInOrder = order.indexOf(targetIndex);
    if (targetPosInOrder === -1) {
      targetPosInOrder = Math.floor(Math.random() * totalItems);
    }

    // 跑燈設定：跑滿 2 圈再到目標位置
    var totalLoops = 2;
    var totalSteps = totalLoops * totalItems + targetPosInOrder + 1;
    var step = 0;

    // 速度控制：先快後慢（easeOut 效果）
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
      // 清除所有高亮
      $items.removeClass("marquee-active");

      if (step >= totalSteps) {
        // 跑完 3 圈，清除所有亮燈並彈出結果
        isMarqueeRunning = false;
        if (onComplete) onComplete();
        return;
      }

      // 當前高亮哪一格
      var currentIndex = order[step % totalItems];
      $items.eq(currentIndex).addClass("marquee-active");

      step++;
      var delay = getDelay(step, totalSteps);
      setTimeout(lightUp, delay);
    }

    lightUp();
  }

  // 抽取道具
  $(document).on("click", ".btn_draw_item", function () {
    if (isMarqueeRunning) return; // 防止重複點擊

    var order = getClockwiseOrder();
    // 過濾掉已經抽中的索引
    var availableIndices = order.filter(function (idx) {
      return drawnIndices.indexOf(idx) === -1;
    });

    if (availableIndices.length === 0) {
      // 這裡可以視需求改成彈窗提示
      alert("所有獎勵都已抽取完畢！");
      return;
    }

    // 隨機選一個還沒抽中的索引
    var winnerIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    runMarqueeAnimation(winnerIndex, function () {
      // 標記為已抽中
      drawnIndices.push(winnerIndex);
      var $winner = $(".reward_grid .reward_item").eq(winnerIndex);
      $winner.addClass("is-drawn");
      $winner.find(".reward_item_icon").css("background-position", "bottom");

      // 模擬隨機抽到一個道具並加入背包 (這裡維持原本對應 allItems 的邏輯，或者可以根據 winnerIndex 對應獎勵)
      var randomItem = allItems[winnerIndex % allItems.length];
      addItemToBag(randomItem);

      // 動態更新獲獎彈窗內容
      var $pop = $("#popGetAward");
      $pop
        .find(".pop-award-item")
        .css("background-image", "url(" + randomItem.img + ")");
      $pop.find(".popAwardCont p").text(randomItem.name);

      $pop.modal("show");
    });
  });

  // 道具背包
  $(document).on("click", ".btn-awardBag", function () {
    $("#popGetAward").modal("hide");
    renderObtainedGrid();
    renderConfirmGrid();
    $("#popItemBag").modal("show");
  });

  // 幸運抽獎
  $(document).on("click", ".btn_open_lucky", function () {
    $("#popLuckyDraw").modal("show");
  });
  $(document).on("click", ".btn_confirm_receive", function () {
    $("#bookedmodal").modal("show");
  });

  $(document).on("click", ".booked_button", function () {
    $("#popMsg .popMsgCont p")
      .removeClass("state-submit-success")
      .addClass("state-receive2");
    $("#popMsg .popBtns").addClass("popBtns_receive2").removeClass("popBtns");
    $("#popMsg .popBtns_receive2 button")
      .addClass("btn_popup_linkaccount")
      .removeClass("btn-msg-confirm");
    $("#popMsg .popBtns_receive2").show();
    $("#popMsg").modal("show");
  });

  $(document).on("click", ".btn_click_draw", function () {
    $("#popLuckyDraw").modal("hide");
    performLottery(function () {
      // var isWin = Math.random() < 0.6;
      var isWin = true;
      if (isWin) {
        var randomIndex = Math.floor(Math.random() * allItems.length);
        var randomItem = allItems[randomIndex];

        if (!randomItem || !randomItem.id) {
          console.error("抽獎異常", randomItem);
          return;
        }

        addItemToBag(randomItem);
        renderObtainedGrid();

        $("#popYyLottery .popLotteryLosing").hide();
        $("#popYyLottery .popLotteryWinning").show();
        $("#popYyLottery .prizeName").text(randomItem.name);
      } else {
        $("#popYyLottery .popLotteryWinning").hide();
        $("#popYyLottery .popLotteryLosing").show();
      }
    });
  });

  // 抽獎彈窗內的按鈕：點擊後關閉目前彈窗，並跳轉至道具背包彈窗
  $(document).on("click", ".btn-LotteryGet", function () {
    $("#popYyLottery").modal("hide");

    // 等待 Bootstrap 彈窗關閉動畫完成後，再開啟背包彈窗
    setTimeout(function () {
      renderObtainedGrid();
      renderConfirmGrid();
      // $('#popItemBag').modal('show');
    }, 400);
  });

  $(document).on("click", ".btn_my_prizes", function () {
    $("#popLuckyDraw").modal("hide");
    $("#popAward").modal("show");
  });

  // ---------------------------------------------------------------
  // 道具背包&幸運抽獎底部按鈕彈窗
  // ---------------------------------------------------------------
  $(document).on("click", ".btn_open_bag", function () {
    renderObtainedGrid();
    renderConfirmGrid();
    $("#popItemBag").modal("show");
  });

  // $(document).on('click', '.btn_open_lucky', function () {
  //   console.log('Lucky Draw button clicked');
  //   $('#popLuckyDraw').modal('show');
  // });

  // ---------------------------------------------------------------
  // 卡片下載與重置
  // ---------------------------------------------------------------
  function downloadCard() {
    // 優先抓取 viewCardModal 裡的卡片
    var $modal = $("#viewCardModal");

    // 擷取前先確保 #viewCardModal 的內容是根據最新的緩存來渲染的
    var saved = localStorage.getItem("nte_card_state");
    if (saved && typeof CARD_DATA !== "undefined") {
      var state = JSON.parse(saved);
      var chara = CARD_DATA.characters.find((c) => c.id === state.charaId);
      var bg = CARD_DATA.backgrounds.find((b) => b.id === state.bgId);
      if (chara) {
        $modal
          .find("#viewcard_mockup_chara")
          .attr("src", `./images/card/share_card/${chara.img_id}.webp`);
      }
      if (bg) {
        $modal
          .find("#viewcard_mockup_bg")
          .attr(
            "src",
            `./images/card/share_card/card_bg${String(bg.id).padStart(2, "0")}.webp`,
          );
        $modal.find(".viewcard_preview_loc").text(`取景地：${bg.name}`);
      }
      $modal.find(".viewcard_preview_job").text(state.jobText);
      $modal.find(".viewcard_preview_date").text(state.uid || "2026.03.26");
      $modal.find(".viewcard_uid_number").text(state.uid || "0000001");
    }

    var $card = $modal.find(".card_mockup");

    if ($card.length === 0) return alert("找不到卡片元素");

    // 因為 viewCardModal 可能處於隱藏狀態，html2canvas 無法截取 display: none 的元素。
    // 暫時將其顯示至畫面外以便截圖
    var wasHidden = !$modal.is(":visible");
    var originalStyle = "";
    if (wasHidden) {
      originalStyle = $modal.attr("style") || "";
      $modal.css({
        display: "block",
        visibility: "hidden",
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
      });
    }

    var targetWidth = 1593;
    var superScale = 2;
    var currentWidth = $card[0].offsetWidth || targetWidth; // 防呆
    var captureScale = (targetWidth / currentWidth) * superScale;

    html2canvas($card[0], {
      scale: captureScale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      onclone: function (clonedDoc) {
        $(clonedDoc).find(".card_mockup").css("image-rendering", "auto");
      },
    })
      .then(function (canvas) {
        if (wasHidden) {
          $modal.attr("style", originalStyle); // 恢復原本隱藏樣式
        }
        var link = document.createElement("a");
        link.download = "citizen_card.png";
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      })
      .catch(function (err) {
        if (wasHidden) {
          $modal.attr("style", originalStyle);
        }
        console.error(err);
        alert("截圖失敗");
      });
  }

  function resetCard() {
    if (typeof selectCharacter === "function") {
      selectCharacter("zero_b");
      selectBackground("01");
      $('.item.chara[data-id="zero_b"]')
        .addClass("active")
        .siblings()
        .removeClass("active");
      $('.item.background[data-id="01"]')
        .addClass("active")
        .siblings()
        .removeClass("active");
    }
    localStorage.removeItem("nte_card_state");
    localStorage.removeItem("nte_card_is_saved");
  }

  $(document).on("click", ".btn_popup_share_save", function () {
    downloadCard();
  });
  $(document).on("click", ".btn_download_card", function () {
    downloadCard();
  }); // 保留原有的綁定以防萬一
  $(document).on("click", ".btn_reset_card, .reset_card", function () {
    resetCard();
    $(".modal").modal("hide");
    if (typeof switchPage === "function") {
      switchPage(".event_city_card_custom");
    }
  });
  $(document).on("click", ".btn_fb", function () {
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(window.location.href),
      "_blank",
    );
  });
  $(document).on("click", ".btn_line", function () {
    window.open(
      "https://social-plugins.line.me/lineit/share?url=" +
        encodeURIComponent(window.location.href) +
        "&openExternalBrowser=1",
      "_blank",
    );
  });

  // 初始化
  initMainMarketGrid();
});
