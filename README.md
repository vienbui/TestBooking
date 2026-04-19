### MarsAir — Flight booking QA automation

This project includes end-to-end manual and automation tests and documentation for the **MarsAir** flight search web application (ThoughtWorks entry QA assessment). <br> The application lets users search for trips to Mars, apply promotional codes, and navigate between pages.
<br> The goal is to validate key user flows such as: searching for flights, validating promo codes, handling valid and invalid inputs — as well as non-functional quality attributes like performance, accessibility, security, and visual consistency.

### Tech stack

| Tool                                                                                              | Purpose                                |
| ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Playwright](https://playwright.dev/) + TypeScript                                                | Test automation framework              |
| [axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) | Accessibility testing                  |
| [Allure](https://docs.qameta.io/allure/) (`allure-playwright` + `allure-commandline`)             | Test reporting with history and trends |
| ESLint + Prettier                                                                                 | Linting and formatting                 |
| GitHub Actions                                                                                    | CI pipeline                            |
| dotenv                                                                                            | Environment variable management        |

### Project structure

```
TestBooking/
├── .github/workflows/playwright.yml    # CI pipeline (multi-job with Allure)
├── doc/
│   ├── requirement.md                  # Exercise instructions
│   ├── spec.md                         # User stories & acceptance criteria
│   ├── Test-Plan-MarsAir-Booking-Flight.md
│   └── questionsAndConcerns.md
├── src/
│   ├── components/                     # UI section locators (header, search form, results)
│   ├── data/                           # Test data (date ranges, promo codes)
│   ├── fixture/                        # Playwright fixtures (homePage injection, failure attachments)
│   └── pages/                          # Page objects (HomePage)
├── tests/
│   ├── functional/
│   │   └── searchFlight.spec.ts        # Search, navigation, promo code specs
│   └── nonfunctional/
│       ├── accessibility.spec.ts       # axe-core a11y checks
│       ├── performance.spec.ts         # TTFB, FCP, load time thresholds
│       ├── security.spec.ts            # XSS, security headers, auth
│       └── visualRegression.spec.ts    # Full-page screenshot comparisons
├── categories.json                     # Allure category rules
├── eslint.config.mjs
├── playwright.config.ts
└── package.json
```

### Test coverage

#### Functional tests (`tests/functional/`)

| Tag                  | Area           | What it covers                                                                   |
| -------------------- | -------------- | -------------------------------------------------------------------------------- |
| `@smoke`             | Search flow    | Home page loads correctly; departing/returning fields present                    |
| `@e2e`               | Date scenarios | Various flight periods (1y, 1.5y, 2y, >2y, <1y); seats/no-seats/invalid messages |
| `@e2e`               | Navigation     | Logo → home; Back link → search form                                             |
| `@e2e` `@regression` | Promo codes    | Valid/invalid codes, check digit validation, discount text, special chars        |

#### Non-functional tests (`tests/nonfunctional/`)

| Tag              | Area              | What it covers                                                    |
| ---------------- | ----------------- | ----------------------------------------------------------------- |
| `@performance`   | Performance       | TTFB, FCP, page load thresholds; search-to-results timing         |
| `@accessibility` | Accessibility     | axe-core critical violation scans on home and results pages       |
| `@security`      | Security          | XSS payloads in promo field; HTTP security headers; root URL auth |
| `@visual`        | Visual regression | Full-page screenshot diffs (home, results variants, promo states) |

### My approach to testing

1. **Requirements analysis** <br> Read the assignment instructions, explored the app, and derived acceptance criteria for each user story. Ambiguities and undefined behaviors are documented in [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md).
2. **Test planning** <br> Drafted a test plan ([doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md)) covering scope, timelines, test types, and environments. Created a test case matrix using boundary value analysis and equivalence partitioning (e.g., flight schedule periods at and around 1-year, 1.5-year, 2-year boundaries). Used exploratory testing for edge cases beyond the spec.
3. **Exploratory testing** <br> Manual test execution against the test case matrix, prioritized by risk. Issues found were logged in the app's **Report an issue** area and tracked under section #10 of the test plan.
4. **Automation strategy** <br> Built a two-layer Page Object Model: pages compose components; fixtures inject `homePage`; data modules drive parameterized cases. P1 cases were automated first. Known defects are documented with `test.fail()`.
5. **CI/CD** <br> GitHub Actions runs a multi-job pipeline: critical tests and non-functional tests execute in parallel, then a report job merges Allure results with trend history.

### Prerequisites

- Node.js (LTS recommended)
- npm

### Setup

```bash
# Clone repository
git clone https://github.com/vienbui/TestBooking.git
cd TestBooking

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### Environment variables

Create a `.env` file in the project root (gitignored):

| Variable         | Default                                       | Purpose                         |
| ---------------- | --------------------------------------------- | ------------------------------- |
| `BASE_URL`       | `https://marsair.recruiting.thoughtworks.net` | Application base URL            |
| `CANDIDATE_PATH` | `/VienBui`                                    | Candidate-specific path segment |

### Run tests

```bash
# Run all tests (all browsers)
npx playwright test

# Run by tag
npx playwright test --grep @smoke
npx playwright test --grep @e2e
npx playwright test --grep @security
npx playwright test --grep @regression

# Run a specific test file
npx playwright test tests/functional/searchFlight.spec.ts

# Run on a single browser
npx playwright test --project=chromium

# Run in headed mode
npx playwright test --headed
```

### Reporting

The project uses both **Playwright HTML** and **Allure** reporters.

```bash
# Run all tests and open Allure report
npm run demo

# Run a specific suite with Allure
npm run demo:smoke
npm run demo:e2e
npm run demo:security
npm run demo:performance
npm run demo:accessibility
npm run demo:visual
npm run demo:regression
```

Allure reports include trend history across runs. The `allure:clean` and `allure:prepare` scripts manage history backup and restoration between runs.

### CI

On push or pull request to `main`, `.github/workflows/playwright.yml` runs a three-job pipeline:

1. **critical-tests** — runs `@smoke` and `@e2e` tagged tests
2. **nonfunctional-tests** — runs `@performance`, `@accessibility`, `@visual`, and `@security` tagged tests (continue-on-error)
3. **report** — merges Allure results from both jobs, restores trend history from GitHub Actions cache, generates the Allure report, and uploads it as an artifact

Both Playwright HTML and Allure reports are uploaded as downloadable artifacts.

### Code quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

ESLint is configured with TypeScript and Playwright plugins. Prettier handles formatting. `lint-staged` runs both on staged files.

### Issues and questions

- All found issues are logged on [Issues in the MarsAir app](https://marsair.recruiting.thoughtworks.net/VienBui/issues)
- All questions and concerns are tracked in [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md)

### Documentation

| Document                                                                           | Description                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------- |
| [doc/requirement.md](doc/requirement.md)                                           | Exercise format and deliverables         |
| [doc/spec.md](doc/spec.md)                                                         | Backstory and user stories               |
| [doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md) | Test plan, test case matrix, and results |
| [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md)                         | Open questions and ambiguities           |

### Author

Vien Bui
