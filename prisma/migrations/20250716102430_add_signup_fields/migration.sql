/*
  Warnings:

  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactRelationship` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "bloodType" TEXT NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhone" TEXT NOT NULL,
ADD COLUMN     "emergencyContactRelationship" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL;
