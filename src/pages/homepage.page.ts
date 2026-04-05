import { expect, Page } from '@playwright/test';
import { HomePageLocators } from '../locators/homepage.locator';

export class HomePage {
    readonly page: Page;
    readonly locators: HomePageLocators;

    constructor(page: Page){
        this.page = page;
        this.locators = new HomePageLocators(page);
    }

    async navigateToHomePage(){
        await this.page.goto('/VienBui');
    }

    async verifyHomePageIsLoaded(){
        await expect(this.page).toHaveURL('/VienBui');
    }

    async verifyHeaderLogoIsVisible(){
        await expect(this.locators.marsAirHeaderLogo).toBeVisible();
    }

    async verifySelectDepartingOptionIsVisible(){
        await expect(this.locators.departingDropdown).toBeVisible();
    }

    async verifySelectReturningOptionIsVisible(){
        await expect(this.locators.returningDropdown).toBeVisible();
    }

    async verifySearchButtonIsVisible(){
        await expect(this.locators.searchButton).toBeVisible();
    }

    async verifyPromoCodeInputIsVisible(){
        await expect(this.locators.promoCodeInput).toBeVisible();
    }

    async verifyReportIssueLinkIsVisible(){
        await expect(this.locators.reportIssueLink).toBeVisible();
    }

    async verifyProblemDefinitionLinkIsVisible(){
        await expect(this.locators.problemDefinitionLink).toBeVisible();
    }

    async verifyPrivacyPolicyLinkIsVisible(){
        await expect(this.locators.privacyPolicyLink).toBeVisible();
    }   

    async verifyBookTicketNowMessageIsVisible(){
        await expect(this.locators.bookTicketNowMessage).toBeVisible();
    }

    async verifyWelcomeMessageIsVisible(){
        await expect(this.locators.welcomeMessage).toBeVisible();
    }

    async verifyAllDepartingOptionsAreVisible(){
        await expect(this.locators.departingDropdown.locator('option')).toHaveText([
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
        await expect(this.locators.returningDropdown.locator('option')).toHaveText([
            'Select...',
            'July',
            'December',
            'July (next year)',
            'December (next year)',
            'July (two years from now)',
            'December (two years from now)',
        ]);
    }   

    
    
}

