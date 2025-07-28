package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	_ "modernc.org/sqlite"
)

type ImlaeiVerse struct {
	Text string `json:"text"`
}

func main() {
	// Open the database
	db, err := sql.Open("sqlite", "./db/database.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	// Read Imlaei.json
	jsonFile, err := os.Open("../Tadabbr-Frontend/Quran/Imlaei.json")
	if err != nil {
		log.Fatalf("Failed to open Imlaei.json: %v", err)
	}
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var versesMap map[string]ImlaeiVerse
	if err := json.Unmarshal(byteValue, &versesMap); err != nil {
		log.Fatalf("Failed to parse Imlaei.json: %v", err)
	}

	insertStmt, err := db.Prepare(`INSERT OR IGNORE INTO verses (surah, verse, text) VALUES (?, ?, ?)`)
	if err != nil {
		log.Fatalf("Failed to prepare insert statement: %v", err)
	}
	defer insertStmt.Close()

	count := 0
	for key, verse := range versesMap {
		var surah, ayah int
		_, err := fmt.Sscanf(key, "%d:%d", &surah, &ayah)
		if err != nil {
			log.Printf("Skipping invalid key: %s", key)
			continue
		}
		_, err = insertStmt.Exec(surah, ayah, verse.Text)
		if err != nil {
			log.Printf("Failed to insert %s: %v", key, err)
			continue
		}
		count++
	}
	log.Printf("✅ Migrated %d verses from Imlaei.json to the database!", count)
} 