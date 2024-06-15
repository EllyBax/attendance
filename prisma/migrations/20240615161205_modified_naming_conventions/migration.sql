/*
  Warnings:

  - Changed the type of `date` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Teacher_id_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
CREATE SEQUENCE teacher_id_seq;
ALTER TABLE "Teacher" ALTER COLUMN "id" SET DEFAULT nextval('teacher_id_seq');
ALTER SEQUENCE teacher_id_seq OWNED BY "Teacher"."id";
