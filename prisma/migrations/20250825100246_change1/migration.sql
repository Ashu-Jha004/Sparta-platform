-- CreateEnum
CREATE TYPE "public"."gender" AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "public"."CommunicationMethod" AS ENUM ('email', 'app');

-- CreateTable
CREATE TABLE "public"."AthleteProfile" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "athleticName" VARCHAR(30),
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."gender",
    "profilePhotoUrl" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT NOT NULL,
    "primarySport" TEXT NOT NULL,
    "otherSports" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" VARCHAR(500),
    "socialLinks" JSONB,
    "website" TEXT,
    "preferredCommunication" "public"."CommunicationMethod" NOT NULL,
    "shortTermGoals" VARCHAR(300),
    "longTermAspirations" VARCHAR(500),
    "openToTeams" BOOLEAN NOT NULL,
    "privacyConsent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AthleteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AthleteProfile_clerkUserId_key" ON "public"."AthleteProfile"("clerkUserId");

-- CreateIndex
CREATE INDEX "AthleteProfile_clerkUserId_idx" ON "public"."AthleteProfile"("clerkUserId");
