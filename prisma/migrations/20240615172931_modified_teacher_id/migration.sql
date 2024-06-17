/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");
