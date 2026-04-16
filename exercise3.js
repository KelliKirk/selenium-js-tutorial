const { Builder, By, Key } = require('selenium-webdriver');

async function submitForm() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Ava leht
        await driver.get('https://www.w3schools.com/html/html_forms.asp');

        // Leia eesnimi väli ja kirjuta nimi
        let firstname = await driver.findElement(By.name('firstname'));
        await firstname.clear();
        await firstname.sendKeys('Sinu Eesnimi');

        // Leia perekonnanimi väli ja kirjuta nimi
        let lastname = await driver.findElement(By.name('lastname'));
        await lastname.clear();
        await lastname.sendKeys('Sinu Perekonnanimi');

        // Esita vorm Enter-klahviga
        await lastname.sendKeys(Key.ENTER);

        console.log('Vorm on esitatud!');

    } finally {
        await driver.quit();
    }
}

submitForm();