package controllers

import (
	"fmt"
	"net/http"
	"sort"

	"github.com/Tadabbr/backend/initializers"
	"github.com/Tadabbr/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/lithammer/fuzzysearch/fuzzy"
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

	err := initializers.DB.Where(fmt.Sprintf("%s = ?", queryField), text).First(&result).Error
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func Suggestion(c *gin.Context) {

	sugg := suggestion{}
	if err := c.ShouldBindJSON(&sugg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
	}
	var searchables []string
	// make the query
	if sugg.Qtype == "ayat" {
		result := initializers.DB.Model(&models.Poetry{}).Distinct("verse").Pluck("verse", &searchables)
		if result.Error != nil {
			logrus.Error(result.Error)
		}
	} else if sugg.Qtype == "poet" {
		result := initializers.DB.Model(&models.Poetry{}).Distinct("poetry").Pluck("poetry", &searchables)
		if result.Error != nil {
			logrus.Error(result.Error)

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

	c.JSON(200, gin.H{
		"possibles": results,
	})
}
