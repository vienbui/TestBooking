import { expect, Page } from "@playwright/test";
import { HomePageLocators } from '../locators/homepage.locator';
import { PERIOD_MORE_THAN_2_YEAR_SELECT_RANGE } from '../data/selectRange';

export class SearchPage {
    readonly page: Page;
    readonly locators: HomePageLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new HomePageLocators(page);
    }

    async searchFlight(departing: string, returning: string){
        await this.locators.departingDropdown.selectOption(departing);
        await this.locators.returningDropdown.selectOption(returning);
        await this.locators.searchButton.click();
    }
}