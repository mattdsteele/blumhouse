package blumhouse
import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/datastore"
)

type Datastore struct {
	ctx        context.Context
	client     *datastore.Client
	screenname string
}

func (d Datastore) Query() {
	q := datastore.NewQuery("Tweet-" + d.screenname)
	var tweets []Tweet
	_, err := d.client.GetAll(d.ctx, q, &tweets)
	if err != nil {
		panic(err)
	}
	for _, tweet := range tweets {
		if len(tweet.Media) > 0 {
			fmt.Println(tweet.Text)
		}
	}
}
func (d Datastore) Persist(tweet Tweet) {
	k := datastore.IncompleteKey("Tweet-"+d.screenname, nil)
	_, newErr := d.client.Put(d.ctx, k, &tweet)
	if newErr != nil {
		log.Fatal(newErr)
	}
}

func MakeStore(name string) (d Datastore) {
	ctx := context.Background()

	dsClient, err := datastore.NewClient(ctx, "blumhouse")
	if err != nil {
		log.Fatal(err)
	}
	d.ctx = ctx
	d.client = dsClient
	d.screenname = name
	return d
}

