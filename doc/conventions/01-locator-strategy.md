# Locator Strategy

> Applies to all files under `src/components/`

## Priority Order

Always prefer locators in this order. Stop at the first one that works reliably.

| Priority | Strategy                  | When to use                                     |
| -------- | ------------------------- | ----------------------------------------------- |
| 1        | `getByRole()`             | Buttons, links, headings, textboxes, comboboxes |
| 2        | `getByText()`             | Visible static text with no semantic role       |
| 3        | `getByLabel()`            | Form inputs with associated `<label>`           |
| 4        | `getByPlaceholder()`      | Inputs with placeholder but no label            |
| 5        | `page.locator()` with CSS | Dynamic content, regex patterns, complex DOM    |

**Never use** `page.locator('#id')` or `page.locator('.class')` unless no semantic alternative exists. These break when the UI framework regenerates IDs or renames CSS classes.

## Examples From This Project

### Links & Navigation — `getByRole('link')`

```typescript
// ✅ Resilient: tied to accessible role + visible text
this.marsAirHeaderLogo = page.getByRole('link', { name: 'MarsAir' });
this.reportIssueLink = page.getByRole('link', { name: 'Report an issue' });
this.backButton = page.getByRole('link', { name: 'Back' });

// ❌ Fragile: depends on DOM structure
this.marsAirHeaderLogo = page.locator('a.logo');
```

### Buttons — `getByRole('button')`

```typescript
// ✅
this.searchButton = page.getByRole('button', { name: 'Search' });

// ❌
this.searchButton = page.locator('input[type="submit"]');
```

### Dropdowns / Comboboxes — `getByRole('combobox')`

```typescript
// ✅
this.departingDropdown = page.getByRole('combobox', { name: 'Departing' });
this.returningDropdown = page.getByRole('combobox', { name: 'Returning' });

// ❌
this.departingDropdown = page.locator('#departing');
```

### Headings — `getByRole('heading')`

```typescript
// ✅
this.searchResultTitle = page.getByRole('heading', { name: 'Search Results' });
```

### Static Text — `getByText()`

```typescript
// ✅ Use for messages where there's no better semantic role
this.welcomeMessage = page.getByText('Welcome to MarsAir!');
this.noSeatsAvailableMessage = page.getByText('Sorry, there are no more seats available.');
```

### Form Inputs Without Label — `page.locator()` with attribute

```typescript
// Acceptable when the input has no <label> or accessible name
this.promoCodeInput = page.locator('input[name="promotional_code"]');
```

### Dynamic / Pattern-Based Content — `page.locator()` with regex

```typescript
// For text that contains variable data, use regex locators
this.promotionalCodeMessage = page.locator('text=/Promotional code .+ used: .+% discount!/');
this.invalidPromotionalCodeMessage = page.locator('text=/Sorry, code .+ is not valid/');
```

## Rules

### 1. Locators live in Component constructors, never in spec files

```typescript
// ✅ Component defines the locator
export class SearchFormComponent {
    readonly searchButton: Locator;
    constructor(page: Page) {
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }
}

// ❌ Spec file should never create locators directly
test('search', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click(); // Don't do this
});
```

### 2. All locators must be `readonly`

Locators are set once in the constructor and never reassigned.

```typescript
readonly searchButton: Locator;    // ✅
searchButton: Locator;             // ❌ Missing readonly
```

### 3. Locator variable names describe the UI element

```typescript
readonly departingDropdown: Locator;         // ✅ Clear what it is
readonly returningDropdown: Locator;         // ✅
readonly dropdown1: Locator;                 // ❌ Meaningless name
readonly el: Locator;                        // ❌
```

### 4. When verifying dynamic text, use a method with parameters

```typescript
// ✅ Parameterized — works for any promo code
async verifyPromoAppliedMessage(code: string, discount: number) {
    await expect(
        this.page.getByText(`Promotional code ${code} used: ${discount}% discount!`)
    ).toBeVisible();
}

// ❌ Hardcoded — only works for one scenario
async verifyPromoAppliedMessage() {
    await expect(this.page.getByText('Promotional code AF3-FJK-418 used: 30% discount!')).toBeVisible();
}
```

### 5. Prefer `exact: true` when text could partially match

```typescript
// If "Search" might match "Search Results", be explicit:
page.getByRole('button', { name: 'Search', exact: true });
```
