# Code Review Checklist

> Use this checklist when reviewing pull requests that modify `src/` or `tests/`

## PR Checklist (for reviewers)

### Structure

- [ ] New spec file is in the correct folder (`functional/` vs `nonfunctional/`)
- [ ] Locators are in component files, not in spec files
- [ ] New page objects are registered in `pageFixtures.ts`
- [ ] File naming follows convention (see `00-project-structure.md`)

### Locators

- [ ] `getByRole()` or `getByText()` used before falling back to CSS selectors
- [ ] No `#id` or `.class` selectors unless justified with a comment
- [ ] All locators are `readonly` and initialized in the constructor
- [ ] Variable names describe the UI element (not `el`, `btn1`, `item`)

### Tests

- [ ] Every test has a unique `[PREFIX-XXX]` ID
- [ ] Data-driven tests include the variant in the title
- [ ] Test data is in `src/data/`, not hardcoded in the spec
- [ ] `test.step` is used for tests with multiple logical phases
- [ ] `test` and `expect` imported from `pageFixtures`, not `@playwright/test`
- [ ] Known bugs use `test.fail()` with ticket reference, not `test.skip()`

### Code Quality

- [ ] No `page.waitForTimeout()` — use proper waits (`waitFor`, assertions)
- [ ] No `console.log()` left in production code (except intentional logging in fixtures)
- [ ] No commented-out test code without an explanation
- [ ] Methods are small and do one thing
- [ ] Duplicate logic extracted to component/page methods

### Non-Functional Tests

- [ ] Visual regression: waits for stable state before screenshot
- [ ] Performance: thresholds defined as named constants
- [ ] Security: navigates to clean state after each payload
- [ ] Accessibility: filters by severity level

## PR Checklist (for authors)

Before requesting a review:

- [ ] Tests pass locally: `npx playwright test --project=chromium`
- [ ] No unintended snapshot changes (check `*.spec.ts-snapshots/`)
- [ ] New test data constants are typed and exported
- [ ] Commit messages reference the test IDs being added/changed
- [ ] Convention docs updated if introducing a new pattern

## Common Review Comments (copy-paste)

### Locator should use role-based strategy

> This locator uses a CSS selector. Per our [locator conventions](./01-locator-strategy.md), prefer `getByRole()` or `getByText()`. CSS selectors are fragile when the UI framework changes class names.

### Test missing ID prefix

> Please add a test ID in the format `[PREFIX-XXX]` at the start of the test title. See [test writing conventions](./03-test-writing.md#test-id-system).

### Hardcoded test data

> This test data should be in `src/data/`. We keep spec files free of hardcoded values so data can be reused and maintained in one place.

### Missing readonly on locator

> All locators must be `readonly` since they are initialized once in the constructor and never reassigned. See [locator conventions](./01-locator-strategy.md#2-all-locators-must-be-readonly).

### Using raw Playwright import

> Please import `test` and `expect` from `../../src/fixture/pageFixtures` instead of `@playwright/test`. Our custom fixtures provide page objects, error capture, and failure screenshots.
