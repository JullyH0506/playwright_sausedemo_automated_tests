import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Adding/Removing items to/from card works as expected', () => {

    let pm: PageManager;

    test.beforeEach(async ({ page }, testInfo) => {
        const user = testInfo.project.metadata.user;
        const password = process.env.PASSWORD!;

        await page.goto('/');
        pm = new PageManager(page);

        await pm.onLoginPage().loginWithCredentials(user.username, password);
    });

    test('User can add product to cart - cart badge is updated', async ({ page }) => {
        await pm.onHomePage().addItemToCart(0);

        // Assertion: cart badge updated
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        await pm.onHomePage().addItemToCart(1);
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    });

    test('User can delete product from cart - cart badge is updated', async ({ page }) => {
        await pm.onHomePage().addItemToCart(0);
        await pm.onHomePage().addItemToCart(1);

        await pm.onHomePage().deleteItemFromCart(0);

        // Assertion: cart badge updated
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await pm.onHomePage().deleteItemFromCart(0);
        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);//
    });
});