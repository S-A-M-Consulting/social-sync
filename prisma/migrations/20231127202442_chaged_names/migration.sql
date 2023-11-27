/*
  Warnings:

  - You are about to drop the `AvailabilityTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailabilityTemplate" DROP CONSTRAINT "AvailabilityTemplate_userId_fkey";

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "recurringTemplateId" INTEGER;

-- DropTable
DROP TABLE "AvailabilityTemplate";

-- CreateTable
CREATE TABLE "RecurringTemplate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "morning" BOOLEAN NOT NULL,
    "afternoon" BOOLEAN NOT NULL,
    "evening" BOOLEAN NOT NULL,
    "lateNight" BOOLEAN NOT NULL,

    CONSTRAINT "RecurringTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_recurringTemplateId_fkey" FOREIGN KEY ("recurringTemplateId") REFERENCES "RecurringTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTemplate" ADD CONSTRAINT "RecurringTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
