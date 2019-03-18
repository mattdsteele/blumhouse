package main
import (
	"os"

	"github.com/mattdsteele/blumhouse"
)

func main() {
	blumhouse.InitArchiver(os.Getenv("BLUMHOUSE_TWITTER_NAME")).ArchiveTweets(3, 1)
}

