import { Page } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async addItemToCart(item_number: number) {
        await this.page.getByRole('button', {name: "Add to cart"}).nth(item_number).click();
    }

    async addProductByNameToCart(productName: string) {
        const productLocator = this.page.locator('.inventory_item').filter({ has: this.page.getByText(productName) });
        await productLocator.getByRole('button', { name: "Add to cart" }).click();
    }

    async deleteItemFromCart(item_number: number) {
        await this.page.getByRole('button', {name: "Remove"}).nth(item_number).click();
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').click();
    }

    async cleanCart(){
        while (await this.page.getByRole('button', { name: "Remove" }).count() > 0) {
            await this.page.getByRole('button', { name: "Remove" }).first().click();
        }
    }

    getProductPriceByName(productName: string) {
        const productLocator = this.page.locator('.inventory_item').filter({ has: this.page.getByText(productName) });
        return productLocator.locator('.inventory_item_price').textContent();
    }
}