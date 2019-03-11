package main
import (
	"os"

	"github.com/mattdsteele/blumhouse"
)

func main() {
	blumhouse.InitArchiver(os.Getenv("TWITTER_USER")).ArchiveTweets(3, 1)
}

