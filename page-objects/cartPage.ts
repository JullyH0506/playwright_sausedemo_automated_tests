import { Page } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async getProductName(product_number: number) {
        return await this.page.locator('.inventory_item_name').nth(product_number).textContent();
    }

    async getProductPrice(product_number: number) {
        return await this.page.locator('.inventory_item_price').nth(product_number).textContent();
    }

    async goToCheckout() {
        await this.page.getByRole('button', {name: "Checkout"}).click();
    }
}