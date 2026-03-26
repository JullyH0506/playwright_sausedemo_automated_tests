import { Page } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async checkoutWithValidData(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByRole('textbox', {name: "First Name"}).fill(firstName);
        await this.page.getByRole('textbox', {name: "Last Name"}).fill(lastName);
        await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
        await this.page.getByRole('button', {name: "Continue"}).click();
    }

    async finishCheckout() {
        await this.page.getByRole('button', {name: "Finish"}).click()
    }
}