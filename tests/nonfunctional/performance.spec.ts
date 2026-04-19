import { test, expect } from '../../src/fixture/pageFixtures';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../../src/data/selectRange';
import { CANDIDATE_PATH } from '../../src/data/env';

const PERF_THRESHOLDS = {
    ttfb: 1500,
    fcp: 2500,
    pageLoad: 5000,
    searchResponse: 3000,
};

test.describe('Performance', () => {
    test('[PERF-001] Home page loads within acceptable thresholds', { tag: '@performance' }, async ({ page }) => {
        await page.goto(CANDIDATE_PATH);

        const perfMetrics = await page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType('paint');
            return {
                ttfb: nav.responseStart - nav.requestStart,
                domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
                loadComplete: nav.loadEventEnd - nav.startTime,
                fcp: paint.find((e) => e.name === 'first-contentful-paint')?.startTime ?? null,
            };
        });

        await test.step(`TTFB: ${perfMetrics.ttfb.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.ttfb}ms)`, async () => {
            expect(perfMetrics.ttfb).toBeLessThan(PERF_THRESHOLDS.ttfb);
        });

        await test.step(`DOM Content Loaded: ${perfMetrics.domContentLoaded.toFixed(0)}ms`, async () => {
            expect(perfMetrics.domContentLoaded).toBeLessThan(PERF_THRESHOLDS.pageLoad);
        });

        await test.step(`Page Load Complete: ${perfMetrics.loadComplete.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.pageLoad}ms)`, async () => {
            expect(perfMetrics.loadComplete).toBeLessThan(PERF_THRESHOLDS.pageLoad);
        });

        if (perfMetrics.fcp !== null) {
            await test.step(`First Contentful Paint: ${perfMetrics.fcp.toFixed(0)}ms (threshold: ${PERF_THRESHOLDS.fcp}ms)`, async () => {
                expect(perfMetrics.fcp).toBeLessThan(PERF_THRESHOLDS.fcp);
            });
        }
    });

    test('[PERF-002] Search returns results within acceptable time', { tag: '@performance' }, async ({ homePage }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];

        await homePage.searchFormComponent.departingDropdown.selectOption(departing);
        await homePage.searchFormComponent.returningDropdown.selectOption(returning);

        const start = Date.now();
        await homePage.searchFormComponent.searchButton.click();
        await homePage.searchResultComponent.searchResultTitle.waitFor({ state: 'visible' });
        const elapsed = Date.now() - start;

        await test.step(`Search completed in ${elapsed}ms (threshold: ${PERF_THRESHOLDS.searchResponse}ms)`, async () => {
            expect(elapsed).toBeLessThan(PERF_THRESHOLDS.searchResponse);
        });
    });
});
