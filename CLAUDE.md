# 客戶維運管理系統 (ops-tracker)

## 專案概述
這是 **FlowReq 平台「工作日誌」功能的 UI/UX 設計參考稿**，讓內部員工記錄每次客戶要求的相關工作與處理狀況。

**定位說明：**
- 公司內部使用系統，非對外產品
- 此 project 是 UI/UX 設計參考稿，供團隊對齊功能架構與互動流程
- 開發團隊有自己的 FlowReq component library，實作時套用既有樣式，不直接沿用此處 code
- 迭代重點：頁面區塊規劃、資訊架構、互動流程、欄位定義——樣式細節不是重點
- 從 Figma Make 匯出後轉移到本地開發環境（Figma Make token 用完）

## 技術堆疊
- **框架**：React 18 + Vite
- **樣式**：Tailwind CSS v4 + shadcn/ui
- **套件管理**：pnpm
- **部署**：Vercel（自動 push 部署）
- **版本控制**：GitHub → github.com/rayc0113/ops-tracker

## 開發流程
```bash
npm run dev        # 本機預覽 http://localhost:5173
npm run build      # 打包
git add . && git commit -m "說明" && git push  # 部署到 Vercel
```

## 專案結構
```
src/
  app/
    App.tsx                   # 主頁面（工作日誌列表、篩選）
    components/
      WorkLogModal.tsx         # 工作日誌詳情 Modal
      ui/                      # shadcn/ui 元件
  styles/                      # 全域樣式
```

## 導航頁面
- **待辦** - 尚未開發
- **我的表單** - 尚未開發
- **表單追蹤** - 尚未開發
- **工作日誌** - 已完成第一版（列表 + 篩選 + Modal）

## 顏色規範
- 主色：`#2D336B`（深藍，主要文字）
- 強調：`#106FFF`（亮藍，連結/案件編號）
- 背景：`#EFF0F8`（淺藍灰，輸入框/Tag 背景）
- 次要文字：`#8F9BC8`

## 設計決議
<!-- 每次討論後的重要決定記錄在這裡 -->
- 2026-04-15：從 Figma Make 匯出，建立本地開發 + GitHub + Vercel 工作流程
