# Mass Tweet Deleter

Twitter only lets you retrieve the last 3200 tweets via their free API. To purge all your old tweets:

- Request a copy of your Twitter data:
- Extract `tweet.js` and convert to JSON; see `tweet.example.json` for an example
- `go run ./cmd/purge2`
