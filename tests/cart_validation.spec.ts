import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test('User sees correct product in cart', async ({ page }, testInfo) => {
    const user = testInfo.project.metadata.user;
    const password = process.env.PASSWORD!;
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.onLoginPage().loginWithCredentials(user.username, password);

    const firstProductName = await pm.onCartPage().getProductName(0);
    const firstProductPrice = await pm.onCartPage().getProductPrice(0);

    await pm.onHomePage().addItemToCart(0);
    await pm.onHomePage().goToCart();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1'); // item quantity is displayed correctly

    await expect(page.locator('.inventory_item_name').first()).toHaveText(firstProductName!); // correct product is in the cart
    await expect(page.locator('.inventory_item_price').first()).toHaveText(firstProductPrice!); // correct price is in the cart
});