package blumhouse
import (
	"context"
	"fmt"
	"strconv"
)

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type Message struct {
	Data []byte `json:"data"`
}

func TwitterPurge(ctx context.Context, m Message) error {
	payload := string(m.Data)
	tweetsToDelete, _ := strconv.Atoi(payload)
	fmt.Println(payload)
	InitArchiver("firedhuskers").ArchiveTweets(tweetsToDelete)
	return nil
}

