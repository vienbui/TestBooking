import {Locator, Page} from '@playwright/test'

export class SearchResultLocators {
    readonly searchResultTitle: Locator;
    readonly seatsAvailableMessage: Locator;
    readonly callNowMessage: Locator;
    readonly noSeatsAvailableMessage: Locator;
    
    readonly promotionalCodeMessage: Locator;
    readonly invalidPromotionalCodeMessage: Locator;
    readonly backButton: Locator;
    
    readonly marsAirLogo: Locator;
    readonly reportIssueLink: Locator;
    readonly problemDefinitionLink: Locator;
    readonly privacyPolicyLink: Locator;

    constructor(page:Page){
        
        this.searchResultTitle = page.getByRole('heading', { name: 'Search Results' });
        this.seatsAvailableMessage = page.getByText('Seats available');
        this.noSeatsAvailableMessage = page.getByText('Sorry, there are no more seats available.');
        this.promotionalCodeMessage = page.getByText('Promotional code [code] used: [discount]% discount!');
        this.invalidPromotionalCodeMessage = page.getByText('Sorry, code [invalid promo code] is not valid');
        this.backButton = page.getByRole('link', { name: 'Back' });
        
        this.marsAirLogo = page.getByRole('link', { name: 'MarsAir' });
        this.reportIssueLink = page.getByRole('link', { name: 'Report an issue' });
        this.problemDefinitionLink = page.getByRole('link', { name: 'Problem definition' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    

}}