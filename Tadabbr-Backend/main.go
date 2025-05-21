package main

import (
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
}

func main() {
	router := gin.Default()
	router.POST("/search")
	router.Run()
}
