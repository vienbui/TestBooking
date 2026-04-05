​

# Test Plan - MarsAir Booking Flight

## Approvers


|                           |      |      |          |       |
| ------------------------- | ---- | ---- | -------- | ----- |
| Approvers                 | Role | Date | Approved | Notes |
| Engineer Manager approval | ​    | ​    | ​        | ​     |
| Tech Lead approval>       | ​    | ​    | ​        | ​     |
| PM approval>              | ​    | ​    | ​        | ​     |
| ​                         | ​    | ​    | ​        | ​     |


## 1. Overview

MarsAir has established itself as the newest commercial spaceship operator. MarsAir is a simple web application system for booking “flights to Mars” ( ThoughtWorks QA entry execise)

​

## 2. Milestone and Testing Timeline

### Milestone


|     |                                  |                                     |                                                                                                                                 |                                                                                  |                                               |
| --- | -------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------- |
| ​   | 4/2/2026                         | 4/3/2026                            | 4/4/2026                                                                                                                        | 4/5/2026                                                                         | 4/6/2026                                      |
| Dev | Application is ready for testing | ​                                   | ​                                                                                                                               | ​                                                                                | ​                                             |
| QA  | ​                                | QA received email with requirements | - Analyze requirements and raise open questions - Create test plan - Init project repo and Playwright setup - Create test cases | - Manual test and log issues - Implement automation test cases - Write README.md | - Send test report - Reply email with results |


### Estimation (High Level)


|     | QA Items             | Estimation (hours) |
| --- | -------------------- | ------------------ |
| 1   | Analyze requirements | 1                  |
| 2   | Create test plan     | 1                  |
| 3   | Create test cases    | 1.5                |
| 4   | Manual test          | 2                  |
| 5   | Implement test cases | 3                  |
| 6   | Total                | 8.5                |


## 3. Impacted Areas

> List the backend components/services impacted and their associated features/functional areas on the frontend to ensure that all affected areas are clearly identified and transparent among teams


|     | Feature/Area                         |
| --- | ------------------------------------ |
| 1   | Search Flight UI                     |
| 2   | Search Result UI                     |
| 3   | Promotion code validation            |
| 4   | Navigation: MarsAir Logo             |
| 5   | Navigation: "Book a ticket" CTA link |
| 6   | Date validation (Return/Departure)   |


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


|   User Story no   |   Story Name     |    |
| --- | -------------------- | --- |
| 1   | Basic Search Flow    |     |
| 2   | Promotional Codes    |     |
| 3   | Link to Home Pages   |     |
| 4   | Invalid Return Dates |     |


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


|             |                                                                                                            |         |     |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ------- | --- |
| Environment | Domain                                                                                                     | Browser | OS  |
| Production  | [https://marsair.recruiting.thoughtworks.net/VienBui](https://marsair.recruiting.thoughtworks.net/VienBui) | Chrome  | Mac |


Note: Manual testing is executed on Chrome/Mac only. Automated tests run across Chrome, Firefox, and Safari (WebKit) via Playwright to verify cross-browser UI consistency per requirements.

### 7. Entry and Exit criteria

#### Entry criteria

- [ ] Application is ready for testing

#### Exit criteria

- [ ] 100% acceptance test and E2E are executed
- [ ] No bugs opening at priority Blocker/ Critical
- [ ] All bugs are triaged by Team
- [ ] Test results are documented

### 8. Test resources

- Manual QA: Vien Bui
- Automation QA: Vien Bui

### 9. Test cases

> Priority: **P1** = Critical | **P2** = High | **P3** = Medium | **P4** = Low
> Test Type: **Manual** | **Automation**

|  | Story | ID | Test Case | Steps | Expected Result | Priority | Test Type | Manual Result | Automation status | Automation Result | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Basic Search Flow | BS-001 | Verify Home page displays with all elements | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui> | Verify that Home page appears with authenticated user.<br> Verify that Home page has: MarsAir logo icon, Report an issue link, Problem definition link, Privacy Policy link and Welcome Search form <br> Verify in Welcome Search Form has "Welcome to MardAir!", "Book a ticket to the red plannet now!", Departing with dropdown list, Returning with dropdown list. Promotional Code with textbox and Search Button| P1 | Automation | Passed | Automated | Passed | ​ |
| 2 | Basic Search Flow | BS-002 | Verify Departing dropdown values | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Click Departing dropdown | Options shown in order: Select..., July, December, July (next year), December (next year), July (two years from now), December (two years from now) | P1 | Automation | Passed | Automated | Passed | ​ |
| 3 | Basic Search Flow | BS-003 | Verify Returning dropdown values | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Click Returning dropdown | Options shown in order: Select..., July, December, July (next year), December (next year), July (two years from now), December (two years from now) | P1 | Automation | Passed | Automated | Passed | ​ |
| 4 | Basic Search Flow | BS-004 | Verify system validates for available seat once user searches with period is exactly 1 year | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing and Returning with data test list<br>3. Click Search **Data Test:**<br>1. Departing: July - Returning: July (next year)<br>2. Departing: December - Returning: December (next year)<br>3. Departing: July (next year) - Returning: July (two years from now)<br>4. Departing: December (next year) - Returning: December ( two years from now) | Verify message "***Sorry, there are no more seats available."*** is displayed on Search Screen | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 5 | Basic Search Flow | BS-005 | Verify system validates for available seat once user searches with period is 1.5 years | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing and Returning with data test list<br>3. Click Search **Data test:**<br>1. Departing: July and Returning: December (next year)<br>2. Departing: December and Returning: July (two years from now)<br>3. Departing : July (next year) and Returning: December ( two years from now) | Verify message "***Sorry, there are no more seats available."*** is displayed on Search Screen | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 6 | Basic Search Flow | BS-006 | Verify system validates for available seat once user searches with period is 2 years | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing and Returning with data test list<br>3. Click Search **Data test:**<br>1. Departing: July and Returning: July (two years from now)<br>2. Departing: December and Returning: December (two years from now) | Verify message "***Sorry, there are no more seats available."*** is displayed on Search Screen | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 7 | Basic Search Flow | BS-007 | Verify system validates for available seat once user searches with period is more than 2 years | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July and Returning: December (two years from now)<br>3. Click Search | Verify that message **"*Seats available!"  "Call now on 0800 MARSAIR to book!*"** is displayed on Search screen | P1 | Automation | Passed | Not Automated yet | Not Run | Having confirmation about text message. Bug#3 |
| 8 | Basic Search Flow | BS-008 | Verify system validates for error once user searches with period is less than 1 year | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing and Returning with data test list<br>3. Click Search **Data test:**<br>1. Departing: July and Returning: December<br>2. Departing: December and Returning: July (next year)<br>3. Departing: July (next year) and Returning: December (next year)<br>4. Departing: December (next year) and Returning: July (two years from now)<br>5. Departing: July (two years from now) and Returning: December (two years from now) | Verify message ***"Unfortunately, this schedule is not possible. Please try again."*** is displayed on Search screen | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 9 | Basic Search Flow | BS-009 | Verify Search without select/input | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Do not select Departing/Returning ( leave them as "Select..."<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | N/A | N/A | The requirement is not clear about this point. Currently, system still allows to click Search and show message "Sorry, there are no more seats available". Raise concern to confirm in Q#1 |
| 10 | Basic Search Flow | BS-010 | Verify Search without selecting Departing | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. DO NOT select Departing ( leave it as "Select...", select a value for Returning<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | N/A | N/A | The requirement is not clear about this point. Currently, system still allows to click Search and show message "Sorry, there are no more seats available". Raise concern to confirm in Q#1, Q#2 |
| 11 | Basic Search Flow | BS-011 | Verify that search without selecting Returning | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select value for Departing, DO NOT select a value for Returning ( leave it as "Select...")<br>3. Do not input Promotional Code<br>4. Click Search | Should have error message | P2 | Manual | N/A | N/A | N/A | The requirement is not clear about this point. Currently, system still allows to click Search and show message "Sorry, there are no more seats available". Raise concern to confirm in Q#1, Q#2 |
| 12 | Basic Search Flow | BS-012 | Verify error message shows if Returning Date is sooner than Departing Date | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Try to perform a search with Returning Date is sooner than Departing Date (e.g: Returning Date: July and Departing Date: December)<br>3. Click Search | Verify that is has error *"Unfortunately, this schedule is not possible. Please try again." is displayed* | P2 | Manual | Failed | N/A | N/A | Bug#4 |
| 13 | Basic Search Flow | BS-013 | Verify error message shows if Returning Date is same as Departing Date | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Try to perform a search with Departing and Returning are on the same day (e.g: Returning Date and Departing Date: December)<br>3. Click Search | Verify that is has error *"Unfortunately, this schedule is not possible. Please try again." is displayed* | P2 | Manual | Failed | N/A | N/A | Bug#5 |
| 14 | Promotional Codes | PC-001 | Verify that Search result shows discount message with valid promo code | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter promo code: AF3-FJK-418<br>5. Click Search | Verify that on Search Result screen has  - "Seats available!" Promotional code AF3-FJK-418 used: 30% discount!" "Call now on 0800 MARSAIR to book!" are displayed. " - Verify Promotional code AF3-FJK-418 used: 30% discount!" is displayed in red and "30% discount!" is in bold | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 15 | Promotional Codes | PC-002 | Verify that Search result shows code is not valid with invalid promo code (wrong check digit) | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter promo code: AF3-FJK-419<br>5. Click Search | Verify that on Search Result screen has  - "Seats available!" Sorry, code AF3-FJK-419 is not valid" "Call now on 0800 MARSAIR to book!" are displayed. " - Verify  "Sorry, code AF3-FJK-419 is not valid" is displayed in red | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 16 | Promotional Codes | PC-003 | Valid promo code with check digit = 0 (sum mod 10 = 0) shows correct discount | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter promo code: `JJ5-OPQ-320`<br>5. Click Search | "Seats available!" is displayed. "Promotional code JJ5-OPQ-320 used: 50% discount!" is displayed in red. | P1 | Automation | Failed | Not Automated yet | Not Run | Bug#6 |
| 17 | Promotional Codes | PC-004 | First digit of promo code determines correct discount percentage (70%) | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter a valid code where first digit = 7 (e.g: `JJ7-OPQ-119`)<br>5. Click Search | "Seats available!" is displayed. Discount shown is 70%. | P1 | Automation | Passed | Not Automated yet | Not Run | image.png |
| 18 | Promotional Codes | PC-005 | Promo code without dashes is rejected | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter `JJ7OPQ119` (no dashes)<br>5. Click Search | "Seats available!" is displayed. "Sorry, code AF3FJK418 is not valid" is displayed in red. | P2 | Automation | Passed | Not Automated yet | Not Run | image.png |
| 19 | Promotional Codes | PC-006 | Empty promo code field shows only seat result, no promo message | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Leave promo code field empty<br>5. Click Search | "Seats available!" and "Call now on 0800 MARSAIR to book!" are displayed. No promo or discount message shown. | P2 | Automation | Passed | Not Automated yet | Not Run | image.png |
| 20 | Promotional Codes | PC-007 | Promo code accepts lowercase input (case-insensitive) | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter af3-fjk-418 (lowercase)<br>5. Click Search | Current behavior "Seats available!" is displayed. "Promotional code af3-fjk-418 used: 30% discount!" is displayed. | P2 | Manual | N/A | N/A | N/A | Currently behavior, system accepts lower case. However, the requirements example mention *"Promotional codes are in the format*XX9-XXX-999*"**"Characters are all random.".* I will re-run this case once I have confirmation |
| 21 | Promotional Codes | PC-008 | Promo code with special characters is rejected | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter AF3-FJ!-418<br>5. Click Search | "Sorry, code AF3-FJ!-418 is not valid" is displayed in red. | P2 | Manual | Failed | N/A | N/A | Bug#7 |
| 22 | Promotional Codes | PC-009 | Promo code longer than 11 chars (12 chars) is accepted — BUG | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter AF3-FJK-418A (12 chars)<br>5. Click Search | Expected: "Sorry, code AF3-FJK-418A is not valid" **Actual: Discount shown — BUG-004** | P2 | Manual | Failed | N/A | N/A | Bug#8 |
| 23 | Promotional Codes | PC-010 | Promo code of 255 chars is accepted and causes UI overflow — BUG | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select Departing: July<br>3. Select Returning: December (two years from now)<br>4. Enter AF3-FJK-418 + 244 'A's (255 chars total)<br>5. Click Search | Expected: Input rejected, max length should be 11 chars **Actual: Discount shown, promo code text overflows result card — BUG-004** | P2 | Manual | Failed | N/A | N/A | Bug#8, Bug#9 |
| 24 | Promotional Codes | PC-011 | Promo code field does not accept more than 255 chars | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Click promo code input field<br>3. Type/paste 256+ chars | Input is truncated at 255 chars — browser enforces maxlength="255" | P2 | Manual | Passed | N/A | N/A | ​ |
| 25 | Link to Home Page | NAV-001 | Verify "Book a ticket to the red planet now!" is visible on Home page as button or link | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui> | Verify "Book a ticket to the red planet now!" is visible on Home page as button or link | P1 | Automation | Failed | Not Automated yet | Not Run | Bug#1 |
| 26 | Link to Home Page | NAV-002 | Verify "Book a ticket to the red planet now!" appears on all pages and clicking CTA navigates to home page | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Perform a search<br>3. Observe "Search Result" screen<br>4. Click "Book a ticket to the red planet now!" | Verify "Book a ticket to the red planet now!" is visible on Search screen as button or link | P1 | Automation | Failed | Not Automated yet | Not Run | Bug#2 |
| 27 | Link to Home Page | NAV-003 | Verify clicking "Book a ticket to the red planet now!" will navigate to home page | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Perform a search<br>3. Observe "Search Result" screen<br>4. Click "Book a ticket to the red planet now!" | Verify that user is redirected to the home page | P1 | Automation | Blocked | Not Automated yet | Not Run | Due to Bug#2, cannot perform step 4 |
| 28 | Link to Home Page | NAV-004 | Verify MarsAir logo is visible on top left | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Observe top left screen<br>3. Click on "Report an issue"<br>4. Observe top left screen | Verify that MarsAir logo is present at top left of the page | P1 | Automation | Passed | Not Automated yet | Not Run | ​ |
| 29 | Link to Home Page | NAV-005 | Verify that clicking MarsAir logo navigates to home page once user is not in the Home page | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Click on "Report an issue"<br>3. Click MarsAir logo | - Verify that user is redirected to the home page with Search form back to default value - Verify that Home page URL is correct | P2 | Manual | Passed | N/A | N/A | ​ |
| 30 | Link to Home Page | NAV-006 | Verify that the page is refreshed once user clicks on MarsAir logo while he is at the Home page | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Select other value than Default ones for Departing/Returning<br>3. Click MarsAir logo | - Verify that the page is refresh, after that Search form back to default value - Verify that Home page URL is correct | P2 | Manual | Passed | N/A | N/A | ​ |
| 31 | Link to Home Page | NAV-007 | Verify error "Not authorized" shows once user accesses page without user path | 1. Access MarsAir system with URL <https://marsair.recruiting.thoughtworks.net/> ( without “/VienBui” | - Verify that message “"Not authorized" appears on UI - Inspect Dev Tool - Network, verify that GET endpoint "https://marsair.recruiting.thoughtworks.net/" returns Status code 401 Unauthorized | P2 | Manual | Passed | N/A | N/A | ​ |
| 32 | Link to Home Page | NAV-008 | Verify clicking on "Back" link in Search Result screen will redirect to Search Form | 1. Access home page <https://marsair.recruiting.thoughtworks.net/VienBui><br>2. Perform a search<br>3. Click "Back" button | Verify that it back to Search form with inputted/selected values | P2 | Manual | Passed | N/A | N/A | ​ |


​

### 10. Highlighted issues

Please refer to [https://marsair.recruiting.thoughtworks.net/VienBui/issues](https://marsair.recruiting.thoughtworks.net/VienBui/issues)

### 11. Open questions

1. What is expected result if user does not select Departing and Returning (keep them as "Select...") but clicking Search? ( disabled Search button?/ error message appears on this form to request input value one user clicks Search?). Currently, system allows to search and show "No more seats available" is not make sense.
2. Do we allow for one-way flight? Mean that user search with Departing but without Returning? If not, what is the expected result?
3. The spec said "Trips for the next two years should be searchable", how about exeed 2 years behavior? Is this a valid combination? Or system should prevent and show error ( combine: Departing: July and Returning: December (two years from now))
4. When user inputs the valid promo code but the search returns that no seat is available, currently, discount message is not displayed. Is this expected or bug?
5. When user input valid promo code, but does not select Departing/Returning ( keep them as "Select..."), which one is validated first: promo code or available seat? ( Should the discount message display even when search result is "no seats available", or only when seats are available?)
6. Do we allow promo code is lower case? The spec format shows uppercase only (XX9-XXX-999) but does not explicitly state lowercase is invalid or not. Currently the system accepts lowercase codes. I'm not sure this is expected behavior or not.
7. The spec only mention "Promotional codes are in the format XX9-XXX-999", but does not indicate what is max lengh for Promotional Code textbox field. I have inspected the API by Dev tool -Elements and the textbox field has "maxlength"=255. So, what is the maxlength for this, 255 ( from HTML design) or 11 ( from Promotional code example in spec)?
8. All available combination do not return available seats except July → December (two years from now), is it expected behavior because of data test limatation or something else?
9. Spec said "Seats available! Call 0800 MARSAIR to book!" but UI shows 2 lines for it. Is this a UI bug?





​