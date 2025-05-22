package main

import (
	"github.com/Tadabbr/backend/controllers"
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables() // has to be first
	initializers.ConnectToDb()
	initializers.ConnectToCache()
	initializers.IntializeDb()
	initializers.InsertDefaultRoles()

}

func main() {
	router := gin.Default()
	router.POST("/sugg", controllers.Suggestion)
	router.POST("/search", controllers.Search)

	router.Run()
}
