import { test, expect, Page } from '@playwright/test';
import { HomePageLocators } from '../src/locators/homepage.locator';
import { HomePage } from '../src/pages/homepage.page';

test.describe('Home Page', () => {

    // BS-001: Verify Home page displays with all elements
    test('Verify home page is loaded with all elements visible', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await homePage.verifyHomePageIsLoaded();
        await homePage.verifyHeaderLogoIsVisible();
        await homePage.verifySelectDepartingOptionIsVisible();
        await homePage.verifySelectReturningOptionIsVisible();
        await homePage.verifySearchButtonIsVisible();

        await homePage.verifyPromoCodeInputIsVisible();
        await homePage.verifyReportIssueLinkIsVisible();
        await homePage.verifyProblemDefinitionLinkIsVisible();
        await homePage.verifyPrivacyPolicyLinkIsVisible();
        await homePage.verifyBookTicketNowMessageIsVisible();
        await homePage.verifyWelcomeMessageIsVisible();
        await homePage.verifyAllDepartingOptionsAreVisible();
        await homePage.verifyAllReturningOptionsAreVisible();   
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

});