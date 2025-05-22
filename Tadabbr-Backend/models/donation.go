package models

import (
	"time"

	"gorm.io/gorm"
)

type Donation struct {
	ID        uint    `gorm:"primaryKey"`
	Gateway   string  `gorm:"not null"`
	Currency  string  `gorm:"not null"`
	Donor     *string // nullable
	Amount    int     `gorm:"not null"`
	CreatedAt time.Time
}

func MigrateDonation(db *gorm.DB) error {
	return db.AutoMigrate(&Donation{})
}
