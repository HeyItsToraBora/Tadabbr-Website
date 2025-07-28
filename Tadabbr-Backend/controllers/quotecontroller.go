package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/Tadabbr/backend/db"
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type CreateQuoteRequest struct {
	Text   string `json:"text" binding:"required"`
	Author string `json:"author" binding:"required"`
	Source string `json:"source"`
}

type UpdateQuoteRequest struct {
	Text   string `json:"text" binding:"required"`
	Author string `json:"author" binding:"required"`
	Source string `json:"source"`
}

// CreateQuote handles creating a new quote
func CreateQuote(c *gin.Context) {
	var req CreateQuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Prepare source field
	var source sql.NullString
	if req.Source != "" {
		source.String = req.Source
		source.Valid = true
	}

	// Create quote
	params := db.CreateQuoteParams{
		Text:   req.Text,
		Author: req.Author,
		Source: source,
	}

	err := initializers.DbQueries.CreateQuote(initializers.Ctx, params)
	if err != nil {
		logrus.Errorf("Error creating quote: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quote"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Quote created successfully"})
}

// ListQuotes handles fetching all quotes
func ListQuotes(c *gin.Context) {
	quotes, err := initializers.DbQueries.ListQuotes(initializers.Ctx)
	if err != nil {
		logrus.Errorf("Error fetching quotes: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quotes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quotes": quotes})
}

// GetQuote handles fetching a single quote by ID
func GetQuote(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quote ID is required"})
		return
	}

	// Convert string ID to int64 (you might want to add proper validation)
	var quoteID int64
	_, err := fmt.Sscanf(id, "%d", &quoteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quote ID"})
		return
	}

	quote, err := initializers.DbQueries.GetQuoteById(initializers.Ctx, quoteID)
	if err != nil {
		logrus.Errorf("Error fetching quote: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Quote not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quote": quote})
}

// UpdateQuote handles updating an existing quote
func UpdateQuote(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quote ID is required"})
		return
	}

	var quoteID int64
	_, err := fmt.Sscanf(id, "%d", &quoteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quote ID"})
		return
	}

	var req UpdateQuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Prepare source field
	var source sql.NullString
	if req.Source != "" {
		source.String = req.Source
		source.Valid = true
	}

	// Update quote
	params := db.UpdateQuoteParams{
		Text:   req.Text,
		Author: req.Author,
		Source: source,
		ID:     quoteID,
	}

	err = initializers.DbQueries.UpdateQuote(initializers.Ctx, params)
	if err != nil {
		logrus.Errorf("Error updating quote: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update quote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Quote updated successfully"})
}

// DeleteQuote handles deleting a quote
func DeleteQuote(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quote ID is required"})
		return
	}

	var quoteID int64
	_, err := fmt.Sscanf(id, "%d", &quoteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quote ID"})
		return
	}

	err = initializers.DbQueries.DeleteQuote(initializers.Ctx, quoteID)
	if err != nil {
		logrus.Errorf("Error deleting quote: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete quote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Quote deleted successfully"})
} 