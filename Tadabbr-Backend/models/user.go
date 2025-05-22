package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint   `gorm:"primaryKey"`
	Username  string `gorm:"unique;not null"`
	Password  string `gorm:"not null"`
	RoleID    uint   `gorm:"not null"`
	Role      Role   `gorm:"foreignKey:RoleID"`
	CreatedAt time.Time
}

func MigrateUser(db *gorm.DB) error {
	return db.AutoMigrate(&User{})
}
