import { test, expect } from '../src/fixture/pageFixtures';
import { PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE, PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE, PERIOD_1_5_YEAR_SELECT_RANGE,PERIOD_1_YEAR_SELECT_RANGE, PERIOD_2_YEAR_SELECT_RANGE } from '../src/data/selectRange';

test.describe('Search Flight', () => {

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    // BS-001: Verify Home page displays with all elements
    test('[BS-001]Verify home page is loaded with all elements visible', async ({homePage}) => {
        await test.step('Header and navigation links', async () => {
            await homePage.verifyHomePageIsLoaded();

            await homePage.verifyHeaderLogoIsVisible();
            await homePage.verifyReportIssueLinkIsVisible();
            await homePage.verifyProblemDefinitionLinkIsVisible();
            await homePage.verifyPrivacyPolicyLinkIsVisible();
        });

        await test.step('Search form elements', async () => {
            await homePage.searchFormComponent.verifySearchFormIsVisible();
            await homePage.searchFormComponent.verifyDefaultValue();
        })
    });

    // BS-002: Verify Departing dropdown values
    test('[BS-002] Verify Departing dropdown values', async ({ homePage }) => {
        await homePage.searchFormComponent.verifyAllDepartingOptionsAreVisible();
    });

    // BS-003: Verify Returning dropdown values
    test('[BS-003]Verify Returning dropdown values', async ({ homePage }) => {
        await homePage.searchFormComponent.verifyAllReturningOptionsAreVisible();
        },
    );


    // BS-004: Verify system validates for available seat once user searches with period is exactly 1 year
    for (const {departing, returning} of PERIOD_1_YEAR_SELECT_RANGE){
    test(`[BS-004] Verify system validates with period is exactly 1 year - ${departing} to ${returning}`, async ({ homePage }) => {
        await homePage.searchFormComponent.searchFlight(departing, returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
        await homePage.searchResultComponent.verifyBackButtonIsVisible();
        });
    }

    // BS-005: Verify system validates with period is 1.5 years
    for (const {departing, returning} of PERIOD_1_5_YEAR_SELECT_RANGE){
        test(`[BS-005] Verify system validates with period is 1.5 years - ${departing} to ${returning}`, async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(departing, returning);
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        })
    }       

    // BS-006: Verify system validates with period is 2 years
    for (const {departing, returning} of PERIOD_2_YEAR_SELECT_RANGE){
        test(`[BS-006] Verify system validates with period is 2 years - ${departing} to ${returning}`, async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(departing, returning);
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        })
    }

    // BS-007: Verify system validates for available seat once user searches with period is more than 2 years
    test('[BS-007] Verify system validates with period is more than 2 years', async ({ homePage}) => {
        await homePage.searchFormComponent.searchFlight(PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing, PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
        await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
        await homePage.searchResultComponent.verifyBackButtonIsVisible();
        }
    );

    // BS-008: Verify system validates for available seat once user searches with period is less than 1 year
    for (const {departing, returning} of PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE){
        test(`[BS-008]Verify system validates with period is less than 1 year - ${departing} to ${returning}`, async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(departing, returning);
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyInvalidReturnDateMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        })
    }
    
});

test.describe('Navigation', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    //NAV-004: Verify that clicking MarsAir logo navigates to home page once user is not in the Home page
    test(`[NAV-004] Verify clicking on MarsAir logo`, async ({ homePage }) => {
        await homePage.searchFormComponent.searchFlight(PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing, PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.homePageComponent.clickLogo();
        await homePage.searchFormComponent.verifySearchFormIsVisible();
        await homePage.searchFormComponent.verifyDefaultValue();
    })

    //NAV-007: Verify clicking on "Back" link in Search Result screen will redirect to Search Form
    test(`[NAV-008] Verify clicking on "Back" link in Search Result screen`, async ({ homePage }) => {
        await homePage.searchFormComponent.searchFlight(PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing, PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
        await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
        await homePage.searchResultComponent.verifyBackButtonIsVisible();
        await homePage.searchResultComponent.clickBackButton();
        await homePage.searchFormComponent.verifySearchFormIsVisible();
    })
}
)

