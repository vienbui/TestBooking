import { test, expect } from '../../src/fixture/pageFixtures';
import AxeBuilder from '@axe-core/playwright';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../../src/data/selectRange';

test.describe('Accessibility', () => {

    test('[A11Y-001] Home page has no critical accessibility violations', async ({ page }) => {
        await page.goto('/VienBui');

        const results = await new AxeBuilder({ page }).analyze();
        const critical = results.violations.filter(v => v.impact === 'critical');
        const serious = results.violations.filter(v => v.impact === 'serious');

        await test.step(`Found ${critical.length} critical and ${serious.length} serious violations`, async () => {
            if (critical.length > 0) {
                const summary = critical.map(v =>
                    `[${v.id}] ${v.description} (${v.nodes.length} instance(s))`
                ).join('\n');
                console.log('Critical violations:\n' + summary);
            }
            expect(critical, 'No critical accessibility violations expected').toHaveLength(0);
        });
    });

    test('[A11Y-002] Search results page has no critical accessibility violations', async ({ homePage, page }) => {
        await homePage.navigateToHomePage();
        const { departing, returning } = PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE[0];
        await homePage.searchFormComponent.searchFlight(departing, returning);
        await homePage.searchResultComponent.verifySearchResultTitleIsVisible();

        const results = await new AxeBuilder({ page }).analyze();
        const critical = results.violations.filter(v => v.impact === 'critical');
        const serious = results.violations.filter(v => v.impact === 'serious');

        await test.step(`Found ${critical.length} critical and ${serious.length} serious violations`, async () => {
            if (critical.length > 0) {
                const summary = critical.map(v =>
                    `[${v.id}] ${v.description} (${v.nodes.length} instance(s))`
                ).join('\n');
                console.log('Critical violations:\n' + summary);
            }
            expect(critical, 'No critical accessibility violations expected').toHaveLength(0);
        });
    });
});
