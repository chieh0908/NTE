# 《異環》歌回投票網頁 (vtb-musicevent)

《異環》(Neverness to Everness, NTE) 感謝祭－海特洛音樂慶典聯動活動網頁。玩家收看「海特洛音樂祭」VTuber 聯動演出節目，於投票期間登入遊戲帳號為喜愛的 VTuber 應援投票即可免費領取虛寶獎勵；頁面同時提供節目曲目表、活動辦法與獎品一覽、演出 VTuber 名單等資訊區塊。

- 正式網址：https://nte.iwplay.com.tw/event/vtb-musicevent.html
- 網頁上線：2026/10/02 12:00 ～ 2026/11/04 23:59（UTC+8）
- 人氣投票：2026/10/09 20:00 開放 ～ 2026/10/11 23:59（UTC+8）截止

## 遊戲背景

《異環》是 Hotta Studio 自主研發的超自然都市開放世界 RPG。故事從海特洛市啟篇，玩家作為首位「無證工作」的「異象獵人」，加入古董店「伊波恩」接取民間異象委託，與夥伴們一起探索城市謎團。

## 活動玩法

- **主視覺（header）**：KV 背景搭配 Slogan 圖與兩顆導覽按鈕──「活動詳情」錨點捲動至活動辦法區塊、「立即投票」錨點捲動至投票區塊。
- **官方影片＆曲目表（event_schedule）**：左側為節目時間資訊與一張直播連結橫幅（目前連結至 YouTube Live 網址），右側為演出曲目表；曲目表以 9 張設計好的曲目圖（含曲序／歌手／翻唱歌名）堆疊呈現，可於清單內捲動瀏覽。區塊有「尚未開放」／「正式」兩種狀態（`.soon` class），尚未開放時曲目圖替換為載入中佔位圖。
- **活動辦法與獎品一覽（event_rules）**：左側提供活動說明文字與「活動規則」按鈕開啟 `#popRule` 彈窗；右側顯示投票時間與 3 項獎品圖示一覽。
- **人氣投票（event_vote，核心玩法）**：
  - 9 張 VTuber 投票卡，點擊可選擇／取消選擇（最多同時選 3 位），卡面與按鈕皆以雙／三段雪碧圖切換「未選擇／hover／已選擇」樣式；每張卡右下角常駐顯示票數。
  - 點擊「確認投票」：未選擇任何 VTuber 時彈出提示「請選擇您要投票的人選至多三位」；已選擇至少 1 位則彈出 `#popConfirmVote` 二次確認彈窗「送出後將無法變更投票選擇，是否確認送出？」。
  - 確認送出後鎖定本次選擇、「確認投票」按鈕切換為已完成樣式並停用，同時顯示「帳號登出」按鈕，並彈出「投票成功，感謝您的參與！」提示（含「獎勵將於 24 小時內發放至遊戲內信箱」備註）。
  - 區塊同樣有「尚未開放」／「正式」兩種狀態（`.soon` class），尚未開放時顯示活動即將開始的提示畫面並隱藏投票清單。
- **演出名單（event_cast）**：以可拖曳／自動滾動的跑馬燈呈現 9 位合作 VTuber 頭像與其 X／YouTube 頻道連結，下方附遊戲各平台（iOS／Android／Windows／PS5）下載按鈕。
- **其他彈窗**：確認跳轉官網提示（`#eventAlertModal`）、通用訊息提示（`#popMsg`）、活動規則（`#popRule`）、隱私權政策（`#privacymodal_sdk`）、SDK 登入彈窗（`#bookedmodal`）。

## 核心技術實作

- **投票流程**（`js/main.js`）：純前端互動邏輯，點擊投票卡切換 `.active` 樣式並限制最多 3 選；送出前以 `#popMsg`／`#popConfirmVote` 二次把關，確認送出後以 `isVoted` 旗標鎖定畫面避免重複操作。
- **SDK 登入彈窗狀態機**（`js/popDemo.js`）：以 `currentState`（`initial`／`selectState`／`state1`簡訊驗證碼／`state2`密碼登入／`state3`角色選擇）管理 `#bookedmodal` 內各登入分支畫面切換，並快取初始 `.button_box` 內容供狀態三（角色選擇）替換後還原；`#demoState1`／`#demoState2`／`#demoState3` 等觸發按鈕為沿用自其他 NTE 活動頁模板的程式碼，目前版面尚未加入對應按鈕，故簡訊／密碼／角色選擇分支暫未開放互動，僅保留基本手機號碼登入表單。登入完成以 `window.mockProductList()` 模擬，供正式 SDK 串接時掛載。
- **跑馬燈（演出名單）**（`js/main.js` `initCastMarquee`）：將 9 位 VTuber 卡片複製兩份首尾相接，以 `requestAnimationFrame` 搭配 `translate3d` 平移形成無限循環；支援滑鼠／觸控拖曳（暫停自動滾動，鬆手後恢復），非行動裝置滑鼠移入時另外暫停，並以 `ResizeObserver` 搭配 `resize`／`orientationchange` 重新量測寬度避免轉向跑版；拖曳偵測會排除卡片內的社群連結，避免誤擋點擊。
- **樣板與多語系資料串接**（`js/eventjson.js`＋`js/main_link.js`＋`js/20261002.js`）：`eventjson.js` 為通用樣板引擎，掃描頁面 `{key}`／`{key.subkey}` 佔位字串並從全域 `ViewObj` 取值替換，陣列值會自動複製節點（如 `#popRule` 的 `{rule_list}`、隱私權彈窗的 `{privacy_list}`）；正式站載入遠端 `main_link.js`（站台共用連結資料）與本活動專屬的 `20261002.js`（擴充 `ViewObj.rule_list` 活動規則文字），本機僅保留對應副本供參考。
- **「尚未開放／正式」狀態切換**：曲目表與投票區塊各自透過 `.soon` class 切換佔位／正式內容，目前僅由頁面右下角 demo 按鈕「切換 SOON 狀態」手動觸發測試，正式環境預期由營運人員在對應時間點手動調整版面或由後端控制，頁面本身未內建倒數計時或時間判斷邏輯。

## 版面規格 / RWD

- 本頁為可直式捲動瀏覽的多區塊版面（非單頁定寬卡片式活動），PC 以 `css/master.css`（2560px 寬基準）、手機以 `css/master_m.css`（750px 寬基準，`@import` 疊加於 `master.css` 上微調為單欄排版）呈現，由 `js/reset.js` 偵測裝置（UA 判斷或 `clientWidth < 768`）動態切換樣式表並以 rem 等比縮放，`resize`／`orientationchange` 時重新計算。
