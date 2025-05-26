package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/Tadabbr/backend/db"
	"github.com/Tadabbr/backend/initializers"
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
	Text     string         `json:"text"`
	Match    int            `json:"match"`
	Surahkey string         `json:"surahkey"`
	Surah    string         `json:"surah"`
	Id       int64          `json:"id"`
	Poet     sql.NullString `json:"poet"`
}

func cacheResults(cachekey string, results []result) bool {
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

func GetFullRowByType(qtype string, text string) (*db.Poem, error) {
	switch qtype {
	case "ayat":
		row, err := initializers.DbQueries.GetPoemsRowByVerse(initializers.Ctx, text)
		return &row, err
	case "poet":
		row, err := initializers.DbQueries.GetPoemRowByPoem(initializers.Ctx, text)
		return &row, err

	default:
		return nil, fmt.Errorf("unsupported query type: %s", qtype)
	}
}

func Suggestion(c *gin.Context) {

	sugg := suggestion{}
	if err := c.ShouldBindJSON(&sugg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		logrus.Infof("%v", err)
		c.AbortWithStatus(400)
		return
	}
	// check if cached
	// the key is the suggestion struct
	cachekey := fmt.Sprintf("%s:%s", sugg.Query, sugg.Qtype)
	val, err := initializers.Cache.Get(initializers.Ctx, cachekey).Result()
	if err == redis.Nil {
		// not cached
		// do nothing
	} else if err != nil {
		// Error
		// logrus
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
		searchables, err = initializers.DbQueries.GetDistinctVerses(initializers.Ctx)
		if err != nil {
			logrus.Error(err.Error())
			c.AbortWithStatus(502)
			return
		} else {

		}
	} else if sugg.Qtype == "poet" {
		searchables, err = initializers.DbQueries.GetDistinctPoems(initializers.Ctx)
		if err != nil {
			log.Printf("Bind error: %v", err)
			c.AbortWithStatus(502)
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
