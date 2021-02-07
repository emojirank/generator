CREATE TABLE IF NOT EXISTS "votes" (
	"unicode_value"	TEXT NOT NULL,
	"vendor_name"	TEXT NOT NULL,
	"vote"	INTEGER NOT NULL,
	"user"	TEXT NOT NULL,
	"date"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "glyphs" (
	"unicode_line"	INTEGER NOT NULL,
	"unicode_value"	TEXT NOT NULL,
	"vendor_name"	TEXT NOT NULL,
	"emoji_name"	TEXT NOT NULL
);
