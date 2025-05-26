-- name: CreateReport :exec
INSERT INTO reports (
    poem_id,edit,edit_by_id
) VALUES(
    ?,?,?
);

-- name: GetPoemById :one
SELECT * FROM poems WHERE id = ? LIMIT 1;

-- name: ListReports :many
SELECT * FROM reports WHERE checked=0;

-- name: GetPoemsRowByVerseKey :many
SELECT * FROM poems WHERE verse_key = ?;

-- name: GetPoemsRowByVerse :one
SELECT * FROM poems WHERE verse = ? LIMIT 1;

-- name: GetPoemRowByPoem :one
SELECT * FROM poems WHERE poetry = ? LIMIT 1; 

-- name: GetDistinctVerses :many
SELECT DISTINCT verse FROM poems;

-- name: GetDistinctPoems :many
SELECT DISTINCT poetry FROM poems;

-- name: GetDistinctPoets :many
SELECT DISTINCT poet FROM poems;

-- name: GetDistinctSources :many
SELECT DISTINCT tafsir FROM poems;
