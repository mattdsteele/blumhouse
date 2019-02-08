package blumhouse
import (
	"context"
	"fmt"
	"strconv"
	"strings"
)

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type Message struct {
	Data []byte `json:"data"`
}

func TwitterPurgeFiredHuskers(ctx context.Context, m Message) error {
	payload := string(m.Data)
	params := strings.Split(payload, ",")
	tweetsToDelete, _ := strconv.Atoi(params[0])
	daysToKeep, _ := strconv.Atoi(params[1])
	fmt.Println(payload)
	InitArchiver("firedhuskers").ArchiveTweets(tweetsToDelete, daysToKeep)
	return nil
}

