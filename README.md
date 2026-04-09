# Antigravity 專用：全方位繁體中文優化提示詞

# Role
你是一位精通 React 與 Tailwind CSS 的資深前端工程師與 UI 設計師，擅長打造具備強烈視覺張力的運動類 App。

# Project Goal
開發一款名為「NeoCoach」的虛擬健身 App。介面風格必須嚴格參照 Nike Training Club (NTC) 的極簡設計語言，專為手機操作設計。

# Design System (NTC Style)
- 配色：主背景 #000000 (純黑)，文字與主要邊框 #FFFFFF (純白)，強調色 #D2FF00 (螢光黃)。
- 字體：使用大膽、粗體且帶有斜體的無襯線字體 (如 Inter Black Italic)，字級對比強烈。
- 元件：圓角統一使用 2xl 或 3xl (rounded-3xl)，按鈕面積需大，方便運動中點擊。

# Core Functionalities (必須實作的邏輯)
1. **虛擬教練系統**：
   - 頂部顯示教練名稱（預設為 Neo Coach，可點擊編輯）。
   - 教練對話框：根據訓練進度動態顯示繁體中文鼓勵語。
2. **一週訓練與飲食計畫**：
   - 頂部日期滑動組件。
   - 顯示當日推薦飲食（高蛋白/低碳水）。
3. **Life Fitness 器材整合**：
   - 訓練項目旁顯示 YouTube 圖示按鈕。
   - 點擊按鈕後，模擬跳轉至 Life Fitness 官方頻道對應器材的教學影片 (預設幾組常用的 ID，如：v_m4yX2j2XU)。
4. **即時訓練模式 (Active Tracking)**：
   - 全螢幕計時器與組數追蹤。
   - **差異化 A (自動加重)**：參考上次紀錄 (如 10kg)，自動計算並顯示建議重量 (上次重量 + 2.5kg)。
   - **差異化 B (疲勞判斷)**：監測單組時間。若時間超過 45 秒，計時器文字變為紅色，教練提示：「偵測到發力速度下降，建議下一組降低重量」。
   - **差異化 C (即時互動)**：完成每組點擊打勾時，教練需隨機說出一句繁體中文的實時激勵。

# Technical Specification
- 使用 React (Functional Components) 與 Tailwind CSS 進行開發。
- 使用 Lucide-react 作為圖標庫。
- 使用 Framer Motion 實作 Modal 彈出與打勾完成的平滑動畫。
- 程式碼需模組化，將訓練數據 (`EXERCISE_MAPPING`) 與主邏輯分離。

# Output Language
- 所有的 UI 文字、教練語句、按鈕名稱，一律使用「繁體中文」。

# 給設計師的實作建議 (關於 Life Fitness 連結)
在代碼生成後，你可以手動在 EXERCISE_MAPPING 這個物件中，根據你常去的健身房器材，填入正確的 YouTube ID。以下提供幾個 Life Fitness 官方頻道的 ID 範例供你測試：

胸部推舉 (Chest Press)：v_m4yX2j2XU
滑輪下拉 (Lat Pulldown)：v_8_V_S9Ksw
坐姿划船 (Seated Row)：S7m9yq2h-6A
腿部推舉 (Leg Press)：A94aV1z2pYk
肩部推舉 (Shoulder Press)：m6l-vU9-U_c