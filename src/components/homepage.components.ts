import {Locator, Page} from '@playwright/test'

export class HomePageComponent {
    readonly marsAirHeaderLogo: Locator;
    readonly reportIssueLink: Locator;
    readonly problemDefinitionLink: Locator;
    readonly privacyPolicyLink: Locator;

    constructor(page:Page){
        this.marsAirHeaderLogo = page.getByRole('link', { name: 'MarsAir' });
        this.reportIssueLink = page.getByRole('link', { name: 'Report an issue' }); 
        this.problemDefinitionLink = page.getByRole('link', { name: 'Problem definition' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    }
}

