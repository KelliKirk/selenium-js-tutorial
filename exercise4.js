const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Ava DuckDuckGo
        await driver.get('https://www.duckduckgo.com');

        // Sisesta otsing ja vajuta Enter
        await driver.findElement(By.name('q')).sendKeys('Selenium WebDriver', Key.ENTER);

        // Oota kuni tulemused laadivad
        await driver.wait(until.elementLocated(By.css('h2 a')), 10000);

        // Leia esimesed 3 tulemust
        let results = await driver.findElements(By.css('h2 a'));

        console.log("Otsingutulemused:");
        for (let i = 0; i < 3; i++) {
            let text = await results[i].getText();
            console.log(`${i + 1}. ${text}`);
        }

        // Tee ekraanipilt ja salvesta
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('screenshot.png', screenshot, 'base64');
        console.log('Ekraanipilt salvestatud: screenshot.png');

    } finally {
        await driver.quit();
    }
}

basicSearch();