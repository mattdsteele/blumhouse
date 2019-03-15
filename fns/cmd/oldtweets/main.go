package main
import (
	"flag"
	"fmt"
	"os"

	"github.com/ChimeraCoder/anaconda"
	"github.com/mattdsteele/blumhouse"
)

func main() {
	fmt.Println("Here we go")
	flag.Parse()
	t := blumhouse.Auth()
	arch := blumhouse.InitArchiver(os.Getenv("TWITTER_USER"))
	args := flag.Args()
	tweet := t.Tweet(args[0])
	tweets := t.ToTweets([]anaconda.Tweet{tweet})
	arch.Arch(tweets)
}

