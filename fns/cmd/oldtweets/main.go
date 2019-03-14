package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func nodeCmd() []string {
	// r, err := exec.Command("pwd").Output()
	r, err := exec.Command("node", "../deepweb/old-tweets.js").Output()
	if err != nil {
		panic(err)
	}
	return strings.Split(string(r), "\n")
}
func main() {
	fmt.Println("Here we go")
	fmt.Println(nodeCmd())
}
