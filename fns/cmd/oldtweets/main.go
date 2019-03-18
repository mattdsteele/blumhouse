package main
import (
	"flag"
	"os"

	"github.com/mattdsteele/blumhouse"
)

func main() {
	flag.Parse()
	t := blumhouse.Auth()
	arch := blumhouse.InitArchiver(os.Getenv("BLUMHOUSE_TWITTER_NAME"))
	args := flag.Args()
	tweets := t.ToTweets(t.Tweet(args))
	arch.Arch(tweets)
}

