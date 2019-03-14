const puppeteer = require('puppeteer');
const [username, pw] = [
  process.env.BLUMHOUSE_TWITTER_NAME,
  process.env.BLUMHOUSE_TWITTER_PW
];
const { prompt } = require('enquirer');
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1024, height: 768 });
  await page.goto('https://twitter.com/login');
  await page.type('.js-username-field', username);
  await page.type('.js-password-field', pw);
  const inputElement = await page.$('button[type=submit]');
  await inputElement.click();
  const res = await prompt({
    type: 'input',
    name: 'otp',
    message: 'OTP?'
  });
  await page.type('#challenge_response', res.otp);
  const otpSubmit = await page.$('input[type=submit]');
  await otpSubmit.click();

  await page.waitForNavigation();
  const query = `from:${username} since:2006-01-01 until:2012-01-01`;
  await page.type('.search-input', query);
  await page.$('.nav-search').then(e => e.click());
  await page.waitForNavigation();
  await page.$('a[data-nav="search_filter_tweets"]').then(i => i.click());
  await page.waitForNavigation();
  const items = await page.$$('[data-item-id]');
  const props = await items[0].jsonValue();
  const p = await items[0].getProperty('dataset');
  console.log(props);
  console.log(p);
  await prompt({
    type: 'input',
    name: 'otp',
    message: 'OTP?'
  });
  await browser.close();
})();
