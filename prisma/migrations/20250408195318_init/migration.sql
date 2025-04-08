-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "multiverse_id" INTEGER,
    "prints_search_uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mana_cost" TEXT NOT NULL,
    "oracle_text" TEXT,
    "usd" TEXT,
    "usd_etched" TEXT,
    "usd_foil" TEXT,
    "img_large" TEXT,
    "img_normal" TEXT,
    "img_small" TEXT
);

-- CreateTable
CREATE TABLE "CardFace" (
    "id" TEXT NOT NULL,
    "face_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "img_large" TEXT,
    "img_normal" TEXT,
    "img_small" TEXT,

    PRIMARY KEY ("id", "face_number"),
    CONSTRAINT "CardFace_id_fkey" FOREIGN KEY ("id") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
