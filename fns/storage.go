package blumhouse
import (
	"context"
	"io"
	"log"

	"cloud.google.com/go/storage"
)

type Storage struct {
	ctx    context.Context
	client *storage.Client
	bucket *storage.BucketHandle
}

func Init(bucketName string) (s Storage) {
	ctx := context.Background()

	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	s.ctx = ctx
	s.client = storageClient
	bucket := storageClient.Bucket(bucketName)
	s.bucket = bucket

	return s
}
func (s Storage) Upload(media *Media) (newUrl string) {
	resp, fileName := DownloadFromUrl(media.Url)
	defer resp.Body.Close()
	obj := s.bucket.Object(fileName)
	w := obj.NewWriter(s.ctx)
	_, err := io.Copy(w, resp.Body)
	if err != nil {
		panic(err)
	}

	err = w.Close()
	if err != nil {
		panic(err)
	}
	attrs, _ := obj.Attrs(s.ctx)
	newUrl = attrs.MediaLink

	return newUrl
}

func StoreEntry() (*storage.BucketHandle, context.Context) {
	ctx := context.Background()

	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	bucket := storageClient.Bucket("blumhouse.appspot.com")
	return bucket, ctx

}

