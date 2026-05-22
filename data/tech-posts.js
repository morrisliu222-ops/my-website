const techPosts = [
  {
    id: "claude-md-intro",
    title: "CLAUDE.md 是什麼？基本介紹與使用重點",
    date: "2026-05-18",
    author: "AI 生成文章",
    content: `
      <h2>什麼是 CLAUDE.md？</h2>
      <p>CLAUDE.md 是一個放在專案根目錄的 Markdown 文件，專門用來告訴 Claude Code 這個專案的背景知識、規則與偏好。每次 Claude Code 在該目錄下啟動時，會自動讀取這份文件並將內容載入對話脈絡中。</p>
      <p>簡單來說，它就像是你寫給 AI 的「工作說明書」。</p>

      <h2>CLAUDE.md 可以寫什麼？</h2>
      <ul>
        <li><strong>專案概述</strong>：說明這個專案是什麼、目的為何</li>
        <li><strong>技術架構</strong>：使用的語言、框架、資料庫</li>
        <li><strong>常用指令</strong>：如何啟動開發伺服器、執行測試、部署流程</li>
        <li><strong>程式碼風格</strong>：命名規則、縮排方式、注釋習慣</li>
        <li><strong>注意事項</strong>：不可修改的檔案、特殊限制、已知問題</li>
        <li><strong>協作偏好</strong>：你希望 AI 怎麼回應、避免哪些行為</li>
      </ul>

      <h2>使用重點</h2>
      <h3>1. 放置位置</h3>
      <p>將 <code>CLAUDE.md</code> 放在專案根目錄即可自動生效。也可以放在子目錄，Claude 進入該目錄時同樣會讀取。若想設定全域規則，可放在 <code>~/.claude/CLAUDE.md</code>。</p>

      <h3>2. 越具體越好</h3>
      <p>模糊的描述效果有限。與其寫「請保持程式碼整潔」，不如寫「函式長度不超過 40 行、變數命名使用 camelCase、禁止使用 var」。</p>

      <h3>3. 記錄「為什麼」</h3>
      <p>不只寫規則，也說明原因。例如「不要使用 mock 測試資料庫，因為上季曾發生 mock 通過但正式環境失敗的事故」，這讓 AI 能在邊界情況做出正確判斷。</p>

      <h3>4. 定期更新</h3>
      <p>CLAUDE.md 會隨時間失效。當專案架構改變、新增依賴、或調整規範時，記得同步更新這份文件，避免 AI 依據過時資訊給出錯誤建議。</p>

      <h3>5. 避免放入機密資訊</h3>
      <p>CLAUDE.md 通常會納入版本控制（git），請勿在其中放置 API 金鑰、密碼或任何敏感憑證。</p>

      <h2>範例結構</h2>
      <pre><code># 專案名稱

## 概述
這是一個個人作品集網站，使用純 HTML/CSS/JS 建置並透過 Vercel 部署。

## 常用指令
- 本地預覽：用瀏覽器直接開啟 index.html
- 部署：push 到 main branch 即自動觸發 Vercel 部署

## 規範
- 不使用任何前端框架，保持純原生
- 圖片統一放在 images/ 資料夾
- 新文章寫入 posts.js</code></pre>

      <h2>小結</h2>
      <p>CLAUDE.md 是讓 AI 真正理解你的專案、減少重複說明、並產出符合期待程式碼的關鍵工具。花 10 分鐘寫好一份 CLAUDE.md，能節省未來無數次的來回溝通。</p>
    `
  }
];
