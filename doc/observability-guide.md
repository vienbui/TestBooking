# Observability Practices — Logging, Monitoring & Alerting

> Hướng dẫn từng bước cho từng mục nhỏ trong chủ đề Observability.
> Dùng để chuẩn bị cho Round 2 interview. Mỗi mục có checklist cụ thể — chỉ cần follow theo thứ tự.

---

## Mục lục

1. [Tổng quan Observability](#1-tổng-quan-observability)
2. [LOGGING — Thu thập dữ liệu](#2-logging--thu-thập-dữ-liệu)
    - 2.1 [Playwright Trace](#21-playwright-trace)
    - 2.2 [Screenshot & Video capture](#22-screenshot--video-capture)
    - 2.3 [Console log capture (browser errors)](#23-console-log-capture-browser-errors)
    - 2.4 [Network request/response logging](#24-network-requestresponse-logging)
    - 2.5 [Allure attachments (đính kèm data vào report)](#25-allure-attachments-đính-kèm-data-vào-report)
    - 2.6 [Structured test steps (test.step)](#26-structured-test-steps-teststep)
3. [MONITORING — Theo dõi liên tục](#3-monitoring--theo-dõi-liên-tục)
    - 3.1 [Allure Trend Charts (pass rate qua thời gian)](#31-allure-trend-charts-pass-rate-qua-thời-gian)
    - 3.2 [Flaky test tracking](#32-flaky-test-tracking)
    - 3.3 [Performance trend monitoring](#33-performance-trend-monitoring)
    - 3.4 [CI pipeline health metrics](#34-ci-pipeline-health-metrics)
    - 3.5 [Cross-browser failure monitoring](#35-cross-browser-failure-monitoring)
4. [ALERTING — Thông báo khi có vấn đề](#4-alerting--thông-báo-khi-có-vấn-đề)
    - 4.1 [GitHub Actions — PR blocking (đã có)](#41-github-actions--pr-blocking-đã-có)
    - 4.2 [Slack notification khi CI fail](#42-slack-notification-khi-ci-fail)
    - 4.3 [Email notification](#43-email-notification)
    - 4.4 [Performance regression alerting](#44-performance-regression-alerting)
    - 4.5 [Alerting strategy theo severity](#45-alerting-strategy-theo-severity)
5. [Interview Q&A](#5-interview-qa)

---

## 1. Tổng quan Observability

Observability = khả năng **hiểu được chuyện gì đang xảy ra** bên trong hệ thống mà không cần đoán.

Trong ngữ cảnh **QA Test Automation**, 3 trụ cột:

| Pillar         | Câu hỏi nó trả lời                 | Ví dụ                                                                         |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| **Logging**    | "Chuyện gì đã xảy ra?"             | Trace file ghi lại từng action, screenshot khi fail, console error từ browser |
| **Monitoring** | "Hệ thống đang khỏe không?"        | Dashboard theo dõi pass rate, flaky rate, performance trend qua nhiều builds  |
| **Alerting**   | "Ai được thông báo khi có vấn đề?" | Slack ping khi CI fail, email khi performance vượt ngưỡng                     |

### Mối quan hệ

```
Logging (thu thập data)
    ↓
Monitoring (phân tích data → dashboard)
    ↓
Alerting (khi dashboard vượt ngưỡng → thông báo)
```

Không có logging tốt → monitoring thiếu data → alerting vô nghĩa.

---

## 2. LOGGING — Thu thập dữ liệu

---

### 2.1 Playwright Trace

**Trace là gì?** File `.zip` ghi lại TOÀN BỘ những gì xảy ra trong browser: network requests, DOM snapshots, console output, action timeline. Có thể mở lại như "replay video" từng bước test.

**Bạn đang có:**

```typescript
// playwright.config.ts
use: {
    trace: 'on-first-retry',
}
```

**Các option cần biết giải thích:**

| Option                | Hành vi                                       | Storage cost       | Khi nào dùng                                           |
| --------------------- | --------------------------------------------- | ------------------ | ------------------------------------------------------ |
| `'off'`               | Không record                                  | 0                  | Production CI khi đã ổn định, tiết kiệm storage        |
| `'on'`                | Record MỌI test                               | Cao (~2-5 MB/test) | Local debug, khi cần investigate mọi test              |
| `'on-first-retry'`    | Chỉ record khi test fail rồi retry            | Thấp               | **Đang dùng** — balance giữa debug info và storage     |
| `'retain-on-failure'` | Record tất cả nhưng chỉ GIỮ LẠI file khi fail | Trung bình         | Khi muốn trace của lần chạy đầu tiên (không cần retry) |
| `'on-all-retries'`    | Record mỗi lần retry                          | Trung bình-Cao     | Khi cần so sánh trace giữa các lần retry               |

**Cách mở trace file:**

```bash
# Mở trace viewer
npx playwright show-trace test-results/<test-name>/trace.zip
```

**Bước chuẩn bị:**

- [ ] Chạy 1 test fail để tạo trace file: `npx playwright test --grep "BS-001" --retries=1`
- [ ] Mở trace viewer và explore: Network tab, Actions tab, Console tab, Snapshots
- [ ] Tập giải thích: "Trace cho phép tôi replay lại chính xác test đã làm gì, browser nhận response gì, DOM trông như thế nào tại mỗi thời điểm"

---

### 2.2 Screenshot & Video capture

**Là gì?** Playwright tự động chụp screenshot hoặc quay video khi test chạy, dựa theo cấu hình.

**Bước thực hiện nếu muốn thêm:**

1. Mở `playwright.config.ts`
2. Thêm vào block `use`:

```typescript
use: {
    baseURL: 'https://marsair.recruiting.thoughtworks.net',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',   // ← thêm dòng này
    video: 'retain-on-failure',      // ← thêm dòng này
}
```

**Các option:**

| Setting      | Option                | Hành vi                                           |
| ------------ | --------------------- | ------------------------------------------------- |
| `screenshot` | `'off'`               | Không chụp                                        |
|              | `'on'`                | Chụp sau mỗi test                                 |
|              | `'only-on-failure'`   | **Recommended** — chỉ chụp khi fail               |
| `video`      | `'off'`               | Không quay                                        |
|              | `'on'`                | Quay mọi test (tốn storage)                       |
|              | `'retain-on-failure'` | **Recommended** — quay hết nhưng chỉ giữ khi fail |
|              | `'on-first-retry'`    | Chỉ quay khi retry                                |

**Output đi đâu?**

- Screenshots & videos lưu trong `test-results/<test-name>/`
- Allure tự động attach vào report nếu dùng `allure-playwright` adapter

**Trade-off cần biết nói:**

|           | Bật                                      | Tắt                                       |
| --------- | ---------------------------------------- | ----------------------------------------- |
| **Ưu**    | Debug dễ hơn, có evidence khi report bug | CI nhanh hơn, ít storage                  |
| **Nhược** | CI chậm hơn, tốn disk                    | Fail mà không có screenshot → phải re-run |

**Bước chuẩn bị:**

- [ ] Biết giải thích tại sao chọn `'only-on-failure'` / `'retain-on-failure'` (balance giữa evidence và cost)
- [ ] Biết screenshot/video nằm ở đâu trong file system

---

### 2.3 Console log capture (browser errors)

**Là gì?** Bắt các `console.log`, `console.error`, `console.warn` **từ browser** khi test chạy. Giúp phát hiện JavaScript errors mà UI không hiện.

**Cách implement:**

Thêm listener trong fixture hoặc `beforeEach`:

```typescript
page.on('console', (msg) => {
    if (msg.type() === 'error') {
        console.log(`[BROWSER ERROR] ${msg.text()}`);
    }
});
```

**Nâng cao hơn — collect và assert:**

```typescript
const browserErrors: string[] = [];

page.on('console', (msg) => {
    if (msg.type() === 'error') {
        browserErrors.push(msg.text());
    }
});

// ... chạy test actions ...

// Cuối test, kiểm tra không có JS error nào
expect(browserErrors, 'Browser should have no console errors').toHaveLength(0);
```

**Đặt ở đâu trong project:**

| Vị trí                            | Ưu điểm                    | Khi nào                     |
| --------------------------------- | -------------------------- | --------------------------- |
| Trong `pageFixtures.ts` (fixture) | Apply cho MỌI test tự động | Khi muốn global logging     |
| Trong `beforeEach` của spec file  | Apply cho 1 describe block | Khi chỉ cần cho 1 nhóm test |
| Trong từng test case              | Linh hoạt nhất             | Khi chỉ 1 test cụ thể cần   |

**Bước chuẩn bị:**

- [ ] Hiểu `page.on('console', callback)` — Playwright event listener bắt browser console messages
- [ ] Biết phân biệt `msg.type()`: `'log'`, `'error'`, `'warning'`, `'info'`
- [ ] Biết giải thích use case: "Phát hiện JS runtime errors mà user không thấy trên UI nhưng ảnh hưởng functionality"

---

### 2.4 Network request/response logging

**Là gì?** Bắt các HTTP request/response khi browser tương tác với server. Giúp detect API errors, slow responses, unexpected redirects.

**Cách implement:**

```typescript
// Log failed HTTP responses
page.on('response', (response) => {
    if (response.status() >= 400) {
        console.log(`[HTTP ${response.status()}] ${response.url()}`);
    }
});

// Log failed requests (network error, timeout)
page.on('requestfailed', (request) => {
    console.log(`[REQUEST FAILED] ${request.url()} — ${request.failure()?.errorText}`);
});
```

**Use cases:**

| Event                      | Bắt được gì                 | Ví dụ                           |
| -------------------------- | --------------------------- | ------------------------------- |
| `page.on('response')`      | Mọi HTTP response           | API trả 500, 404, slow response |
| `page.on('requestfailed')` | Request fail ở tầng network | DNS fail, timeout, CORS blocked |
| `page.on('request')`       | Mọi request gửi đi          | Audit request nào được gửi      |

**Bước chuẩn bị:**

- [ ] Hiểu Playwright network events: `request`, `response`, `requestfailed`, `requestfinished`
- [ ] Biết giải thích: "Network logging giúp tôi detect API-level failures mà test functional có thể miss — ví dụ server trả 500 nhưng UI vẫn hiện 'no results' thay vì error page"

---

### 2.5 Allure attachments (đính kèm data vào report)

**Là gì?** Gắn thêm files (screenshot, JSON, text, HTML) vào từng test case trong Allure Report. Ai đọc report có thể click xem ngay, không cần tìm file.

**Cách implement:**

```typescript
import { allure } from 'allure-playwright';

// Attach text
await allure.attachment('Error Details', 'Connection timeout after 30s', 'text/plain');

// Attach JSON (ví dụ API response)
await allure.attachment('API Response', JSON.stringify(responseBody, null, 2), 'application/json');

// Attach screenshot
const screenshot = await page.screenshot();
await allure.attachment('Page Screenshot', screenshot, 'image/png');
```

**Khi nào dùng:**

| Scenario         | Attach gì                             |
| ---------------- | ------------------------------------- |
| Test fail        | Screenshot, page HTML, console errors |
| Performance test | JSON với tất cả metrics đo được       |
| API test         | Request/response body                 |
| Debug flaky test | Video, trace file link                |

**Bước chuẩn bị:**

- [ ] Biết `allure-playwright` package export `allure` object với method `attachment(name, content, type)`
- [ ] Biết giải thích: "Allure attachments giúp mọi evidence nằm ngay trong report — reviewer không cần access server hoặc CI artifacts riêng"

---

### 2.6 Structured test steps (test.step)

**Bạn đang có:** Sử dụng `test.step()` trong nhiều test case.

**Là gì?** Chia test thành các sub-steps có tên, hiển thị trong report như một tree structure. Mỗi step có status riêng (pass/fail).

**Ví dụ trong project hiện tại:**

```typescript
// tests/searchFlight.spec.ts
await test.step('Header and navigation links', async () => {
    await homePage.verifyHomePageIsLoaded();
    await homePage.verifyHeaderLogoIsVisible();
    // ...
});

await test.step('Search form elements', async () => {
    await homePage.searchFormComponent.verifySearchFormIsVisible();
    // ...
});
```

**Trong report thể hiện:**

```
[BS-001] Verify home page is loaded
  ├── ✅ Header and navigation links
  │     ├── verifyHomePageIsLoaded
  │     └── verifyHeaderLogoIsVisible
  └── ✅ Search form elements
        ├── verifySearchFormIsVisible
        └── verifyDefaultValue
```

**Tại sao đây là logging:**

- Mỗi `test.step` = 1 structured log entry
- Khi step fail → report chỉ CHÍNH XÁC step nào fail
- Không cần đọc code, không cần re-run

**Bước chuẩn bị:**

- [ ] Biết giải thích `test.step` là một dạng structured logging — mỗi step ghi lại "action gì, lúc nào, pass hay fail"
- [ ] Biết so sánh: không có `test.step` → chỉ biết test fail; có `test.step` → biết step nào fail
- [ ] Biết link với Allure: Allure render `test.step` thành nested tree trong Suites tab

---

## 3. MONITORING — Theo dõi liên tục

---

### 3.1 Allure Trend Charts (pass rate qua thời gian)

**Là gì?** Biểu đồ trong Allure Dashboard hiển thị pass/fail trend qua nhiều CI builds. Cho thấy test suite đang ổn định hay xuống dốc.

**Yêu cầu:** Persist `history/` folder giữa các CI builds.

**Cách set up trong GitHub Actions:**

1. Sau khi test chạy xong, copy `allure-report/history/` ra nơi lưu trữ (GitHub Pages, artifact)
2. Ở build tiếp theo, copy `history/` cũ vào `allure-results/history/` TRƯỚC khi generate report
3. `allure generate` sẽ đọc history và vẽ trend chart

**Flow trong CI:**

```
Build N:
  1. Checkout code
  2. Tải history/ từ build N-1 → copy vào allure-results/history/
  3. Run tests → allure-results/ (chứa cả history cũ)
  4. allure generate → allure-report/ (có trend chart)
  5. Upload allure-report/ (bao gồm history/ mới)

Build N+1:
  1. Checkout code
  2. Tải history/ từ build N → copy vào allure-results/history/
  3. ... lặp lại
```

**GitHub Actions steps cần thêm:**

```yaml
# Bước 1: Lấy history từ GitHub Pages (nơi lưu report cũ)
- name: Get previous Allure history
  uses: actions/checkout@v4
  with:
      ref: gh-pages
      path: gh-pages
  continue-on-error: true

# Bước 2: Copy history vào allure-results
- name: Restore Allure history
  run: |
      mkdir -p allure-results/history
      cp -r gh-pages/history/* allure-results/history/ 2>/dev/null || true

# Bước 3: Generate report (trend chart sẽ có data)
- name: Generate Allure report
  run: npx allure generate allure-results --clean -o allure-report

# Bước 4: Publish lên GitHub Pages (để build sau lấy history)
- name: Deploy to GitHub Pages
  if: github.ref == 'refs/heads/main'
  uses: peaceiris/actions-gh-pages@v4
  with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: ./allure-report
```

**Trend chart cho thấy gì:**

| Trend              | Ý nghĩa                      | Action                       |
| ------------------ | ---------------------------- | ---------------------------- |
| Stable 100%        | Test suite healthy           | Maintain                     |
| Giảm từ 100% → 95% | Recent commit gây regression | Investigate commit đó        |
| Dao động lên xuống | Flaky tests                  | Prioritize de-flake          |
| Đi xuống dần       | Quality deteriorating        | Stop feature work, fix tests |

**Bước chuẩn bị:**

- [ ] Hiểu flow: history cũ → allure-results/history/ → allure generate → report có trend
- [ ] Biết giải thích: "Trend chart là monitoring tool — cho thấy test suite health qua thời gian, phát hiện regression pattern"
- [ ] Biết nói về GitHub Pages deployment như cách publish report cho team

---

### 3.2 Flaky test tracking

**Là gì?** Theo dõi những test fail rồi pass khi retry — đây là test không đáng tin cậy.

**Bạn đang có:**

```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

**Cách Allure detect flaky:**

```
Lần 1: ❌ FAIL
Lần 2 (retry): ✅ PASS
→ Allure đánh dấu: 🔥 FLAKY
```

**Metrics cần track:**

| Metric            | Công thức                          | Ngưỡng               |
| ----------------- | ---------------------------------- | -------------------- |
| Flaky rate        | (số test flaky / tổng test) × 100% | < 5% là acceptable   |
| Flaky count trend | Số test flaky qua mỗi build        | Nên giảm hoặc stable |
| Top flaky tests   | Tests flaky nhiều nhất             | Fix ưu tiên cao      |

**Quy trình xử lý flaky test:**

```
1. Allure flag test là FLAKY
2. Review test: timing issue? data dependency? race condition?
3. Fix root cause (thêm wait, isolate data, retry logic)
4. Monitor: test còn flaky ở build tiếp không?
5. Nếu không fix được ngay → quarantine (tách riêng, chạy nightly)
```

**Bước chuẩn bị:**

- [ ] Biết giải thích flaky test = test không deterministic, pass/fail khác nhau mỗi lần chạy
- [ ] Biết retry mechanism: Playwright retry + Allure tự detect
- [ ] Biết flaky rate < 5% là healthy, > 10% là vấn đề nghiêm trọng
- [ ] Biết nói về quarantine strategy: tách flaky test riêng để không block CI

---

### 3.3 Performance trend monitoring

**Là gì?** Theo dõi các metrics performance (TTFB, FCP, page load, search time) qua nhiều builds để phát hiện regression.

**Bạn đang có:** Performance tests đo TTFB, FCP, Page Load, Search Response (file `tests/performance.spec.ts`).

**Cách monitoring hoạt động:**

```
Build #100: TTFB = 200ms ✅
Build #101: TTFB = 220ms ✅
Build #102: TTFB = 250ms ✅
Build #103: TTFB = 800ms ✅ (still under 1500ms, but 4x increase!)
Build #104: TTFB = 1600ms ❌ FAIL → alert
```

**Vấn đề:** Test chỉ fail khi vượt threshold. Nhưng trend từ 200ms → 800ms đã là warning dù chưa fail.

**Giải pháp nâng cao (biết nói, không cần implement):**

1. **Allure metrics attachment** — mỗi build attach JSON chứa performance values, review qua report
2. **Custom dashboard** — export metrics ra CSV/JSON, vẽ chart bằng Grafana hoặc Google Sheets
3. **Percentage-based threshold** — alert khi metric tăng > 50% so với rolling average

**Bước chuẩn bị:**

- [ ] Biết giải thích: "Performance test chỉ catch threshold breach; monitoring catch TREND — metric tăng dần dù chưa fail"
- [ ] Biết nói: "Trong project production, tôi sẽ export metrics ra time-series database và dùng Grafana dashboard"
- [ ] Biết link: performance test → metric data → trend analysis → alerting

---

### 3.4 CI pipeline health metrics

**Là gì?** Theo dõi sức khỏe của chính CI pipeline — không chỉ test results mà cả tốc độ, stability.

**Metrics cần track:**

| Metric                  | Đo cái gì                 | Target    | Đo bằng gì             |
| ----------------------- | ------------------------- | --------- | ---------------------- |
| **Pass rate**           | % test pass mỗi build     | ≥ 95%     | Allure overview        |
| **Pipeline duration**   | Tổng thời gian CI chạy    | < 15 phút | GitHub Actions timing  |
| **Test execution time** | Thời gian chạy test suite | < 5 phút  | Playwright report      |
| **Flaky rate**          | % test flaky              | < 5%      | Allure flaky count     |
| **Build success rate**  | % builds thành công       | ≥ 90%     | GitHub Actions history |
| **Time to fix**         | Thời gian từ fail → fix   | < 24 giờ  | Git history            |

**Cách xem trên GitHub:**

- GitHub Actions → Repository → Actions tab → xem lịch sử builds
- Mỗi build có duration, status (success/failure)
- Filter by branch, actor, status

**Bước chuẩn bị:**

- [ ] Biết liệt kê 5-6 CI health metrics
- [ ] Biết giải thích: "Monitoring CI pipeline giúp team biết quality gate đang hoạt động hiệu quả không"
- [ ] Biết target values và tại sao (ví dụ: pass rate < 95% → quá nhiều failures, team mất niềm tin vào test suite)

---

### 3.5 Cross-browser failure monitoring

**Bạn đang có:** Chạy test trên 3 browsers (Chromium, Firefox, WebKit).

**Cách monitoring:**

| Pattern                            | Nghĩa gì                    | Action                           |
| ---------------------------------- | --------------------------- | -------------------------------- |
| Test fail trên CẢ 3 browsers       | Application bug             | File bug, fix app                |
| Test fail chỉ trên 1 browser       | Browser compatibility issue | Check CSS/JS compatibility       |
| Test flaky chỉ trên 1 browser      | Browser-specific timing     | Thêm wait, điều chỉnh timeout    |
| Test fail trên CI nhưng pass local | Environment difference      | Check OS, headless mode, network |

**Allure hiện thị:**

- Suites tab → 3 suites: `chromium`, `firefox`, `webkit`
- So sánh pass/fail giữa 3 suites
- Nếu `webkit` có nhiều failures hơn → investigate WebKit-specific issues

**Bước chuẩn bị:**

- [ ] Biết đọc Allure Suites tab để so sánh cross-browser
- [ ] Biết giải thích: "Cross-browser monitoring cho thấy liệu bug là application-level hay browser-specific"
- [ ] Biết ví dụ: "Nếu tôi thấy 1 test fail chỉ trên Firefox, tôi sẽ check CSS rendering hoặc JS engine difference"

---

## 4. ALERTING — Thông báo khi có vấn đề

---

### 4.1 GitHub Actions — PR blocking (đã có)

**Bạn đang có:**

```yaml
# .github/workflows/playwright.yml
on:
    push:
        branches: [main, master]
    pull_request:
        branches: [main, master]
```

**Đây là alerting level 1:** CI tự fail → PR bị block → không merge được code xấu.

**Để enforce:**

1. GitHub → Repository → Settings → Branches → Branch protection rules
2. Enable **"Require status checks to pass before merging"**
3. Chọn workflow `test` làm required check
4. Kết quả: PR không thể merge nếu test fail

**Bước chuẩn bị:**

- [ ] Biết giải thích: "GitHub Actions là alerting mechanism đầu tiên — prevent bad code from reaching main branch"
- [ ] Biết nói về branch protection rules → required status checks

---

### 4.2 Slack notification khi CI fail

**Là gì?** Gửi message vào Slack channel khi CI pipeline fail — team biết ngay không cần vào GitHub.

**Cần gì:**

| #   | Việc cần làm                       | Chi tiết                                                         |
| --- | ---------------------------------- | ---------------------------------------------------------------- |
| 1   | Tạo Slack App                      | Vào https://api.slack.com/apps → Create New App                  |
| 2   | Enable Incoming Webhooks           | App Settings → Incoming Webhooks → Activate                      |
| 3   | Tạo Webhook URL                    | Add New Webhook to Workspace → chọn channel (ví dụ `#qa-alerts`) |
| 4   | Lưu Webhook URL vào GitHub Secrets | Repository → Settings → Secrets → New: `SLACK_WEBHOOK_URL`       |
| 5   | Thêm step vào workflow             | Xem YAML bên dưới                                                |

**YAML cần thêm vào `.github/workflows/playwright.yml`:**

```yaml
# Thêm SAU step "Run Playwright tests"
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v2
  with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
      webhook-type: incoming-webhook
      payload: |
          {
            "text": "🔴 Playwright Tests Failed",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*🔴 Test Suite Failed*\n*Branch:* `${{ github.ref_name }}`\n*Commit:* `${{ github.sha }}`\n*Author:* ${{ github.actor }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View CI Run>"
                }
              }
            ]
          }
```

**Giải thích từng phần:**

| Phần                              | Ý nghĩa                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `if: failure()`                   | Chỉ chạy step này khi step trước FAIL                     |
| `slackapi/slack-github-action@v2` | Official GitHub Action từ Slack                           |
| `webhook`                         | Webhook URL lấy từ GitHub Secrets                         |
| `payload`                         | Nội dung message: branch, commit, author, link đến CI run |

**Kết quả trong Slack:**

```
🔴 Test Suite Failed
Branch: feature/add-search
Commit: abc1234
Author: vbui
View CI Run (link)
```

**Bước chuẩn bị:**

- [ ] Biết liệt kê 5 steps cần làm (tạo app → webhook → secret → YAML)
- [ ] Biết giải thích `if: failure()` chỉ trigger khi previous step fail
- [ ] Biết giải thích tại sao dùng Secrets: "Webhook URL là sensitive — không commit vào code"

---

### 4.3 Email notification

**Là gì?** Gửi email khi CI fail — cho stakeholders không dùng Slack.

**Cách 1: GitHub built-in notification**

| #   | Việc cần làm                                        |
| --- | --------------------------------------------------- |
| 1   | GitHub → Settings → Notifications                   |
| 2   | Enable "Actions" notifications                      |
| 3   | Chọn "Send notifications for failed workflows only" |
| 4   | GitHub tự gửi email khi workflow fail               |

**Cách 2: Custom email trong GitHub Actions (dùng SendGrid/SMTP)**

```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
      server_address: smtp.gmail.com
      server_port: 465
      username: ${{ secrets.EMAIL_USERNAME }}
      password: ${{ secrets.EMAIL_PASSWORD }}
      subject: '🔴 Test Failed — ${{ github.repository }}'
      body: |
          Test suite failed on branch ${{ github.ref_name }}.
          Commit: ${{ github.sha }}
          Author: ${{ github.actor }}
          View run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
      to: qa-team@company.com
      from: ci-bot@company.com
```

**Cần gì:**

| #   | Việc cần làm                                       |
| --- | -------------------------------------------------- |
| 1   | Chọn SMTP provider (Gmail, SendGrid, company SMTP) |
| 2   | Tạo app password hoặc API key                      |
| 3   | Lưu credentials vào GitHub Secrets                 |
| 4   | Thêm step vào workflow                             |

**Bước chuẩn bị:**

- [ ] Biết 2 cách: GitHub built-in (đơn giản) vs custom SMTP (linh hoạt)
- [ ] Biết giải thích: "Email cho stakeholders không check Slack thường xuyên — managers, PMs"

---

### 4.4 Performance regression alerting

**Là gì?** Thông báo KHI performance metrics xấu đi — không đợi đến khi vượt threshold.

**Liên kết với những gì bạn có:**

```typescript
// tests/performance.spec.ts
const PERF_THRESHOLDS = {
    ttfb: 1500,
    fcp: 2500,
    pageLoad: 5000,
    searchResponse: 3000,
};
```

**Hiện tại:** Test chỉ FAIL khi vượt threshold → alert qua CI fail → Slack/email.

**Nâng cao (biết nói, không cần implement):**

| Level                 | Cơ chế            | Ví dụ                                                          |
| --------------------- | ----------------- | -------------------------------------------------------------- |
| **Level 1** (đang có) | Threshold-based   | TTFB > 1500ms → test fail → CI alert                           |
| **Level 2**           | Warning threshold | TTFB > 1000ms → test pass nhưng log warning                    |
| **Level 3**           | Trend-based       | TTFB tăng > 50% so với 5 builds gần nhất → alert               |
| **Level 4**           | Anomaly detection | TTFB vượt 2 standard deviations so với historical data → alert |

**Cách implement Level 2 (warning threshold):**

```typescript
const WARNING_THRESHOLDS = {
    ttfb: 1000, // warn at 1000ms, fail at 1500ms
    fcp: 2000, // warn at 2000ms, fail at 2500ms
};

await test.step(`TTFB: ${ttfb}ms`, async () => {
    if (ttfb > WARNING_THRESHOLDS.ttfb) {
        console.warn(
            `⚠️ TTFB approaching threshold: ${ttfb}ms (warn: ${WARNING_THRESHOLDS.ttfb}ms, fail: ${PERF_THRESHOLDS.ttfb}ms)`,
        );
    }
    expect(ttfb).toBeLessThan(PERF_THRESHOLDS.ttfb);
});
```

**Bước chuẩn bị:**

- [ ] Biết giải thích 4 levels từ simple → advanced
- [ ] Biết nói: "Threshold-based chỉ catch khi đã quá muộn; trend-based catch sớm hơn"
- [ ] Biết link với monitoring: "Performance data cần được track qua thời gian để có context"

---

### 4.5 Alerting strategy theo severity

**Là gì?** Không phải mọi failure đều cần cùng mức urgency. Phân loại failure → route đến đúng channel.

**Strategy matrix:**

| Failure Type                       | Severity | Alert Channel                  | Response Time | Ví dụ                       |
| ---------------------------------- | -------- | ------------------------------ | ------------- | --------------------------- |
| **Security test fail**             | Critical | Email to security team + Slack | < 4 giờ       | XSS vulnerability detected  |
| **Functional test fail trên main** | High     | Slack `#qa-alerts` + PR block  | < 24 giờ      | Search không trả kết quả    |
| **Performance threshold breach**   | High     | Slack `#qa-alerts`             | < 24 giờ      | TTFB > 1500ms               |
| **Performance warning**            | Medium   | Slack `#qa-monitoring`         | Next sprint   | TTFB tăng 50%               |
| **Accessibility regression**       | Medium   | Slack + JIRA ticket            | Next sprint   | New critical a11y violation |
| **Flaky test detected**            | Low      | Weekly report email            | Within sprint | Test pass on retry          |
| **Visual regression**              | Low      | Slack `#qa-visual`             | Review in PR  | Screenshot diff detected    |

**Cách implement trong CI:**

```yaml
# Alert cho security failures
- name: Alert security team
  if: failure() && contains(github.job, 'security')
  # ... gửi email đến security team

# Alert cho performance
- name: Alert performance regression
  if: failure() && contains(github.job, 'performance')
  # ... gửi Slack đến #performance channel

# General alert
- name: Alert QA team
  if: failure()
  # ... gửi Slack đến #qa-alerts
```

**Bước chuẩn bị:**

- [ ] Biết giải thích: "Không phải mọi alert đều urgent — phân loại giúp team không bị alert fatigue"
- [ ] Biết nói về **alert fatigue**: "Nếu mọi thứ đều urgent, team sẽ ignore tất cả"
- [ ] Biết vẽ ra severity matrix như bảng trên

---

## 5. Interview Q&A

### Q: "What observability practices do you follow in your test automation?"

> "I structure observability around three pillars. For **logging**, I use Playwright traces that capture full browser activity — network requests, DOM snapshots, console output — on test failures. I also use structured `test.step()` so each test action appears as a named entry in the Allure report. For **monitoring**, I track pass rate trends, flaky test rates, and performance metrics across CI builds through Allure's history feature. For **alerting**, CI blocks PRs when tests fail, and I configure Slack notifications for build failures so the team knows immediately without checking GitHub."

### Q: "How do you handle logging in Playwright tests?"

> "Multiple layers. First, Playwright traces — configured as `'on-first-retry'` to capture full browser activity only when a test fails and retries. This includes network requests, DOM snapshots, and console output. Second, `test.step()` in the code creates structured log entries in the report. Third, I capture browser console errors via `page.on('console')` to catch JavaScript runtime errors the UI doesn't surface. Fourth, screenshots on failure provide visual evidence. All of this flows into the Allure report so anyone reviewing the results has complete context."

### Q: "How do you monitor test suite health over time?"

> "Allure's trend charts show pass rate across CI builds — I persist the history folder between builds to enable this. I monitor five key metrics: pass rate should stay above 95%, flaky rate below 5%, pipeline duration under 15 minutes, cross-browser parity between Chromium/Firefox/WebKit, and performance metrics trending stable. If pass rate drops or flaky rate rises across three consecutive builds, that's a signal to stop feature work and investigate."

### Q: "How do you set up alerting for test failures?"

> "I use a tiered approach. Level 1 is CI blocking PRs — already in place via GitHub Actions. Level 2 is Slack notifications on failure — a webhook sends a message to `#qa-alerts` with branch, commit, author, and a link to the CI run. Level 3 is email for stakeholders who don't monitor Slack. I also differentiate by severity: security test failures go to the security team immediately, functional failures block the PR, performance warnings go to a monitoring channel, and flaky tests go into a weekly digest. This prevents alert fatigue while ensuring critical issues get fast response."

### Q: "What's the difference between monitoring and alerting?"

> "Monitoring is passive — it's the dashboard that shows trends and current state. You look at it when you want to understand health. Alerting is active — it pushes a notification to you when something crosses a threshold. Monitoring answers 'how are we doing?' while alerting answers 'something just went wrong.' You need both: monitoring for context and pattern recognition, alerting for immediate response to incidents."

### Q: "How do you prevent alert fatigue?"

> "Three strategies. First, **severity-based routing** — not every failure goes to the same channel. Security failures alert the security team; flaky tests go into a weekly report, not an immediate ping. Second, **actionable alerts only** — every alert must have enough context (branch, commit, link) for someone to start investigating immediately. Third, **signal vs noise** — I keep the flaky rate low so that when a test fails, it's meaningful. If flaky tests flood the alerts, team members start ignoring them."

### Q: "What would you improve about observability in your current project?"

> "Three things. First, I'd add Slack webhook integration to the CI pipeline — currently the only alert is GitHub's built-in PR blocking. Second, I'd set up Allure history persistence on GitHub Pages so the trend charts track regression patterns across builds. Third, I'd add performance warning thresholds alongside the hard thresholds — alert when TTFB increases 50% even if it's still under the absolute limit, to catch degradation early before it becomes a failure."

---

## Quick Reference — Tổng hợp tất cả cần chuẩn bị

### Logging checklist

- [ ] Giải thích được Playwright trace: là gì, các config options, cách mở trace viewer
- [ ] Giải thích được screenshot/video capture: options, trade-off storage vs evidence
- [ ] Biết `page.on('console')` bắt browser console messages
- [ ] Biết `page.on('response')` bắt HTTP responses
- [ ] Biết Allure attachments gắn evidence vào report
- [ ] Biết `test.step()` là structured logging cho test execution

### Monitoring checklist

- [ ] Giải thích được Allure trend chart: cần history, cách persist trong CI
- [ ] Biết flaky test tracking: cách Allure detect, flaky rate metric, quarantine strategy
- [ ] Biết performance trend monitoring: threshold vs trend, warning levels
- [ ] Liệt kê được 5+ CI health metrics (pass rate, duration, flaky rate...)
- [ ] Biết đọc cross-browser results trong Allure

### Alerting checklist

- [ ] Giải thích được CI PR blocking (đã có)
- [ ] Biết 5 steps setup Slack notification (Slack app → webhook → secret → YAML)
- [ ] Biết email notification: GitHub built-in vs custom SMTP
- [ ] Biết phân loại severity → route đến đúng channel
- [ ] Biết giải thích alert fatigue và cách phòng tránh
