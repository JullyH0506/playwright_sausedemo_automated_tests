
import { Page } from '@playwright/test'
import { LoginPage } from './loginPage'
import { NavigationPage } from './navigationPage'
import { HomePage } from './homePage'
import { CartPage } from './cartPage'
import { CheckoutPage } from './checkourPage'


export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly loginPage: LoginPage
    private readonly homePage: HomePage
    private readonly cartPage: CartPage
    private readonly checkoutPage: CheckoutPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.loginPage = new LoginPage(this.page)
        this.homePage = new HomePage(this.page)
        this.cartPage = new CartPage(this.page)
        this.checkoutPage = new CheckoutPage(this.page)

    }

    navigateTo() {
        return this.navigationPage
    }

    onLoginPage() {
        return this.loginPage
    }

    onHomePage() {
        return this.homePage
    }

    onCartPage() {
        return this.cartPage
    }

    onCheckoutPage() {
        return this.checkoutPage
    }
}