/*
  Warnings:

  - You are about to drop the column `pix_key` on the `ideas` table. All the data in the column will be lost.
  - Added the required column `payment_link` to the `ideas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_link_id` to the `ideas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ideas` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ideas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "payment_link_id" TEXT NOT NULL,
    "payment_link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ideas" ("description", "email", "id", "title") SELECT "description", "email", "id", "title" FROM "ideas";
DROP TABLE "ideas";
ALTER TABLE "new_ideas" RENAME TO "ideas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
