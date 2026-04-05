# Code Review Notes - findFlight.spec.ts

## Critical Issues


## Structural / Architectural Suggestions

### 3. Use Playwright fixtures instead of manual page object instantiation
Every test manually creates page objects:
```typescript
const homePage = new HomePage(page);
const searchPage = new SearchPage(page);
const searchResultPage = new SearchResultPage(page);
```
The Playwright best practice is to extend the base `test` fixture so page objects are injected automatically:
```typescript
// src/fixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from './pages/homepage.page';
import { SearchPage } from './pages/search.page';
import { SearchResultPage } from './pages/searchResult.page';

type MyFixtures = {
  homePage: HomePage;
  searchPage: SearchPage;
  searchResultPage: SearchResultPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  searchResultPage: async ({ page }, use) => {
    await use(new SearchResultPage(page));
  },
});

export { expect } from '@playwright/test';
```
Then tests become cleaner:
```typescript
test('Verify home page is loaded', async ({ homePage }) => {
  await homePage.navigateToHomePage();
  await homePage.verifyHomePageIsLoaded();
});
```

### 4. Use `test.beforeEach` to eliminate repeated navigation
Every test calls `homePage.navigateToHomePage()`. Extract into a `beforeEach`:
```typescript
test.beforeEach(async ({ homePage }) => {
  await homePage.navigateToHomePage();
});
```

### 5. Reconsider the 3-layer split (Spec -> Page Object -> Locator class)
The 3-layer pattern adds indirection without clear benefit. The Playwright community norm is a 2-layer pattern where locators live inside the page object as properties.

Also, `SearchPage` reuses `HomePageLocators`, which tightly couples two pages. If home page locators change, the search page breaks. Consider creating a shared component (e.g., `SearchFormComponent`) that both pages compose.

### 6. Unused imports in spec file
`Page` and `expect` are imported but never used in `findFlight.spec.ts`. Clean up unused imports.

---

## Test Design Suggestions

### 7. Data-driven tests with parameterized loops
Rich test data exists in `selectRange.ts` but only one entry from one dataset is used. For thorough coverage, use parameterized tests:
```typescript
for (const data of PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE) {
  test(`Search with departing=${data.departing}, returning=${data.returning}`, async ({ page }) => {
    // ...
  });
}
```

### 8. BS-001 test is doing too much in a single test
The first test verifies 10+ elements. If the 5th assertion fails, assertions 6-10 won't run. Consider:
- **Option A**: Use soft assertions (`expect.soft(...)`) so all checks run even if some fail.
- **Option B**: Use `test.step()` to logically group assertions for better reporting:
```typescript
test('Verify home page elements', async ({ homePage }) => {
  await test.step('Header and navigation links', async () => {
    await homePage.verifyHeaderLogoIsVisible();
    await homePage.verifyReportIssueLinkIsVisible();
  });
  await test.step('Search form elements', async () => {
    await homePage.verifySelectDepartingOptionIsVisible();
  });
});
```

### 9. Test and `describe` block naming
- The `describe` block is called `'Home Page'` but contains search result tests (BS-007). Organize by feature or split into multiple describe blocks.
- Prefer concise test titles that describe behavior: `'shows available seats for 2+ year search period'` instead of `'Verify system validates for available seat once user searches with period is more than 2 years'`.

### 10. Hardcoded promo/invalid-promo locator text
In `searchResult.locator.ts`, locators contain literal placeholder text (`[code]`, `[discount]`, `[invalid promo code]`) that will never match actual page content. These should accept parameters or use regex:
```typescript
promotionalCodeMessage(code: string, discount: number) {
  return this.page.getByText(`Promotional code ${code} used: ${discount}% discount!`);
}
```

---

## Minor / Style

### 11. Duplicate locators across page objects
`marsAirLogo`, `reportIssueLink`, `problemDefinitionLink`, and `privacyPolicyLink` appear in both `HomePageLocators` and `SearchResultLocators`. Extract shared layout elements into a `CommonLocators` or `LayoutComponent` class.

### 12. Navigation URL is duplicated and potentially wrong
`'/VienBui'` appears in `homepage.page.ts` and `baseURL` in `playwright.config.ts` is already `https://marsair.recruiting.thoughtworks.net/VienBui`. Calling `page.goto('/VienBui')` navigates to `.../VienBui/VienBui`. Use `page.goto('/')` instead, or adjust the baseURL.

### 13. Missing closing brace formatting
In `searchResult.locator.ts` line 34, the closing braces for the class and constructor are on the same line (`}}`). Minor formatting inconsistency.

### 14. Trailing whitespace
Line 27 of the spec file has trailing whitespace. Consider adding `.editorconfig` or Prettier to enforce consistent formatting.

---

## Summary Checklist

| Priority | Item | Action |
|----------|------|--------|
| **Critical** | `test.only` on line 46 | Remove before commit |
| **Critical** | `page.pause()` on line 54 | Remove before commit |
| **High** | Use Playwright fixtures | Eliminate manual PO instantiation |
| **High** | Add `beforeEach` for navigation | DRY up repeated `navigateToHomePage()` |
| **High** | Fix double `/VienBui/VienBui` URL | Use `page.goto('/')` since baseURL already includes the path |
| **Medium** | Fix parameterized promo locators | Make them accept dynamic values |
| **Medium** | Use soft assertions or `test.step` | Improve BS-001 failure diagnostics |
| **Medium** | Extract shared locators | Remove duplication between page locators |
| **Low** | Clean up unused imports | Remove `Page`, `expect` from spec |
| **Low** | Organize describe blocks | Separate home page vs. search result tests |
| **Low** | Add data-driven test loops | Leverage all data in `selectRange.ts` |
