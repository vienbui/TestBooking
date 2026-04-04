​

# Test Plan - MarsAir Booking Flight

Draft document
  
Engineers/ QA collab
  
In-person review
  
Test Plan Approved
  
Test Plan Executed

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
| 3 | Create test cases | 2 |
| 4 | Manual test | 1.5 |
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
| 1 | 1 | Basic Search Flow |
| 2 | 2 | Promotional Codes |
| 3 | 3 | Link to Home Pages |
| 4 | 4 | Invalid Return Dates |

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
- ​

### 9. Test cases

|  | Story | ID | Test Case | Expected result | Priority | Test Type | G |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Basic Search Flow | BS-001 | Search form displays departure and return fields | 1. Open home page | Departure and Return dropdown fields are visible on the form | P1 | Automation |
| 2 | Basic Search Flow | BS-002 | Departure dropdown contains only July and December options for next 2 years | 1. Open home page 2. Click Departure dropdown | Options shown: July 2026, December 2026, July 2027, December 2027 | P1 | Automation |
| 3 | Basic Search Flow | BS-003 | Return dropdown contains only July and December options for next 2 years | 1. Open home page 2. Click Return dropdown | Options shown: July 2026, December 2026, July 2027, December 2027 | P1 | Automation |
| 4 | Basic Search Flow | BS-004 | Search with available seats shows correct message | 1. Select a valid departure 2. Select a valid return (≥ 1 year from departure) 3. Click Search | "Seats available! Call 0800 MARSAIR to book!" is displayed | P1 | Automation |
| 5 | Basic Search Flow | BS-005 | Search with no available seats shows correct message | 1. Select departure/return with no seats 2. Click Search | "Sorry, there are no more seats available." is displayed | P1 | Automation |
| 6 | Basic Search Flow | BS-006 | Departure dropdown does not contain dates beyond 2-year range | 1. Open home page 2. Inspect Departure dropdown options | No options beyond December 2027 are shown | P2 | Automation |
| 7 | Basic Search Flow | BS-007 | Search without selecting any field shows validation or default behavior | 1. Open home page 2. Click Search without selecting any option | Form does not crash; appropriate message or default behavior shown | P2 | Manual |
| 8 | ​ | ​ | ​ | ​ | ​ | ​ | ​ |

​

### 10. Highlighted issues

Please refer to

### 11. Open questions

​