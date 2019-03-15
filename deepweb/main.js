const getOldTweets = require('./old-tweets');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

(async () => {
  oldTweets = await getOldTweets(2009);
  const cmd = '../fns/bin/oldtweets';
  console.log(`archiving ${oldTweets.length} tweets`);
  try {
    const { stdout, stderr } = await execFile(cmd, oldTweets);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error(e);
  }
})();
