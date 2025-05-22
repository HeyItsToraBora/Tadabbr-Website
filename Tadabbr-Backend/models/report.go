package models

import (
	"time"

	"gorm.io/gorm"
)

type Report struct {
	ID        uint    `gorm:"primaryKey"`
	PoemID    uint    `gorm:"not null"`
	Edit      string  `gorm:"type:text;not null"`
	Checked   bool    `gorm:"default:false"`
	EditBy    *string // nullable
	CreatedAt time.Time
}

func MigrateReport(db *gorm.DB) error {
	return db.AutoMigrate(&Report{})
}
