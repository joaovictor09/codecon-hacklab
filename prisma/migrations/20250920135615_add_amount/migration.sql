-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ideas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "current_amount" DECIMAL NOT NULL DEFAULT 0,
    "payment_link_id" TEXT NOT NULL,
    "payment_link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ideas" ("createdAt", "description", "email", "id", "payment_link", "payment_link_id", "title", "updatedAt") SELECT "createdAt", "description", "email", "id", "payment_link", "payment_link_id", "title", "updatedAt" FROM "ideas";
DROP TABLE "ideas";
ALTER TABLE "new_ideas" RENAME TO "ideas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
