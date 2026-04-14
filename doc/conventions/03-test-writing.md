# Test Writing Conventions

> Applies to all `*.spec.ts` files under `tests/`

## Test ID System

Every test must have a unique ID prefix in brackets. IDs map to test categories:

| Prefix     | Category                      | Location               |
| ---------- | ----------------------------- | ---------------------- |
| `BS-XXX`   | Booking/Search (functional)   | `tests/functional/`    |
| `NAV-XXX`  | Navigation (functional)       | `tests/functional/`    |
| `PC-XXX`   | Promotional Code (functional) | `tests/functional/`    |
| `VR-XXX`   | Visual Regression             | `tests/nonfunctional/` |
| `A11Y-XXX` | Accessibility                 | `tests/nonfunctional/` |
| `SEC-XXX`  | Security                      | `tests/nonfunctional/` |
| `PERF-XXX` | Performance                   | `tests/nonfunctional/` |

When adding a new feature area, define a new prefix and document it here.

### Format

```typescript
// ✅ ID in brackets at start of title
test('[BS-004] Verify system validates with period is exactly 1 year', ...);

// ✅ Data-driven: append the variant
test(`[BS-004] Verify system validates with period is exactly 1 year - ${departing} to ${returning}`, ...);

// ❌ No ID
test('Verify system validates with period is exactly 1 year', ...);

// ❌ ID not in brackets
test('BS-004 Verify system validates', ...);
```

## Test Structure

### Grouping with `test.describe`

Group by feature or test type. One `describe` block per concern:

```typescript
test.describe('Search Flight', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    test('[BS-001] Verify home page is loaded', async ({ homePage }) => { ... });
    test('[BS-002] Verify Departing dropdown values', async ({ homePage }) => { ... });
});

test.describe('Navigation', () => { ... });
test.describe('Promotional Code', () => { ... });
```

### Use `test.step` for logical sections

Break complex tests into readable steps:

```typescript
test('[BS-001] Verify home page is loaded with all elements visible', async ({ homePage }) => {
    await test.step('Header and navigation links', async () => {
        await homePage.verifyHeaderLogoIsVisible();
        await homePage.verifyReportIssueLinkIsVisible();
    });

    await test.step('Search form elements', async () => {
        await homePage.searchFormComponent.verifySearchFormIsVisible();
    });
});
```

### Use `beforeEach` for common preconditions

```typescript
test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHomePage();
});
```

## Data-Driven Tests

### When to use

Use `for...of` loops when the same test logic applies to multiple data sets:

```typescript
for (const { departing, returning } of PERIOD_1_YEAR_SELECT_RANGE) {
    test(`[BS-004] Verify ... - ${departing} to ${returning}`, async ({ homePage }) => {
        await homePage.searchFormComponent.searchFlight(departing, returning);
        await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
    });
}
```

### Rules

1. **Test data lives in `src/data/`**, never hardcoded in spec files
2. **Each data file exports typed constants** — no functions, no classes
3. **Include the variant in the test title** so failures are identifiable
4. **Keep the test ID the same** for all variants of the same scenario

### Data file structure

```typescript
// src/data/promo.data.ts
export const VALID_PROMO_CODES = [
    { code: 'AF3-FJK-418', discount: 30 },
    { code: 'JT2-OPQ-114', discount: 20 },
];

export const INVALID_PROMO_CODES = [
    { code: 'AF3-FJK-419', reason: 'wrong check digit' },
    { code: 'JJ7OPQ119', reason: 'no dashes' },
];
```

## Known Defects

### `test.fail()` — for verified bugs

Mark tests that are **expected to fail** due to known bugs:

```typescript
test('[PC-003] Verify promo code with check digit = 0', async ({ homePage }) => {
    test.fail(true, 'BUG#6: System shows code is not valid for valid promo code with check digit=0');
    // ... test continues — Playwright expects it to fail
});
```

### `test.fixme()` — for incomplete/blocked tests

```typescript
await test.step('HSTS header is present', async () => {
    test.fixme(true, 'Known defect: server does not return HSTS header');
    expect(headers['strict-transport-security']).toBeDefined();
});
```

### Rules

- Always include the **bug/ticket reference** in the message
- Remove `test.fail()` / `test.fixme()` once the defect is fixed
- Never use `test.skip()` to hide bugs — use `test.fail()` so CI still runs the test

## Non-Functional Tests

### Visual Regression (`tests/nonfunctional/visualRegression.spec.ts`)

```typescript
const SCREENSHOT_OPTIONS = { maxDiffPixelRatio: 0.01 };

test('[VR-001] Home page looks correct', async ({ homePage, page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchFormComponent.verifySearchFormIsVisible(); // Wait for stable state
    await expect(page).toHaveScreenshot('home-page.png', SCREENSHOT_OPTIONS);
});
```

- Always **wait for a stable state** before taking screenshots
- Use **descriptive screenshot names**: `home-page.png`, not `screenshot1.png`
- Define `maxDiffPixelRatio` as a shared constant

### Performance (`tests/nonfunctional/performance.spec.ts`)

- Define thresholds as constants at the top of the file
- Use `test.step` to report each metric with its measured value
- Never use `page.waitForTimeout()` — measure real performance APIs

### Accessibility (`tests/nonfunctional/accessibility.spec.ts`)

- Use `@axe-core/playwright` for automated checks
- Filter by severity (`critical`, `serious`) — don't fail on `minor`
- Log violation details for debugging

### Security (`tests/nonfunctional/security.spec.ts`)

- Define payloads as constants
- Always clean up after injection tests (navigate back to a clean state)
- Check both client-side (dialog) and server-side (reflected HTML) vulnerabilities

## Imports

All spec files must import `test` and `expect` from the **custom fixture**, not from `@playwright/test`:

```typescript
// ✅ Custom fixture — includes page objects + error capture
import { test, expect } from '../../src/fixture/pageFixtures';

// ❌ Raw Playwright — loses fixture benefits
import { test, expect } from '@playwright/test';
```
