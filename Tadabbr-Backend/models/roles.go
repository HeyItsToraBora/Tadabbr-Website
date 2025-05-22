package models

import (
	"gorm.io/gorm"
)

type Role struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"unique;not null"`
}

func MigrateRole(db *gorm.DB) error {
	return db.AutoMigrate(&Role{})
}
