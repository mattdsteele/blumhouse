package blumhouse
import (
	"fmt"
	"os"
	"strconv"
	"sync"
	"time"
)

type Archiver struct {
	twitter     Twitter
	storage     Storage
	datastore   Datastore
	screenname  string
	safeTweetId string
}

func InitArchiver(screenname string) (archiver Archiver) {
	archiver.twitter = Auth()
	archiver.datastore = MakeStore(screenname)
	archiver.storage = Init(screenname + "-tweet-media")
	archiver.screenname = screenname
	safeTweet := os.Getenv("BLUMHOUSE_WHITELISTED_TWEET_ID")
	archiver.safeTweetId = safeTweet
	return archiver
}

func (a Archiver) ArchiveTweets(numTweets int, daysToDelete int) {
	tweets := a.GetTweets(numTweets, daysToDelete)
	var wg sync.WaitGroup
	wg.Add(len(tweets))
	for _, tweet := range tweets {
		go a.Archive(tweet, &wg)
	}
	wg.Wait()
}
func (a Archiver) GetTweets(numTweets, daysToDelete int) (tweets []Tweet) {
	safeTweetTime := time.Now().AddDate(0, 0, -daysToDelete)
	safeTweets := 0
	allTweets := a.twitter.ToTweets(a.twitter.Timeline(a.screenname, numTweets))
	for _, tweet := range allTweets {
		if tweet.Id == a.safeTweetId {
			fmt.Println("Saving whitelisted tweet")
			safeTweets++
		} else if tweet.Date.Before(safeTweetTime) {
			tweets = append(tweets, tweet)
		} else {
			safeTweets++
		}
	}
	if safeTweets > 0 {
		fmt.Println(safeTweets, "tweets safe for now")
	}
	return tweets

}
func upload(media *Media, a Archiver, newUrls chan []string, wg *sync.WaitGroup) {
	defer wg.Done()
	newUrl := a.storage.Upload(media)
	newUrls <- []string{newUrl, media.DisplayUrl}
}
func (a Archiver) Archive(tweet Tweet, wg *sync.WaitGroup) {
	defer wg.Done()
	var mediaWg sync.WaitGroup
	fmt.Println("Archiving", tweet.Id)
	count := len(tweet.Media)
	mediaWg.Add(count)
	newUrls := make(chan []string)
	for _, media := range tweet.Media {
		go upload(media, a, newUrls, &mediaWg)
	}
	go func() {
		for newData := range newUrls {
			tweet.SwapUrl(newData[1], newData[0])
		}
	}()
	mediaWg.Wait()
	a.datastore.Persist(tweet)
	id, _ := strconv.ParseInt(tweet.Id, 0, 64)
	a.twitter.Delete(id)
	fmt.Println("Done with", tweet.Id)
}

