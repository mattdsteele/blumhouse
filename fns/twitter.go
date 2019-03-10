package blumhouse
import (
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ChimeraCoder/anaconda"
)

type Twitter struct {
	api *anaconda.TwitterApi
}

type Media struct {
	MediaType  string
	Url        string
	DisplayUrl string
}

// Id should be strings?? 64 bit not big enough lol
type Tweet struct {
	Id           string
	Text         string
	Date         time.Time
	FaveCount    int
	RetweetCount int
	IsRetweet    bool
	ReplyToId    string
	Media        []*Media
	Location     string
}

func (t *Tweet) SwapUrl(displayUrl, newUrl string) {
	t.Text = strings.Replace(t.Text, displayUrl, newUrl, -1)
	for _, media := range t.Media {
		if media.DisplayUrl == displayUrl {
			media.Url = newUrl
			media.DisplayUrl = newUrl
		}
	}
}

func videoURL(videos []anaconda.Variant) string {
	highestBitrate := 0
	var highestURL string
	for _, video := range videos {
		if video.Bitrate > highestBitrate {
			highestBitrate = video.Bitrate
			highestURL = video.Url
		}
	}
	return highestURL
}
func asMedia(entities anaconda.Entities) (media []*Media) {
	for _, am := range entities.Media {
		m := Media{}
		m.MediaType = am.Type
		if m.MediaType == "video" {
			m.Url = videoURL(am.VideoInfo.Variants)

		} else {
			m.Url = am.Media_url_https
		}
		m.DisplayUrl = am.Url
		media = append(media, &m)
	}
	return media
}
func asTweet(at anaconda.Tweet) (tweet Tweet) {
	tweet.Id = strconv.FormatInt(at.Id, 10)
	tweet.FaveCount = at.FavoriteCount
	tweet.IsRetweet = at.RetweetedStatus != nil
	tweet.RetweetCount = at.RetweetCount
	tweet.ReplyToId = strconv.FormatInt(at.InReplyToStatusID, 10)
	date, _ := at.CreatedAtTime()
	tweet.Date = date
	tweet.Media = asMedia(at.ExtendedEntities)

	place := at.Place
	if place.Name != "" {
		tweet.Location = place.Name
	}

	urls := at.Entities.Urls

	text := at.FullText
	if len(urls) > 0 {
		for _, url := range urls {
			text = strings.Replace(text, url.Url, url.Expanded_url, -1)
		}
	}
	tweet.Text = text
	return tweet
}
func (t Twitter) ToTweets(atweets []anaconda.Tweet) (tweets []Tweet) {
	for _, at := range atweets {
		tweets = append(tweets, asTweet(at))
	}
	return tweets

}
func (t Twitter) Delete(id int64) {
	_, err := t.api.DeleteTweet(id, false)
	if err != nil {
		panic(err)
	}
}
func (t Twitter) Timeline(user string, numTweets int) []anaconda.Tweet {
	args := url.Values{}
	args.Add("screen_name", user)
	args.Add("exclude_replies", "false")
	args.Add("include_rts", "true")
	args.Add("count", strconv.Itoa(numTweets))
	timeline, err := t.api.GetUserTimeline(args)
	if err != nil {
		panic(err)
	}
	return timeline
}

func Auth() Twitter {
	apiKey := os.Getenv("TWITTER_API_KEY")
	apiSecret := os.Getenv("TWITTER_API_SECRET")
	accessToken := os.Getenv("TWITTER_ACCESS_TOKEN")
	accessSecret := os.Getenv("TWITTER_ACCESS_SECRET")
	anaconda.SetConsumerKey(apiKey)
	anaconda.SetConsumerSecret(apiSecret)
	t := Twitter{}
	t.api = anaconda.NewTwitterApi(accessToken, accessSecret)
	return t
}

