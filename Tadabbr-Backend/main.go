package main

import (
	"github.com/Tadabbr/backend/controllers"
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.ConnectToDb()
	initializers.LoadEnvVariables()
}

func main() {
	router := gin.Default()
	router.POST("/sugg", controllers.Suggestion)
	router.Run()
}
