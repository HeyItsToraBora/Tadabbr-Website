package models

type Poetry struct {
	ID            uint    `gorm:"column:id;primaryKey"`
	Poet          *string `gorm:"column:poet"` // nullable
	Poetry        string  `gorm:"column:poetry"`
	ContextBefore string  `gorm:"column:context_before"`
	ContextAfter  string  `gorm:"column:context_after"`
	Verse         string  `gorm:"column:verse"`
	Surah         string  `gorm:"column:surah"`
	Tafsir        string  `gorm:"column:tafsir"`
	VerseKey      string  `gorm:"column:verse_key"`
	Word          string  `gorm:"column:word"`
}

func (Poetry) TableName() string {
	return "poems"
}
