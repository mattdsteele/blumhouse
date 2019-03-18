# Blumhouse

Purges old Tweets

## Why

See https://steele.blue/blumhouse

## You probably don't want to host this yourself

This was me just futzing around with what Google Cloud had to offer. It theoretically will work for you, but other tools are likely easier and more feature complete.

If you want to clean up old tweets, check out https://github.com/adamdrake/harold or https://github.com/victoriadotdev/ephemeral

If you want to host your tweets somewhere else, use https://github.com/mholt/timeliner

## If you do want to run this on your account

Setup a Twitter Developer account and create an app: https://developer.twitter.com/en/apps

### Running Locally

Set the following environment variables:

- `BLUMHOUSE_TWITTER_NAME` - the user name you want to begin purging
- `TWITTER_API_KEY` - from Twitter API
- `TWITTER_API_SECRET` - from Twitter API
- `TWITTER_ACCESS_TOKEN` - from Twitter API
- `TWITTER_ACCESS_SECRET` - from Twitter API
- `BLUMHOUSE_WHITELISTED_TWEET_ID` - a single Tweet you'd like to preserve. Useful for pinned tweets

Get a Google Cloud account and create a project.

[Create a Service Account](https://console.cloud.google.com/apis/credentials/serviceaccountkey) and download the JSON credentials file. Add an `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to that file.

Run the purge:

```
cd fns
go run ./cmd/local/
```

Generate the static site:

```
cd static
npm i
npm start
```

### Running on The Cloud

Edit `fns/cloudbuild.yaml` and setup Google Cloud Build to deploy new Cloud Functions on commits: https://cloud.google.com/functions/docs/deploying/repo

After the first deploy, add the appropriate environment variables (see above) to the Cloud Functions. I did this manually through the console.

Setup a new Cloud Scheduler trigger to execute the function periodically through a Pub/Sub event: https://cloud.google.com/scheduler/docs/tut-pub-sub

In the Cloud Scheduler payload, pass in two values separated by a comma, such as `2,1`. The first value is the number of Tweets to attempt to purge. The second is the number of days of recent Twitter history to preserve.

Next, edit `static/cloudbuild.yaml` and setup another Cloud Build job to deploy to a new static content bucket on commits: https://cloud.google.com/community/tutorials/automated-publishing-cloud-build

### Deleting Older Tweets

You can only get the last 3200 tweets this way. To purge everything, see `fns/cmd/purge2`.
