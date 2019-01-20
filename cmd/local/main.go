package main
import (
	"github.com/mattdsteele/blumhouse"
)

func main() {
	blumhouse.InitArchiver("firedhuskers").ArchiveTweets(1)
}

