package controllers

import (
	"fmt"
	"net/http"

	"github.com/Tadabbr/backend/initializers"
	"github.com/Tadabbr/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type RequestBody struct {
	Key string `json:"key"`
}

func Search(c *gin.Context) {

	var results []models.Poetry

	Body := RequestBody{}
	if err := c.ShouldBindJSON(&Body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
	}
	err := initializers.DB.Where(fmt.Sprintf("%s = ?", "verse_key"), Body.Key).Find(&results).Error
	if err != nil {
		logrus.Error(err)
	}
	c.JSON(200, gin.H{
		"responses": results,
	})

}
