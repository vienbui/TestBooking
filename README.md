** MarsAir — Flight booking QA automation **

End-to-end tests and documentation for the **MarsAir** flight search web app (ThoughtWorks QA exercise). The app lets users search for trips to Mars, apply promotional codes, and navigate between pages.

### Project structure
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
└── README.md

```
### User stories under test
| # | Story                 | Focus |
| - | --------------------- | ----- |
| 1 | Basic search flow     | Departing/returning fields, schedule rules, seat messages |
| 2 | Promotional codes     | Format `XX9-XXX-999`, check digit, discount messaging |
| 3 | Link to home page     | CTA and MarsAir logo navigation |
| 4 | Invalid return dates  | Return &lt; 1 year after departure |

Full acceptance criteria: [doc/spec.md](doc/spec.md).
### My approach to testing
This section responds to the exercise requirement to describe how the application was tested.
1. **Requirements Analysis** <br> First of all, I read the instruction in the email carefully. After that, I explore the assignment link including the Problem definition, Privacy Policy and play around with the app to understand what need to be done and what expected outcome for this entry assessment. <br> Outcome of analyzing the Problem definition and playing around with the app, I have: <br> - Acceptance test for each requirement ( user story) <br> - I clarify ambiguities and undefined behaviors and document them in [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md).
2. **Test Planning** <br> - After analyzed requirements, I started to draft the test plan   ([doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md)) with scope, testing timeline, test types, environments <br> - Once I have a draft of test plan, I started to create test cases based on Acceptance criteria of each user story and the out come is a test case matrix ( priority, test type: manual/automation, test data). <br> - I used some test design techniques to define the test cases such as boundary value analysis andEquivalence partitioning techniques  ( apply to flight schedule validation, tested varios period less than 1 year, exactly 1 year, 1.5 years, 2 years and over 2 years) to ensure correct behavior at and around boundary. I also used Exploratory technique to explore edge cases not cover in the spec. 
3. **Exploration Testing** <br> - After phase 2, I started to manual test and fill result to the list of test cases based on their priority. I also found some issues and logged them in the app’s **Report an issue**   area. <br> - I also tracked the bug list under section #10 Highlight issues in the test plan.
4. **Automation Strategy** <br> - I started to initial project and repo, using TypeScript and Playwright <br> - I defined the framwork with page object model style layout for easier maintainability: pages compose components; fixtures inject `homePage`; data modules drive parameterized cases (date ranges in `selectRange.ts`, promo lists in `promo.data.ts`). High-priority flows were automated first; known defects use `test.fail()` where documented.
5. **CI** — GitHub Actions runs `npm ci`, installs browsers, and executes `npx playwright test`, uploading the HTML report as an artifact.
## Test approach (summary)
- Functional coverage against acceptance criteria  
- Boundary and negative cases (dates, promo codes)  
- UI/navigation (logo, back from results)  
- Cross-browser: local config targets Chromium; the test plan notes broader browser coverage where applicable  
### Prerequisites
- Node.js (LTS recommended)  
- npm  
### Setup
```bash
cd TestBooking
npm ci
npx playwright install --with-deps
```
### Run tests
```bash
npx playwright test
npx playwright test --ui
npx playwright test tests/searchFlight.spec.ts
npx playwright test --headed
npx playwright show-report
```
`playwright.config.ts` sets `baseURL` to `https://marsair.recruiting.thoughtworks.net`. Tests navigate to the candidate path (e.g. `/VienBui`) via page objects.
### CI
On push or pull request to `main` or `master`, `.github/workflows/playwright.yml` installs dependencies, runs Playwright, and uploads `playwright-report/` (30-day retention).
### Issues and questions
- **Logged issues:** [Issues in the MarsAir app](https://marsair.recruiting.thoughtworks.net/VienBui/issues) (per exercise instructions).  
- **Open questions:** [doc/questionsAndConcerns.md](doc/questionsAndConcerns.md).
### Documentation
| Document | Description |
| -------- | ----------- |
| [doc/requirement.md](doc/requirement.md) | Exercise format and deliverables |
| [doc/spec.md](doc/spec.md) | Backstory and user stories |
| [doc/Test-Plan-MarsAir-Booking-Flight.md](doc/Test-Plan-MarsAir-Booking-Flight.md) | Full test plan and case matrix |
### Author
Vien Bui
