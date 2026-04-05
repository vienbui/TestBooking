import {Locator, Page, expect} from '@playwright/test'

export class SearchFormComponent {
    readonly welcomeMessage: Locator;
    readonly bookTicketNowMessage: Locator;
    readonly departingDropdown: Locator;
    readonly returningDropdown: Locator;
    readonly promoCodeInput: Locator;
    readonly searchButton: Locator;

    constructor(page:Page){
        this.welcomeMessage = page.getByText('Welcome to MarsAir!');
        this.bookTicketNowMessage = page.getByText('Book a ticket to the red planet now!');
        this.departingDropdown = page.getByRole('combobox', { name: 'Departing' });
        this.returningDropdown = page.getByRole('combobox', { name: 'Returning' });
        this.promoCodeInput = page.locator('input[name="promotional_code"]');
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async verifyWelcomeMessageIsVisible(){
        await expect(this.welcomeMessage).toBeVisible();
    }

    async verifyBookTicketNowMessageIsVisible(){
        await expect(this.bookTicketNowMessage).toBeVisible();
    }
    async verifySelectDepartingOptionIsVisible(){
        await expect(this.departingDropdown).toBeVisible();
    }

    async verifySelectReturningOptionIsVisible(){
        await expect(this.returningDropdown).toBeVisible();
    }

    async verifySearchButtonIsVisible(){
        await expect(this.searchButton).toBeVisible();
    }

    async verifyPromoCodeInputIsVisible(){
        await expect(this.promoCodeInput).toBeVisible();
    }

    async verifyAllDepartingOptionsAreVisible(){
        await expect(this.departingDropdown.locator('option')).toHaveText([
            'Select...',
            'July',
            'December',
            'July (next year)',
            'December (next year)',
            'July (two years from now)',
            'December (two years from now)',
        ]);
    }

    async verifyAllReturningOptionsAreVisible(){
        await expect(this.returningDropdown.locator('option')).toHaveText([
            'Select...',
            'July',
            'December',
            'July (next year)',
            'December (next year)',
            'July (two years from now)',
            'December (two years from now)',
        ]);
    }

    async searchFlight(departing: string, returning: string){
        await this.departingDropdown.selectOption(departing);
        await this.returningDropdown.selectOption(returning);
        await this.searchButton.click();
    }
};

