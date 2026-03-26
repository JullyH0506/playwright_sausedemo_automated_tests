import { Page } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async loginWithCredentials(username: string, password: string) {
        await this.page.getByRole('textbox', {name: "Username"}).fill(username);;
        await this.page.getByRole('textbox', {name: "Password"}).fill(password);
        await this.page.getByRole('button', {name: "Login"}).click();
    }
}