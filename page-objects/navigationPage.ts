import { Locator, Page } from '@playwright/test';

export class NavigationPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
     }

     async allItems(){
        await this.page.locator('#react-burger-menu-btn').click();
        await this.page.getByRole('link', { name: 'All Items' }).click();

     }
}