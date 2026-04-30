/*
  Warnings:

  - Added the required column `schoolName` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operatorName" TEXT NOT NULL,
    "intervieweeName" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Assessment" ("date", "id", "intervieweeName", "operatorName") SELECT "date", "id", "intervieweeName", "operatorName" FROM "Assessment";
DROP TABLE "Assessment";
ALTER TABLE "new_Assessment" RENAME TO "Assessment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
