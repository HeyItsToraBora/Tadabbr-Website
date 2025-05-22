package controllers

import (
	"log"
	"net/http"

	"github.com/Tadabbr/backend/initializers"
	"github.com/Tadabbr/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type RequestBodyReport struct {
	Id   int    `json:"id"`
	Edit string `json:"edit"`
}

func AddReport(c *gin.Context) {

	Body := RequestBodyReport{}
	if err := c.ShouldBindJSON(&Body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		c.AbortWithStatus(404)
		return
	}

	// add a new report
	report := models.Report{
		PoemID:  uint(Body.Id),
		Edit:    Body.Edit,
		Checked: false,
		EditBy:  nil,
	}
	err := initializers.DB.Create(&report).Error
	if err != nil {
		logrus.Errorf("Error while inserting a report: %v", err)
		c.JSON(404, gin.H{
			"error": "Resource not found",
		})
		c.AbortWithStatus(404)
		return
	} else {
		c.Status(200)
	}
}

type FetchResponse struct {
	Poem     string  `json:"poem"`
	Poemid   int     `json:"poemid"`
	Surahkey string  `json:"surahkey"`
	Editor   *string `json:"editor"`
	Edit     string  `json:"edit"`
	Checked  bool    `json:"checked"`
}

func GetPoetRowByPid(pid int) (*models.Poetry, error) {
	var result models.Poetry

	err := initializers.PoetryDb.Where("id = ?", pid).First(&result).Error
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func FetchReports(c *gin.Context) {
	var reports []models.Report
	var response []FetchResponse
	results := initializers.DB.Find(&reports)
	if results.Error != nil {
		log.Fatalf("failed to fetch reports: %v", results.Error.Error())
		c.AbortWithStatus(404)
		return
	}
	for _, report := range reports {

		row, err := GetPoetRowByPid(int(report.PoemID))
		if err != nil {
			logrus.Error("Error fetching row:", err)
		} else {
			data := FetchResponse{
				Poem:     row.Poetry,
				Poemid:   int(row.ID),
				Surahkey: row.VerseKey,
				Editor:   report.EditBy,
				Edit:     report.Edit,
				Checked:  report.Checked,
			}
			response = append(response, data)
		}

	}
	c.JSON(200, gin.H{
		"reports": response,
	})
}
