# Page Object & Component Pattern

> Applies to `src/pages/` and `src/components/`

## Architecture

This project uses a **two-layer Page Object Model**:

```
Spec File
  └── Page Object (composes components, high-level workflows)
        ├── Component A (locators + element-level actions)
        ├── Component B
        └── Component C
```

- **Component**: Owns locators for ONE UI section. Contains low-level verify/action methods.
- **Page Object**: Composes multiple components. Contains navigation and page-level methods.
- **Spec File**: Uses page objects only. Never touches components directly (except through page).

## Component Rules

### Structure

Every component follows this template:

```typescript
import { Locator, Page, expect } from '@playwright/test';

export class SearchFormComponent {
    readonly page: Page;

    // 1. Declare all locators as readonly
    readonly welcomeMessage: Locator;
    readonly searchButton: Locator;

    // 2. Initialize locators in constructor
    constructor(page: Page) {
        this.page = page;
        this.welcomeMessage = page.getByText('Welcome to MarsAir!');
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    // 3. Verification methods — prefix with "verify"
    async verifySearchFormIsVisible() {
        await expect(this.welcomeMessage).toBeVisible();
        await expect(this.searchButton).toBeVisible();
    }

    // 4. Action methods — name describes the user action
    async searchFlight(departing: string, returning: string) {
        await this.departingDropdown.selectOption(departing);
        await this.returningDropdown.selectOption(returning);
        await this.searchButton.click();
    }
}
```

### Method Naming

| Type               | Prefix                    | Example                                         |
| ------------------ | ------------------------- | ----------------------------------------------- |
| Verify visible     | `verify...IsVisible()`    | `verifySearchButtonIsVisible()`                 |
| Verify not visible | `verify...IsNotVisible()` | `verifyPromoAppliedMessageIsNotVisible()`       |
| Verify value       | `verify...`               | `verifyDefaultValue()`                          |
| Click action       | `click...()`              | `clickBackButton()`                             |
| Fill / Input       | Use action name           | `searchFlight()`, `searchFlightWithPromoCode()` |

### When to include `page` as a class field

- Include `readonly page: Page` **only if** the component needs `page` beyond the constructor (e.g., for dynamic locators in methods).
- If all locators are defined in the constructor and methods only use those locators, `page` is not needed as a field.

```typescript
// page NOT needed as field — all locators in constructor
export class HomePageComponent {
    readonly marsAirHeaderLogo: Locator;
    constructor(page: Page) {
        this.marsAirHeaderLogo = page.getByRole('link', { name: 'MarsAir' });
    }
}

// page IS needed — methods create dynamic locators
export class SearchResultComponent {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async verifyPromoAppliedMessage(code: string, discount: number) {
        await expect(this.page.getByText(`Promotional code ${code} used: ${discount}% discount!`)).toBeVisible();
    }
}
```

## Page Object Rules

### Structure

```typescript
import { Page } from '@playwright/test';
import { SearchFormComponent } from '../components/searchForm.component';
import { SearchResultComponent } from '../components/searchResult.component';

export class HomePage {
    readonly page: Page;
    readonly searchFormComponent: SearchFormComponent;
    readonly searchResultComponent: SearchResultComponent;

    constructor(page: Page) {
        this.page = page;
        this.searchFormComponent = new SearchFormComponent(page);
        this.searchResultComponent = new SearchResultComponent(page);
    }

    async navigateToHomePage() {
        await this.page.goto('/VienBui');
    }
}
```

### Rules

1. **One page object per application page/screen**
2. **Compose components via constructor** — never inherit
3. **Page-level methods only**: navigation, page-wide assertions
4. **Components are public `readonly`** — specs access them via `homePage.searchFormComponent`
5. **No business logic** in page objects — they are structural glue

## Fixture Integration

Register every page object in `src/fixture/pageFixtures.ts`:

```typescript
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homepage.page';

type PageFixtures = {
    homePage: HomePage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use, testInfo) => {
        // Setup (browser error capture, etc.)
        await use(new HomePage(page));
        // Teardown (screenshots on failure, etc.)
    },
});
```

### Adding a new page

1. Create component files in `src/components/`
2. Create page object in `src/pages/`
3. Add type to `PageFixtures`
4. Add fixture setup in `base.extend`

## Anti-Patterns

```typescript
// ❌ Locator in spec file
test('login', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
});

// ❌ Component inheriting from another component
class AdminForm extends SearchFormComponent { }

// ❌ Business logic in page object
class HomePage {
    async calculateDiscount(code: string) { return parseInt(code[2]) * 10; }
}

// ❌ Hardcoded waits
async clickSearch() {
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
}
```
