# Allure Report — Comprehensive Guide

> Written from a Senior QA perspective.
> Use this as a reference for onboarding juniors or preparing for QA interviews.

---

## Table of Contents

1. [What Is Allure Report and Why Use It](#1-what-is-allure-report-and-why-use-it)
2. [Setup — Step by Step](#2-setup--step-by-step)
3. [Understanding allure-results vs allure-report](#3-understanding-allure-results-vs-allure-report)
4. [How to Run Locally](#4-how-to-run-locally)
5. [Reading the Allure Dashboard](#5-reading-the-allure-dashboard)
6. [How to Demo in an Interview](#6-how-to-demo-in-an-interview)
7. [CI/CD Integration](#7-cicd-integration)
8. [Common Pitfalls and Troubleshooting](#8-common-pitfalls-and-troubleshooting)
9. [Interview Q&A — Frequently Asked Questions](#9-interview-qa--frequently-asked-questions)

---

## 1. What Is Allure Report and Why Use It

Allure is an **open-source test reporting framework** widely adopted in the QA industry. It takes raw test results and transforms them into a rich, interactive HTML dashboard.

### Why Allure over Playwright's built-in HTML report?

| Aspect                 | Playwright HTML Report        | Allure Report                                                  |
| ---------------------- | ----------------------------- | -------------------------------------------------------------- |
| **Audience**           | Developers debugging failures | QA leads, PMs, stakeholders                                    |
| **Dashboard richness** | Basic pass/fail list          | Pie charts, trend graphs, timeline, categories                 |
| **History trends**     | No (single run only)          | Yes (across CI builds)                                         |
| **Flaky detection**    | Manual inspection             | Automatic — flags tests that pass on retry                     |
| **Tool-agnostic**      | Playwright only               | Same dashboard for Playwright, Selenium, REST API, JUnit, etc. |
| **Categories/Labels**  | Limited                       | Rich — Epic, Feature, Story, Severity, custom labels           |
| **Industry adoption**  | Internal dev tool             | Industry standard — recognized in interviews                   |

### When to choose Allure

- You need a **stakeholder-facing** report (PMs, managers, clients)
- You run tests in **CI/CD** and want trend tracking across builds
- You want a **tool-agnostic** reporting standard across multiple test frameworks
- You want **zero custom code** — just install, configure, done

---

## 2. Setup — Step by Step

### Step 1 — Install the Allure Playwright adapter

```bash
npm install --save-dev allure-playwright
```

This is the bridge between Playwright and Allure. When tests run, this adapter writes raw JSON results.

### Step 2 — Install the Allure CLI

The adapter only _collects_ data. You need the CLI to _generate_ the visual report.

```bash
npm install --save-dev allure-commandline
```

Alternative (macOS):

```bash
brew install allure
```

### Step 3 — Configure the reporter in `playwright.config.ts`

```typescript
reporter: [
    ['html'], // keeps Playwright's built-in report
    ['allure-playwright', { outputFolder: 'allure-results' }], // adds Allure
];
```

The `outputFolder` option explicitly tells Allure where to write results. Without it, results go to `allure-results/` by default, but being explicit avoids confusion.

### Step 4 — Add to `.gitignore`

```
allure-results/
allure-report/
```

These folders contain generated artifacts — they should not be committed to version control.

### Step 5 — Verify installation

```bash
npx playwright test          # should create allure-results/ with JSON files
ls allure-results/           # confirm *.json files exist
npx allure serve allure-results  # should open dashboard in browser
```

---

## 3. Understanding allure-results vs allure-report

This is the most common confusion point for beginners. They are two different things:

```
npx playwright test          npx allure generate             npx allure open
────────────────── ──▶  allure-results/  ──▶  ──────────────────── ──▶  allure-report/  ──▶  Browser
   (run tests)          (raw JSON data)     (generate dashboard)      (static HTML)
```

### allure-results/ — Raw data (INPUT)

- **Created by:** `allure-playwright` adapter during test execution
- **Contains:** JSON files — one per test case, plus containers for suites/hooks
    - `*-result.json` — test name, status (passed/failed/broken/skipped), duration, error messages
    - `*-container.json` — metadata about describe blocks, beforeEach/afterEach hooks
    - `*-attachment.*` — screenshots, traces, videos (if configured)
- **Human-readable?** Technically yes (it's JSON), but not practical
- **Persist in CI?** Yes — this is the source of truth. Keep it as a CI artifact.

### allure-report/ — Dashboard (OUTPUT)

- **Created by:** `allure generate` CLI command
- **Contains:** A complete static website
    - `index.html` — entry point
    - `app.js`, `styles.css` — dashboard UI
    - `data/` — processed data (suites.json, categories.json, timeline.json)
    - `widgets/` — data powering the overview page widgets
    - `history/` — trend data across runs
- **Human-readable?** Yes — open in any browser
- **Persist in CI?** Optional — can always be regenerated from allure-results

### Key insight

> `allure-results` is **data**. `allure-report` is **presentation**.
> You can regenerate the report anytime from the results. You cannot regenerate results without re-running tests.

---

## 4. How to Run Locally

### Quick run (for development)

```bash
npx playwright test
npx allure serve allure-results
```

`allure serve` = generate + start local server + open browser — all in one command.

### Clean run (for demos)

```bash
rm -rf allure-results allure-report
npx playwright test
npx allure serve allure-results
```

Always delete `allure-results/` before a fresh run. Otherwise, results from previous runs accumulate and the report shows duplicate/stale data (e.g., 417 tests instead of 126).

### Recommended npm scripts

Add to `package.json`:

```json
"scripts": {
  "test": "npx playwright test",
  "test:report": "rm -rf allure-results && npx playwright test && npx allure serve allure-results",
  "report:generate": "npx allure generate allure-results --clean -o allure-report",
  "report:open": "npx allure open allure-report"
}
```

| Script                    | When to use                                               |
| ------------------------- | --------------------------------------------------------- |
| `npm test`                | Quick test run, no report                                 |
| `npm run test:report`     | Full run + auto-open Allure dashboard (demos, interviews) |
| `npm run report:generate` | Generate static HTML (for CI artifact upload)             |
| `npm run report:open`     | Open previously generated report                          |

---

## 5. Reading the Allure Dashboard

### 5.1 Overview Page

The landing page gives a high-level health check at a glance.

| Section                 | What it shows                                  | What to look for                                           |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **Donut chart**         | Pass rate (e.g., 100%, 95%)                    | Any red/orange slices = failures to investigate            |
| **Test cases count**    | Total executions (e.g., 126)                   | Should match: scenarios × browsers (42 × 3 = 126)          |
| **SUITES**              | Grouped by browser (chromium, firefox, webkit) | Uneven counts between browsers = browser-specific failures |
| **TREND**               | Pass/fail trend across builds                  | Requires history from previous CI runs                     |
| **ENVIRONMENT**         | OS, browser version, build number              | Empty unless you write `environment.properties`            |
| **FEATURES BY STORIES** | Tests grouped by feature/story                 | Quick view of coverage per feature                         |
| **CATEGORIES**          | Failure classification                         | Product defects vs test defects vs environment issues      |
| **EXECUTORS**           | CI build info                                  | Shows which CI job generated this report                   |

### 5.2 Suites Tab

Shows all tests organized in a tree: Suite → Test → Steps.

**What to demonstrate:**

- Expand a test to see `test.step()` breakdown — each step appears as a child node with its own pass/fail status
- Click on a failed step to see the error message, stack trace, and any attachments (screenshots)

### 5.3 Timeline Tab

A Gantt chart showing when each test started and finished.

**How to read it:**

| Visual element                 | Meaning                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| **Rows (vertical)**            | Each row = one worker/thread                                                          |
| **Blocks (horizontal)**        | Each block = one test. Width = duration.                                              |
| **Multiple rows at same time** | Tests running in **parallel**                                                         |
| **Single row**                 | Tests running **sequentially**                                                        |
| **Block color**                | Green = passed, Red = failed, Yellow/Orange = broken/expected failure, Gray = skipped |
| **Long block**                 | Slow test — candidate for optimization                                                |

**Parallel execution example:**

```
Worker 1: ██ ██ ██ ██        ← fast tests
Worker 2: ██ ██ ██ ██        ← running at the same time
Worker 3: ████████████████   ← one slow test blocking this worker
```

The timeline is proof that `fullyParallel: true` in `playwright.config.ts` is working.

### 5.4 Graphs Tab

Statistical charts:

- **Status chart** — pie chart of pass/fail/broken/skipped
- **Severity chart** — distribution by severity tag (if you use `@allure.severity`)
- **Duration chart** — histogram of test durations. Long tail = tests to optimize.
- **Duration trend** — how execution time changes across builds (requires history)

### 5.5 Behaviors Tab

Groups tests by Epic → Feature → Story. Useful when you tag tests with Allure decorators:

```typescript
test('my test', async () => {
    await allure.epic('Booking');
    await allure.feature('Search Flight');
    await allure.story('Valid date range');
    // ...
});
```

### 5.6 Packages Tab

Groups tests by file path — mirrors your project's folder structure.

---

## 6. How to Demo in an Interview

### Opening (30 seconds)

> "I integrated Allure Report as part of my test reporting strategy. It generates a rich dashboard from Playwright results with zero custom code. Let me walk you through it."

### Demo Flow (5-7 minutes)

**1. Overview Page — Show scale and health**

> "We have 42 test scenarios running across 3 browsers — Chromium, Firefox, and WebKit — giving us 126 total executions. The 100% pass rate includes expected failures for known bugs, which I'll show next."

**2. Suites Tab — Show test organization and test.step()**

Click into a test like [BS-001] to show step breakdown.

> "Each test uses Playwright's `test.step()` so the report shows granular sub-steps. When a step fails, you know exactly which assertion broke without reading code."

**3. Known Bugs — Show test.fail() and test.fixme()**

Click into [PC-003] or [SEC-001].

> "I don't delete or skip tests for known bugs. I use `test.fail()` with a bug reference. The report marks these as 'expected failures' (green, not red). When a developer fixes the bug, the test automatically flips to 'unexpected pass' — serving as an early detection mechanism."

**4. Data-Driven Tests — Show parameterization**

Look at [BS-004] through [BS-008] entries.

> "Rather than one test per date combination, I use data-driven loops. Allure shows each combination as a separate entry — so if 'July to July (next year)' fails but 'December to December (next year)' passes, you pinpoint the exact boundary condition."

**5. Timeline Tab — Show parallel execution**

> "The timeline proves tests run in parallel. Multiple workers execute simultaneously, which is why 126 tests finish in about a minute. You can also spot bottleneck tests — any block that's visually wider than others is a candidate for optimization."

**6. Cross-Browser Coverage**

> "The 3 suites — Chromium, Firefox, WebKit — give us cross-browser confidence. If a test fails only on Firefox, Allure makes that immediately visible in the Suites breakdown."

### Closing Statement

> "In CI/CD, this report would be auto-generated after every build and published as a GitHub Pages site or CI artifact. I also persist history across builds to enable trend charts — so the team can spot regression patterns over time."

---

## 7. CI/CD Integration

### Why CI integration matters

Locally, you run `allure serve` to view results. In CI, there is no browser to open.
Instead, you **generate a static HTML report** and **publish it** where the team can access it.

### GitHub Actions — Full example with Allure

```yaml
name: Playwright Tests

on:
    push:
        branches: [main, master]
    pull_request:
        branches: [main, master]

jobs:
    test:
        timeout-minutes: 60
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: lts/*

            - name: Install dependencies
              run: npm ci

            - name: Install Playwright browsers
              run: npx playwright install --with-deps

            - name: Run Playwright tests
              run: npx playwright test
              continue-on-error: true # don't fail the workflow — we want the report even on failure

            - name: Generate Allure report
              run: npx allure generate allure-results --clean -o allure-report

            - name: Upload Allure report
              uses: actions/upload-artifact@v4
              if: ${{ !cancelled() }}
              with:
                  name: allure-report
                  path: allure-report/
                  retention-days: 30

            - name: Upload Playwright report
              uses: actions/upload-artifact@v4
              if: ${{ !cancelled() }}
              with:
                  name: playwright-report
                  path: playwright-report/
                  retention-days: 30
```

### Publishing options

| Method                          | How team accesses it                              | Complexity | Best for                                           |
| ------------------------------- | ------------------------------------------------- | ---------- | -------------------------------------------------- |
| **CI artifact download**        | GitHub Actions → select run → download zip        | Low        | Small teams, quick setup                           |
| **GitHub Pages**                | Permanent URL: `https://<user>.github.io/<repo>/` | Medium     | Open-source projects, interview demos              |
| **Allure Server** (self-hosted) | Dedicated Allure Server URL                       | High       | Enterprise teams needing history across all builds |
| **S3 / Azure Blob**             | Static website URL                                | Medium     | Cloud-native teams                                 |

### Enabling History Trends in CI

The TREND chart on the Overview page requires data from previous runs. To enable it:

```yaml
# Before generating: copy history from previous report
- name: Get previous Allure history
  uses: actions/checkout@v4
  with:
      ref: gh-pages
      path: gh-pages
  continue-on-error: true

- name: Restore history
  run: |
      mkdir -p allure-results/history
      cp -r gh-pages/history/* allure-results/history/ 2>/dev/null || true

# Now generate — the report will include trend data
- name: Generate Allure report with history
  run: npx allure generate allure-results --clean -o allure-report

# Publish to GitHub Pages (persists history for next run)
- name: Deploy to GitHub Pages
  if: github.ref == 'refs/heads/main'
  uses: peaceiris/actions-gh-pages@v4
  with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: ./allure-report
```

The cycle:

1. CI copies `history/` from the previous published report into `allure-results/history/`
2. `allure generate` reads that history and includes it in the new report
3. The new report (with updated history) is published to GitHub Pages
4. Next CI run repeats from step 1

---

## 8. Common Pitfalls and Troubleshooting

### Problem: "0 test cases" — Empty report

**Cause:** You ran `allure generate` or `allure serve` before running tests, so `allure-results/` didn't exist or was empty.

**Fix:** Always run tests first:

```bash
npx playwright test          # creates allure-results/
ls allure-results/           # verify *.json files exist
npx allure serve allure-results
```

### Problem: Report shows more tests than expected (e.g., 417 instead of 126)

**Cause:** You ran tests multiple times without clearing `allure-results/`. Each run appends new JSON files — Allure reads all of them and counts duplicates as separate tests.

**Fix:** Delete the folder before each run:

```bash
rm -rf allure-results
npx playwright test
npx allure serve allure-results
```

### Problem: TREND chart says "There is nothing to show"

**Cause:** No history data from previous runs.

**Fix:** For local development, this is expected — you only have one run. To get trends:

- In CI: persist `allure-report/history/` between builds (see CI section above)
- Locally (hacky): before re-running, copy `allure-report/history/` into `allure-results/history/`

### Problem: ENVIRONMENT section is empty

**Cause:** Allure needs an `environment.properties` file in `allure-results/`.

**Fix:** Create the file after tests run (typically in CI):

```bash
echo "Browser=Chromium, Firefox, WebKit" > allure-results/environment.properties
echo "OS=$(uname -s)" >> allure-results/environment.properties
echo "Node=$(node -v)" >> allure-results/environment.properties
echo "Playwright=$(npx playwright --version)" >> allure-results/environment.properties
```

### Problem: EXECUTORS section says "There is no information about test executors"

**Cause:** No executor metadata. This is auto-populated in CI environments (Jenkins plugin, GitHub Actions with Allure action).

**Fix:** Create `allure-results/executor.json`:

```json
{
    "name": "GitHub Actions",
    "type": "github",
    "buildName": "Build #123",
    "buildUrl": "https://github.com/<owner>/<repo>/actions/runs/<run_id>"
}
```

---

## 9. Interview Q&A — Frequently Asked Questions

### Q: Why did you choose Allure over other reporting tools?

> "Allure is the most widely adopted reporting tool in the QA automation community. It requires zero custom code — just install the adapter and configure the reporter. It produces a rich, interactive dashboard that non-technical stakeholders can understand. It's also framework-agnostic, so if the team later adds API tests with a different tool, the same Allure dashboard can aggregate all results."

### Q: What's the difference between `allure serve` and `allure open`?

> "`allure serve allure-results` does three things: generates the report, starts a local HTTP server, and opens the browser — all in one command. It's a convenience shortcut for development. `allure open allure-report` only starts a server for a previously generated report. In CI, you use neither — you just `allure generate` and upload the static files."

### Q: How do you handle flaky tests in Allure?

> "Allure automatically detects flaky tests when retries are configured. If a test fails on the first attempt but passes on retry, Allure flags it with a flaky icon. In `playwright.config.ts`, I set `retries: process.env.CI ? 2 : 0` so retries only happen in CI. The Allure dashboard then shows which tests are unstable — these become candidates for investigation and hardening."

### Q: How do you track known bugs in your test suite?

> "I use Playwright's `test.fail()` and `test.fixme()` annotations with a bug reference. For example: `test.fail(true, 'BUG#6: System shows code is not valid for check digit=0')`. In Allure, these appear as 'expected failures' (not red). When the developer fixes the bug, the test automatically flips to 'unexpected pass' which flags it in the next report — no manual tracking needed."

### Q: How does Allure integrate with CI/CD?

> "In GitHub Actions, after tests run, I add a step to `allure generate` the static HTML report and upload it as a build artifact. Team members can download and view it from any CI run. For more mature setups, I deploy the report to GitHub Pages for a permanent URL. I also persist the `history/` folder between builds so the TREND chart shows pass/fail patterns over time — useful for spotting regression trends."

### Q: What's the test count formula?

> "In this project: 42 test scenarios × 3 browsers (Chromium, Firefox, WebKit) = 126 total executions. Allure counts each browser execution as a separate test case because each one runs independently and could have different results. A test might pass on Chromium but fail on WebKit — Allure makes that difference visible."

### Q: How do you read the Timeline view?

> "The Timeline is a Gantt chart. Each row represents a worker thread. Blocks on the same row run sequentially; blocks on different rows at the same timestamp run in parallel. Block width = duration. Colors indicate status: green (passed), red (failed), yellow/orange (broken or expected failure), gray (skipped). Long blocks reveal bottleneck tests that slow down the entire suite."

### Q: Can Allure show test steps?

> "Yes. I use Playwright's `test.step()` in my tests — for example, separating 'Header and navigation links' from 'Search form elements' in a page verification test. Allure renders these as nested child steps under each test. When a step fails, the report shows exactly which sub-step broke, without needing to read the source code."

### Q: What would you improve about the current Allure setup?

> "Three things: (1) Add `environment.properties` to show browser versions, OS, and Node version in the report. (2) Configure Allure categories to auto-classify failures into 'Product defect', 'Test defect', and 'Environment issue' — this saves triage time. (3) Set up GitHub Pages deployment with history persistence so the TREND chart tracks regression patterns across builds."

---

## Quick Reference — Commands Cheat Sheet

```bash
# Install
npm install --save-dev allure-playwright allure-commandline

# Run tests (creates allure-results/)
npx playwright test

# Clean run + open dashboard
rm -rf allure-results && npx playwright test && npx allure serve allure-results

# Generate static report (for CI)
npx allure generate allure-results --clean -o allure-report

# Open previously generated report
npx allure open allure-report
```
