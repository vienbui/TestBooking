import {Locator, Page} from '@playwright/test'

export class HomePageLocators {
    readonly marsAirHeaderLogo: Locator;
    readonly bookTicketNowMessage: Locator;
    readonly welcomeMessage: Locator;
    readonly departingDropdown: Locator;
    readonly returningDropdown: Locator;
    readonly searchButton: Locator;
    readonly promoCodeInput: Locator;
    readonly reportIssueLink: Locator;
    readonly problemDefinitionLink: Locator;
    readonly privacyPolicyLink: Locator;



    constructor(page:Page){
        this.marsAirHeaderLogo = page.getByRole('link', { name: 'MarsAir' });
        this.bookTicketNowMessage = page.getByText('Book a ticket to the red planet now!');
        this.welcomeMessage = page.getByText('Welcome to MarsAir!');
        this.departingDropdown = page.getByRole('combobox', { name: 'Departing' });
        this.returningDropdown = page.getByRole('combobox', { name: 'Returning' });
        this.promoCodeInput = page.locator('input[name="promotional_code"]');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.reportIssueLink = page.getByRole('link', { name: 'Report an issue' }); 
        this.problemDefinitionLink = page.getByRole('link', { name: 'Problem definition' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    }
}

