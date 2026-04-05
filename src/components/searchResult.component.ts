import {Locator, Page, expect} from '@playwright/test'

export class SearchResultComponent {
    readonly page: Page;
    readonly searchResultTitle: Locator;
    readonly seatsAvailableMessage: Locator;
    readonly callNowMessage: Locator;
    readonly noSeatsAvailableMessage: Locator;
    readonly invalidReturnDateMessage: Locator;
    readonly promotionalCodeMessage: Locator;
    readonly invalidPromotionalCodeMessage: Locator;
    readonly backButton: Locator;
    
    constructor(page:Page){
        this.page = page;
        this.searchResultTitle = page.getByRole('heading', { name: 'Search Results' });
        this.seatsAvailableMessage = page.getByText('Seats available');
        this.callNowMessage = page.getByText('Call now on 0800 MARSAIR to book!');
        this.noSeatsAvailableMessage = page.getByText('Sorry, there are no more seats available.');
        this.invalidReturnDateMessage = page.getByText('Unfortunately, this schedule is not possible. Please try again.');
        this.promotionalCodeMessage = page.locator('text=/Promotional code .+ used: .+% discount!/');
        this.invalidPromotionalCodeMessage = page.locator('text=/Sorry, code .+ is not valid/');
        this.backButton = page.getByRole('link', { name: 'Back' }); 

    }
    async verifySearchResultTitleIsVisible(){
        await expect(this.searchResultTitle).toBeVisible();
    }

    async verifySeatsAvailableMessageIsVisible(){
        await expect(this.seatsAvailableMessage).toBeVisible();
    }
    
    async verifyCallNowMessageIsVisible(){
        await expect(this.callNowMessage).toBeVisible();
    }

    async verifyNoSeatsAvailableMessageIsVisible(){
        await expect(this.noSeatsAvailableMessage).toBeVisible();
    }

    async verifyInvalidReturnDateMessageIsVisible(){
        await expect(this.invalidReturnDateMessage).toBeVisible();
    }
    
    async verifyPromotionalCodeMessageIsVisible(){
        await expect(this.promotionalCodeMessage).toBeVisible();
    }

    async verifyInvalidPromotionalCodeMessageIsVisible(){
        await expect(this.invalidPromotionalCodeMessage).toBeVisible();
    }
    
    async verifySeatsAvailableMessageIsNotVisible(){
        await expect(this.seatsAvailableMessage).not.toBeVisible();
    }

    async verifyCallNowMessageIsNotVisible(){
        await expect(this.callNowMessage).not.toBeVisible();
    }

    async verifyBackButtonIsVisible(){
        await expect(this.backButton).toBeVisible();
    }

    async clickBackButton(){
        await this.backButton.click();
    }
   
    async verifyPromoAppliedMessage(code: string, discount: number){
        await expect(this.page.getByText(`Promotional code ${code} used: ${discount}% discount!`)).toBeVisible();
    }

    async verifyPromoAppliedMessageIsNotVisible(){
        await expect(this.page.getByText(`Promotional code`)).not.toBeVisible();
    }
    async verifyPromoInvalidMessage(code: string){
        await expect(this.page.getByText(`Sorry, code ${code} is not valid`)).toBeVisible();
    }

    async verifyPromoInvalidMessageIsNotVisible(){
        await expect(this.page.getByText(`Sorry, code`)).not.toBeVisible();
    }
}