/**
 * 市民卡製作核心邏輯
 * 包含角色資料、背景資料、Swiper 動態渲染以及圖層切換
 */

const CARD_DATA = {
    // 角色資料 (共 18 位)
    characters: [
        { id: "zero_b", name: "男主角", img_id: "card_zero_b", list_img: "./images/card/profile_esperzero_male.webp", jobs: ["看破奇點的鑑定師", "無證上崗的異象獵人", "(未來可能的) 海特洛首富", "白尾樹盤山公路最速傳說"] },
        { id: "zero_g", name: "女主角", img_id: "card_zero_g", list_img: "./images/card/profile_esperzero_female.webp", jobs: ["看破奇點的鑑定師", "無證上崗的異象獵人", "(未來可能的) 海特洛首富", "白尾樹盤山公路最速傳說"] },
        { id: "mint", name: "薄荷", img_id: "card_mint", list_img: "./images/card/profile_mint.webp", jobs: ["異象管理員收容二組骨幹", "古海特洛掌管補考的神", "被異象騙最多次獎得主", "碎雪冰淇淋黑金會員"] },
        { id: "nanally", name: "娜娜莉", img_id: "card_nanally", list_img: "./images/card/profile_nanally.webp", jobs: ["柯林斯家族一代目", "伊波恩古董店一號台柱", "橋間地的轟雷之虎", "貝斯界的希望之星"] },
        { id: "baicang", name: "白藏", img_id: "card_baicang", list_img: "./images/card/profile_baicang.webp", jobs: ["異象管理員 E.T.D 四隊隊長", "家師級摸魚達人", "反內卷協會會長", "E.T.D 最惡趣味員工榜7連冠"] },
        { id: "jiuyuan", name: "九原", img_id: "card_jiuyuan", list_img: "./images/card/profile_jiuyuan.webp", jobs: ["斯特利速遞代理店長", "玫瑰收藏家", "代號：夜鶯", "更多資訊恕不透露"] },
        { id: "daffodill", name: "達芙蒂爾", img_id: "card_daffodill", list_img: "./images/card/profile_daffodill.webp", jobs: ["澤的專職保鏢", "伊波恩古董店普通員工", "一介刀客", "眼罩收藏家"] },
        { id: "sakiri", name: "早霧", img_id: "card_sakiri", list_img: "./images/card/profile_sakiri.webp", jobs: ["絕不好惹的伊波恩一霸", "鬼郎丸的主人", "柯林斯家族二老闆", "塔吉多的天敵"] },
        { id: "edgar", name: "埃德加", img_id: "card_edgar", list_img: "./images/card/profile_edgar.webp", jobs: ["伊波恩的異象偵探", "自走型人形圖書館", "獵人幫最具潛力新星選手", "塔吉多的好搭檔"] },
        { id: "adler", name: "阿德勒", img_id: "card_adler", list_img: "./images/card/profile_adler.webp", jobs: ["伊波恩古董店管家", "蛋卷及小羊排主理人", "歧骸友好家", "高級茶道導師"] },
        { id: "fadia", name: "法蒂雅", img_id: "card_fadia", list_img: "./images/card/profile_fadia.webp", jobs: ["異象管理員 E.T.D 四隊隊員", "危險又迷人的正派角色", "格赫羅斯島的特赦犯人", "已死的利爾尼亞家千金"] },
        { id: "lacrimosa", name: "安魂曲", img_id: "card_lacrimosa", list_img: "./images/card/profile_lacrimosa.webp", jobs: ["異象管理員 E.T.D 四隊隊員", "打字......好累......", "安魂曲......想睡覺......", "晚安......"] },
        { id: "skia", name: "霧", img_id: "card_skia", list_img: "./images/card/profile_skia.webp", jobs: ["異象管理員 E.T.D 四隊副隊長", "市公職人員（安全、防務類）", "（前）企業中層主管", "（前）自由職業者"] },
        { id: "hathor", name: "哈索爾", img_id: "card_hathor", list_img: "./images/card/profile_hathor.webp", jobs: ["斯特利速遞精英快遞員", "海特洛市 S 級摩托車手", "斯特利單日派送記錄保持者", "剛剛入坑的二次元新人"] },
        { id: "haniel", name: "哈尼婭", img_id: "card_haniel", list_img: "./images/card/profile_haniel.webp", jobs: ["斯特利速遞快遞員", "貓頭音！！！！樂隊吉他手", "唄果同人區百大唄主", "超異科王牌一號"] },
        { id: "chiz", name: "小吱", img_id: "card_chiz", list_img: "./images/card/profile_chiz.webp", jobs: ["粉爪銀行大堂經理", "隨叫隨到的理財規劃師", "便利店飯糰代言人", "繃帶鑑賞大師"] },
        { id: "hotori", name: "澤", img_id: "card_hotori", list_img: "./images/card/profile_hotori.webp", jobs: ["伊波恩古董店店長", "時間的魔女", "異象藏品買買買領域大神", "今朝有酒今朝醉"] },
        { id: "kurage", name: "海月", img_id: "card_kurage", list_img: "./images/card/profile_kurage.webp", jobs: ["貓頭音！！！！頭號粉絲", "商店街特聘管理員", "水母獨家駕駛員", "海特洛市民"] }
    ],
    // 背景資料 (共 11 組)
    backgrounds: [
        { id: "01", name: "伊波恩古董店", img: "./images/card/card_mockup/card_bg01.webp" },
        { id: "02", name: "異象管理局", img: "./images/card/card_mockup/card_bg02.webp" },
        { id: "03", name: "斯特利快遞", img: "./images/card/card_mockup/card_bg03.webp" },
        { id: "04", name: "粉玉", img: "./images/card/card_mockup/card_bg04.webp" },
        { id: "05", name: "湛望角站", img: "./images/card/card_mockup/card_bg05.webp" },
        { id: "06", name: "落雨亭", img: "./images/card/card_mockup/card_bg06.webp" },
        { id: "07", name: "新赫蘭德中心", img: "./images/card/card_mockup/card_bg07.webp" },
        { id: "08", name: "上晴塔", img: "./images/card/card_mockup/card_bg08.webp" },
        { id: "09", name: "願木坡", img: "./images/card/card_mockup/card_bg09.webp" },
        { id: "10", name: "雷加利亞 LAVELOX", img: "./images/card/card_mockup/card_bg10.webp" },
        { id: "11", name: "幽靈號車站", img: "./images/card/card_mockup/card_bg11.webp" },
    ]
};

// 當前選擇狀態
let currentCardState = {
    charaId: "zero_b",
    bgId: "01",
    jobText: "鑑定師",
    uid: "0000001"
};

// 全域 Swiper 實例
let charaSwiper, bgSwiper;

$(function() {
    // 1. 初始化
    initCardSwipers();
    
    // 2. 監聽分頁切換
    $(document).on("click", ".event_city_card_custom .tab", function () {
        const targetTab = $(this).data("tab");
        $(this).addClass("active").siblings().removeClass("active");
        
        $(".tab_pane").removeClass("active");
        $(".tab_content_" + targetTab + "_list").addClass("active");

        // 更新 Swiper 狀態
        if (targetTab === 'chara' && charaSwiper) charaSwiper.update();
        if (targetTab === 'background' && bgSwiper) bgSwiper.update();

        // 職業分頁隱藏按鈕
        const $arrows = $(this).closest(".select_content_area").find(".slider_arrow");
        if (targetTab === "job") {
            $arrows.hide();
        } else {
            $arrows.show();
        }
    });

    // 3. 監聽點擊
    $(document).on("click", ".tab_content_chara_list .item.chara", function() {
        selectCharacter($(this).attr("data-id"));
        $(this).addClass("active").siblings().removeClass("active");
    });

    $(document).on("click", ".tab_content_background_list .item.background", function() {
        selectBackground($(this).attr("data-id"));
        $(this).addClass("active").siblings().removeClass("active");
    });

    // 開啟職業彈窗
    $(document).on("click", ".btn_modify_job, .current_job_text", function() {
        $("#jobSelectionModal").modal("show");
    });

    // Bootstrap modal 顯示前動態填入職業選項（確保 DOM 已準備好）
    $("#jobSelectionModal").on("show.bs.modal", function() {
        renderJobModal();
    });

    // 彈窗內職業選取
    $(document).on("click", ".job_opt_item", function() {
        $(".job_opt_item").removeClass("active");
        $(this).addClass("active");
    });

    // 彈窗確認：無論選哪個都清空再寫入
    $(document).on("click", ".btn_confirm_job", function() {
        const selectedJob = $(".job_opt_item.active").first().text();
        if (selectedJob) {
            selectJob(selectedJob);
        }
        $("#jobSelectionModal").modal("hide");
    });


    $(document).on("click", "#popMsg .btn-msg-confirm, #popMsg .btn_popup_linkaccount", function () {
      $("#popMsg").modal("hide");
      $("#popMsg .popMsgCont p").removeClass("state-receive state-receive2 state-submit-success state-bag-limit").text("");
      $("#popMsg .popBtns_receive2").addClass("popBtns").removeClass("popBtns_receive2").hide();
      $("#popMsg .popBtns button").addClass("btn-msg-confirm").removeClass("btn_popup_linkaccount");
    });

    $(".btn_random").on("click", function() {
        randomizeCard();
    });

    // 完成定製
    $(".btn_complete").on("click", function() {
        completeCard();
    });

    // 保存按鈕 → 儲存至 localStorage
    $(document).on("click", ".btn_download_card, .btn_popup_card_save", function() {
        localStorage.setItem("nte_card_is_saved", "true");
        saveCardState();
    });

    // 分享按鈕 → 開啟查看市民卡彈窗
    $(document).on("click", ".btn_share_card", function() {
        openViewCardModal();
    });

    // 載入初始狀態
    loadCardState();

    // 4. 卡片縮放監聽
    updateCardScale();
    $(window).on("resize", updateCardScale);
});

function initCardSwipers() {
    const $charaWrapper = $(".tab_content_chara_list .swiper-wrapper");
    const $bgWrapper = $(".tab_content_background_list .swiper-wrapper");

    // 渲染資料
    if ($charaWrapper.length) {
        $charaWrapper.empty();
        CARD_DATA.characters.forEach((chara) => {
            $charaWrapper.append(`<div class="item chara swiper-slide chara_icon_${chara.id}" data-id="${chara.id}"></div>`);
        });
    }

    if ($bgWrapper.length) {
        $bgWrapper.empty();
        CARD_DATA.backgrounds.forEach((bg) => {
            $bgWrapper.append(`<div class="item background swiper-slide bg_icon_${bg.id}" data-id="${bg.id}"></div>`);
        });
    }

    const swiperOptions = {
        slidesPerView: 6,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: true,
        grabCursor: true,
        navigation: {
          nextEl: '.slider_container .arrow_right',
          prevEl: '.slider_container .arrow_left',
        },
        observer: true,
        observeParents: true
    };

    if ($('.tab_content_chara_list').length) {
        charaSwiper = new Swiper('.tab_content_chara_list', swiperOptions);
    }
    if ($('.tab_content_background_list').length) {
        bgSwiper = new Swiper('.tab_content_background_list', {
            ...swiperOptions,
            slidesPerView: 6,
            spaceBetween: 10
        });
    }
}

function selectCharacter(id) {
    const chara = CARD_DATA.characters.find(c => c.id === id);
    if (!chara) return;

    currentCardState.charaId = id;

    // 更新主卡片
    $("#mockup_chara").attr("src", `./images/card/card_mockup/${chara.img_id}.webp`);
    
    // 同步更新 viewCardModal 中的卡片
    $("#viewcard_mockup_chara").attr("src", `./images/card/share_card/${chara.img_id}.webp`);
    
    // 如果目前職業不屬於該角色，則重置為該角色的第一個職業
    if (!chara.jobs.includes(currentCardState.jobText)) {
        selectJob(chara.jobs[0]);
    } else {
        selectJob(currentCardState.jobText);
    }
    saveCardState();
}

function renderJobModal() {
    const chara = CARD_DATA.characters.find(c => c.id === currentCardState.charaId);
    if (!chara) return;

    const $optList = $(".job_opt_list");
    $optList.empty();
    
    chara.jobs.forEach(job => {
        const active = (currentCardState.jobText === job) ? "active" : "";
        $optList.append(`<div class="job_opt_item ${active}">${job}</div>`);
    });
}

function selectBackground(id) {
    const bg = CARD_DATA.backgrounds.find(b => b.id === id);
    if (!bg) return;

    currentCardState.bgId = id;

    // 更新主卡片
    $("#mockup_bg").attr("src", bg.img);
    
    // 同步更新 viewCardModal 中的卡片
    $("#viewcard_mockup_bg").attr("src", getShareCardBgPath(bg.id));
    
    // 更新取景地
    $(".preview_loc").text(bg.name);
    $(".viewcard_preview_loc").text(bg.name);
    
    saveCardState();
}

function selectJob(text) {
    currentCardState.jobText = text;
    
    // 更新主卡片職業
    $(".preview_job").text(text);
    $(".current_job_text p").text(text);
    
    // 同步更新 viewCardModal 中的職業
    $(".viewcard_preview_job").text(text);
    
    saveCardState();
}

function randomizeCard() {
    const randChara = CARD_DATA.characters[Math.floor(Math.random() * CARD_DATA.characters.length)];
    const randBg = CARD_DATA.backgrounds[Math.floor(Math.random() * CARD_DATA.backgrounds.length)];
    
    // 隨機選取角色與背景
    selectCharacter(randChara.id);
    selectBackground(randBg.id);
    
    // 隨機選取該角色的一個職業
    const randJob = randChara.jobs[Math.floor(Math.random() * randChara.jobs.length)];
    selectJob(randJob);

    // 同步 Swiper
    if (charaSwiper) {
        const slideIndex = CARD_DATA.characters.findIndex(c => c.id === randChara.id);
        charaSwiper.slideToLoop(slideIndex);
    }
    if (bgSwiper) {
        const slideIndex = CARD_DATA.backgrounds.findIndex(b => b.id === randBg.id);
        bgSwiper.slideToLoop(slideIndex);
    }
    
    // 同步 active 狀態（需先全清，因為 Swiper loop 模式會複製 slide）
    $(".item.chara").removeClass("active");
    $(`.item.chara[data-id="${randChara.id}"]`).addClass("active");

    $(".item.background").removeClass("active");
    $(`.item.background[data-id="${randBg.id}"]`).addClass("active");

}

/**
 * 完成定製：儲存狀態至 localStorage 並顯示成功彈窗
 */
function completeCard() {
    const $modal = $("#customSuccessModal");
    const $mainCard = $(".card_preview_area .card_mockup");

    // 從主區域取得資料
    const mainBgSrc = $mainCard.find(".layer_bg").attr("src");
    const mainCharaSrc = $mainCard.find(".layer_chara").attr("src");
    const mainUid = $mainCard.find(".uid_number").text() || "0000001";
    const mainJob = $mainCard.find(".preview_job").text();
    const mainDate = $mainCard.find(".preview_date").text();
    const mainLoc = $mainCard.find(".preview_loc").text();

    // 同步到彈窗內的 card_mockup
    $modal.find(".layer_bg").attr("src", mainBgSrc);
    $modal.find(".layer_chara").attr("src", mainCharaSrc);
    $modal.find(".uid_number").text(mainUid);
    $modal.find(".preview_job").text(mainJob);
    $modal.find(".preview_date").text(mainDate);
    $modal.find(".preview_loc").text(mainLoc);

    // 顯示定製完成彈窗
    $modal.modal("show");
}

function saveCardState() {
    localStorage.setItem("nte_card_state", JSON.stringify(currentCardState));
}

function loadCardState() {
    const saved = localStorage.getItem("nte_card_state");
    const isSaved = localStorage.getItem("nte_card_is_saved");

    if (saved && isSaved) {
        // 從 storage 載入
        const state = JSON.parse(saved);
        currentCardState = state;
        selectCharacter(state.charaId);
        selectBackground(state.bgId);
        selectJob(state.jobText);
        $(".uid_number").text(state.uid || "0000001");

        $(".item.chara").removeClass("active");
        $(`.item.chara[data-id="${state.charaId}"]`).addClass("active");
        $(".item.background").removeClass("active");
        $(`.item.background[data-id="${state.bgId}"]`).addClass("active");

        // 也把 swiper 滑過去
        setTimeout(() => {
            if (charaSwiper) {
                const charaIndex = CARD_DATA.characters.findIndex(c => c.id === state.charaId);
                if (charaIndex !== -1) charaSwiper.slideToLoop(charaIndex);
            }
            if (bgSwiper) {
                const bgIndex = CARD_DATA.backgrounds.findIndex(b => b.id === state.bgId);
                if (bgIndex !== -1) bgSwiper.slideToLoop(bgIndex);
            }
        }, 100);
    } else {
        // 每次開啟時固定選取每個選單的第一個選項 (預設)
        resetCardDefaults();
    }
}

/**
 * 重置卡片至預設狀態：各選單選取第一個選項並標記 active
 */
function resetCardDefaults() {
    const firstChara = CARD_DATA.characters[0];
    const firstBg = CARD_DATA.backgrounds[0];

    // 選取第一個角色
    selectCharacter(firstChara.id);
    // 選取第一個背景
    selectBackground(firstBg.id);
    // 選取該角色的第一個職業
    selectJob(firstChara.jobs[0]);
    // 設定 UID
    $(".uid_number").text("0000001");

    // 標記 Swiper 中的 active 狀態
    $(".item.chara").removeClass("active");
    $(`.item.chara[data-id="${firstChara.id}"]`).addClass("active");

    $(".item.background").removeClass("active");
    $(`.item.background[data-id="${firstBg.id}"]`).addClass("active");

    // Swiper 滑動到第一個
    if (charaSwiper) charaSwiper.slideToLoop(0);
    if (bgSwiper) bgSwiper.slideToLoop(0);

    // 重置分頁到「姓名」頁籤
    $(".event_city_card_custom .tab").removeClass("active").first().addClass("active");
    $(".tab_pane").removeClass("active");
    $(".tab_content_chara_list").addClass("active");
}

/**
 * 更新卡片內容縮放比例
 * 使 rem 單位內容能隨 card_mockup 等比縮放
 */
function updateCardScale() {
    const $mockup = $(".card_mockup");
    if (!$mockup.length) return;

    // 取得卡片當前實際寬度
    const currentWidth = $mockup.width();
    
    // 取得基準縮放：
    // reset.js 設定 1rem = clientWidth / 25.6
    // 設計稿中卡片寬度為 1593px，在 2560px 基準下應為 15.93rem
    const docEl = document.documentElement;
    const fontSize = parseFloat(window.getComputedStyle(docEl).fontSize);
    const designWidthInRem = 15.93;
    const designWidthPx = designWidthInRem * fontSize;

    // 計算比例
    const scale = currentWidth / designWidthPx;

    // 將比例寫入 CSS 變數
    document.documentElement.style.setProperty('--card-scale', scale);
}

/**
 * 開啟查看市民卡彈窗，從 localStorage 讀取已儲存的卡片狀態填入
 */
function getShareCardBgPath(bgId) {
    return `./images/card/share_card/card_bg${String(bgId).padStart(2, "0")}.webp`;
}
function openViewCardModal() {
    const saved = localStorage.getItem("nte_card_state");
    if (!saved) return;

    const state = JSON.parse(saved);
    const chara = CARD_DATA.characters.find(c => c.id === state.charaId);
    const bg = CARD_DATA.backgrounds.find(b => b.id === state.bgId);

    if (chara) {
        // 更新卡片圖層
        $("#viewcard_mockup_chara").attr("src", `./images/card/share_card/${chara.img_id}.webp`);
    }
    
    if (bg) {
        $("#viewcard_mockup_bg").attr("src", getShareCardBgPath(bg.id));
        $("#viewcard_preview_loc").text(`取景地：${bg.name}`);
    }
    
    // 更新職業和日期
    $(".viewcard_preview_job").text(state.jobText);
    $(".viewcard_preview_date").text(state.uid || "2026.03.26");
    $(".viewcard_uid_number").text(state.uid || "0000001");

    // 關閉 customSuccessModal，開啟 viewCardModal
    $("#customSuccessModal").modal("hide");
    $("#viewCardModal").modal("show");
}
