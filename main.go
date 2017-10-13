package main

import (
	"cloud.google.com/go/firestore"
	"fmt"
	"github.com/pelletier/go-toml"
	"github.com/tidwall/gjson"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

type Config struct {
	Channels                []string
	BotToken                string
	FirebaseProjectID       string
	FirebaseCredentialsFile string
}

type Client struct {
	Client *firestore.Client
	Ctx    context.Context
}

type Log struct {
	Date    time.Time `firestore:"date"`
	Channel string    `firestore:"channel"`
	Count   int64     `firestore:"count"`
}

func (c *Client) AddLog(log Log) error {
	_, _, err := client.Client.Collection("counts").Add(client.Ctx, log)
	return err
}

var conf Config
var client Client

func main() {
	fmt.Println("Loading config")

	if err := loadConfig(); err != nil {
		panic(err)
	}

	fmt.Println("Loaded config")

	fmt.Println("Connecting to firestore")

	if err := connectToFirestore(); err != nil {
		panic(err)
	}

	fmt.Println("Connected to firestore")

	for _, channel := range conf.Channels {
		// Strip leading @
		channel = strings.TrimPrefix(channel, "@")

		fmt.Printf("Getting %s\n", channel)

		url := fmt.Sprintf("https://api.telegram.org/bot%s/getChatMembersCount?chat_id=@%s", conf.BotToken, channel)
		resp, err := http.Get(url)

		if err != nil {
			fmt.Println(err)
			continue
		}

		bytes, _ := ioutil.ReadAll(resp.Body)
		body := string(bytes)

		if resp.StatusCode != 200 {
			fmt.Println("Response status is " + resp.Status)
			fmt.Println("Body is " + body)
			continue
		}

		// Get the count from the body
		resultField := gjson.Get(body, "result")

		if resultField.Exists() {
			n := resultField.Int()
			fmt.Println(n)

			client.AddLog(Log{time.Now(), channel, n})
		} else {
			fmt.Println("Invalid response: " + body)
		}

		resp.Body.Close()
	}
}

func loadConfig() error {
	t, err := toml.LoadFile("config/config.toml")

	if err != nil {
		return err
	}

	return t.Unmarshal(&conf)
}

func connectToFirestore() error {
	client.Ctx = context.Background()

	var err error
	option := option.WithCredentialsFile(conf.FirebaseCredentialsFile)
	client.Client, err = firestore.NewClient(client.Ctx, conf.FirebaseProjectID, option)

	if err != nil {
		return err
	} else {
		return nil
	}
}
