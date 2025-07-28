package initializers

import (
	"context"
	"database/sql"
	_ "embed"
	"os"
	"strconv"

	"github.com/Tadabbr/backend/db"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	_ "modernc.org/sqlite"
)

var DB *sql.DB
var DbQueries *db.Queries
var Ctx context.Context
var Cache *redis.Client

func ConnectToDb() {
	var err error
	DB, err = sql.Open("sqlite", "db/database.db")
	if err != nil {
		logrus.Fatalf("failed to connect database : %v", err)
		os.Exit(1)
	}
}

func ConnectToCache() {
	Ctx = context.Background()
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
	if os.Getenv("GIN_MODE") == "debug" {
		err = Cache.FlushDB(Ctx).Err()
		if err != nil {
			logrus.Errorf("Error in flushing Cache:%v", err.Error())
		}
	}
}

func IntializeDb(ddl string) error {
	if _, err := DB.ExecContext(Ctx, ddl); err != nil {
		logrus.Fatalf("failed to connect database : %v", err)
		os.Exit(1)
	}
	DbQueries = db.New(DB)
	return nil
}
