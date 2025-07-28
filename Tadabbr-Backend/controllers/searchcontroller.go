package controllers

import (
	"encoding/json"

	"github.com/sirupsen/logrus"

	"net/http"
	"time"

	"github.com/Tadabbr/backend/db"
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type RequestBodySearch struct {
	Key string `json:"key"`
}

func cacheSearch(cachekey string, results []db.Poem) bool {
	jsonString, err := json.Marshal(results)
	if err != nil {
		logrus.Errorf("Couldn't cache results, error in serialization: %v", err.Error())
		return false
	}
	err = initializers.Cache.Set(initializers.Ctx, cachekey, jsonString, 6*time.Hour).Err()
	if err != nil {
		logrus.Errorf("Failed to cache results: %v", err.Error())
		return false
	}
	return true
}

func Search(c *gin.Context) {

	var results []db.Poem

	Body := RequestBodySearch{}
	if err := c.ShouldBindJSON(&Body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// check if cached
	// the key is the verse key struct
	val, err := initializers.Cache.Get(initializers.Ctx, Body.Key).Result()
	if err == redis.Nil {
		// not cached
		// do nothing
	} else if err != nil {
		// Error
		// logrus
		logrus.Errorf("Error in Checking retriving Cache: %v", err.Error())
	} else {
		// HIT
		if err := json.Unmarshal([]byte(val), &results); err != nil {
			logrus.Errorf("Error unmarshaling cached value: %v", err)
		} else {
			c.JSON(200, gin.H{
				"responses": results,
			})
			return
		}

	}
	results, err = initializers.DbQueries.GetPoemsRowByVerseKey(initializers.Ctx, Body.Key)
	if err != nil {
		logrus.Error(err)
		c.AbortWithStatus(404)
		return
	}

	// cache results
	cacheSearch(Body.Key, results)
	c.JSON(200, gin.H{
		"responses": results,
	})

}
