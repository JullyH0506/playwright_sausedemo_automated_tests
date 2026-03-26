import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { checkoutData } from '../utils/testData/checkoutData';

test('User can complete checkout', async ({ page }, testInfo) => {
    const user = testInfo.project.metadata.user;
    const password = process.env.PASSWORD!;
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.onLoginPage().loginWithCredentials(user.username, password);
    
    await pm.onHomePage().addItemToCart(0);
    await pm.onHomePage().goToCart();

    await pm.onCartPage().goToCheckout();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    
    await pm.onCheckoutPage().checkoutWithValidData(checkoutData.user1.firstName, checkoutData.user1.lastName, checkoutData.user1.postalCode);

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    await pm.onCheckoutPage().finishCheckout();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});