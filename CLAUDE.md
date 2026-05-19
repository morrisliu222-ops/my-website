# CLAUDE.md — 我的個人網站

## 專案概覽

純靜態個人網站，部署在 **GitHub + Vercel**。沒有前端框架，全部用原生 HTML / CSS / JavaScript 撰寫。所有頁面都在同一個 `index.html` 裡，用 `display: none / block` 切換不同區塊（SPA 但無 router）。

## 技術架構

| 層面 | 技術 |
|------|------|
| 前端 | 原生 HTML / CSS / JavaScript（無框架） |
| 資料 | `.js` 檔案（陣列形式，直接被 `<script>` 載入） |
| 部署 | Vercel（偵測到 git push 自動重新部署） |
| 本機編輯器 | Python HTTP Server（`editor_server.py`，port 8787） |

## 檔案結構

```
my_website/
├── index.html          主要網站（唯一頁面，含所有 section）
├── editor.html         生活雜記編輯表單（需搭配 editor_server.py）
├── editor_server.py    本機 Python HTTP server，處理寫入 posts.js
├── posts.js            生活雜記資料（陣列）
├── tech-posts.js       技術筆記資料（陣列，含 HTML 內文）
├── photo-albums.js     攝影集資料（陣列，含相片路徑）
├── CLAUDE.md           本檔案
└── .github/
    ├── workflows/
    │   └── new-post.yml        GitHub Actions：Issue 開啟即自動新增雜記
    └── ISSUE_TEMPLATE/
        └── new-post.yml        Issue 表單範本（標題 + 內文）
```

## 頁面結構（index.html）

側邊欄有三個群組，對應以下頁面（每個 `<section id="page-xxx">`）：

- **關於我**：`home`（首頁）、`about`（自我介紹）、`contact`（聯絡方式）
- **作品集**：`design`（設計，含 RC Car PDF + ESP32 天氣站）、`code`（程式，含工廠薪資系統）、`photo`（攝影集）
- **文章**：`tech`（技術筆記）、`blog`（生活雜記）

## 資料檔案格式

### posts.js（生活雜記）
```js
const posts = [
  { title: "標題", date: "YYYY-MM-DD", content: "內文" },
  // 最新文章排在最前面
];
```

### tech-posts.js（技術筆記）
```js
const techPosts = [
  { id: "唯一id", title: "標題", date: "YYYY-MM-DD", author: "作者", content: `<h2>HTML 內文</h2>` },
];
```

### photo-albums.js（攝影集）
```js
const photoAlbums = [
  { id: "唯一id", title: "相簿名稱", description: "說明", cover: "圖片路徑", photos: [{ src: "路徑", caption: "說明" }] },
];
```

## 本機開發工作流

### 新增生活雜記（本機）
```powershell
# 1. 啟動編輯器 server
python editor_server.py
# 瀏覽器自動開啟 http://localhost:8787

# 2. 填寫表單後按送出，posts.js 自動更新

# 3. 部署
git add posts.js
git commit -m "新增雜記"
git push
```

### 手動修改資料檔
直接編輯 `posts.js` / `tech-posts.js` / `photo-albums.js`，維持陣列格式即可，最新的項目放最前面。

## 部署流程

```
git push → GitHub → Vercel 自動偵測 → 重新部署（約 10–30 秒上線）
```

不需要任何 build step，Vercel 直接服務靜態檔案。

## 手機發文（GitHub Issues）

在手機 GitHub App 開一個新 Issue，選「新增雜記」範本，填標題和內文送出，GitHub Actions 自動更新 `posts.js` 並 commit，Vercel 隨即重新部署。

**注意：** bot commit 不會同步到本機，在本機編輯 `posts.js` 前要先 `git pull`。

## 注意事項

- `index.html` 裡的作品集內容（工廠薪資系統、ESP32 天氣站）是用 JavaScript 字串硬編碼在頁面內，不是獨立的 `.js` 資料檔。
- 自我介紹（`page-about`）的履歷內容也是直接硬編碼在 HTML 裡，姓名與聯絡資訊不顯示。來源是 `liumufan_20260311.pdf`。
- 新增攝影照片需把圖片檔放到 repo 內，再更新 `photo-albums.js`。
- 技術筆記的 `content` 欄位是 HTML 字串，直接用 `innerHTML` 渲染。
- 全站主題色定義在 CSS 變數 `--accent: #3d5a80`，修改顏色只需改這一處。
