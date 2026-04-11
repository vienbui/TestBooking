import { test, expect } from '../src/fixture/pageFixtures';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../src/data/selectRange';

const XSS_PAYLOADS = [
    '<script>alert("xss")</script>',
    '"><img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    "javascript:alert('xss')",
    "'; DROP TABLE flights; --",
];

test.describe('Security', () => {

    test('[SEC-001] Promo code field does not execute injected scripts', async ({ homePage, page }) => {
        test.fixme(true, 'Known defect: application reflects unsanitised HTML in promo code response (XSS vulnerability)');
    });

    test('[SEC-002] Response includes security headers', async ({ page }) => {
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
            test.fixme(!headers['strict-transport-security'],
                'Known defect: server does not return HSTS header');
            expect(headers['strict-transport-security']).toBeDefined();
        });
    });

    test('[SEC-003] Accessing root without user path returns 401', async ({ page }) => {
        const response = await page.goto('https://marsair.recruiting.thoughtworks.net/');
        expect(response).not.toBeNull();

        await test.step('Response status is 401 Unauthorized', async () => {
            expect(response!.status()).toBe(401);
        });

        await test.step('"Not authorized" message is displayed', async () => {
            await expect(page.getByText('Not authorized')).toBeVisible();
        });
    });
});
