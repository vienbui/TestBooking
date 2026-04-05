import {Locator, Page} from '@playwright/test'

export class HomePageLocators {
    readonly marsAirHeaderLogo: Locator;
    readonly bookTicketNowMessage: Locator;
    readonly welcomeMessage: Locator;
    readonly departingDropdown: Locator;
    readonly returningDropdown: Locator;
    readonly searchButton: Locator;



    constructor(page:Page){
        this.marsAirHeaderLogo = page.getByRole('link', { name: 'MarsAir' });
        this.bookTicketNowMessage = page.getByText('Book a ticket to the red planet now!');
        this.welcomeMessage = page.getByText('Welcome to MarsAir!');
        this.departingDropdown = page.getByRole('combobox', { name: 'Departing' });
        this.returningDropdown = page.getByRole('combobox', { name: 'Returning' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }
}

