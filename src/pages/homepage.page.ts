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
        await expect(this.locators.headerLogo).toBeVisible();
    }
}

