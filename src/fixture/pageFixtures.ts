import { test as base } from '@playwright/test';
import { attachment } from 'allure-js-commons';
import { HomePage } from '../pages/homepage.page';

type PageFixtures = {
    homePage: HomePage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use, testInfo) => {
        const browserErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                browserErrors.push(`[${msg.type()}] ${msg.text()}`);
            }
        });

        page.on('requestfailed', (request) => {
            browserErrors.push(`[REQUEST FAILED] ${request.url()} — ${request.failure()?.errorText}`);
        });

        await use(new HomePage(page));

        if (browserErrors.length > 0) {
            await attachment('Browser Console Errors', browserErrors.join('\n'), 'text/plain');
        }

        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshot = await page.screenshot({ fullPage: true });
            await attachment('Screenshot on Failure', screenshot, 'image/png');

            const pageUrl = page.url();
            const pageTitle = await page.title();
            await attachment(
                'Page Context on Failure',
                `URL: ${pageUrl}\nTitle: ${pageTitle}\nBrowser: ${testInfo.project.name}`,
                'text/plain',
            );
        }
    },
});

export { expect } from '@playwright/test';
