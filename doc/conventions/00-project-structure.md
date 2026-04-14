# Project Structure & Naming Conventions

> Applies to all `.ts` files under `src/` and `tests/`

## Folder Structure

```
TestBooking/
├── src/
│   ├── components/       # UI component locators & actions (one file per component)
│   ├── pages/            # Page objects that compose components
│   ├── fixture/          # Playwright custom fixtures
│   └── data/             # Test data constants (no logic, only data)
├── tests/
│   ├── functional/       # Business-logic test specs
│   └── nonfunctional/    # Performance, accessibility, security, visual regression
├── doc/
│   ├── conventions/      # This folder — team coding standards
│   └── image/            # Documentation images
└── .github/workflows/    # CI/CD pipelines
```

## File Naming

| Layer               | Pattern                        | Example                   |
| ------------------- | ------------------------------ | ------------------------- |
| Page Object         | `<pageName>.page.ts`           | `homepage.page.ts`        |
| Component           | `<componentName>.component.ts` | `searchForm.component.ts` |
| Fixture             | `<name>Fixtures.ts`            | `pageFixtures.ts`         |
| Test Data           | `<domain>.data.ts`             | `promo.data.ts`           |
| Functional Test     | `<feature>.spec.ts`            | `searchFlight.spec.ts`    |
| Non-functional Test | `<type>.spec.ts`               | `performance.spec.ts`     |

## Naming Rules

### Files — camelCase

```
✅ searchForm.component.ts
✅ selectRange.ts
❌ SearchForm.component.ts
❌ search-form.component.ts
```

### Classes — PascalCase, suffix matches layer

```typescript
// Component → ends with "Component"
export class SearchFormComponent {}

// Page → ends with "Page"
export class HomePage {}
```

### Variables & Methods — camelCase, descriptive

```typescript
// Locators: describe what the element IS
readonly departingDropdown: Locator;
readonly searchButton: Locator;

// Methods: describe what the action DOES
async verifySearchFormIsVisible() { }
async searchFlightWithPromoCode(departing: string, returning: string, code: string) { }
```

### Constants — UPPER_SNAKE_CASE

```typescript
export const VALID_PROMO_CODES = [ ... ];
export const PERF_THRESHOLDS = { ttfb: 1500, fcp: 2500 };
```

## Import Order

Group imports in this order, separated by blank lines:

```typescript
// 1. Playwright / third-party
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// 2. Project fixtures
import { test, expect } from '../../src/fixture/pageFixtures';

// 3. Project data
import { VALID_PROMO_CODES } from '../../src/data/promo.data';

// 4. Project pages/components (only in page files)
import { SearchFormComponent } from '../components/searchForm.component';
```

## Adding a New Feature

When adding tests for a new page/feature, create files in this order:

1. **Component(s)** in `src/components/` — locators + element actions
2. **Page Object** in `src/pages/` — composes components
3. **Register** in `src/fixture/pageFixtures.ts` — add to fixtures
4. **Test Data** in `src/data/` — if needed
5. **Spec File** in `tests/functional/` or `tests/nonfunctional/`
