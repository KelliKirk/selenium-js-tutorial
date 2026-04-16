const { Builder } = require('selenium-webdriver');

async function printTitle() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigeeri Wikipedia lehele
        await driver.get('https://en.wikipedia.org/wiki/Selenium_%28software%29');
        
        // Võta pealkiri ja prindi konsooli
        let title = await driver.getTitle();
        console.log(title);
        
    } finally {
        // Sule brauser
        await driver.quit();
    }
}

printTitle();