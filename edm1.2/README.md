# 《異環》1.2版本「九百九十九夜」EDM (edm1.2)

《異環》(Neverness to Everness, NTE) 1.2 版本上線宣傳電子郵件（EDM），通知既有玩家版本更新內容，並導流至遊戲登入與好友邀請活動頁面。

- 郵件主旨：《異環》九百九十九夜-1.2版本現已開啟
- 版本上線時間：2026/7/16

## 遊戲背景

《異環》是 Hotta Studio 自主研發的超自然都市開放世界 RPG。故事從海特洛市啟篇，玩家作為首位「無證工作」的「異象獵人」，加入古董店「伊波恩」接取民間異象委託，與夥伴們一起探索城市謎團。

## 信件內容

- **主圖（main.png）**：《異環》收容測試資格獲選通知視覺。
- **版本介紹文字段**：標題「登入送 S級自選 & 1600環石」，說明 1.2 版本新增沉浸式 RPG 桌遊玩法「九百九十九夜」、全新 S 級角色「真紅」登場，以及多項海特洛市都市生活玩法；並提示登入即可領取夏日贈禮。
- **CTA 按鈕（btn1.png）**：連結至遊戲登入導流頁 `https://nte.pse.is/999nightsEDM`。
- **活動說明圖（sec1.png）**。
- **伊波恩合夥人行動文字段**：說明邀請好友回歸海特洛、完成伊波恩合夥人任務最高可獲取 940 環石獎勵。
- **CTA 按鈕（btn2.png）**：連結至活動頁 `https://nte.iwplay.com.tw/event/EibonPartner.html`。
- **活動說明圖（sec02.png）**。
- **Footer**：社群連結圖示（Facebook、YouTube、Discord、Instagram、X、PlayStation Store）、品牌 Logo、服務條款／隱私權政策連結，以及版權宣告。

## 技術規格 / RWD

- 純 HTML Email（table-based 版面 + inline style），相容 Outlook（MSO 條件註解）、Gmail、Apple Mail 等主流信箱客戶端。
- 所有圖片皆外連 CDN：`https://images1.iwplay.com.tw/image/nte/edm/20260716/`。
- `email-container` 最大寬度固定 600px；針對螢幕寬度 680px、360px 以下設有對應 media query，調整內文字級（`content-text`／`highlight-title`／`content-text-2` 等 class）、社群 icon 尺寸（`sns-img`）與區塊間距（`sm-p` 系列）。
