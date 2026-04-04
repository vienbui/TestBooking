​

# Test Plan - MarsAir Booking Flight


## Approvers

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| Approvers | Role | Date | Approved | Notes |
| <Engineer Manager approval> | ​ | ​ | ​ | ​ |
| <Tech Lead approval> | ​ | ​ | ​ | ​ |
| <PM approval> | ​ | ​ | ​ | ​ |
| ​ | ​ | ​ | ​ | ​ |

## 1. Overview

MarsAir has established itself as the newest commercial spaceship operator. MarsAir is a simple web application system for booking “flights to Mars” ( ThoughtWorks QA entry execise)

​

## 2. Milestone and Testing Timeline

### Milestone

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| ​ | 4/2/2026 | 4/3/2026 | 4/4/2026 | 4/5/2026 | 4/6/2026 |
| Dev | Application is ready for testing | ​ | ​ | ​ | ​ |
| QA | ​ | QA received email with requirements | - Analyze requirements - Create test plan - Init project repo - Create test cases | - Manual test - Implement automations test cases - Write README.md | - Reply email with results |

### Estimation (High Level)

|  | QA Items | Estimation (hours) |
| --- | --- | --- |
| 1 | Analyze requirements | 1 |
| 2 | Create test plan | 1 |
| 3 | Create test cases | 1.5 |
| 4 | Manual test | 2 |
| 5 | Implement test cases | 3 |
| 6 | Total | 8.5 |

## 3. Impacted Areas

> List the backend components/services impacted and their associated features/functional areas on the frontend to ensure that all affected areas are clearly identified and transparent among teams

|  | Feature/Area |
| --- | --- |
| 1 | Search Flight UI |
| 2 | Search Result UI |
| 3 | Promotion code validation |
| 4 | Navigation: MarsAir Logo |
| 5 | Navigation: "Book a ticket" CTA link |
| 6 | Date validation (Return/Departure) |

## 4. Test Scope

### 4.1 In scope

- Flight search form
- Flight schedule rules
- Search result messages (valid and invalid search)
- Promotion code
- Navigation

### 4.2 Out of scope

- Payment/Credit card processing
- Cross-selling
- Content Management
- Non-functional testing (performance, load, security)
- Backend/API layer

### 4.3 User Stories under test

|  | User Story no | B |
| --- | --- | --- |
| 1 | Basic Search Flow |
| 2 | Promotional Codes |
| 3 | Link to Home Pages |
| 4 | Invalid Return Dates |

## 5. Test Approach

### 5.1 Test Types

- Functional testing: Verify acceptance criteria for each user story
- Boundary Testing: Verify date boundaries, promotion code
- Negative Testing: invalid promotion code, invalid date combinations
- UI/Navigation testing: routing
- Cross browser testing
- Exploration testing

### 5.2 Automation Strategy

- Framework: Playwright + Typescript
- Detailed of which test cases are automated are specified in Test cases section

### 6. Test environments

|  |  |  |  |
| --- | --- | --- | --- |
| Environment | Domain | Browser | OS |
| Production | <https://marsair.recruiting.thoughtworks.net/VienBui> | Chrome | Mac |

Note: Manual testing is executed on Chrome/Mac only. Automated tests run across Chrome, Firefox, and Safari (WebKit) via Playwright to verify cross-browser UI consistency per requirements.



### 7. Entry and Exit criteria

#### Entry criteria

- Application is ready for testing

#### Exit criteria

- 100% acceptance test and E2E are executed
- No bugs opening at priority Blocker/ Critical
- All bugs are triaged by Team
- Test results are documented

### 8. Test resources

- Manual QA: Vien Bui
- Automation QA: Vien Bui
  

### 9. Test cases


> Priority: **P1** = Critical | **P2** = High | **P3** = Medium | **P4** = Low
> Test Type: **Manual** | **Automation**

| Story | ID | Test Case | Steps | Expected Result | Priority | Test Type | Manual Result | Note |
|---|---|---|---|---|---|---|---|---|
| Basic Search Flow | BS-001 | Verify Search form displays | 1. Open home page | Departure and Return dropdown fields are visible on the form | P1 | Automation | Passed | |
| Basic Search Flow | BS-002 | Verify Departing dropdown values | 1. Open home page<br>2. Click Departing dropdown | Options shown in order: Select..., July, December, July (next year), December (next year), July (two years from now), December (two years from now) | P1 | Automation | Passed | |
| Basic Search Flow | BS-003 | Verify Returning dropdown values | 1. Open home page<br>2. Click Returning dropdown | Options shown in order: Select..., July, December, July (next year), December (next year), July (two years from now), December (two years from now) | P1 | Automation | Passed | |
| Basic Search Flow | BS-004 | Verify Search with gap exactly 1 year | 1. Open home page<br>2. Select Departing: July and Returning: July (next year)<br>3. Click Search<br><br>**Data Test:**<br>- Departing: July → Returning: July (next year)<br>- Departing: December → Returning: December (next year)<br>- Departing: July (next year) → Returning: July (two years from now)<br>- Departing: December (next year) → Returning: December (two years from now) | "Sorry, there are no more seats available." is displayed | P1 | Automation | Passed | |
| Basic Search Flow | BS-005 | Verify Search with gap 1.5 years | 1. Open home page<br>2. Select Departing: July and Returning: December (next year)<br>3. Click Search<br><br>**Data Test:**<br>- Departing: July → Returning: December (next year)<br>- Departing: December → Returning: July (two years from now)<br>- Departing: July (next year) → Returning: December (two years from now) | "Sorry, there are no more seats available." is displayed | P1 | Automation | Passed | |
| Basic Search Flow | BS-006 | Verify Search with gap 2 years | 1. Open home page<br>2. Select Departing: July and Returning: July (two years from now)<br>3. Click Search<br><br>**Data Test:**<br>- Departing: July → Returning: July (two years from now)<br>- Departing: December → Returning: December (two years from now) | "Sorry, there are no more seats available." is displayed | P1 | Automation | Passed | |
| Basic Search Flow | BS-007 | Verify Search with gap 2.5 years | 1. Open home page<br>2. Select Departing: July and Returning: December (two years from now)<br>3. Click Search | "Seats available!" and "Call now on 0800 MARSAIR to book!" displayed | P1 | Automation | Passed | Have open Q#2 |
| Basic Search Flow | BS-008 | Verify Search with date less than 1 year from departure date should show error | 1. Select Departing: **July**<br>2. Select Returning: **December**<br>3. Click Search | "Unfortunately, this schedule is not possible. Please try again." is displayed | P1 | Automation | Passed | |
| Basic Search Flow | BS-009 | Verify Search without select/input | 1. Open home page<br>2. Do not select Departing/Returning (leave them as "Select...")<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | No requirement about it. Need to confirm Q#1 |
| Basic Search Flow | BS-010 | Verify Search without selecting Departing | 1. Open home page<br>2. Do NOT select Departing (leave as "Select..."), select a value for Returning<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | No requirement about it. Need to confirm Q#1 |
| Basic Search Flow | BS-011 | Verify Search without selecting Returning | 1. Open home page<br>2. Select value for Departing, do NOT select Returning (leave as "Select...")<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | No requirement about it. Need to confirm Q#1 |
| Basic Search Flow | BS-012 | Verify error message shown if Returning is sooner than Departing | 1. Open home page<br>2. Select Departing: **December (next year)**<br>3. Select Returning: **July**<br>4. Click Search | "Unfortunately, this schedule is not possible. Please try again." is displayed | P2 | Manual | Failed | In Progress to log |
| Basic Search Flow | BS-013 | Same option selected for departure and return shows error | 1. Select Departing: **December**<br>2. Select Returning: **December**<br>3. Click Search | "Unfortunately, this schedule is not possible. Please try again." is displayed | P2 | Automation | Failed | In Progress to log |
| Promotional Codes | PC-001 | Valid promo code shows discount message alongside seat result | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter promo code: `AF3-FJK-418`<br>4. Click Search | "Seats available!" and "Call now on 0800 MARSAIR to book!" are displayed. "Promotional code AF3-FJK-418 used: 30% discount!" is displayed in red. | P1 | Automation | | |
| Promotional Codes | PC-002 | Invalid promo code (wrong check digit) shows error alongside seat result | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter promo code: `AF3-FJK-419`<br>4. Click Search | "Seats available!" and "Call now on 0800 MARSAIR to book!" are displayed. "Sorry, code AF3-FJK-419 is not valid" is displayed in red. | P1 | Automation | | |
| Promotional Codes | PC-003 | Valid promo code with check digit = 0 (sum mod 10 = 0) shows correct discount | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter promo code: `JJ5-OPQ-320`<br>4. Click Search | "Seats available!" is displayed. "Promotional code JJ5-OPQ-320 used: 50% discount!" is displayed in red. | P1 | Automation | | |
| Promotional Codes | PC-004 | First digit of promo code determines correct discount percentage (20%) | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter a valid code where first digit = 2<br>4. Click Search | "Seats available!" is displayed. Discount shown is 20%. | P1 | Automation | | |
| Promotional Codes | PC-005 | Promo code without dashes is rejected | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter `AF3FJK418` (no dashes)<br>4. Click Search | "Seats available!" is displayed. "Sorry, code AF3FJK418 is not valid" is displayed in red. | P2 | Automation | | |
| Promotional Codes | PC-006 | Empty promo code field shows only seat result, no promo message | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Leave promo code field empty<br>4. Click Search | "Seats available!" and "Call now on 0800 MARSAIR to book!" are displayed. No promo or discount message shown. | P2 | Automation | | |
| Promotional Codes | PC-007 | Promo code accepts lowercase input (case-insensitive) | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter `af3-fjk-418` (lowercase)<br>4. Click Search | "Seats available!" is displayed. "Promotional code af3-fjk-418 used: 30% discount!" is displayed. Note: AC defines format as uppercase only — known bug (BUG-003). | P3 | Manual | Failed | In Progress to log |
| Promotional Codes | PC-008 | Promo code with special characters is rejected | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter `AF3-FJ!-418`<br>4. Click Search | "Sorry, code AF3-FJ!-418 is not valid" is displayed in red. | P3 | Manual | | |
| Promotional Codes | PC-009 | Promo code longer than 11 chars (12 chars) is accepted — BUG | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter `AF3-FJK-418A` (12 chars)<br>4. Click Search | **Expected:** "Sorry, code AF3-FJK-418A is not valid"<br>**Actual:** Discount shown — BUG-004 | P2 | Manual | Failed | In Progress to log |
| Promotional Codes | PC-010 | Promo code of 255 chars is accepted and causes UI overflow — BUG | 1. Select Departing: **July**<br>2. Select Returning: **December (two years from now)**<br>3. Enter `AF3-FJK-418` + 244 'A's (255 chars total)<br>4. Click Search | **Expected:** Input rejected, max length should be 11 chars<br>**Actual:** Discount shown, promo code text overflows result card — BUG-004 | P2 | Manual | | |
| Promotional Codes | PC-011 | Promo code field does not accept more than 255 chars | 1. Click promo code input field<br>2. Type/paste 256+ chars | Input is truncated at 255 chars — browser enforces maxlength="255" | P3 | Manual | | |
| Link to Home Page | NAV-001 | "Book a ticket to the red planet now!" CTA is visible on page | 1. Open any page on MarsAir | CTA text "Book a ticket to the red planet now!" is visible and prominent | P1 | Automation | | |
| Link to Home Page | NAV-002 | Clicking CTA navigates to home page | 1. Navigate to a non-home page<br>2. Click "Book a ticket to the red planet now!" | User is redirected to the home page | P1 | Automation | | |
| Link to Home Page | NAV-003 | MarsAir logo is visible on top left | 1. Open any page | MarsAir logo is present at top left of the page | P1 | Automation | | |
| Link to Home Page | NAV-004 | Clicking MarsAir logo navigates to home page | 1. Navigate to a non-home page<br>2. Click MarsAir logo | User is redirected to the home page | P1 | Automation | | |
| Link to Home Page | NAV-005 | Home page URL is correct after clicking logo or CTA | 1. Click logo or CTA<br>2. Check URL | URL matches the expected home page URL | P1 | Automation | | |


​

### 10. Highlighted issues

Please refer to 

### 11. Open questions
1. What is expected result if user does not select Departing and Returning (keep them as "Select...") but clicking Search? ( disabled Search button?/ error message appears on this form to request input value one user clicks Search?). Currently, system allows to search and show "No more seats available" is not make sense.
2. Do we allow for one-way flight? Mean that user search with Departing but without Returning? If not, what is the expected result?
3. AC says "Trips for the next two years should be searchable", how about exeed 2 years behavior? Is this a valid combination? Or system should prevent and show error ( combine: Departing: July and Returning: December (two years from now)
4. When user inputs the valid promo code but the search returns that no seat is available, currently, discount message is not displayed. Is this expected or bug?
5. When user input valid promo code, but does not select Departing/Returning ( keep them as "Select..."), which one is validated first: promo code or available seat?
6. Spec said "Seats available! Call 0800 MARSAIR to book!" but UI shows 2 lines for it. Is this a UI bug?
7. 
​