package controllers

import (
	"net/http"

	"github.com/Tadabbr/backend/db"
	"github.com/Tadabbr/backend/initializers"
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
	report := db.CreateReportParams{
		PoemID: int64(Body.Id),
		Edit:   Body.Edit,
	}
	err := initializers.DbQueries.CreateReport(initializers.Ctx, report)
	if err != nil {
		logrus.Infof("Error while inserting a report: %v", err)
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
	Poem     string `json:"poem"`
	Poemid   int    `json:"poemid"`
	Surahkey string `json:"surahkey"`
	Edit     string `json:"edit"`
	Checked  bool   `json:"checked"`
}

func FetchReports(c *gin.Context) {
	var reports []db.Report
	var response []FetchResponse
	reports, err := initializers.DbQueries.ListReports(initializers.Ctx)
	if err != nil {
		logrus.Fatalf("failed to fetch reports: %v", err.Error())
		c.AbortWithStatus(404)
		return
	}
	for _, report := range reports {

		row, err := initializers.DbQueries.GetPoemById(initializers.Ctx, int64(report.PoemID))
		if err != nil {
			logrus.Error("Error fetching row:", err)
		} else {
			data := FetchResponse{
				Poem:     row.Poetry,
				Poemid:   int(row.ID),
				Surahkey: row.VerseKey,
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
