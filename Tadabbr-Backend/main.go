package main

// to add the outpot db from https://github.com/Tadabbr/Tadabbr-scraper to the website db
import (
	_ "embed"

	"github.com/Tadabbr/backend/controllers"
	"github.com/Tadabbr/backend/initializers"
	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

//go:embed sql/schema.sql
var ddl string

func init() {
	initializers.LoadEnvVariables() // has to be first
	initializers.ConnectToDb()
	initializers.ConnectToCache()
	initializers.IntializeDb(ddl)
	initializers.Initlogrus()
}

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // or "*" for all origins (not recommended)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	router.POST("/sugg", controllers.Suggestion)
	router.POST("/search", controllers.Search)
	router.POST("/report/add", controllers.AddReport)
	router.GET("/report/all", controllers.FetchReports)

	router.Run()
}
