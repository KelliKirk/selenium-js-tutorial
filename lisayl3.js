const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

async function parabankRegister() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://parabank.parasoft.com/parabank/index.htm');
        await driver.findElement(By.linkText('Register')).click();
        await driver.sleep(2000);

        await driver.findElement(By.id('customer.firstName')).sendKeys('Selenium');
        await driver.findElement(By.id('customer.lastName')).sendKeys('User');
        await driver.findElement(By.id('customer.address.street')).sendKeys('123 Test Street');
        await driver.findElement(By.id('customer.address.city')).sendKeys('Testville');
        await driver.findElement(By.id('customer.address.state')).sendKeys('TestState');
        await driver.findElement(By.id('customer.address.zipCode')).sendKeys('12345');
        await driver.findElement(By.id('customer.phoneNumber')).sendKeys('123-456-7890');
        await driver.findElement(By.id('customer.ssn')).sendKeys('123-45-6789');

        const username = 'seluser' + Math.random().toString(36).substring(2, 8);
        console.log('Kasutajanimi:', username);
        await driver.findElement(By.id('customer.username')).sendKeys(username);
        await driver.sleep(500);
        await driver.findElement(By.id('customer.password')).sendKeys('TestPassword123');
        await driver.sleep(500);
        await driver.findElement(By.id('repeatedPassword')).sendKeys('TestPassword123');

        await driver.findElement(By.xpath('//input[@value="Register"]')).click();
        await driver.sleep(3000);
        console.log('Registreerimine õnnestus!');

        // Loo uus pangakonto enne Accounts Overview avamist
        await driver.findElement(By.linkText('Open New Account')).click();
        await driver.sleep(3000);
        console.log('Uus konto loodud!');

        // Nüüd mine Accounts Overview
        await driver.findElement(By.linkText('Accounts Overview')).click();
        await driver.sleep(3000);

        // Tee ekraanipilt
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('parabank_accounts.png', screenshot, 'base64');
        console.log('Ekraanipilt salvestatud: parabank_accounts.png');

    } finally {
        await driver.quit();
    }
}

parabankRegister();