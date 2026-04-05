import { expect, Page } from '@playwright/test';
import { HomePageComponent } from '../components/homepage.components';
import { SearchFormComponent } from '../components/searchForm.component';
import { SearchResultComponent } from '../components/searchResult.component';

export class HomePage {
    readonly page: Page;
    readonly homePageComponent: HomePageComponent;
    readonly searchFormComponent: SearchFormComponent;
    readonly searchResultComponent: SearchResultComponent;

    constructor(page: Page){
        this.page = page;
        this.homePageComponent = new HomePageComponent(page);
        this.searchFormComponent = new SearchFormComponent(page);
        this.searchResultComponent = new SearchResultComponent(page);

    }

    async navigateToHomePage(){
        await this.page.goto('/VienBui');
    }

    async verifyHomePageIsLoaded(){
        await expect(this.page).toHaveURL('/VienBui');
    }

    async verifyHeaderLogoIsVisible(){
        await expect(this.homePageComponent.marsAirHeaderLogo).toBeVisible();
    }

    async verifyReportIssueLinkIsVisible(){
        await expect(this.homePageComponent.reportIssueLink).toBeVisible();
    }

    async verifyProblemDefinitionLinkIsVisible(){
        await expect(this.homePageComponent.problemDefinitionLink).toBeVisible();
    }

    async verifyPrivacyPolicyLinkIsVisible(){
        await expect(this.homePageComponent.privacyPolicyLink).toBeVisible();
    }  
    
}
    