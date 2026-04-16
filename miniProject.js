const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

async function demoBlazeProducts() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Ava DemoBlaze leht
        await driver.get('https://www.demoblaze.com');

        // Klõpsa kategoorial "Laptops"
        let laptopsLink = await driver.findElement(By.linkText('Laptops'));
        await laptopsLink.click();

        // Oota kuni tooted laevad
        await driver.wait(until.elementLocated(By.css('.card-title a')), 10000);
        await driver.sleep(2000); // lisa ooteaeg, et kõik tooted jõuaks laadida

        // Leia kõik tooted
        let products = await driver.findElements(By.css('.card-title a'));

        // Prindi esimesed 5 toote nimed
        console.log('Esimesed 5 toodet:');
        for (let i = 0; i < 5 && i < products.length; i++) {
            let name = await products[i].getText();
            console.log(`${i + 1}. ${name}`);
        }

        // Tee ekraanipilt
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('demoblaze_laptops.png', screenshot, 'base64');
        console.log('Ekraanipilt salvestatud: demoblaze_laptops.png');

    } finally {
        await driver.quit();
    }
}

demoBlazeProducts();