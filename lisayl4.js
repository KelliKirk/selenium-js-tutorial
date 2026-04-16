const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createDriver() {
    const options = new chrome.Options();

    options.setChromeBinaryPath('/usr/bin/chromium-browser');

    options.addArguments(
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--user-data-dir=/tmp/selenium-profile"
    );

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

// Abifunktsioonid
async function login(driver, username, password) {
    await driver.get('https://www.saucedemo.com/');

    await driver.wait(until.elementLocated(By.id('user-name')), 10000);

    await driver.findElement(By.id('user-name')).clear();
    await driver.findElement(By.id('password')).clear();

    await driver.findElement(By.id('user-name')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.id('login-button')).click();
}

async function loginSuccess(driver) {
    await login(driver, 'standard_user', 'secret_sauce');
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);
}


// Toodete nimekiri
async function testProductList(driver) {
    console.log('\nTEST 1');

    await loginSuccess(driver);

    let products = await driver.findElements(By.css('.inventory_item'));

    if (products.length !== 6)
        throw new Error('Vale toote arv');

    for (let p of products) {
        await p.findElement(By.css('.inventory_item_name')).getText();
        await p.findElement(By.css('.inventory_item_price')).getText();
        await p.findElement(By.css('button')).getText();
    }
}


// Detailid
async function testProductDetail(driver) {
    console.log('\nTEST 2');

    await loginSuccess(driver);

    let first = await driver.findElement(By.css('.inventory_item_name'));
    let name = await first.getText();
    await first.click();

    let detailName = await driver.findElement(By.css('.inventory_details_name')).getText();
    let price = await driver.findElement(By.css('.inventory_details_price')).getText();

    if (name !== detailName)
        throw new Error('Nimi ei klapi');

    if (!price.includes('$'))
        throw new Error('Hind puudu');
}


// Sortimine
async function testSorting(driver) {
    console.log('\nTEST 3');

    await loginSuccess(driver);

    await driver.findElement(By.css('.product_sort_container'))
        .sendKeys('Price (low to high)');

    let prices = await driver.findElements(By.css('.inventory_item_price'));

    let values = [];
    for (let p of prices) {
        values.push(parseFloat((await p.getText()).replace('$', '')));
    }

    let sorted = [...values].sort((a,b)=>a-b);

    if (JSON.stringify(values) !== JSON.stringify(sorted))
        throw new Error('Sort ei tööta');
}


// Ostukorv
async function testCart(driver) {
    console.log('\nTEST 4');

    await loginSuccess(driver);

    let buttons = await driver.findElements(By.css('button.btn_primary'));
    await buttons[0].click();
    await buttons[1].click();

    let badge = await driver.findElement(By.css('.shopping_cart_badge')).getText();

    if (badge !== '2')
        throw new Error('Cart vale');

    await driver.findElement(By.css('.shopping_cart_link')).click();

    let items = await driver.findElements(By.css('.cart_item'));

    if (items.length !== 2)
        throw new Error('Cart detail vale');

    await driver.findElement(By.css('button.btn_secondary')).click();

    let after = await driver.findElements(By.css('.cart_item'));

    if (after.length !== 1)
        throw new Error('Eemaldamine ei tööta');
}


// Checkout
async function testCheckout(driver) {
    console.log('\nTEST 5');

    await loginSuccess(driver);

    await driver.findElement(By.css('button.btn_primary')).click();
    await driver.findElement(By.css('.shopping_cart_link')).click();
    await driver.findElement(By.id('checkout')).click();

    await driver.findElement(By.id('first-name')).sendKeys('Test');
    await driver.findElement(By.id('last-name')).sendKeys('User');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');

    await driver.findElement(By.id('continue')).click();
    await driver.findElement(By.id('finish')).click();

    let msg = await driver.findElement(By.css('.complete-header')).getText();

    if (!msg.includes('THANK YOU'))
        throw new Error('Checkout fail');
}


// Väljalogimine
async function testLogout(driver) {
    console.log('\nTEST 6');

    await loginSuccess(driver);

    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.findElement(By.id('logout_sidebar_link')).click();

    await driver.wait(until.elementLocated(By.id('login-button')), 10000);
}


// Negatiivsed testid
async function testNegative(driver) {
    console.log('\nTEST 8');

    await login(driver, 'standard_user', 'wrong');

    let err = await driver.findElement(By.css('[data-test="error"]')).getText();

    if (!err)
        throw new Error('Error ei näita');
}


// Mitu kasutajat
async function testUsers(driver) {
    console.log('\nTEST 9');

    const users = ['standard_user', 'problem_user', 'locked_out_user'];

    for (let u of users) {
        await login(driver, u, 'secret_sauce');

        try {
            await driver.wait(until.elementLocated(By.css('.inventory_item')), 5000);
            console.log(u + ' OK');
        } catch {
            console.log(u + ' FAIL');
        }
    }
}


// Hübriidtestid
async function testHybrid(driver) {
    console.log('\nTEST 10');

    await loginSuccess(driver);

    let buttons = await driver.findElements(By.css('button.btn_primary'));
    await buttons[0].click();
    await buttons[1].click();

    await driver.findElement(By.css('.shopping_cart_link')).click();
    await driver.findElement(By.id('checkout')).click();

    await driver.findElement(By.id('first-name')).sendKeys('Test');
    await driver.findElement(By.id('last-name')).sendKeys('User');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');

    await driver.findElement(By.id('continue')).click();
    await driver.findElement(By.id('finish')).click();

    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.findElement(By.id('logout_sidebar_link')).click();

    await loginSuccess(driver);
}


// Käivita kõik
async function runAll() {
    const tests = [
        testProductList,
        testProductDetail,
        testSorting,
        testCart,
        testCheckout,
        testLogout,
        testNegative,
        testUsers,
        testHybrid
    ];

    for (let test of tests) {
        let driver = await createDriver();

        try {
            await test(driver);
            console.log('PASS');
        } catch (e) {
            console.log('FAIL:', e.message);
        } finally {
            await driver.quit();
        }
    }

    console.log('\nDONE');
}

runAll();