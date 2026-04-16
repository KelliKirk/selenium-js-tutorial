const { Builder, By, until } = require('selenium-webdriver');

async function saucedemoLogin() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Ava leht
        await driver.get('https://www.saucedemo.com/');

        // Sisesta kasutajanimi
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');

        // Sisesta parool
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');

        // Vajuta Login nuppu
        await driver.findElement(By.id('login-button')).click();

        // Oota kuni toodete leht laadib
        await driver.wait(until.elementLocated(By.css('.inventory_item_name')), 10000);

        // Leia kõik tooted
        let products = await driver.findElements(By.css('.inventory_item_name'));

        // Prindi kõik toodete nimed
        console.log('Toodete nimekiri:');
        for (let i = 0; i < products.length; i++) {
            let name = await products[i].getText();
            console.log(`${i + 1}. ${name}`);
        }

    } finally {
        await driver.quit();
    }
}

saucedemoLogin();