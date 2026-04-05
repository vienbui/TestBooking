import { expect, Page } from "@playwright/test";
import { SearchResultLocators } from "../locators/searchResult.locator";

export class SearchResultPage {
    readonly page: Page;
    readonly locators: SearchResultLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new SearchResultLocators(page);
    }

    async verifySearchResultTitleIsVisible(){
        await expect(this.locators.searchResultTitle).toBeVisible();
    }

    async verifySeatsAvailableMessageIsVisible(){
        await expect(this.locators.seatsAvailableMessage).toBeVisible();
    }
    
    async verifyCallNowMessageIsVisible(){
        await expect(this.locators.callNowMessage).toBeVisible();
    }

    async verifyNoSeatsAvailableMessageIsVisible(){
        await expect(this.locators.noSeatsAvailableMessage).toBeVisible();
    }
    
    
    async verifyPromotionalCodeMessageIsVisible(){
        await expect(this.locators.promotionalCodeMessage).toBeVisible();
    }

    async verifyInvalidPromotionalCodeMessageIsVisible(){
        await expect(this.locators.invalidPromotionalCodeMessage).toBeVisible();
    }
    
    
    async verifyBackButtonIsVisible(){
        await expect(this.locators.backButton).toBeVisible();
    }

    async verifyMarsAirLogoIsVisible(){
        await expect(this.locators.marsAirLogo).toBeVisible();
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
    
  
    
    
}