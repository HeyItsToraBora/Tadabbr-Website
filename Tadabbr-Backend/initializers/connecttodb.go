package initializers

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDb() {
	var err error
	DB, err = gorm.Open(sqlite.Open("db/poetry.db?mode=ro"), &gorm.Config{}) // read only for now !TODO
	if err != nil {
		panic("failed to connect database")
	}
}
