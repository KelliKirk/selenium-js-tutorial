const { Builder, By, until } = require('selenium-webdriver');

async function addRemoveElements() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Ava leht
        await driver.get('https://practice.expandtesting.com/add-remove-elements');

        // Leia "Add Element" nupp
        let addButton = await driver.findElement(By.xpath('//button[text()="Add Element"]'));

        // Vajuta nuppu 5 korda
        console.log('Lisan 5 elementi...');
        for (let i = 0; i < 5; i++) {
            await addButton.click();
            await driver.sleep(500);
            console.log(`Element ${i + 1} lisatud`);
        }

        // Oota veidi et elemendid ilmuksid
        await driver.sleep(1000);

        // Leia kõik "Delete" nupud
        let deleteButtons = await driver.findElements(By.xpath('//button[text()="Delete"]'));
        console.log(`\nLeitud ${deleteButtons.length} Delete nuppu`);

        // Kustuta kõik ühe kaupa
        console.log('Kustan kõik elemendid...');
        for (let i = 0; i < 5; i++) {
            // Otsime iga kord uuesti, sest DOM muutub
            let buttons = await driver.findElements(By.xpath('//button[text()="Delete"]'));
            await buttons[0].click();
            await driver.sleep(500);
            console.log(`Element ${i + 1} kustutatud`);
        }

        console.log('\nKõik elemendid kustutatud!');

    } finally {
        await driver.quit();
    }
}

addRemoveElements();