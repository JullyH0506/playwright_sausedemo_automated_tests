import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { checkoutData } from '../utils/testData/checkoutData';

test('Complete end-to-end flow - user can add item to cart and complete checkout, all data is correct', async ({ page }, testInfo) => {
    const user = testInfo.project.metadata.user;
    const password = process.env.PASSWORD!;
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.onLoginPage().loginWithCredentials(user.username, password);

    await pm.onHomePage().cleanCart(); // make sure cart is empty before test
    
    const productNames: string[] = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
    const productPrices: string[] = [];

    for (const product of productNames) {

        await pm.onHomePage().addProductByNameToCart(product);

        const price = await pm.onHomePage().getProductPriceByName(product);

        productPrices.push(price?.trim() ?? "0");
    }
    
    await pm.onHomePage().goToCart();

    //Check that correct products are in the cart
    for (let i = 0; i < productNames.length; i++) {
        const itemName = await page.locator('.inventory_item_name').nth(i).textContent();
        const itemPrice = await page.locator('.inventory_item_price').nth(i).textContent();
        expect(productNames).toContain(itemName);
        expect(productPrices).toContain(itemPrice);
    }

    await pm.onCartPage().goToCheckout();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    
    await pm.onCheckoutPage().checkoutWithValidData(checkoutData.user1.firstName, checkoutData.user1.lastName, checkoutData.user1.postalCode);

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    //Checking thet correct products are displayed on the checkout overview page
    for (let i = 0; i < productNames.length; i++) {
        const itemName2 = await page.locator('.inventory_item_name').nth(i).textContent();
        const itemPrice2 = await page.locator('.inventory_item_price').nth(i).textContent();
        expect(productNames).toContain(itemName2);
        expect(productPrices).toContain(itemPrice2);
    }

    //Checking that total price is calculated correctly (before tax and added tax)
    const productPricesTrimmed = productPrices.map(p => Number(p.replace('$', '').trim()));
    const expectedTotalBeforeTax = productPricesTrimmed.reduce((sum, price) => sum + price, 0);

    // Get subtotal from page
    const totalPriceTextBeforeTaxLocator = await page.locator('[data-test="subtotal-label"]').textContent();
    const totalPriceTextBeforeTax = totalPriceTextBeforeTaxLocator?.replace('Item total: $', '').trim() ?? '0';

    // Assert subtotal
    expect(Number(totalPriceTextBeforeTax)).toBeCloseTo(expectedTotalBeforeTax, 2);

    // Get tax from page
    const taxLocator = page.locator('.summary_tax_label');
    await taxLocator.scrollIntoViewIfNeeded(); // make sure it's visible

    const taxText = await taxLocator.textContent(); // e.g. "Tax: $2.40"

    // Remove everything except digits and dot
    const taxNumber = Number(taxText?.replace(/[^0-9.]/g, '').trim() ?? '0');

    // Calculate expected total
    const expectedTotal = expectedTotalBeforeTax + taxNumber;

    // Get total from page
    const totalPriceTextAfterTaxLocator = page.locator('.summary_total_label')
    await totalPriceTextAfterTaxLocator.scrollIntoViewIfNeeded(); // scroll first
    const totalPriceTextAfterTaxText = await totalPriceTextAfterTaxLocator.textContent();
    const totalPriceTextAfterTax = Number(totalPriceTextAfterTaxText?.replace('Total: $', '').trim() ?? '0');

    // Assert total
    expect(totalPriceTextAfterTax).toBeCloseTo(expectedTotal, 2);

    await pm.onCheckoutPage().finishCheckout();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});