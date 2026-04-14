# Performance Test -- Line-by-Line Code Explanation

> **Purpose of this document:** Help junior engineers understand **every line** in `tests/performance.spec.ts` -- **what** each element is, **where** it comes from, and **why** it's written that way. After reading, you should be able to write similar performance tests on your own.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Imports (lines 1-2)](#2-imports-lines-1-2)
3. [Threshold Constants (lines 4-9)](#3-threshold-constants-lines-4-9)
4. [Test PERF-001: Page Load (lines 13-44)](#4-test-perf-001-home-page-loads-within-acceptable-thresholds-lines-13-44)
5. [Test PERF-002: Search Response (lines 46-61)](#5-test-perf-002-search-returns-results-within-acceptable-time-lines-46-61)
6. [Key Concepts](#6-key-concepts)
7. [Guide to Writing More Performance Tests](#7-guide-to-writing-more-performance-tests)
8. [Why the Two Test Cases Use Different Navigation Approaches](#8-why-the-two-test-cases-use-different-navigation-approaches)
9. [Deep Dive: `performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming`](#9-deep-dive-performancegetentriesbytypenavigation0-as-performancenavigationtiming)
10. [Distinguishing Knowledge Sources: Web API vs Playwright vs TypeScript](#10-distinguishing-knowledge-sources-web-api-vs-playwright-vs-typescript)
11. [Interview Q&A (English)](#11-interview-qa-english)
12. [Manual Performance Testing Guide](#12-manual-performance-testing-guide)

---

## 1. Overview

This file contains **2 test cases** that verify the performance of the MarsAir application:

| Test ID  | What it verifies                                                               |
| -------- | ------------------------------------------------------------------------------ |
| PERF-001 | How fast the home page loads (using browser Performance API)                   |
| PERF-002 | How long the flight search takes to return results (measuring wall-clock time) |

---

## 2. Imports (lines 1-2)

```typescript
import { test, expect } from '../src/fixture/pageFixtures';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../src/data/selectRange';
```

### Line 1

| Element  | What it is                                                                                     | Where it comes from                                             | Why                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `test`   | The main Playwright Test Runner object, used to declare test cases, describe blocks, and steps | Re-exported from `@playwright/test` via the `pageFixtures` file | The fixture file extends Playwright with custom fixtures (like `homePage`), so we import from here instead of directly from `@playwright/test` |
| `expect` | Assertion function -- used to verify values are correct                                        | Re-exported from `@playwright/test` via the `pageFixtures` file | Same reason as above                                                                                                                           |

### Line 2

| Element                                | What it is                                                                             | Where it comes from            | Why                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------ |
| `PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE` | An array of `{ departing, returning }` pairs -- test data for date dropdown selections | File `src/data/selectRange.ts` | Test PERF-002 needs data to fill the search form |

---

## 3. Threshold Constants (lines 4-9)

```typescript
const PERF_THRESHOLDS = {
    ttfb: 1500,
    fcp: 2500,
    pageLoad: 5000,
    searchResponse: 3000,
};
```

| Element                | What it is                                              | Value   | Meaning                                                            |
| ---------------------- | ------------------------------------------------------- | ------- | ------------------------------------------------------------------ |
| `const`                | Variable declaration keyword that prevents reassignment | --      | Ensures thresholds can't be accidentally changed                   |
| `PERF_THRESHOLDS`      | Object containing all performance thresholds            | --      | Centralized in one place for easy tuning                           |
| `ttfb: 1500`           | **Time To First Byte** threshold                        | 1500 ms | Server must respond with the first byte within 1.5 seconds         |
| `fcp: 2500`            | **First Contentful Paint** threshold                    | 2500 ms | User must see first meaningful content within 2.5 seconds          |
| `pageLoad: 5000`       | **Full Page Load** threshold                            | 5000 ms | Entire page (images, CSS, JS) must finish loading within 5 seconds |
| `searchResponse: 3000` | **Search Response** threshold                           | 3000 ms | Search must return results within 3 seconds                        |

> **Tip:** Set thresholds based on Google Web Vitals or project requirements. When you need to adjust, only edit here.

---

## 4. Test PERF-001: Home page loads within acceptable thresholds (lines 13-44)

### 4.1. Test Declaration (line 13)

```typescript
test('[PERF-001] Home page loads within acceptable thresholds', async ({ page }) => {
```

| Element            | What it is                                      | Where it comes from                    | Why                                                                                         |
| ------------------ | ----------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `test(...)`        | Function that declares a test case              | Imported on line 1                     | Playwright needs to know this is a test                                                     |
| `'[PERF-001] ...'` | Test case name (string)                         | Author-defined                         | `[PERF-001]` is a test ID traceable to the Test Plan; the rest describes what the test does |
| `async`            | Keyword marking the function as asynchronous    | TypeScript                             | Required because `await` is used inside                                                     |
| `({ page })`       | Destructures the `page` fixture from Playwright | Playwright Test Runner auto-injects it | `page` = a fresh browser tab used to control the browser                                    |

### 4.2. Navigate to Page (line 14)

```typescript
await page.goto('/VienBui');
```

| Element          | What it is                       | Where it comes from                                                          | Why                                                                                    |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `await`          | Waits for the action to complete | TypeScript                                                                   | `goto` returns a Promise; we need to wait for the page to finish loading               |
| `page.goto(...)` | Tells the browser to open a URL  | Playwright API (`page` fixture)                                              | Waits for the `load` event by default -- at this point Navigation Timing data is ready |
| `'/VienBui'`     | Home page path (relative URL)    | The `baseURL` config in `playwright.config.ts` combines this into a full URL | This is the page we need to measure                                                    |

### 4.3. Collect Metrics from the Browser (lines 16-25)

```typescript
const perfMetrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    return {
        ttfb: nav.responseStart - nav.requestStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
        fcp: paint.find((e) => e.name === 'first-contentful-paint')?.startTime ?? null,
    };
});
```

#### Line 16: `page.evaluate(() => { ... })`

| Element              | What it is                                                                      | Where it comes from | Why                                                                                |
| -------------------- | ------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `page.evaluate(...)` | Executes JavaScript **inside the browser** (not Node.js) and returns the result | Playwright API      | The Performance API only exists in the browser and cannot be accessed from Node.js |
| `() => { ... }`      | Arrow function that gets serialized and run in the browser context              | Author-written      | This code runs on the browser side                                                 |

#### Line 17: Get Navigation Timing

```typescript
const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
```

| Element                           | What it is                                 | Where it comes from       | Why                                                                                            |
| --------------------------------- | ------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `performance`                     | Browser's global performance object        | Web Performance API (W3C) | Contains all timing information for the page                                                   |
| `.getEntriesByType('navigation')` | Gets an array of "navigation" type entries | Navigation Timing API     | Each page load creates 1 entry containing all timing milestones                                |
| `[0]`                             | Gets the first (and only) element          | Array indexing            | A page only has exactly 1 navigation entry                                                     |
| `as PerformanceNavigationTiming`  | TypeScript type assertion                  | TypeScript type assertion | Tells the IDE the object has properties like `responseStart`, `domContentLoadedEventEnd`, etc. |

#### Line 18: Get Paint Timing

```typescript
const paint = performance.getEntriesByType('paint');
```

| Element                      | What it is                     | Where it comes from    | Why                                                 |
| ---------------------------- | ------------------------------ | ---------------------- | --------------------------------------------------- |
| `.getEntriesByType('paint')` | Gets an array of paint entries | Paint Timing API (W3C) | Contains `first-paint` and `first-contentful-paint` |

#### Line 20: Calculate TTFB

```typescript
ttfb: nav.responseStart - nav.requestStart,
```

| Element             | What it is                                                 | Where it comes from   | Meaning                                            |
| ------------------- | ---------------------------------------------------------- | --------------------- | -------------------------------------------------- |
| `nav.responseStart` | Timestamp when the first byte was received from the server | Navigation Timing API | Time milestone (ms) relative to `startTime`        |
| `nav.requestStart`  | Timestamp when the browser sent the request                | Navigation Timing API | Time milestone when the HTTP request was initiated |
| Subtraction         | Gap between the two milestones                             | Arithmetic            | = server processing time + network latency         |

> **High TTFB** = slow server or network issues.

#### Line 21: Calculate DOM Content Loaded

```typescript
domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
```

| Element                        | What it is                                           | Meaning                                                       |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| `nav.domContentLoadedEventEnd` | Timestamp when the `DOMContentLoaded` event finished | HTML has been fully parsed and deferred scripts have executed |
| `nav.startTime`                | Timestamp when navigation started (time zero)        | Time origin                                                   |
| Subtraction                    | Total time from start until DOM is ready             | Images and CSS may not be finished yet                        |

#### Line 22: Calculate Page Load Complete

```typescript
loadComplete: nav.loadEventEnd - nav.startTime,
```

| Element            | What it is                               | Meaning                                                   |
| ------------------ | ---------------------------------------- | --------------------------------------------------------- |
| `nav.loadEventEnd` | Timestamp when the `load` event finished | Everything has finished loading (images, CSS, iframes...) |
| Subtraction        | Total time to fully load the entire page | This is the "heaviest" metric                             |

#### Line 23: Calculate First Contentful Paint (FCP)

```typescript
fcp: paint.find(e => e.name === 'first-contentful-paint')?.startTime ?? null,
```

| Element                                    | What it is                                                                  | Where it comes from    | Why                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `paint.find(...)`                          | Finds the entry with `name === 'first-contentful-paint'` in the paint array | `Array.prototype.find` | The paint array may contain both `first-paint` and `first-contentful-paint` |
| `e => e.name === 'first-contentful-paint'` | Callback that compares the entry name                                       | Arrow function         | Filters for exactly the FCP entry                                           |
| `?.startTime`                              | Optional chaining -- gets `startTime` if `find` returns a result            | ES2020 syntax          | If `find` returns `undefined` (not found), this avoids a runtime error      |
| `?? null`                                  | Nullish coalescing -- if the left side is `undefined/null`, use `null`      | ES2020 syntax          | Returns an explicit `null` to handle at line 39                             |

> **FCP** = the moment the user sees the first meaningful content (text, image, canvas...) on screen.

### 4.4. Assert TTFB (lines 27-29)

```typescript
await test.step(`TTFB: ${perfMetrics.ttfb.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.ttfb}ms)`, async () => {
    expect(perfMetrics.ttfb).toBeLessThan(PERF_THRESHOLDS.ttfb);
});
```

| Element                                      | What it is                                                    | Where it comes from        | Why                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `test.step(name, fn)`                        | Creates a sub-step in the report                              | Playwright Test API        | Report displays each metric separately, making it easier to debug failures                                            |
| `` `TTFB: ${...}ms (threshold: ${...}ms)` `` | Template literal -- step name                                 | ES6 syntax                 | Displays the **actual value** + **threshold** right in the name, so you can read the report without checking the code |
| `.toFixed(0)`                                | Rounds the number and returns a string with no decimal places | `Number.prototype.toFixed` | `312.456` → `"312"` -- for readability                                                                                |
| `expect(perfMetrics.ttfb)`                   | Starts an assertion with the measured TTFB value              | Playwright `expect`        | The value to check                                                                                                    |
| `.toBeLessThan(1500)`                        | Matcher: the value **must be less than** 1500                 | Playwright expect API      | If >= 1500 → test **FAILS**                                                                                           |

### 4.5. Assert DOM Content Loaded (lines 31-33)

```typescript
await test.step(`DOM Content Loaded: ${perfMetrics.domContentLoaded.toFixed(0)}ms`, async () => {
    expect(perfMetrics.domContentLoaded).toBeLessThan(PERF_THRESHOLDS.pageLoad);
});
```

Same structure as the TTFB assertion. Compares `domContentLoaded` against the `pageLoad` threshold (5000 ms).

> **Note:** DOM Content Loaded uses the `pageLoad` threshold because it's part of the page load process -- it must always be less than or equal to the full page load time.

### 4.6. Assert Page Load Complete (lines 35-37)

```typescript
await test.step(`Page Load Complete: ${perfMetrics.loadComplete.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.pageLoad}ms)`, async () => {
    expect(perfMetrics.loadComplete).toBeLessThan(PERF_THRESHOLDS.pageLoad);
});
```

Compares the full page load time (`loadComplete`) against the `pageLoad` threshold (5000 ms).

### 4.7. Conditional FCP Assertion (lines 39-43)

```typescript
if (perfMetrics.fcp !== null) {
    await test.step(`First Contentful Paint: ${perfMetrics.fcp.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.fcp}ms)`, async () => {
        expect(perfMetrics.fcp).toBeLessThan(PERF_THRESHOLDS.fcp);
    });
}
```

| Element                         | What it is                      | Why                                                                                                            |
| ------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `if (perfMetrics.fcp !== null)` | Checks whether FCP data exists  | Not all browsers report FCP (headless Firefox may not). If `null`, skip the assertion to avoid a false failure |
| Assertion inside                | Same pattern as the steps above | FCP must be < 2500 ms                                                                                          |

---

## 5. Test PERF-002: Search returns results within acceptable time (lines 46-61)

### 5.1. Test Declaration (line 46)

```typescript
test('[PERF-002] Search returns results within acceptable time', async ({ homePage, page }) => {
```

| Element              | What it is              | Where it comes from                                                           | Why                                                                  |
| -------------------- | ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `{ homePage, page }` | Destructures 2 fixtures | `homePage` is a custom fixture from `pageFixtures`; `page` is from Playwright | `homePage` contains the Page Object Model, `page` is the browser tab |

### 5.2. Navigation (line 47)

```typescript
await homePage.navigateToHomePage();
```

Uses the Page Object method instead of `page.goto()` directly -- maintains consistency with the project.

### 5.3. Get Test Data (line 48)

```typescript
const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
```

| Element                                   | What it is                           | Where it comes from | Why                                                     |
| ----------------------------------------- | ------------------------------------ | ------------------- | ------------------------------------------------------- |
| Destructuring `{ departing, returning }`  | Extracts 2 values from the object    | ES6 syntax          | Cleaner than writing `data.departing`, `data.returning` |
| `PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0]` | First element of the test data array | Imported on line 2  | Gets a valid date pair for testing                      |

### 5.4. Fill the Form (lines 50-51)

```typescript
await homePage.searchFormComponent.departingDropdown.selectOption(departing);
await homePage.searchFormComponent.returningDropdown.selectOption(returning);
```

| Element                        | What it is                                           | Where it comes from |
| ------------------------------ | ---------------------------------------------------- | ------------------- |
| `homePage.searchFormComponent` | Component object containing the search form elements | Page Object Model   |
| `.departingDropdown`           | Locator for the "Departing" dropdown                 | Page Object         |
| `.selectOption(departing)`     | Selects an option in the dropdown                    | Playwright API      |

### 5.5. Measure Search Time (lines 53-56)

```typescript
const start = Date.now();
await homePage.searchFormComponent.searchButton.click();
await homePage.searchResultComponent.searchResultTitle.waitFor({ state: 'visible' });
const elapsed = Date.now() - start;
```

| Line                                               | What it is                                   | Why                                                             |
| -------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `Date.now()`                                       | Gets the current timestamp (ms) from Node.js | Start marker for the measurement                                |
| `.searchButton.click()`                            | Clicks the Search button                     | Triggers the search action                                      |
| `.searchResultTitle.waitFor({ state: 'visible' })` | Waits until the result title is visible      | End marker -- results have finished rendering                   |
| `Date.now() - start`                               | Calculates the time difference               | = the actual time the user would have to wait (wall-clock time) |

> **Difference from PERF-001:** This uses `Date.now()` (Node.js) instead of the browser Performance API, because we're measuring the time from a button click to results appearing, not page navigation timing.

### 5.6. Assertion (lines 58-60)

```typescript
await test.step(`Search completed in ${elapsed}ms (threshold: ${PERF_THRESHOLDS.searchResponse}ms)`, async () => {
    expect(elapsed).toBeLessThan(PERF_THRESHOLDS.searchResponse);
});
```

Same pattern as PERF-001: the step name displays the actual value + threshold, and the assertion checks < 3000 ms.

---

## 6. Key Concepts

### Navigation Timing API (browser)

```
navigationStart
    → redirectStart/End
    → fetchStart
    → domainLookupStart/End (DNS)
    → connectStart/End (TCP)
    → requestStart            ← TTFB starts here
    → responseStart            ← TTFB ends here
    → responseEnd
    → domContentLoadedEventStart/End  ← DOM ready
    → loadEventStart/End              ← Page fully loaded
```

### Paint Timing API (browser)

- **first-paint (FP):** The first pixel rendered on screen (could be a background color).
- **first-contentful-paint (FCP):** The first meaningful content (text, image) appears.

### `test.step` vs direct `expect`

| Approach               | Report display                           | When to use                                                     |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `expect(...)` directly | Shows only pass/fail                     | Simple tests                                                    |
| `test.step(name, fn)`  | Shows a sub-step with a descriptive name | When you want detailed reports, especially with measured values |

### `page.evaluate` vs Node.js code

|                              | Runs where                  | When to use                                                        |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `page.evaluate(() => {...})` | Inside the browser          | When you need access to DOM, Performance API, `window`, `document` |
| Regular code in the test     | Node.js (Playwright runner) | Browser control, assertions, test logic                            |

---

## 7. Guide to Writing More Performance Tests

### Basic Template

```typescript
test('[PERF-XXX] <short description>', async ({ page }) => {
    // 1. Navigate or perform an action
    await page.goto('/path');

    // 2. Collect metrics
    const metric = await page.evaluate(() => {
        // Use Performance API or other calculations
        return someValue;
    });

    // 3. Assert with test.step (displays value in report)
    await test.step(`Metric Name: ${metric}ms (threshold: ${THRESHOLD}ms)`, async () => {
        expect(metric).toBeLessThan(THRESHOLD);
    });
});
```

### Checklist When Writing Performance Tests

- [ ] Add new thresholds to `PERF_THRESHOLDS` if needed.
- [ ] Use test ID format `[PERF-XXX]`.
- [ ] Use `test.step` to display actual values in the report.
- [ ] Handle cases where a metric might be `null` (like FCP on line 39).
- [ ] Use `page.evaluate` when you need browser APIs; use `Date.now()` for wall-clock time.
- [ ] Update the Test Plan if adding new tests.

---

## 8. Why the Two Test Cases Use Different Navigation Approaches

|          | PERF-001 (line 14)            | PERF-002 (line 47)                    |
| -------- | ----------------------------- | ------------------------------------- |
| **Code** | `await page.goto('/VienBui')` | `await homePage.navigateToHomePage()` |
| **Uses** | Playwright API directly       | Page Object Model                     |

### PERF-001 uses `page.goto()` directly -- because it measures browser-level timing

PERF-001 measures TTFB, DOM Content Loaded, and FCP -- all sourced from the browser's Navigation Timing API. `page.goto()` **is the navigation event** that the browser records in the Performance API. If any other navigation occurs beforehand (e.g., the Page Object calls `goto` internally then redirects...), the data in `performance.getEntriesByType('navigation')` would be overwritten or polluted.

> Calling `page.goto()` directly = guarantees a single, clean navigation with no side effects.

### PERF-002 uses `homePage.navigateToHomePage()` -- because it measures user interaction time

PERF-002 **does not measure page load timing**. It measures the time from clicking Search to results appearing, using `Date.now()` (Node.js clock). The initial navigation is just a setup step that doesn't affect the measurement. Using the Page Object maintains consistency with the rest of the test.

### General Rule

- If you're measuring **the navigation itself** → use `page.goto()` directly.
- If navigation is just a **setup step** before measuring something else → use Page Object for consistency.

---

## 9. Deep Dive: `performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming`

### What is `[0]`?

`performance.getEntriesByType('navigation')` returns an **array**. But each page only has **exactly 1 navigation entry**. `[0]` extracts the first (and only) element from the array.

| Without `[0]`                                                | With `[0]`                                         |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `[{ responseStart: 420, ... }]` -- array containing 1 object | `{ responseStart: 420, ... }` -- the object itself |
| Cannot call `.responseStart` directly                        | Can access `.responseStart`, `.requestStart`, etc. |

> The API returns an array because `getEntriesByType()` is a generic method -- for type `'resource'` it can return dozens of entries (one for each image, CSS file, JS file). The API consistently returns an array for all types. Only `'navigation'` always has exactly 1 element.

### What is `as PerformanceNavigationTiming`?

This is a **TypeScript type assertion**. It does not change the value at runtime -- it only tells TypeScript what type the value is.

`getEntriesByType('navigation')[0]` returns the type `PerformanceEntry` (the parent/generic type), which only has a few basic properties:

```typescript
// PerformanceEntry (parent type) -- only has:
interface PerformanceEntry {
    readonly duration: number;
    readonly entryType: string;
    readonly name: string;
    readonly startTime: number;
}
```

But we need more specific properties that only exist on the child type `PerformanceNavigationTiming`:

```typescript
// PerformanceNavigationTiming (child type) -- additionally has:
interface PerformanceNavigationTiming extends PerformanceResourceTiming {
    readonly requestStart: number;
    readonly responseStart: number;
    readonly domContentLoadedEventEnd: number;
    readonly loadEventEnd: number;
    // ... and many more properties
}
```

Without `as PerformanceNavigationTiming` → TypeScript throws a compile error and won't let you use `responseStart`, `requestStart`, etc.

### Where is this type defined?

| Question                  | Answer                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| Who wrote it?             | The TypeScript team (based on the W3C spec)                              |
| Where is it located?      | `node_modules/typescript/lib/lib.dom.d.ts`                               |
| Do you need to import it? | **No** -- it's a global type, available when `tsconfig` includes `"DOM"` |
| When is it updated?       | Each new TypeScript version may update it according to new W3C specs     |

---

## 10. Distinguishing Knowledge Sources: Web API vs Playwright vs TypeScript

This is an important distinction to understand -- the code in this file combines knowledge from **3 different sources**:

| Source                | Where it comes from                            | Examples in code                                                |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| **Web API** (Browser) | W3C specification, implemented by all browsers | `performance.getEntriesByType()`, `PerformanceNavigationTiming` |
| **Playwright API**    | The Playwright library                         | `page.goto()`, `page.evaluate()`, `expect()`, `test.step()`     |
| **TypeScript types**  | TypeScript compiler (`lib.dom.d.ts`)           | `as PerformanceNavigationTiming` (type only, not runtime code)  |

Playwright only provides `page.evaluate()` as a **bridge** to run any Browser API. The more Browser APIs you know, the more types of tests you can write.

### Knowledge Order to Master

```
1. Web fundamentals (HTML, CSS, JS, Browser APIs)
       │
       ▼
2. TypeScript basics (types, interfaces, assertions)
       │
       ▼
3. Playwright API (page, evaluate, expect, test)
       │
       ▼
4. Combine all 3 to write performance tests
```

---

## 11. Interview Q&A (English)

### Q: "How did you measure page performance metrics in your Playwright tests?"

> "I used Playwright's `page.evaluate()` to execute JavaScript inside the browser context and access the **Navigation Timing API** and **Paint Timing API** -- these are standard W3C Web APIs that all browsers implement.
>
> Specifically, I called `performance.getEntriesByType('navigation')` to get timing milestones like `requestStart`, `responseStart`, `domContentLoadedEventEnd`, and `loadEventEnd`. From these I calculated metrics like TTFB, DOM Content Loaded time, and full page load time.
>
> For First Contentful Paint, I used `performance.getEntriesByType('paint')` and looked for the `first-contentful-paint` entry. Since not every browser engine reports paint timing -- especially in headless mode -- I added a null check to avoid false failures.
>
> Each metric was then asserted against a predefined threshold inside a `test.step()`, so the actual measured value appears in the test report regardless of pass or fail."

### Q: "Why `page.evaluate` instead of measuring from Node.js?"

> "The Navigation Timing API and Paint Timing API only exist in the browser context -- they're not accessible from Node.js. `page.evaluate()` is Playwright's way to bridge that gap: it serializes a function, runs it inside the browser, and returns the result back to the test runner.
>
> For scenarios where I don't need browser-specific APIs -- like measuring the time between a button click and a result appearing -- I use `Date.now()` directly in Node.js, which is simpler and sufficient."

### Q: "What's `as PerformanceNavigationTiming`?"

> "That's a TypeScript type assertion. `getEntriesByType()` returns a generic `PerformanceEntry` array, but I need access to navigation-specific properties like `responseStart` and `requestStart`. The type assertion tells TypeScript to treat it as the more specific `PerformanceNavigationTiming` interface, which extends `PerformanceEntry` with those properties. It doesn't change anything at runtime -- it's purely for type safety and IDE autocompletion."

### Q: "Why did you use two different navigation approaches in PERF-001 and PERF-002?"

> "In PERF-001, I used `page.goto()` directly because I was measuring the page load itself -- TTFB, DOM Content Loaded, FCP. I needed a clean, single navigation event so the browser's Navigation Timing data would be accurate and not polluted by any intermediate navigations.
>
> In PERF-002, navigation was just a setup step before the actual measurement -- which was the time from clicking Search to results appearing. Since navigation wasn't being measured, I used the Page Object method `homePage.navigateToHomePage()` to stay consistent with the project's Page Object Model pattern."

### Q: "How do you decide the threshold values?"

> "The thresholds are based on industry standards like Google's Web Vitals and project-specific requirements. For example, Google recommends TTFB under 800ms for a good experience, but since this is a test environment with variable network conditions, I set it at 1500ms. The thresholds are centralized in a single `PERF_THRESHOLDS` object so they're easy to tune as the application evolves."

---

## 12. Manual Performance Testing Guide

This section helps you understand how to **manually verify** what the automation is measuring. Understanding manual testing gives you deeper insight into what the automation code is actually checking.

---

### PERF-001: Home page loads within acceptable thresholds (Manual)

**Objective:** Measure TTFB, DOM Content Loaded, Page Load, and FCP of the home page.

**Tools:** Chrome DevTools (or Firefox/Edge DevTools).

#### Step 1: Open DevTools

1. Open Chrome browser.
2. Press `F12` (or `Cmd + Option + I` on Mac) to open DevTools.
3. Select the **Network** tab.

#### Step 2: Prepare a Clean Environment

4. Check the **Disable cache** checkbox (above the filter bar in the Network tab).
    - **Why:** Ensures you're measuring real speed, not artificially fast results from local cache.
5. Press `Cmd + Shift + Delete` → Clear browsing data (or open an Incognito window).
    - **Why:** Removes cookies, service workers, and old cache that can affect results.

#### Step 3: Measure TTFB

6. In the address bar, type the home page URL (e.g., `https://marsair.example.com/VienBui`) and press Enter.
7. Wait for the page to finish loading.
8. In the **Network** tab, click on the **first request** (document request -- usually the first row, type `document`).
9. Select the **Timing** tab in the detail panel on the right.
10. Find the **Waiting for server response** entry (or **TTFB**).
11. **Record the value** → compare with the threshold of **1500 ms**.

```
PASS: TTFB < 1500ms
FAIL: TTFB >= 1500ms
```

#### Step 4: Measure DOM Content Loaded & Page Load

12. Look at the **status bar** at the bottom of the Network tab, find these 2 values:
    - **DOMContentLoaded:** displayed as `DOMContentLoaded: 1.2s` (blue text).
    - **Load:** displayed as `Load: 2.5s` (red text).
13. **Record both values** → compare with the threshold of **5000 ms**.

```
PASS: DOMContentLoaded < 5000ms  AND  Load < 5000ms
FAIL: Any value >= 5000ms
```

#### Step 5: Measure First Contentful Paint (FCP)

**Method 1: Using the Performance tab**

14. Switch to the **Performance** tab in DevTools.
15. Click the **Reload** button (circular arrow icon) in the top-left of the Performance tab.
16. Wait for the page to finish loading; DevTools stops recording automatically.
17. In the **Timings** section (timeline at the top), find the **FCP** marker.
18. **Record the value** → compare with the threshold of **2500 ms**.

**Method 2: Using Lighthouse**

14. Switch to the **Lighthouse** tab in DevTools.
15. Select the **Performance** category, click **Analyze page load**.
16. Wait for the scan to complete, find the **First Contentful Paint** metric in the results.
17. **Record the value** → compare with the threshold of **2500 ms**.

**Method 3: Using Console (same as automation)**

14. Switch to the **Console** tab in DevTools.
15. Paste and run the following code:

```javascript
const nav = performance.getEntriesByType('navigation')[0];
const paint = performance.getEntriesByType('paint');
console.table({
    'TTFB (ms)': nav.responseStart - nav.requestStart,
    'DOM Content Loaded (ms)': nav.domContentLoadedEventEnd - nav.startTime,
    'Page Load (ms)': nav.loadEventEnd - nav.startTime,
    'FCP (ms)': paint.find((e) => e.name === 'first-contentful-paint')?.startTime ?? 'N/A',
});
```

16. Read the result table → compare each metric against its threshold.

```
PASS: TTFB < 1500  AND  DOM Content Loaded < 5000  AND  Page Load < 5000  AND  FCP < 2500
FAIL: Any metric exceeds its threshold
```

> **Tip:** Method 3 runs the exact same code as the automation, giving the most accurate results for comparison.

#### PERF-001 Results Summary

| #   | Metric             | Manual measurement method                          | Threshold | Result    | Pass/Fail |
| --- | ------------------ | -------------------------------------------------- | --------- | --------- | --------- |
| 1   | TTFB               | Network tab → Timing → Waiting for server response | < 1500 ms | \_\_\_ ms |           |
| 2   | DOM Content Loaded | Network tab → status bar (blue text)               | < 5000 ms | \_\_\_ ms |           |
| 3   | Page Load          | Network tab → status bar (red text)                | < 5000 ms | \_\_\_ ms |           |
| 4   | FCP                | Performance tab → Timings → FCP marker             | < 2500 ms | \_\_\_ ms |           |

---

### PERF-002: Search returns results within acceptable time (Manual)

**Objective:** Measure the time from clicking Search to results being displayed.

**Tools:** Chrome DevTools + stopwatch (or visual observation with the Network tab).

#### Step 1: Open the Page and Prepare

1. Open Chrome browser, press `F12` to open DevTools.
2. Switch to the **Network** tab.
3. Navigate to the MarsAir home page.
4. Wait for the page to fully load.

#### Step 2: Fill the Search Form

5. In the **Departing** dropdown, select a value (e.g., a month more than 2 years from now).
6. In the **Returning** dropdown, select a corresponding value.

#### Step 3: Measure Search Time

**Method 1: Using the Network tab**

7. Click the **Clear** button (circle-slash icon) in the Network tab to remove old requests.
8. Click the **Search** button.
9. Observe the Network tab -- find the main request (usually a navigation request or XHR/fetch).
10. When the results page finishes displaying, look at the **Time** column for that request or the **Load** indicator in the status bar.
11. **Record the total time** → compare with the threshold of **3000 ms**.

**Method 2: Using Console with a manual stopwatch**

7. Switch to the **Console** tab in DevTools.
8. Type `console.time('search')` and press Enter.
9. **Immediately** click the **Search** button on the page.
10. When results are fully displayed, go back to Console and type `console.timeEnd('search')` then press Enter.
11. Console displays `search: 1234ms` → **record the value** → compare with the threshold of **3000 ms**.

**Method 3: Using the Performance tab (most accurate)**

7. Switch to the **Performance** tab.
8. Click the **Record** button (circle dot icon).
9. Click the **Search** button on the page.
10. When results are fully displayed, click **Stop** recording.
11. In the timeline, measure the distance from the click event to when rendering completes.
12. **Record the value** → compare with the threshold of **3000 ms**.

```
PASS: Search time < 3000ms
FAIL: Search time >= 3000ms
```

#### PERF-002 Results Summary

| #   | Action       | Observation                      | Threshold | Result    | Pass/Fail |
| --- | ------------ | -------------------------------- | --------- | --------- | --------- |
| 1   | Click Search | Time until results are displayed | < 3000 ms | \_\_\_ ms |           |

---

### Manual vs Automation Comparison

| Criteria                   | Manual                                                   | Automation                     |
| -------------------------- | -------------------------------------------------------- | ------------------------------ |
| **Accuracy**               | Depends on human reflexes (especially PERF-002)          | Accurate to the millisecond    |
| **Reproducibility**        | Hard to reproduce exactly (network, cache, human timing) | Consistent results across runs |
| **Execution time**         | 5-10 minutes per run                                     | A few seconds                  |
| **When to use manual**     | Debugging, exploring issues, visual confirmation         | --                             |
| **When to use automation** | CI/CD, regression, measuring trends over time            | --                             |

> **Advice:** Always try manual testing first before writing automation to understand what you're actually measuring. Then use automation to run it repeatedly and automatically.
