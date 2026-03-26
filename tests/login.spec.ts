import {expect, test, chromium} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager';

test("Login with valid credentials", async ({page}, testInfo) => {
    const user = testInfo.project.metadata.user;
    const password = process.env.PASSWORD!;
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.onLoginPage().loginWithCredentials(user.username, password);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
})