const techPosts = [
  {
    id: "scada-database-architecture",
    title: "SCADA 資料庫架構：Medallion Architecture 三層 11 種資料庫全解析",
    date: "2026-05-25",
    author: "Morris",
    content: `
      <h2>核心框架：Medallion Architecture（三層）</h2>
      <p>工業資料從現場到決策，流經三層：</p>
      <pre>Bronze → Silver → Gold
原始層 → 加工層 → 分析層</pre>
      <p><strong>重要前提</strong>：這個框架只描述「流動的操作資料」，不涵蓋基礎設施（訊息佇列）和設備管理（PLC備份）。</p>

      <h2>Layer 1：Bronze 原始層</h2>
      <p><strong>定義</strong>：從來源直接採集，未經任何轉換或彙總的原始資料。</p>
      <p>資料特徵：有原始時間戳記、未清洗未計算、量最大最細緻、一旦寫入不應修改。</p>

      <h3>1. 即時資料庫（Real-time / In-Memory DB）</h3>
      <ul>
        <li><strong>存什麼</strong>：所有 Tag 的當前值（只有最新一筆）</li>
        <li><strong>生命週期</strong>：斷電即消失</li>
        <li><strong>典型技術</strong>：Redis / 自建記憶體結構</li>
        <li><strong>概念定位</strong>：系統的「工作記憶」</li>
        <li><em>注意：這不是歷史資料，只記錄「現在」。</em></li>
      </ul>

      <h3>2. 時序資料庫 / Historian</h3>
      <ul>
        <li><strong>存什麼</strong>：每個 Tag 每一個時間點的原始數值</li>
        <li><strong>生命週期</strong>：永久保存（數年至數十年）</li>
        <li><strong>資料量</strong>：極大（每天數千萬筆）</li>
        <li><strong>典型技術</strong>：OSIsoft PI / InfluxDB / TimescaleDB</li>
        <li><strong>概念定位</strong>：系統的「黑盒子」</li>
        <li><em>注意：Historian 本身可能同時存 Layer 1（原始值）和 Layer 2（計算彙總值），需區分兩類資料。</em></li>
      </ul>

      <h3>3. 事件 / 警報資料庫（Event / Alarm DB）</h3>
      <ul>
        <li><strong>存什麼</strong>：警報觸發/確認記錄、操作員動作、系統事件</li>
        <li><strong>特性</strong>：不可竄改、可稽核</li>
        <li><strong>典型技術</strong>：PostgreSQL（加審計觸發器）</li>
        <li><strong>概念定位</strong>：系統的「操作日誌」</li>
        <li><em>Layer 1 = 原始事件（發生了什麼、何時）；Layer 2 = 事件分析（這批警報代表什麼問題）</em></li>
      </ul>

      <h3>4. 資安審計日誌（Security Audit Log）</h3>
      <ul>
        <li><strong>存什麼</strong>：登入/登出記錄、存取嘗試、指令歷史、網路事件</li>
        <li><strong>特性</strong>：與事件資料庫分開存放、更高防竄改要求</li>
        <li><strong>法規依據</strong>：IEC 62443 強制要求</li>
        <li><strong>典型技術</strong>：獨立 Syslog Server / SIEM 系統</li>
        <li><strong>概念定位</strong>：系統的「監視錄影」</li>
        <li><em>為何獨立：資安事件不能由被入侵的系統自己管理。</em></li>
      </ul>

      <h2>Layer 2：Silver 加工層</h2>
      <p><strong>定義</strong>：對 Layer 1 的原始資料進行彙總、計算、賦予製程情境。</p>
      <p>資料特徵：有製程意義、經過計算或彙總、量比 Layer 1 小、可直接讓工程師/管理者理解。</p>

      <h3>5. 彙總時序資料（Aggregated Historian）</h3>
      <ul>
        <li><strong>存什麼</strong>：每小時均值、每日最大/最小/平均、標準差</li>
        <li><strong>來源</strong>：由 Layer 1 Historian 計算而來</li>
        <li><strong>概念</strong>：「這一小時的溫度概況」</li>
      </ul>

      <h3>6. 批次記錄資料庫（Batch Record DB）</h3>
      <ul>
        <li><strong>存什麼</strong>：每一批產品的完整製程紀錄（原料批號、製程參數、時間軸、操作員、結果）</li>
        <li><strong>概念</strong>：「這批產品是在什麼條件下生產的」</li>
        <li><strong>典型技術</strong>：PostgreSQL / 專用 Batch MES DB</li>
        <li><em>製藥/食品產業的法規核心要求。</em></li>
      </ul>

      <h3>7. KPI 計算資料庫</h3>
      <ul>
        <li><strong>存什麼</strong>：OEE（設備綜合效率）、良率、能耗、生產速率</li>
        <li><strong>概念</strong>：「這條線今天表現如何」</li>
        <li><em>已經有業務意義，但還不是最終報表。</em></li>
      </ul>

      <h3>8. 品質統計資料庫（SPC / Quality DB）</h3>
      <ul>
        <li><strong>存什麼</strong>：管制圖資料、Cpk、製程能力指標、不良品記錄</li>
        <li><strong>概念</strong>：「製程是否在統計管制內」</li>
        <li><strong>典型技術</strong>：專用 SPC 軟體 DB / PostgreSQL</li>
      </ul>

      <h2>Layer 3：Gold 分析層</h2>
      <p><strong>定義</strong>：整合多來源資料，轉化為可直接支援業務決策的形式。</p>
      <p>資料特徵：跨系統整合（SCADA + ERP + 品質 + 財務）、有業務貨幣化意義、量最小密度最高、給管理層和決策者使用。</p>

      <h3>9. 資料倉儲（Data Warehouse）</h3>
      <ul>
        <li><strong>存什麼</strong>：跨系統整合後的歷史資料（SCADA + ERP + 品質 + 財務）</li>
        <li><strong>概念</strong>：「公司所有數字的統一來源」</li>
        <li><strong>典型技術</strong>：Snowflake / BigQuery / SQL Server DW</li>
      </ul>

      <h3>10. 報表 / BI 資料庫</h3>
      <ul>
        <li><strong>存什麼</strong>：預先計算好的報表資料、儀表板指標</li>
        <li><strong>概念</strong>：「主管看的數字」</li>
        <li><strong>典型技術</strong>：Grafana / Power BI / Tableau（連接 DW）</li>
      </ul>

      <h3>11. ML 特徵資料庫（Feature Store）</h3>
      <ul>
        <li><strong>存什麼</strong>：為機器學習模型準備好的特徵資料</li>
        <li><strong>概念</strong>：「餵給 AI 模型的食材」</li>
        <li><strong>用途</strong>：預測性維護、異常偵測、良率預測</li>
      </ul>

      <h2>資料流向總覽</h2>
      <pre>現場設備
   ↓
[Layer 0：邊緣緩衝]      ← 不屬於 Medallion，是來源端
   ↓
[傳輸：訊息佇列]          ← 不屬於 Medallion，是管道
   ↓
Layer 1 Bronze（四種）
   ├─ 即時資料庫          ← 當前值，給控制和 HMI 用
   ├─ Historian           ← 原始歷史，永久保存
   ├─ 事件資料庫          ← 原始警報操作記錄
   └─ 資安審計日誌        ← 原始安全事件
   ↓ 彙總、計算、賦予情境
Layer 2 Silver（四種）
   ├─ 彙總時序資料        ← 小時/天的統計
   ├─ 批次記錄            ← 每批產品的故事
   ├─ KPI 計算            ← OEE、良率、效率
   └─ 品質統計 SPC        ← 製程管制狀態
   ↓ 整合、萃取
Layer 3 Gold（三種）
   ├─ 資料倉儲            ← 跨系統整合
   ├─ 報表/BI             ← 管理層儀表板
   └─ ML 特徵庫           ← AI 模型輸入</pre>

      <h2>三個平行關切（不屬於 Medallion 資料流）</h2>
      <p>這三類常被混入 Medallion 框架，但它們是獨立的關切面，不要混為一談：</p>
      <ul>
        <li><strong>資料流架構</strong>（Medallion L1/L2/L3）：操作資料如何流動</li>
        <li><strong>傳輸基礎設施</strong>（Pipeline）：訊息佇列、邊緣緩衝、網路/防火牆</li>
        <li><strong>設備管理</strong>（DevOps）：PLC 程式備份、HMI 專案備份、設備參數備份、版本控制</li>
      </ul>
      <p><strong>參考資料</strong>（橫跨所有層，提供情境，本身不流動）：組態資料庫（Tag定義、設備清單、警報設定）、使用者帳號與權限資料庫。</p>

      <h2>對應工業標準 ISA-95 / IEC 62264</h2>
      <ul>
        <li><strong>Layer 3 Gold</strong> ↔ Level 4：ERP / 企業管理</li>
        <li><strong>Layer 2 Silver</strong> ↔ Level 3：MES / 製造執行</li>
        <li><strong>Layer 1 Bronze</strong> ↔ Level 1–2：SCADA / PLC / DCS</li>
      </ul>
    `
  },
  {
    id: "scada-data-centric-architecture",
    title: "SCADA 核心觀念：資料驅動架構（Data-Centric Architecture）",
    date: "2026-05-25",
    author: "Morris",
    content: `
      <h2>最重要的觀念：打破程式導向思維</h2>
      <p>學 SCADA 時最需要建立的認知轉換：</p>
      <ul>
        <li><strong>傳統程式思維</strong>：Code 是主體，資料跟著流動。<code>main()</code> → 邏輯流動 → 產生資料</li>
        <li><strong>SCADA 思維</strong>：Data 是主體，程式碼是反應者。Tag 資料庫（中心）← 所有服務圍著它轉</li>
      </ul>

      <h2>Tag 即時資料庫：SCADA 的真正主體</h2>
      <ul>
        <li>所有當前值都存在這裡（TIC-001=87.3°C, P-001=RUNNING...）</li>
        <li>沒有任何服務直接跟另一個服務說話</li>
        <li>全部透過 Tag 資料庫溝通</li>
        <li>這是系統的「<strong>單一資料來源</strong>」(Single Source of Truth)</li>
      </ul>

      <h2>運作模式：發布 / 訂閱（Pub/Sub）</h2>
      <p><strong>發布者（寫資料）</strong>：掃描引擎 → 從現場設備讀值 → 更新 Tag 資料庫</p>
      <p><strong>訂閱者（監視資料，自動反應）</strong>：</p>
      <ul>
        <li>警報引擎 → 監視 Tag 值是否超限 → 觸發警報</li>
        <li>Historian → 監視所有 Tag 變化 → 寫入歷史資料庫</li>
        <li>HMI → 監視畫面上的 Tag → 推送更新給操作員</li>
      </ul>
      <p><em>重點：沒有人等指令，每個服務都在「監視」，自動反應。</em></p>

      <h2>工廠類比：中央看板</h2>
      <p>不是「班長發號施令 → 工人執行」的模式，而是「<strong>中央看板 → 所有人看著它行動</strong>」：</p>
      <ul>
        <li><strong>看板顯示槽A溫度 87°C</strong> → 操作員繼續觀察、自動控制不動作、記錄員寫日誌、警報系統不響</li>
        <li><strong>看板顯示槽A溫度 91°C（超限）</strong> → 四個角色同時有反應，但沒有人「指揮」另一個人，每個角色根據自己的規則反應</li>
      </ul>
      <blockquote>Tag 資料庫 = 中央看板</blockquote>

      <h2>軟體服務架構</h2>
      <pre>           [ Tag 即時資料庫 ]
                  ↑↓
  ┌──────────┬────┴────┬──────────┐
  │          │         │          │
掃描引擎  警報引擎  Historian    HMI
(寫入)  (讀取/反應) (讀取/記錄) (讀取/顯示)</pre>
      <ul>
        <li><strong>掃描引擎</strong>：SCADA的心跳，每N秒問一次現場設備</li>
        <li><strong>警報引擎</strong>：監控數值，判斷是否超限，產生通知</li>
        <li><strong>Historian</strong>：把每個時間點的數值永久記錄到歷史DB</li>
        <li><strong>HMI服務</strong>：提供操作員介面，即時顯示數值</li>
        <li><strong>API服務</strong>：讓外部系統（MES/ERP）來存取資料</li>
      </ul>

      <h2>資料架構三層模型（Medallion Architecture）</h2>
      <p>工業資料從現場到決策，共經過三層處理：</p>
      <ul>
        <li><strong>Layer 1 Bronze — 原始層/操作層</strong>：發生了什麼？「TIC-001 在 14:32:05 是 87.3°C」，原始、精確、量大、不加詮釋</li>
        <li><strong>Layer 2 Silver — 情境層/加工層</strong>：這代表什麼？「下午班的平均溫度比昨天同時段高 1.2°C」，有情境、有比較基準</li>
        <li><strong>Layer 3 Gold — 分析層/商業層</strong>：對業務有什麼影響？「本週能源效率下降 3%，預估月底超出預算」，可以直接做決策</li>
      </ul>
      <p>對應工業標準 ISA-95：Layer 1 Bronze ↔ Level 1-2 SCADA/PLC、Layer 2 Silver ↔ Level 3 MES、Layer 3 Gold ↔ Level 4 ERP。</p>
      <p><em>Layer 1 四種資料庫的詳細展開，請見「SCADA 資料庫架構」篇。</em></p>

      <h2>常見混淆：不屬於 Medallion 資料流的三類</h2>
      <ul>
        <li><strong>組態資料庫</strong>：參考資料（Reference Data），描述系統，不流動</li>
        <li><strong>訊息佇列</strong>：傳輸基礎設施（Pipeline），資料的輸送帶，非終點</li>
        <li><strong>邊緣緩衝</strong>：Layer 0 來源端，資料進入系統之前的暫存</li>
        <li><strong>設備組態備份</strong>：DevOps 範疇，PLC程式/設備參數，與資料流無關</li>
      </ul>

      <h2>為什麼這樣設計？</h2>
      <ul>
        <li>任何功能掛掉不影響其他功能 → 沒有單一主體</li>
        <li>24小時不停機 → 各服務可獨立重啟</li>
        <li>功能可以擴充 → 加新服務只要接上 Tag DB</li>
        <li>多系統存取同一份資料 → 資料是中心，單一來源</li>
      </ul>

      <h2>商業 SCADA 平台（Ignition / WinCC）的做法</h2>
      <ul>
        <li><strong>外表</strong>：一個 SCADA Server 執行檔（看起來像有主體）</li>
        <li><strong>內部</strong>：仍然是各模組圍著共享 Tag DB 運作</li>
      </ul>
      <p>差別只是：自建系統各服務是獨立的程式/容器；商業平台各模組包在同一個執行檔裡。</p>

      <h2>關鍵風險點（SPOF）</h2>
      <p>Tag 資料庫本身是整個架構的最大弱點（Single Point of Failure）。解決方案：</p>
      <ul>
        <li>使用高可用性的 In-Memory DB（如 Redis Cluster）</li>
        <li>Active-Standby 熱備援，主DB失效自動切換</li>
        <li>各服務本地緩存最後一筆數值，短暫斷線不影響</li>
      </ul>

      <h2>心像更新</h2>
      <p><strong>舊心像（程式導向）</strong>：<code>main()</code> 控制一切 → 資料跟著流動</p>
      <p><strong>正確心像（資料導向）</strong>：Tag 資料庫是中心，各服務圍著它，各司其職，資料的「變化」驅動所有行為。</p>
      <p>對應製程直覺：就像生產線的「即時狀態」是中心，操作員、自控系統、記錄系統都在看同一份「現場狀態」，然後各自做自己該做的事。</p>
    `
  },
  {
    id: "prompt-engineering-techniques",
    title: "提示工程技巧總整理：8 個讓 AI 回答更精準的方法",
    date: "2026-05-22",
    author: "AI 生成文章",
    content: `
      <h2>基礎概念</h2>
      <p>提示工程的核心原則：<strong>問題要限制清楚，思考過程要給空間。兩者不衝突。</strong></p>
      <p>目前需要這些技巧，根本原因是 AI 缺乏上下文、不會主動追問、推理有時不穩定。這些技巧本質上是在補這些缺口。</p>

      <h2>技巧一覽</h2>

      <h3>1. Chain-of-Thought (CoT)</h3>
      <p>要求 AI 一步一步說出推理過程，而不是直接給答案。適合複雜問題，能降低跳步出錯的機率。</p>
      <blockquote>「請先列出這段程式的執行流程，再判斷每一步是否可能出錯，最後說明你的結論。」</blockquote>

      <h3>2. Few-shot（少量示例）</h3>
      <p>在提問時附上幾個輸入／輸出範例，讓 AI 直接模仿格式或風格，比用文字描述更直接有效。</p>
      <blockquote>「幫我把標題改成口語風格。原本：深度學習模型訓練方法探討 → 改後：我是怎麼訓練 AI 模型的。現在處理這個：週末健行心得分享」</blockquote>

      <h3>3. Role Prompting（角色設定）</h3>
      <p>給 AI 一個身份，讓它從特定領域視角回答，採用對應的判斷標準。</p>
      <blockquote>「你是一個有十年經驗的嵌入式工程師，請審查這段 ESP32 程式碼。」</blockquote>

      <h3>4. Constraint Prompting（限制條件）</h3>
      <p>明確說出不要什麼，比只說要什麼更有效。</p>
      <blockquote>「解釋這個演算法，不要用數學符號，不要超過五句話。」</blockquote>

      <h3>5. Output Format Prompting（指定輸出格式）</h3>
      <p>直接描述期望的輸出結構，例如指定 JSON 欄位或段落格式。</p>
      <blockquote>「用 JSON 格式回傳，欄位有 title、date、summary。」</blockquote>

      <h3>6. Decomposition（任務分解）</h3>
      <p>把大任務拆成多輪對話逐步完成，而不是一次塞給 AI。</p>
      <blockquote>第一輪：「先列出這篇技術文章的大綱」→ 第二輪：「展開第二節」→ 第三輪：「幫第二節加入程式碼範例」</blockquote>

      <h3>7. Self-Consistency（自我一致性）</h3>
      <p>要 AI 從多個角度分析問題，再選最一致的結論。適合重要決策。</p>
      <blockquote>「用三種不同角度分析這個架構設計，然後告訴我哪個角度最站得住腳。」</blockquote>

      <h3>8. Reflection（反思提示）</h3>
      <p>要 AI 檢查自己的輸出是否有誤，往往能觸發主動修正。</p>
      <blockquote>「你剛才的回答有沒有哪些地方可能是錯的？」</blockquote>

      <h2>永遠有效的基本功</h2>
      <p>無論 AI 再進步，這三點不會過時：</p>
      <ol>
        <li>目標明確</li>
        <li>給足背景</li>
        <li>說清楚「成功的答案長什麼樣子」</li>
      </ol>
    `
  },
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
