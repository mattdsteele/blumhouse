package main
import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/mattdsteele/blumhouse"
)

type Tweet struct {
	Id string `json:"id_str"`
}

func main() {
	// Open our jsonFile
	jsonFile, err := os.Open("tweet.json")
	defer jsonFile.Close()
	// if we os.Open returns an error then handle it
	if err != nil {
		panic(err)
	}
	fmt.Println("Successfully Opened tweets")
	// defer the closing of our jsonFile so that we can parse it later on

	// read our opened xmlFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	// we initialize our Users array
	tweets := make([]Tweet, 0)

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'users' which we defined above
	json.Unmarshal(byteValue, &tweets)

	buckets := hundredBuckets(tweets)
	fmt.Println(len(buckets[0]), len(buckets))
	t := blumhouse.Auth()
	arch := blumhouse.InitArchiver(os.Getenv("TWITTER_USER"))

	for _, tweetBucket := range buckets {
		tweets := t.ToTweets(t.Tweet(tweetBucket))
		arch.Arch(tweets)
	}
}

func hundredBuckets(tweets []Tweet) [][]string {
	multBuckets := make([][]string, 0)
	bucket := make([]string, 0)
	for i, tweet := range tweets {
		bucket = append(bucket, tweet.Id)
		if i > 0 && i%98 == 0 {
			multBuckets = append(multBuckets, bucket)
			bucket = make([]string, 0)
		}
	}
	return multBuckets
}

