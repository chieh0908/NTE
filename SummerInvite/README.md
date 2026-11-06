# 《異環》盛夏再啟・夏日邀請活動網頁 (SummerInvite)

《異環》(Neverness to Everness, NTE) 夏日邀請活動網頁。鑒定師可生成專屬邀請碼邀請其他鑒定師，透過完成活躍邀請任務與幸運抽取獲得獎勵，網頁以單頁三分頁（首頁／任務／抽獎）呈現，並支援滑鼠滾輪、觸控滑動與分頁導覽按鈕切換。

- 正式網址：https://nte.iwplay.com.tw/event/SummerInvite.html

## 遊戲背景

《異環》是 Hotta Studio 自主研發的超自然都市開放世界 RPG。故事從海特洛市啟篇，玩家作為首位「無證工作」的「異象獵人」，加入古董店「伊波恩」接取民間異象委託，與夥伴們一起探索城市謎團。

## 活動玩法

- **首頁（home_page）**：主視覺 KV，背景與 Logo 隨分頁切換自動替換（首頁用 `kv_bg.webp` + `logo.png`，其餘分頁切換為 `bg.webp` + `logo_b.png`）；頁面上的「前往任務」按鈕會呼叫 Swiper API 直接切至任務分頁。
- **任務頁（task_page）**：
  - 頂部「活躍邀請」頁籤（`partner_tabs`，目前「回歸邀請」頁籤與內容區塊已先行註解保留，僅開放活躍邀請）。
  - **活躍邀請任務列表**：以表格形式列出已邀請用戶（遮罩後的帳號）與兩組獎勵按鈕（`btn_item1`／`btn_item2`），依 `state_locked`／`state_claimable`／`state_claimed` 三種狀態切換雪碧圖；尚未邀請的空位顯示「尚未邀請」。點擊可領取狀態（`state_claimable`）的獎勵按鈕會切換為已領取並彈出提示。
  - **邀請碼互動**：顯示「您的邀請碼」供一鍵複製分享，另提供「請輸入對方的邀請碼」輸入框與確認按鈕供回歸鑒定師綁定。
  - **底部抽獎操作區**：顯示目前剩餘抽獎次數與「前往抽獎」按鈕，點擊會直接切換到抽獎分頁。
- **抽獎頁（lottery_page）**：
  - **幸運抽取（6 張卡片翻牌）**：點擊抽取按鈕隨機挑選一張卡片翻牌，從獎品池隨機抽出一項獎勵（不限制不重複，可重複中獎），翻牌後接續彈出「獲得獎勵」彈窗；彈窗關閉後卡片蓋回背面並觸發大洗牌動畫，動畫結束才解鎖下一次抽取。
  - 「獎勵一覽」按鈕開啟全螢幕蓋版列出所有獎品；「查詢獎勵」按鈕開啟獎勵紀錄彈窗（`#popAward_v1`），可切換「有獎項／無獎項」兩種示意狀態，並可一鍵複製序號或直接開啟「填寫收件資訊」彈窗。
- **收件資訊／聯絡資料流程**：填寫收件資訊彈窗需完整填寫姓名／手機／Email／地址才能送出，送出前會先跳出「確認提交」二次確認彈窗；確認後欄位鎖定為唯讀，頁面上的按鈕由「填寫收件資訊」切換為「查看收件資訊」，之後僅能唯讀檢視已送出內容。聯絡資料彈窗（`#popContactData`）為另一套獨立送出流程，送出成功後顯示通用提示彈窗。
- **會員資訊／登入**：右上角會員按鈕可開關會員資訊區塊（顯示 UID 與切換帳號按鈕），點擊外部區域會自動收合。登入相關以 SDK 彈窗（`#bookedmodal`）呈現，詳見下方核心技術說明。
- **其他彈窗**：活動規則（`#popRule`）、通用訊息提示（`#popMsg`）、回流/活躍邀請獲得抽獎次數提示（`#popReturnReward`）、不符合資格提示（`#popNotEligible`）、隱私權政策（`#privacymodal_sdk`）等。

## 核心技術實作

- **Swiper 垂直分頁 + 全螢幕滑動接管**（`js/main.js` `SwiperPageManager`）：
  - Swiper 固定使用 `direction: "vertical"`、`allowTouchMove: false`、`effect: "fade"`，僅保留 PC 滾輪（`mousewheel: true`）正常運作，觸控／滑鼠拖曳改由自訂 `pointerdown`／`pointerup` 事件全面接管。
  - 放開手指/滑鼠的瞬間即時讀取當下 `window.innerHeight > innerWidth` 來動態判斷「直式(已被強制旋轉 90 度)」或「橫式」，據此把物理座標上的 X 軸或 Y 軸位移換算回「視覺上的上下滑動」，據以呼叫 `slideNext()`／`slidePrev()`，完全不依賴 Swiper 內建觸控引擎或 `changeDirection()`，避開轉向瞬間判斷延遲與方向錯亂的問題（詳見〈swiper最新改動(為了適應畫面轉向).txt〉）。
  - 透過白名單過濾 `.modal`、`.gift-overlay`、`.swiper-no-swiping` 等區塊，讓彈窗、蓋版與任務列表（`.task_container`）內部的原生捲動/滾輪操作不會誤觸發整頁切頁；`.task_container` 另外對 `wheel`/`mousewheel`/`DOMMouseScroll` 呼叫 `stopPropagation()` 加強防護。
  - 分頁切換（`slideChange`）同步處理背景圖／Logo 替換，並在切到任務頁、抽獎頁時各自觸發一次性的進場物件動畫（`triggerTaskObjAnimation`／`triggerLotteryObjAnimation`，透過旗標確保動畫只播放一次）。
- **幸運抽取 3D 翻牌與洗牌動畫**（`js/main.js` `initLuckyDrawFlow`）：
  - 卡片採三層結構（`.card` > `.card-inner` > `.card-front`／`.card-back`），以 `transform-style: preserve-3d` 搭配 `backface-visibility: hidden` 達成正反面無縫交替，背面預先 `rotateY(180deg)`，翻牌只需切換 `.is-flipped` class 即可觸發 CSS 過渡動畫（原理詳見〈卡片3D翻牌做法.txt〉）。
  - 點擊抽取後隨機挑一張卡片翻牌，並從獎品圖庫隨機抽出一項（可重複中獎）替換卡片背面與彈窗圖片；翻牌動畫後延遲 0.5 秒彈出「獲得獎勵」彈窗，彈窗關閉後才蓋回卡片背面並進入洗牌流程。
  - `executeShuffle`：以卡片相對網格容器（`gridContainer`）的 `offsetLeft`/`offsetTop` 計算各卡牌與容器中心的局部偏移量（刻意不用 `getBoundingClientRect`，避免外部旋轉影響座標），讓所有卡片飛向中心並疊加隨機旋轉角度模擬洗牌，停留 0.8 秒後歸位回原格位，動畫結束才解鎖 `isAnimating` 讓玩家進行下一次抽取。
  - 以全域 `remainingChances` 搭配 `isAnimating` 旗標鎖定重複點擊與次數歸零時停用按鈕；所有畫面上標示 `.draw_count` 的元素會同步顯示剩餘次數。
- **獎勵列表跑馬燈（互動拖曳／滑動）**（`initUniversalMarquee`）：將原始獎品清單複製兩份首尾相接，依容器排版方向（橫向／直向）以 `requestAnimationFrame` 計算速度並用 `translate3d` 平移形成無限循環；支援滑鼠／觸控拖曳（`mousedown/touchstart` → `mousemove/touchmove` 綁定於 `window`，確保拖曳超出邊界仍可更新），拖曳時暫停自動滾動，鬆手後恢復；視窗縮放或裝置旋轉時以 `ResizeObserver` 搭配 `resize`/`orientationchange` 重新量測並重置位置；非行動裝置滑鼠移入時暫停自動滾動方便細看獎品。
- **RWD／強制橫式瀏覽**（`js/reset.js`）：不論 PC 或手機，頁面本身只有一套橫式版面（`css/master.css`，2560×1440 為基準），以 rem 做等比縮放。當偵測視窗為直式（高 > 寬）時，不切換另一套 CSS，而是直接將 `#top` 容器 `rotate(90deg)` 並置中，強制以橫式畫面呈現內容；旋轉時另外處理 `#modal_wrapper` 同步旋轉，確保彈窗（Bootstrap Modal / `modal-backdrop`）在直式手機上也維持正確的橫式視覺與置中位置。此做法與 `SwiperPageManager` 的動態方向判斷互相配合，才能在「畫面已被 CSS 轉向」的情況下仍正確對應使用者視覺上的滑動方向。
- **彈窗流程管理**：以 Bootstrap Modal 搭配多個狀態旗標（`isInfoSubmitted`、`currentState` 等）串接「填寫收件資訊 → 二次確認 → 提交成功」「登入 SDK 多狀態分支」等多層彈窗的開關順序；修正多重彈窗疊加時，最新產生的 `.modal-backdrop` 需動態調整 `z-index`（1069）才不會被前一層蓋住。
- **SDK 登入彈窗**（`#bookedmodal`）：以狀態機（`initial`／`selectState`／`state1` 簡訊驗證碼／`state2` 密碼登入／`state3` 角色選擇）管理同一彈窗內各登入分支畫面的顯示/隱藏切換，並快取初始 `button_box` 內容供狀態三（角色選擇）替換後還原；demo 階段以按鈕點擊模擬登入成功（呼叫 `window.mockProductList`）流程。

## 版面規格 / RWD

- 全站僅一套固定比例橫式版面（`css/master.css`，2560×1440 基準），由 `js/reset.js` 以 rem 做等比縮放。
- 不論裝置直式或橫式，皆以 CSS `rotate(90deg)` 強制將內容旋轉為橫式顯示（無另外的直式排版或「請旋轉裝置」遮罩頁），滑動/滾動翻頁邏輯會依照旋轉後的實際視窗長寬即時換算對應的滑動方向（見上方 `SwiperPageManager` 說明）。
