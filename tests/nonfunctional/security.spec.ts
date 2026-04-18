import { test, expect } from '../../src/fixture/pageFixtures';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../../src/data/selectRange';

const XSS_PAYLOADS = [
    '<script>alert("xss")</script>',
    '"><img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    "javascript:alert('xss')",
    "'; DROP TABLE flights; --",
];

const CANDIDATE_PATH = process.env.CANDIDATE_PATH || '/VienBui';

test.describe('Security', () => {
    test(
        '[SEC-001] Promo code field does not execute injected scripts',
        { tag: ['@security', '@regression'] },
        async ({ homePage, page }) => {
            test.fail(
                true,
                'Known defect: application reflects unsanitised HTML in promo code response (XSS vulnerability)',
            );

            await homePage.navigateToHomePage();
            const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
            const errors: string[] = [];

            for (const payload of XSS_PAYLOADS) {
                await test.step(`Testing XSS payload: ${payload.substring(0, 30)}...`, async () => {
                    let dialogFired = false;
                    const dialogHandler = async (dialog: import('@playwright/test').Dialog) => {
                        dialogFired = true;
                        await dialog.dismiss();
                    };
                    page.on('dialog', dialogHandler);

                    await homePage.searchFormComponent.searchFlightWithPromoCode(departing, returning, payload);

                    await page.waitForLoadState('domcontentloaded');

                    const bodyText = await page.locator('body').textContent();

                    const hasSearchResults = bodyText?.includes('Search Results');
                    const hasIllegalOperation = bodyText?.includes('The system performed an illegal operation');

                    if (dialogFired) {
                        errors.push(`[XSS] Payload "${payload}" triggered a JavaScript dialog`);
                    }

                    if (hasIllegalOperation) {
                        errors.push(`[Server Error] Payload "${payload}" caused unhandled server exception`);
                    }

                    if (hasSearchResults) {
                        const bodyHtml = await page.content();
                        if (
                            bodyHtml.includes('<script>alert') ||
                            bodyHtml.includes('onerror=alert') ||
                            bodyHtml.includes('<svg onload')
                        ) {
                            errors.push(`[XSS] Payload "${payload}" reflected unsanitised HTML in response`);
                        }
                    }

                    page.off('dialog', dialogHandler);
                    await page.goto(CANDIDATE_PATH);
                    await homePage.searchFormComponent.verifySearchFormIsVisible();
                });
            }

            expect(errors, `Security vulnerabilities found:\n${errors.join('\n')}`).toHaveLength(0);
        },
    );

    test('[SEC-002] Response includes security headers', { tag: ['@security', '@regression'] }, async ({ page }) => {
        const response = await page.goto('/VienBui');
        expect(response).not.toBeNull();
        const headers = response!.headers();

        await test.step('X-Content-Type-Options header is set to nosniff', async () => {
            expect(headers['x-content-type-options']).toBe('nosniff');
        });

        await test.step('X-Frame-Options header prevents clickjacking', async () => {
            expect(headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/i);
        });

        await test.step('Strict-Transport-Security header is present', async () => {
            test.fixme(true, 'Known defect: server does not return HSTS header');
            expect(headers['strict-transport-security']).toBeDefined();
        });
    });

    test(
        '[SEC-003] Accessing root without user path returns 401',
        { tag: ['@security', '@regression'] },
        async ({ page }) => {
            const response = await page.goto('https://marsair.recruiting.thoughtworks.net/');
            expect(response).not.toBeNull();

            await test.step('Response status is 401 Unauthorized', async () => {
                expect(response!.status()).toBe(401);
            });

            await test.step('"Not authorized" message is displayed', async () => {
                await expect(page.getByText('Not authorized')).toBeVisible();
            });
        },
    );
});
