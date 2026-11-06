# 《異環》黑羽的邀請函活動網頁 (BlackBird)

《異環》(Neverness to Everness, NTE) 1.4 版本回流活動網頁。活躍鑒定師可生成專屬邀請連結邀請新人／回歸鑒定師，雙方透過完成任務與消耗占卜次數進行幸運抽取，獲取環石、方斯、質實骰子等獎勵。

- 正式網址：https://nte.iwplay.com.tw/event/BlackBird.html
- 活動時間：1.4 版本更新後 ～ 2026/11/11 05:59:59（UTC+8）

## 遊戲背景

《異環》是 Hotta Studio 自主研發的超自然都市開放世界 RPG。故事從海特洛市啟篇，玩家作為首位「無證工作」的「異象獵人」，加入古董店「伊波恩」接取民間異象委託，與夥伴們一起探索城市謎團。

## 活動玩法

- **首頁（event_home）**：主視覺 KV，中央顯示 Slogan與「進入活動」按鈕，右上方提供下載、活動規則、會員資訊三顆圖示按鈕；右側另有一個兌換碼提示方塊。點擊「進入活動」呼叫 `switchPage(".event_main")` 切換到任務與占卜頁。
- **任務與占卜頁（event_main）**：整體以一封「信件」為主視覺，內容區分左右兩塊：
  - **左半部（任務列表）**：上半部為共通任務（首次分享專屬邀請連結、每日登入遊戲 1/3，登入進度於隔日 11:00 更新）；下半部左側為「回流邀請進度」（邀請 1～5 人，5 個檔位）、右側為累計環石（上限 540）／占卜次數（上限 24）的累計顯示，以及「新人邀請進度」（邀請 1～3 人，3 個檔位）。各任務／邀請檔位按鈕以 `data-status`（0 不可領／1 可領／2 已領）控制顯示與可點擊狀態。
  - **右半部（占卜操作區）**：直式排列的返回首頁、活動規則、邀請與獎勵紀錄、下載四顆圖示按鈕，以及占卜（幸運抽取）按鈕、剩餘次數顯示（`#draw_count`）與分享邀請碼按鈕。
- **邀約綁定簽署流程**：新人／回歸身份的鑒定師進站時彈出「初始簽署彈窗」（`initial_signing_modal`，左側輸入專屬邀請碼、右側為 Swiper 輪播的活動介紹banner），輸入邀請碼並二次確認後，輸入框切換為唯讀的「已綁定來自…的邀請」文字，隨後彈出「成功回歸獎勵」彈窗供分享自己的專屬連結；若關閉彈窗前未完成綁定，畫面會依身份改顯示對應的全螢幕遮罩（`back_player_overlay`／`new_player_overlay`），提示立即綁定；完成綁定後再次進站則顯示「已綁定」遮罩（`award_player_overlay`），提示分享連結。
- **占卜（幸運抽取，核心玩法）**：點擊占卜按鈕開啟 3 張卡片的彈窗（`#popLottery`），翻開任意一張後另外兩張卡淡出，0.5 秒後翻開的卡片左移縮小、中獎資訊滑入右側，並可點擊背景任意處關閉或按「繼續占卜」重新開一輪。
- **邀請狀態／獎勵紀錄**：點擊邀請紀錄圖示開啟雙分頁彈窗（`#popInviteLog`），分頁一為邀請歷史（日期／用戶 UID／回歸狀態），分頁二為獎勵記錄（日期／來源／獎勵），各自有「暫未有記錄產生」的無資料畫面可切換測試。
- **其他彈窗／遮罩**：恭喜獲得獎勵（`#popGetAward`）、確認綁定二次確認（`#popBindingConfirm`）、下載區（各平台 Store 連結＋QR Code）、通用訊息提示（`#popMsg`）、SDK 登入彈窗（`#bookedmodal`）、隱私權政策、登入提示（確認跳轉官網）等。
- **Demo 模擬登入**：畫面右下角的浮動按鈕群組（`demo_btn_group`）可切換「一般玩家／回流玩家／新玩家」三種身分進行測試，驅動上述簽署彈窗與各全螢幕遮罩的顯示邏輯。

## 核心技術實作

- **頁面切換單一入口**（`switchPage(targetClass)`，`js/main.js`）：隱藏所有 `.event` 頁面並顯示目標頁面；僅在首頁與任務占卜頁顯示 footer；切回任務占卜頁時統一重置簽署彈窗與各遮罩狀態，避免殘留畫面污染下一次測試。
- **邀約綁定簽署流程**：以 `window.currentDemoPlayer`（`''`／`back`／`new`）記錄目前模擬身分，決定未綁定時該顯示哪一種全螢幕遮罩；綁定成功後對 `modal_content`／`modal_invite_area`／`modal_input_wrapper` 加上 `bound` class 觸發 CSS 切換為唯讀顯示，並在二次確認彈窗關閉動畫結束（延遲 0.4 秒）後才接續彈出成功回歸獎勵彈窗，避免兩個 Bootstrap Modal 的開合動畫互相搶拍；簽署彈窗內的介紹輪播以 Swiper 初始化（`loop: true`、3 秒自動播放、`disableOnInteraction: false`）。
- **占卜 3D 翻牌動畫**（`js/main.js`）：卡片採三層結構（`.lottery_card_item` > `.card-inner` > `.card-front`／`.card-back`），點擊時以全域 `isAnimating` 旗標鎖定重複點擊，並限制同一輪只能翻開一張卡片。獎品圖（`award_gift`，右側中獎資訊顯示，1～5 全隨機不保底）與卡背圖（`card-back img`，翻開畫面顯示）各自獨立抽取：卡背圖在前 5 次占卜以洗牌過的 `guaranteedCardBacks` 陣列保底不重複出現 1～5，第 6 次之後才改為全隨機，刻意讓玩家在前期看到的卡面樣式較不重複。`resetLotteryModal()` 統一處理「繼續占卜」與彈窗關閉（`hidden.bs.modal`）時的狀態還原，並以 500 毫秒延遲避免卡片翻回動畫尚未結束前又被點擊。
- **SDK 登入彈窗狀態機**（`#bookedmodal`）：以 `currentState`（`initial`／`selectState`／`state1` 簡訊驗證碼／`state2` 密碼登入／`state3` 角色選擇）管理同一彈窗內各登入分支畫面的顯示切換；`resetToInitial()` 統一還原欄位與按鈕顯示，並在彈窗第一次開啟時快取 `button_box` 原始內容（`btnBoxOriginal`），供狀態三替換為角色選擇 UI 後可以還原；demo 階段點擊登入／角色選擇按鈕呼叫 `window.mockProductList()` 模擬登入成功。
- **Bootstrap 多重彈窗疊加修正**：監聽 `show.bs.modal`，依目前畫面上已開啟的 `.modal` 數量動態計算 `z-index`（`1050 + 10 * N`），並在非同步產生的 `.modal-backdrop` 出現後同步墊高其層級，避免後開的彈窗被前一層遮罩蓋住；`hidden.bs.modal` 時若畫面仍有其他彈窗開著，手動補回 `body.modal-open`，避免背景提早恢復可捲動。另外對 `data-backdrop="static"` 的彈窗點擊外層遮罩時加上 `.modal-static` 觸發晃動提示動畫，600 毫秒後移除 class 以便重複觸發。
- **行動鍵盤留白修正**：`input`／`select`／`textarea` 失焦時延遲 100 毫秒執行 `scrollTo(0, 0)`，並刻意切換 `body.style.display` 強迫瀏覽器重新計算版面，解決手機虛擬鍵盤收起後畫面底部留白、跑版的問題。
- **RWD／強制橫式瀏覽**（`js/reset.js`）：全站僅一套橫式版面（`css/master.css`，2560×1440 為基準），以 rem 做等比縮放。當偵測視窗為直式（高 > 寬）時，不切換另一套 CSS，而是直接將 `#wrapper` 與 `#modal_wrapper` 整體 `rotate(90deg)` 並置中，強制以橫式畫面呈現內容；另外以 `MutationObserver` 監聽 Bootstrap 動態產生的 `.modal-backdrop` 節點，即時搬移進 `#modal_wrapper` 內，確保旋轉後彈窗遮罩的層級與置中位置正確。
- **會員資訊區塊**：點擊會員按鈕時，若資訊區塊目前不在該按鈕後方，就以 `insertAfter` 動態搬移過去並顯示，否則單純切換顯示／隱藏；點擊畫面其他區域會自動收合。

## 版面規格 / RWD

- 全站僅一套固定比例橫式版面（`css/master.css`，2560×1440 基準），由 `js/reset.js` 以 rem 做等比縮放。
- 不論裝置直式或橫式，皆以 CSS `rotate(90deg)` 強制將內容旋轉為橫式顯示（無另外的直式排版或「請旋轉裝置」遮罩頁），與 EibonPartner／FF47lottery 切換另一套 `master_m.css` 的做法不同，而是沿用 SummerInvite 的強制旋轉方案。
