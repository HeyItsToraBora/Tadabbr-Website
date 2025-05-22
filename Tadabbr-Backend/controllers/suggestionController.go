package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/Tadabbr/backend/initializers"
	"github.com/Tadabbr/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/lithammer/fuzzysearch/fuzzy"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type suggestion struct {
	Query string `json:"query"`
	Qtype string `json:"type"`
}

type result struct {
	Text     string  `json:"text"`
	Match    int     `json:"match"`
	Surahkey string  `json:"surahkey"`
	Surah    string  `json:"surah"`
	Id       uint    `json:"id"`
	Poet     *string `json:"poet"`
}

func GetFullRowByType(qtype string, text string) (*models.Poetry, error) {
	var result models.Poetry

	var queryField string
	switch qtype {
	case "ayat":
		queryField = "verse"
	case "poet":
		queryField = "poetry"
	default:
		return nil, fmt.Errorf("unsupported query type: %s", qtype)
	}

	err := initializers.PoetryDb.Where(fmt.Sprintf("%s = ?", queryField), text).First(&result).Error
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func cacheResults(cachekey string, results []result) bool {
	jsonString, err := json.Marshal(results)
	if err != nil {
		logrus.Errorf("Couldn't cache results, error in serialization: %v", err.Error())
		return false
	}
	err = initializers.Cache.Set(initializers.CacheCtx, cachekey, jsonString, 6*time.Hour).Err()
	if err != nil {
		logrus.Errorf("Failed to cache results: %v", err.Error())
		return false
	}
	return true
}

func Suggestion(c *gin.Context) {

	sugg := suggestion{}
	if err := c.ShouldBindJSON(&sugg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		c.AbortWithStatus(404)
		return
	}
	// check if cached
	// the key is the suggestion struct
	cachekey := fmt.Sprintf("%s:%s", sugg.Query, sugg.Qtype)
	val, err := initializers.Cache.Get(initializers.CacheCtx, cachekey).Result()
	if err == redis.Nil {
		// not cached
		// do nothing
	} else if err != nil {
		// Error
		// log
		logrus.Errorf("Error in Checking retriving Cache: %v", err.Error())
	} else {
		// HIT

		var cachedResults []result
		if err := json.Unmarshal([]byte(val), &cachedResults); err != nil {
			logrus.Errorf("Error unmarshaling cached value: %v", err)
		} else {
			c.JSON(200, gin.H{
				"possibles": cachedResults,
			})
			return
		}

	}

	// not cached

	var searchables []string

	// make the query
	if sugg.Qtype == "ayat" {
		result := initializers.PoetryDb.Model(&models.Poetry{}).Distinct("verse").Pluck("verse", &searchables)
		if result.Error != nil {
			logrus.Error(result.Error)
			c.AbortWithStatus(404)
			return
		}
	} else if sugg.Qtype == "poet" {
		result := initializers.PoetryDb.Model(&models.Poetry{}).Distinct("poetry").Pluck("poetry", &searchables)
		if result.Error != nil {
			logrus.Error(result.Error)
			c.AbortWithStatus(404)
			return

		}
	}
	// rank results
	matches := fuzzy.RankFind(sugg.Query, searchables) // fuzzy search it
	logrus.Info(searchables)
	sort.Sort(matches)
	limit := 5
	if len(matches) < limit {
		limit = len(matches)
	}
	topMatches := matches[:limit]
	var results []result
	for _, match := range topMatches {
		var data = result{}
		data.Text = match.Target
		data.Match = match.Distance
		row, err := GetFullRowByType(sugg.Qtype, data.Text)
		if err != nil {
			logrus.Error("Error fetching row:", err)
		} else {
			data.Id = row.ID
			data.Surah = row.Surah
			data.Surahkey = row.VerseKey
		}
		if sugg.Qtype == "poet" {
			data.Poet = row.Poet
		}
		results = append(results, data)

	}

	// cache the results
	logrus.Info(cacheResults(cachekey, results))
	c.JSON(200, gin.H{
		"possibles": results,
	})
}
