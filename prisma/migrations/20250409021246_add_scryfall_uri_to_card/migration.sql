/*
  Warnings:

  - Added the required column `scryfall_uri` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scryfall_uri" TEXT NOT NULL,
    "usd" TEXT,
    "usd_etched" TEXT,
    "usd_foil" TEXT,
    "img" TEXT
);
INSERT INTO "new_Card" ("id", "img", "name", "usd", "usd_etched", "usd_foil") SELECT "id", "img", "name", "usd", "usd_etched", "usd_foil" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
