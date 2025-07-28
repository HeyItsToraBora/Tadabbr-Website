package controllers

import (
	"net/http"
	"strconv"

	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
)

func GetVerse(c *gin.Context) {
	surahStr := c.Query("surah")
	verseStr := c.Query("verse")

	surah, err1 := strconv.Atoi(surahStr)
	verse, err2 := strconv.Atoi(verseStr)
	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid surah or verse parameter"})
		return
	}

	var text string
	err := initializers.DB.QueryRow("SELECT text FROM verses WHERE surah = ? AND verse = ?", surah, verse).Scan(&text)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Verse not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"surah": surah,
		"verse": verse,
		"text": text,
	})
} 