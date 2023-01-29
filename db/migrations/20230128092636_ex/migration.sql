/*
  Warnings:

  - Added the required column `payed` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Insurance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hopperId" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    CONSTRAINT "Insurance_hopperId_fkey" FOREIGN KEY ("hopperId") REFERENCES "Hopper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hopperId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "payed" BOOLEAN NOT NULL,
    CONSTRAINT "Payment_hopperId_fkey" FOREIGN KEY ("hopperId") REFERENCES "Hopper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("hopperId", "id", "month", "year") SELECT "hopperId", "id", "month", "year" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
