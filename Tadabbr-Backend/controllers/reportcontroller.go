package controllers

import (
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
