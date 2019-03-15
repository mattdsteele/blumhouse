const puppeteer = require('puppeteer');
const [username, pw] = [
  process.env.BLUMHOUSE_TWITTER_NAME,
  process.env.BLUMHOUSE_TWITTER_PW
];
const { prompt } = require('enquirer');
const getOldTweets = async (year = 2008) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0'
  );
  page.setViewport({ width: 1024, height: 768 });
  await page.goto('https://twitter.com/login');
  await page.type('.js-username-field', username);
  await page.type('.js-password-field', pw);
  await page.$('button[type=submit]').then(e => e.press('Enter'));
  if (page.url().match('login_verification')) {
    throw new Error('Did not get OTP prompt', page.url());
  }
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
    await Promise.race([
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      ),
      page.waitFor(10000)
    ]);
    await page.waitFor(scrollDelay);
  };
  const query = `from:${username} since:${year}-01-01 until:${year + 1}-11-11`;
  const tweetsUrl = `https://twitter.com/search?f=tweets&vertical=default&q=${encodeURIComponent(
    query
  )}&src=typd`;
  await page.goto(tweetsUrl);
  await [1, 2, 3, 4].reduce((prev, curr) => {
    return prev
      .then(() => scrollDown())
      .then(() => page.screenshot({ path: `screens/scrolled-${curr}.png` }));
  }, Promise.resolve());
  const tweetIds = await page.evaluate(() =>
    [...document.querySelectorAll('[data-tweet-id]')].map(
      e => e.dataset.tweetId
    )
  );
  await browser.close();
  return tweetIds;
};

module.exports = getOldTweets;
