/*
  Warnings:

  - You are about to drop the column `img_large` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `img_normal` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `img_small` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `mana_cost` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `multiverse_id` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `oracle_text` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `prints_search_uri` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `img_large` on the `CardFace` table. All the data in the column will be lost.
  - You are about to drop the column `img_normal` on the `CardFace` table. All the data in the column will be lost.
  - You are about to drop the column `img_small` on the `CardFace` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "usd" TEXT,
    "usd_etched" TEXT,
    "usd_foil" TEXT,
    "img" TEXT
);
INSERT INTO "new_Card" ("id", "name", "usd", "usd_etched", "usd_foil") SELECT "id", "name", "usd", "usd_etched", "usd_foil" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE TABLE "new_CardFace" (
    "id" TEXT NOT NULL,
    "face_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,

    PRIMARY KEY ("id", "face_number"),
    CONSTRAINT "CardFace_id_fkey" FOREIGN KEY ("id") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardFace" ("face_number", "id", "name") SELECT "face_number", "id", "name" FROM "CardFace";
DROP TABLE "CardFace";
ALTER TABLE "new_CardFace" RENAME TO "CardFace";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
