const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://twitter.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
