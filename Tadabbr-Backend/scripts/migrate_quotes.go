package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	// Open the database
	db, err := sql.Open("sqlite", "./db/database.db")
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	// Create quotes table
	createQuotesTable := `
	CREATE TABLE IF NOT EXISTS quotes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		text TEXT NOT NULL,
		author TEXT NOT NULL,
		source TEXT,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err = db.Exec(createQuotesTable)
	if err != nil {
		log.Fatalf("failed to create quotes table: %v", err)
	}

	log.Println("✅ Quotes table created successfully!")

	// Insert some sample quotes
	sampleQuotes := []struct {
		text   string
		author string
		source string
	}{
		{
			text:   "العلم نور والجهل ظلام",
			author: "مثل عربي",
			source: "الأمثال العربية",
		},
		{
			text:   "من جد وجد، ومن زرع حصد",
			author: "مثل عربي",
			source: "الأمثال العربية",
		},
		{
			text:   "الوقت كالسيف إن لم تقطعه قطعك",
			author: "علي بن أبي طالب",
			source: "نهج البلاغة",
		},
	}

	insertStmt, err := db.Prepare(`
		INSERT INTO quotes (text, author, source)
		VALUES (?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("failed to prepare insert statement: %v", err)
	}
	defer insertStmt.Close()

	for _, quote := range sampleQuotes {
		_, err = insertStmt.Exec(quote.text, quote.author, quote.source)
		if err != nil {
			log.Printf("failed to insert quote: %v", err)
			continue
		}
	}

	log.Printf("✅ Inserted %d sample quotes!", len(sampleQuotes))
	log.Println("Migration completed successfully!")
} 