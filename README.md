# MarsAir — Flight booking QA automation

End-to-end tests and documentation for the **MarsAir** flight search web app (ThoughtWorks QA exercise). The app lets users search for trips to Mars, apply promotional codes, and navigate between pages.

**Application under test:** [https://marsair.recruiting.thoughtworks.net/VienBui](https://marsair.recruiting.thoughtworks.net/VienBui)

## Tech stack

| Tool        | Version   |
| ----------- | --------- |
| Playwright  | ^1.59.1   |
| TypeScript  | (Node)    |
| @types/node | ^25.5.2   |

## Project structure

```
TestBooking/
├── .github/workflows/playwright.yml   # CI (GitHub Actions)
├── doc/
│   ├── requirement.md                 # Exercise instructions
│   ├── spec.md                        # User stories & acceptance criteria
│   ├── Test-Plan-MarsAir-Booking-Flight.md
│   └── questionsAndConcerns.md
├── src/
│   ├── components/                    # UI sections (search form, results, header)
│   ├── data/                        # Test data (dates, promo codes)
│   ├── fixture/                     # Playwright fixtures (page objects)
│   └── pages/
├── tests/
│   └── searchFlight.spec.ts         # Automated specs
├── playwright.config.ts
└── package.json
```

## User stories under test

| # | Story                 | Focus |
| - | --------------------- | ----- |
| 1 | Basic search flow     | Departing/returning fields, schedule rules, seat messages |
| 2 | Promotional codes     | Format `XX9-XXX-999`, check digit, discount messaging |
| 3 | Link to home page     | CTA and MarsAir logo navigation |
| 4 | Invalid return dates  | Return less than one year after departure |

Full acceptance criteria: [doc/spec.md](doc/spec.md).

## My approach to testing

This section responds to the exercise requirement to describe how the application was tested.

1. **Requirements** — Read the user stories and acceptance criteria, then listed gaps and questions for stakeholders in [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md).

2. **Planning** — Produced a test plan ([doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md)) with scope, test types, environments, and a case matrix (priorities P1–P4, manual vs automation).

3. **Exploration** — Manual exploration first to learn behavior, find edge cases (e.g. promo check digit 0, special characters, empty date selections), and log issues in the app’s **Report an issue** / issues area.

4. **Automation** — Implemented Playwright + TypeScript with a **page object** style layout: **pages** compose **components**; **fixtures** inject `homePage`; **data** modules drive parameterized cases (date ranges in `selectRange.ts`, promo lists in `promo.data.ts`). High-priority flows were automated first; known defects use `test.fail()` where documented.

5. **CI** — GitHub Actions runs `npm ci`, installs browsers, and executes `npx playwright test`, uploading the HTML report as an artifact.

## Test approach (summary)

- Functional coverage against acceptance criteria  
- Boundary and negative cases (dates, promo codes)  
- UI/navigation (logo, back from results)  
- Cross-browser: local config targets Chromium; the test plan notes broader browser coverage where applicable  

## Prerequisites

- Node.js (LTS recommended)  
- npm  

## Setup

```bash
cd TestBooking
npm ci
npx playwright install --with-deps
```

## Run tests

```bash
npx playwright test
npx playwright test --ui
npx playwright test tests/searchFlight.spec.ts
npx playwright test --headed
npx playwright show-report
```

`playwright.config.ts` sets `baseURL` to `https://marsair.recruiting.thoughtworks.net`. Tests navigate to the candidate path (e.g. `/VienBui`) via page objects.

## CI

On push or pull request to `main` or `master`, `.github/workflows/playwright.yml` installs dependencies, runs Playwright, and uploads `playwright-report/` (30-day retention).

## Issues and questions

- **Logged issues:** [Issues in the MarsAir app](https://marsair.recruiting.thoughtworks.net/VienBui/issues) (per exercise instructions).  
- **Open questions:** [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md).

## Documentation

| Document | Description |
| -------- | ----------- |
| [doc/requirement.md](doc/requirement.md) | Exercise format and deliverables |
| [doc/spec.md](doc/spec.md) | Backstory and user stories |
| [doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md) | Full test plan and case matrix |

## Author

Vien Bui
