package blumhouse
import (
	"fmt"
	"sync"
)

type Archiver struct {
	twitter    Twitter
	storage    Storage
	datastore  Datastore
	screenname string
}

func InitArchiver(screenname string) (archiver Archiver) {
	archiver.twitter = Auth()
	archiver.datastore = MakeStore(screenname)
	archiver.storage = Init(screenname + "-tweet-media")
	archiver.screenname = screenname
	return archiver
}

func (a Archiver) ArchiveTweets(numTweets int) {
	tweets := a.GetTweets(numTweets)
	var wg sync.WaitGroup
	wg.Add(len(tweets))
	for _, tweet := range tweets {
		go a.Archive(tweet, &wg)
	}
	wg.Wait()
}
func (a Archiver) GetTweets(numTweets int) []Tweet {
	tweets := a.twitter.ToTweets(a.twitter.Timeline(a.screenname, numTweets))
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
	a.twitter.Delete(tweet.Id)
	fmt.Println("Done with", tweet.Id)
}

