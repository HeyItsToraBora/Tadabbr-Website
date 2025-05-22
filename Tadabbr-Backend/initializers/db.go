package initializers

import (
	"context"
	"os"
	"strconv"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB
var CacheCtx context.Context
var Cache *redis.Client

func ConnectToDb() {
	var err error
	DB, err = gorm.Open(sqlite.Open("db/poetry.db?mode=ro"), &gorm.Config{}) // read only for now !TODO
	if err != nil {
		panic("failed to connect database")
	}
}

func ConnectToCache() {
	CacheCtx = context.Background()
	DB, err := strconv.Atoi(os.Getenv("DB"))
	if err != nil {
		logrus.Fatalf("failed to connect to Redis: %v", err)
		os.Exit(1) // stops the program cause i can't run the backend without redis
	}
	Cache = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDISADDR"),
		Password: os.Getenv("REDISPASSWORD"),
		DB:       DB,
	})
}
