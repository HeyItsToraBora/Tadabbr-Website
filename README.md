# Tadabbr

**Tadabbr** is a web application that allows users to explore and search Arabic poetry cited in classical Quranic tafsir (exegesis). It provides a clean and intuitive interface to discover how early scholars used poetry to explain and contextualize Quranic verses.

## Features

- **Search by keyword, poet name, or Quranic verse**
- **Browse poems linked to specific Surahs and Ayahs**
- **View poetic citations in their original tafsir context**
- **Backed by a structured database of verse-linked poetry**

## Purpose

Classical Islamic scholars often used pre-Islamic and early Islamic poetry to clarify linguistic meanings and rhetorical structures in the Quran. **Tadabbr** makes these references searchable and accessible, helping researchers, students, and enthusiasts explore the rich interplay between Quranic interpretation and Arabic poetic tradition.

## Data Source

Check: https://github.com/Tadabbr/Tadabbr-Scraper

The poetry is extracted from publicly available tafsir texts and organized into a searchable database. The project focuses on presenting this content without tying it to a specific publisher or website.

---

**Tadabbr** is built for exploration, reflection, and deepening appreciation of the literary and interpretive traditions that surround the Quran.

## TODOs

- A way to authenticate admins []
- an endpoint for approving reports (edits the poetry db) []
## Documentation 

---

## POST `/suggest`

Provides fuzzy search-based suggestions for either **ayat** (verses) or **poet** (poetry) queries.

### Request Body

```json
{
  "query": "string",  // the text to search for
  "type": "ayat" | "poem" // the type of search
}
```

### Response

```json
{
  "possibles": [
    {
      "text": "string",       // the matched text
      "match": number,        // match distance (lower is better)
      "surahkey": "string",   // verse key (e.g., "2:255")
      "surah": "string",      // name of the surah
      "id": number,           // internal ID of the matched entry
      "poem": "string|null"   // poet name (if applicable)
    },
    ...
  ]
}
```

### Description

- Uses fuzzy matching to rank the most relevant matches for the given query.
- Returns up to **5 top matches**.
- If `type` is `ayat`, it searches within Quranic verses.
- If `type` is `poet`, it searches within poetry texts.
- Errors during DB access or fuzzy search are logged but not exposed in the response.

---

## POST `/search`

Fetches all entries with a specific verse key.

### Request Body

```json
{
  "key": "string" // the verse_key to search for, e.g., "2:255"
}
```

### Response

```json
{
  "responses": [
    {
      "id": number,
      "verse": "string",
      "verse_key": "string",
      "poetry": "string",
      "surah": "string",
      "poem": "string|null",
      // other fields defined in the Poetry model
    },
    ...
  ]
}
```

### Description

- Performs an exact match lookup on the `verse_key` field.
- Returns all poetry rows that have the matching key.
- Errors during DB operations are logged and return a 500 response if necessary.

---

## POST `/report/add`

Submits a new user report for a poem edit.

### Request Body

```json
{
  "id": number,     // ID of the poem being reported
  "edit": "string"  // The proposed edit text
}
```

### Response

- `200 OK` – Report submitted successfully.
- `404 Not Found` – Error during report insertion.

### Description

- Creates a new report for the given `poem_id`.
- `checked` is set to `false` by default.
- `edit_by` is set to `null` (anonymous submission).
- Internal errors are logged, but not exposed to clients.

---

## GET `/report/all`

Fetches all submitted reports along with associated poem data.

### Response

```json
{
  "reports": [
    {
      "poem": "string",        // Original poem text
      "poemid": number,        // Poem ID
      "surahkey": "string",    // Quranic verse key (e.g., "2:255")
      "editor": "string|null", // Editor username if available
      "edit": "string",        // Proposed edit
      "checked": boolean       // Whether the report has been reviewed
    }
  ]
}
```

### Description

- Retrieves all reports from the database.
- Joins each report with its related poem using `poem_id`.
- Skips any reports whose poem is not found, logging the error internally.
- Returns a full array of report objects with contextual information.
