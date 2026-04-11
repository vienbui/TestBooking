import { test, expect } from '../src/fixture/pageFixtures';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE, PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE } from '../src/data/selectRange';
import { VALID_PROMO_CODES, INVALID_PROMO_CODES } from '../src/data/promo.data';

const SCREENSHOT_OPTIONS = { maxDiffPixelRatio: 0.01 };

test.describe('Visual Regression', () => {

    test('[VR-001] Home page looks correct', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        await homePage.searchFormComponent.verifySearchFormIsVisible();

        await expect(page).toHaveScreenshot('home-page.png', SCREENSHOT_OPTIONS);
    });

    test('[VR-002] Search results - seats available', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
        await homePage.searchFormComponent.searchFlight(departing, returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        await expect(page).toHaveScreenshot('search-results-seats-available.png', SCREENSHOT_OPTIONS);
    });

    test('[VR-003] Search results - no seats available', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE[0];
        await homePage.searchFormComponent.searchFlight(departing, returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        await expect(page).toHaveScreenshot('search-results-no-seats.png', SCREENSHOT_OPTIONS);
    });

    test('[VR-004] Search results - invalid return date', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        await homePage.searchFormComponent.searchFlight('December', 'July');
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        await expect(page).toHaveScreenshot('search-results-invalid-date.png', SCREENSHOT_OPTIONS);
    });

    test('[VR-005] Search results - valid promo code applied', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
        const { code } = VALID_PROMO_CODES[0];
        await homePage.searchFormComponent.searchFlightWithPromoCode(departing, returning, code);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        await expect(page).toHaveScreenshot('search-results-promo-valid.png', SCREENSHOT_OPTIONS);
    });

    test('[VR-006] Search results - invalid promo code', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
        const { code } = INVALID_PROMO_CODES[0];
        await homePage.searchFormComponent.searchFlightWithPromoCode(departing, returning, code);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        await expect(page).toHaveScreenshot('search-results-promo-invalid.png', SCREENSHOT_OPTIONS);
    });
});
