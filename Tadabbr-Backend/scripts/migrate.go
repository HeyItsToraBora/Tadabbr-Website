package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Open source database
	sourceDB, err := sql.Open("sqlite3", "./poetry.db")
	if err != nil {
		log.Fatalf("failed to open source DB: %v", err)
	}
	defer sourceDB.Close()

	// Open destination database
	destDB, err := sql.Open("sqlite3", "./db/database.db")
	if err != nil {
		log.Fatalf("failed to open destination DB: %v", err)
	}
	defer destDB.Close()

	// Read poems from source
	rows, err := sourceDB.Query(`SELECT id, poet, poetry, context_before, context_after, verse, surah, tafsir, verse_key FROM poems`)
	if err != nil {
		log.Fatalf("failed to read from source: %v", err)
	}
	defer rows.Close()

	// Prepare insert for destination
	insertStmt, err := destDB.Prepare(`
		INSERT INTO poems (id, poet, poetry, context_before, context_after, verse, surah, tafsir, verse_key)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatalf("failed to prepare insert: %v", err)
	}
	defer insertStmt.Close()

	count := 0
	for rows.Next() {
		var id int
		var poet, poetry, contextBefore, contextAfter, verse, surah, tafsir, verseKey sql.NullString

		err := rows.Scan(&id, &poet, &poetry, &contextBefore, &contextAfter, &verse, &surah, &tafsir, &verseKey)
		if err != nil {
			log.Printf("skip row: %v", err)
			continue
		}

		_, err = insertStmt.Exec(id, poet.String, poetry.String, contextBefore.String, contextAfter.String, verse.String, surah.String, tafsir.String, verseKey.String)
		if err != nil {
			log.Printf("failed to insert row %d: %v", id, err)
			continue
		}
		count++
	}

	log.Printf("✅ Migrated %d poems.", count)
}
