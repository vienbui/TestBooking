import { test } from '../../src/fixture/pageFixtures';
import {
    PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE,
    PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE,
    PERIOD_1_5_YEAR_SELECT_RANGE,
    PERIOD_1_YEAR_SELECT_RANGE,
    PERIOD_2_YEAR_SELECT_RANGE,
} from '../../src/data/selectRange';
import { VALID_PROMO_CODES, INVALID_PROMO_CODES } from '../../src/data/promo.data';

test.describe('Search Flight', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    // BS-001: Verify Home page displays with all elements
    test(
        '[BS-001]Verify home page is loaded with all elements visible',
        { tag: ['@smoke', '@regression'] },
        async ({ homePage }) => {
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
            });
        },
    );

    // BS-002: Verify Departing dropdown values
    test('[BS-002] Verify Departing dropdown values', { tag: ['@smoke', '@regression'] }, async ({ homePage }) => {
        await homePage.searchFormComponent.verifyAllDepartingOptionsAreVisible();
    });

    // BS-003: Verify Returning dropdown values
    test('[BS-003]Verify Returning dropdown values', { tag: ['@smoke', '@regression'] }, async ({ homePage }) => {
        await homePage.searchFormComponent.verifyAllReturningOptionsAreVisible();
    });

    // BS-004: Verify system validates for available seat once user searches with period is exactly 1 year
    for (const { departing, returning } of PERIOD_1_YEAR_SELECT_RANGE) {
        test(
            `[BS-004] Verify system validates with period is exactly 1 year - ${departing} to ${returning}`,
            { tag: ['@e2e', '@regression'] },
            async ({ homePage }) => {
                await homePage.searchFormComponent.searchFlight(departing, returning);
                await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
                await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
                await homePage.searchResultComponent.verifyBackButtonIsVisible();
            },
        );
    }

    // BS-005: Verify system validates with period is 1.5 years
    for (const { departing, returning } of PERIOD_1_5_YEAR_SELECT_RANGE) {
        test(
            `[BS-005] Verify system validates with period is 1.5 years - ${departing} to ${returning}`,
            { tag: ['@e2e', '@regression'] },
            async ({ homePage }) => {
                await homePage.searchFormComponent.searchFlight(departing, returning);
                await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
                await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
                await homePage.searchResultComponent.verifyBackButtonIsVisible();
            },
        );
    }

    // BS-006: Verify system validates with period is 2 years
    for (const { departing, returning } of PERIOD_2_YEAR_SELECT_RANGE) {
        test(
            `[BS-006] Verify system validates with period is 2 years - ${departing} to ${returning}`,
            { tag: ['@e2e', '@regression'] },
            async ({ homePage }) => {
                await homePage.searchFormComponent.searchFlight(departing, returning);
                await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
                await homePage.searchResultComponent.verifyNoSeatsAvailableMessageIsVisible();
                await homePage.searchResultComponent.verifyBackButtonIsVisible();
            },
        );
    }

    // BS-007: Verify system validates for available seat once user searches with period is more than 2 years
    test(
        '[BS-007] Verify system validates with period is more than 2 years',
        { tag: ['@smoke', '@e2e', '@regression'] },
        async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        },
    );

    // BS-008: Verify system validates for available seat once user searches with period is less than 1 year
    for (const { departing, returning } of PERIOD_LESS_THAN_1_YEAR_SELECT_RANGE) {
        test(
            `[BS-008]Verify system validates with period is less than 1 year - ${departing} to ${returning}`,
            { tag: ['@e2e', '@regression'] },
            async ({ homePage }) => {
                await homePage.searchFormComponent.searchFlight(departing, returning);
                await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
                await homePage.searchResultComponent.verifyInvalidReturnDateMessageIsVisible();
                await homePage.searchResultComponent.verifyBackButtonIsVisible();
            },
        );
    }
});

test.describe('Navigation', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    //NAV-004: Verify that clicking MarsAir logo navigates to home page once user is not in the Home page
    test(`[NAV-004] Verify clicking on MarsAir logo`, { tag: ['@e2e', '@regression'] }, async ({ homePage }) => {
        await homePage.searchFormComponent.searchFlight(
            PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
            PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
        );
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.homePageComponent.clickLogo();
        await homePage.searchFormComponent.verifySearchFormIsVisible();
        await homePage.searchFormComponent.verifyDefaultValue();
    });

    //NAV-007: Verify clicking on "Back" link in Search Result screen will redirect to Search Form
    test(
        `[NAV-007] Verify clicking on "Back" link in Search Result screen`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
            await homePage.searchResultComponent.clickBackButton();
            await homePage.searchFormComponent.verifySearchFormIsVisible();
        },
    );
});

test.describe('Promotional Code', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    //PC-001: Verify system validates with valid promotional code
    test(`[PC-001] Verify valid promotional code is applied`, { tag: ['@e2e', '@regression'] }, async ({ homePage }) => {
        const { code, discount } = VALID_PROMO_CODES[0];
        await homePage.searchFormComponent.searchFlightWithPromoCode(
            PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
            PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
            code,
        );
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
        await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
        await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
        await homePage.searchResultComponent.verifyBackButtonIsVisible();
        await homePage.searchResultComponent.verifyPromoAppliedMessage(code, discount);
    });

    //PC-002: Verify system validates with invalid wrong check digit promotional code
    test(
        `[PC-002] Verify system validates with invalid wrong check digit promotional code`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            const { code } = INVALID_PROMO_CODES[0];
            await homePage.searchFormComponent.searchFlightWithPromoCode(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
                code,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyInvalidPromotionalCodeMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        },
    );

    //PC-003: Verify that Search result shows correct discount for valid promo code with check digit = 0 (sum mod 10 = 0)
    test(
        `[PC-003] Verify promo code is applied with check digit = 0`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            test.fail(
                true,
                'BUG#6: System shows code is not valid even user inputs valid promo code with check digit=0  JJ5-OPQ-321',
            );
            const { code, discount } = VALID_PROMO_CODES[5];
            await homePage.searchFormComponent.searchFlightWithPromoCode(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
                code,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
            await homePage.searchResultComponent.verifyPromoAppliedMessage(code, discount);
        },
    );

    //PC-004: Verify that system validates the first digit and shows as discount percentage
    for (const { code, discount } of VALID_PROMO_CODES.slice(0, 3)) {
        test(
            `[PC-004] Promo code first digit ${code[2]} shows ${discount}% discount`,
            { tag: ['@e2e', '@regression'] },
            async ({ homePage }) => {
                await homePage.searchFormComponent.searchFlightWithPromoCode(
                    PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                    PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
                    code,
                );
                await homePage.searchResultComponent.verifyPromoAppliedMessage(code, discount);
            },
        );
    }

    //PC-005: Verify that system validates promo code without dashes as invalid one
    test(
        `[PC-005] Verify that system validates promo code without dashes as invalid one`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            const { code } = INVALID_PROMO_CODES[1];
            await homePage.searchFormComponent.searchFlightWithPromoCode(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
                code,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyInvalidPromotionalCodeMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        },
    );

    //PC-006: Verify that search can perform sucessfully without input promo code
    test(
        `[PC-006] Verify that search can perform sucessfully without input promo code`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            await homePage.searchFormComponent.searchFlight(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifySeatsAvailableMessageIsVisible();
            await homePage.searchResultComponent.verifyCallNowMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
            await homePage.searchResultComponent.verifyPromoAppliedMessageIsNotVisible();
            await homePage.searchResultComponent.verifyPromoInvalidMessageIsNotVisible();
        },
    );

    //PC-008: Verify system validates with invalid promotional code with special characters
    test(
        `[PC-008] Verify system validates with invalid promotional code with special characters`,
        { tag: ['@e2e', '@regression'] },
        async ({ homePage }) => {
            // test.fail(true, 'BUG#7: Should not accept Promo code containing special characters')
            const { code } = INVALID_PROMO_CODES[2];
            await homePage.searchFormComponent.searchFlightWithPromoCode(
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].departing,
                PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0].returning,
                code,
            );
            await homePage.searchResultComponent.verifySearchResultTitleIsVisible();
            await homePage.searchResultComponent.verifyInvalidPromotionalCodeMessageIsVisible();
            await homePage.searchResultComponent.verifyBackButtonIsVisible();
        },
    );
});
