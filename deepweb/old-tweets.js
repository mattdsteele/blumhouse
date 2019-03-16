const puppeteer = require('puppeteer');
const [username, pw] = [
  process.env.BLUMHOUSE_TWITTER_NAME,
  process.env.BLUMHOUSE_TWITTER_PW
];
const { prompt } = require('enquirer');
const getOldTweets = async year => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1024, height: 768 });
  await page.goto('https://twitter.com/login');
  await page.type('.js-username-field', username);
  await page.type('.js-password-field', pw);
  await page.$('button[type=submit]').then(e => e.press('Enter'));
  if (!page.url().match('login_verification')) {
    throw new Error(`Did not get OTP prompt, ${page.url()}`);
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

  const tweetsForMonth = async month => {
    const query = `from:${username} since:${year}-${month}-01 until:${year}-${month +
      2}-01`;
    const tweetsUrl = `https://twitter.com/search?f=tweets&vertical=default&q=${encodeURIComponent(
      query
    )}&src=typd`;
    await page.goto(tweetsUrl);
    await page.wait(500);
    const tweetIds = await page.evaluate(() =>
      [...document.querySelectorAll('[data-tweet-id]')].map(
        e => e.dataset.tweetId
      )
    );
    return tweetIds;
  };
  /*
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
  */
  await [1, 3, 5, 7, 9].reduce(async (prevPromise, month) => {
    return prevPromise.then(async prev => {
      console.log(
        `getting tweets for month ${month}, have ${prev.length} currently`
      );
      const tweets = await tweetsForMonth(month);
      return [...prev, ...tweets];
    });
  }),
    Promise.resolve([]);
  /*
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
  */
  await browser.close();
  return foundTweets;
};

module.exports = getOldTweets;
