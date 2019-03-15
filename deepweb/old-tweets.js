const puppeteer = require('puppeteer');
const [username, pw] = [
  process.env.BLUMHOUSE_TWITTER_NAME,
  process.env.BLUMHOUSE_TWITTER_PW
];
const { prompt } = require('enquirer');
(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
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

  const scrollDown = async () => {
    const scrollDelay = 100;
    const previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForFunction(
      `document.body.scrollHeight > ${previousHeight}`
    );
    await page.waitFor(scrollDelay);
  };
  const query = `from:${username} since:2006-01-01 until:2012-01-01`;
  const tweetsUrl = `https://twitter.com/search?f=tweets&vertical=default&q=${encodeURIComponent(
    query
  )}&src=typd`;
  await page.goto(tweetsUrl);
  await [1, 2, 3, 4, 5].reduce(prev => {
    return prev.then(() => scrollDown());
  }, Promise.resolve());
  const tweetIds = await page.evaluate(() =>
    [...document.querySelectorAll('[data-tweet-id]')].map(
      e => e.dataset.tweetId
    )
  );
  tweetIds.forEach(t => console.log(t));
  await browser.close();
})();
