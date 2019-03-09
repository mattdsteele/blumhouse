package blumhouse
import (
	"net/http"
	"strings"
)

func DownloadFromUrl(url string) (*http.Response, string) {
	tokens := strings.Split(url, "/")
	fileName := tokens[len(tokens)-1]

	response, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	return response, fileName
}

