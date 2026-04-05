import { test, expect, Page } from '@playwright/test';
import { HomePageLocators } from '../src/locators/homepage.locator';
import { HomePage } from '../src/pages/homepage.page';

test.describe('Home Page', () => {

    test('Verify header logo is visible', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await homePage.verifyHomePageIsLoaded();
        await homePage.verifyHeaderLogoIsVisible();
    });

});