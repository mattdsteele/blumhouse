package main
import (
	"github.com/mattdsteele/blumhouse"
)

func main() {
	blumhouse.InitArchiver("mattdsteele").ArchiveTweets(2, 1)
}

