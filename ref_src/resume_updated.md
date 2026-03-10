# Lewis Chan

**System Architect | Full Stack Engineer | AI-Assisted Development Specialist**

📧 lewsiafat@gmail.com | 💼 [LinkedIn](https://www.linkedin.com/in/lewis-chan-78234221/) | 🌐 [Portfolio](https://lewsi.ddns.net)

---

## 專業摘要 (Professional Summary)

擁有 15 年軟體開發與 6 年技術管理經驗，專精於建構高效率開發流程與自動化體系。現任技術組長，帶領團隊交付超過 500 款遊戲產品。擅長全端開發、DevOps 自動化整合，並致力於將 AI 技術導入軟體開發生命週期（SDLC）。近期主導 **WorkspaceAI** 大型工作區專案，涵蓋 Model Context Protocol (MCP)、客製化 AI Agent 技能開發、加密貨幣分析與自動化網頁服務，展現對前瞻技術的實務應用能力與對生產力提升的持續追求。

---

## 核心技能 (Core Skills)

*   **程式語言：** Python, TypeScript, JavaScript, Lua, Shell Script
*   **前端框架：** Vue 3, React 19, Vite, Tailwind CSS, Cocos2dx
*   **後端開發：** FastAPI, Node.js, SQLite, SQL
*   **DevOps & Tools：** Model Context Protocol (MCP), API integration (WhatsApp/Telegram), Nginx, CI/CD Automation
*   **AI 應用：** AI Agent Development & Skills, Prompt Engineering, AI-Driven Development, SDD (Specification-Driven Development)

---

## 工作經歷 (Work Experience)

### 技術組長 (Tech Lead) | 天旭國際
*2020年 - 至今 (6年)*

領導 6 人技術團隊，負責遊戲產品線的研發與交付，建立標準化遊戲產線。

*   **研發流程優化：** 設計並實施標準化開發流程，將單款遊戲開發週期穩定控制在 2 週內，團隊月產能達到 18 款。
*   **自動化工具開發：**
    *   **專案管理平台：** 整合 Vue3、Electron 與 Python，集中管理專案生命週期。
    *   **自動化建置系統 (LittleGameCLITool)：**
        *   開發 Python 命令列工具，採用標準樣板 (Standard Template) 與 Symbolic Links 技術，實現遊戲專案的標準化建置。
        *   整合 GitLab API 與 CI/CD 流程，自動化處理專案建立、資源打包、版本發布等生命週期管理。
        *   成效：將專案建立時間從 5 分鐘縮減至 30 秒，並透過資源共用機制將單一專案體積從 450MB 優化至 10MB 左右。
    *   **資源優化工具：** 開發線上圖片打包與壓縮服務，累計節省大量軟體採購費用。
*   **AI 導入與品質控管：**
    *   導入 AI 輔助 Code Review 流程，提升程式碼審查的一致性，平均每案節省約 62.5% 審查時間。
    *   建立團隊 AI 使用規範，提升整體開發效率。

### 資深工程師 (Senior Engineer) | 天旭國際
*2018年 - 2020年 (2年)*

負責博弈遊戲核心邏輯開發與平台對接。

*   **遊戲開發：** 獨立負責多款平台配套遊戲與押分機遊戲的開發工作。
*   **技術研究：** 負責圖片加密技術的研究與實作，提升產品安全性。
*   **技術棧：** Cocos2dx-lua, Python

### 高級工程師 (Senior Engineer) | 鈊象電子 (IGS)
*2013年 - 2018年 (5年)*

參與博弈遊戲平台創始期的核心開發，協助團隊進行技術轉型。

*   **技術轉型主導：** 協助團隊從 Flash 網頁遊戲順利轉型至 Cocos2dx 手機遊戲開發框架。
*   **架構設計：** 導入 MVC 架構與依賴注入（Dependency Injection）模式，提升程式碼的可維護性與復用性。
*   **共用模組開發：** 設計 Slot 遊戲共用元件系統，大幅縮短新遊戲開發時間。
*   **部署優化：** 優化發佈流程，將版本部署時間縮短 50% 以上。

### 資深工程師 | 黑米數位
*2011年 - 2013年 (2年)*
*   全端網頁開發與 Flash 編輯器工具開發（Flex, PHP, MySQL）。

### 工程師 | 英丰寶資訊
*2009年 - 2011年 (2年)*
*   負責企業級專案開發與維護，參與 ETL 資料處理流程設計（Java, MS-SQL）。

---

## 個人專案與開源貢獻 (Side Projects)

### WorkspaceAI - 多專案開發工作區 (Monorepo)
*2025年 - 2026年*

**專案概述：** 打造集合 AI 整合工具、加密貨幣分析、網頁服務與硬體開發的 Monorepo 架構工作區。全面導入多 AI Agent 接力協作模式，並獨立開發多項客製化 AI 技能（如 `skill-creator`, `repo-sync`, `theme-factory`, `webapp-testing`），實現高度自動化的開發生命週期。包含以下核心子專案：

*   **AI & MCP (Model Context Protocol)：**
    *   **nanoclaw：** 個人 AI 助手，深度整合 WhatsApp/Telegram 通訊與 SQLite 資料庫。
    *   **binance-mcp：** 基於 Binance 交易協議開發的 MCP (Model Context Protocol) 伺服器，使 AI 具備交易平台交互能力。
    *   **AICodeReviewCLI：** 純 CLI 的 AI 驅動代碼審查工具，整合 Gemini、Claude 等多模型，導入團隊後每月平均節省約 50% 審查時間，並支援 Git 與檔案雙模式。
*   **Trading & Crypto (加密貨幣分析)：**
    *   **TradeGuard：** 專為加密貨幣交易者設計的無後端風險守護工具。採用 React 19 + Vite + Tailwind CSS，資料完全本地化，提供持倉追蹤與視覺化分析。
    *   **scalping-trade：** 專業級實時剝頭皮交易分析器，採用單文件 Python 體系與嚴格的無第三方依賴限制。
    *   **AI_K_TOOOL：** K 線分析輔助工具。
*   **Web & Apps (網頁應用)：**
    *   **landingPage：** 使用 Vite + Tailwind CSS + Vue 3 建構的現代化、高互動性落地頁，展示專案與技術成果。
    *   **WebShareee / WebStatic：** 輕量級靜態網頁託管服務（Vue 3, FastAPI, Nginx），提供 AI 生成內容（Markdown/HTML）一鍵部署的解決方案。
    *   **WebAppTemplate：** 多語言後端專案樣板生成器（支援 Python, Node.js, Go），導入 SDD (Specification-Driven Development) 概念，自動生成 AI 開發指引文件。
*   **Hardware & Embedded (硬體開發)：**
    *   **Picore-W / Presto：** 基於 Raspberry Pi Pico 的硬體開發與物聯網專案。

---

## 線上資源 (Online Resources)

*   **GitHub:** [github.com/Lewsiafat](https://github.com/Lewsiafat)
*   **Portfolio:** [lewsi.ddns.net](https://lewsi.ddns.net)
