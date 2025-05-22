package initializers

import (
	"context"
	"log"
	"os"
	"strconv"

	"github.com/Tadabbr/backend/models"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var PoetryDb *gorm.DB
var DB *gorm.DB
var CacheCtx context.Context
var Cache *redis.Client

func ConnectToDb() {
	var err error
	PoetryDb, err = gorm.Open(sqlite.Open("db/poetry.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	DB, err = gorm.Open(sqlite.Open("db/database.db"), &gorm.Config{})
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

func IntializeDb() {
	if err := models.MigrateRole(DB); err != nil {
		log.Fatal(err)
	}
	if err := models.MigrateUser(DB); err != nil {
		log.Fatal(err)
	}
	if err := models.MigrateReport(DB); err != nil {
		log.Fatal(err)
	}
	if err := models.MigrateDonation(DB); err != nil {
		log.Fatal(err)
	}
}

func InsertDefaultRoles() {
	roles := []string{"admin", "editor"}

	for _, name := range roles {
		var role models.Role
		err := DB.Where("name = ?", name).First(&role).Error
		if err == gorm.ErrRecordNotFound {
			// Not found, create role
			if err := DB.Create(&models.Role{Name: name}).Error; err != nil {
				logrus.Errorf("Error in adding role: %v", err.Error())
			}
		} else if err != nil {
			logrus.Errorf("Error in adding role: %v", err.Error())
		}
		// If found, do nothing and continue
	}

}
