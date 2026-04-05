import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../src/pages/homepage.page';
import { SearchPage } from '../src/pages/search.page';
import { SearchResultPage } from '../src/pages/searchResult.page';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../src/data/selectRange';

test.describe('Search Flight', () => {

    // BS-001: Verify Home page displays with all elements
    test('Verify home page is loaded with all elements visible', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();

        await homePage.verifyHomePageIsLoaded();

        await homePage.verifyHeaderLogoIsVisible();
        await homePage.verifyReportIssueLinkIsVisible();
        await homePage.verifyProblemDefinitionLinkIsVisible();
        await homePage.verifyPrivacyPolicyLinkIsVisible();

        await homePage.verifyWelcomeMessageIsVisible();
        await homePage.verifyBookTicketNowMessageIsVisible();
        await homePage.verifySelectDepartingOptionIsVisible();
        await homePage.verifySelectReturningOptionIsVisible();
        await homePage.verifyPromoCodeInputIsVisible();
        await homePage.verifySearchButtonIsVisible();
         
    });

    // BS-002: Verify Departing dropdown values
    test('Verify Departing dropdown values', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await homePage.verifyAllDepartingOptionsAreVisible();
    });

    // BS-003: Verify Returning dropdown values
    test('Verify Returning dropdown values', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await homePage.verifyAllReturningOptionsAreVisible();
    });


    // BS-007: Verify system validates for available seat once user searches with period is more than 2 years
    test('Verify system validates for available seat once user searches with period is more than 2 years', async ({ page }) => {
        const searchPage = new SearchPage(page);
        const homePage = new HomePage(page);
        const searchResultPage = new SearchResultPage(page);
        await homePage.navigateToHomePage();
        await searchPage.searchFlight(PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing, PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning);
        await searchResultPage.verifySearchResultTitleIsVisible();
        await searchResultPage.verifySeatsAvailableMessageIsVisible();
       
        await searchResultPage.verifyCallNowMessageIsVisible();
        await searchResultPage.verifyBackButtonIsVisible();
    });
});