-- CreateEnum
CREATE TYPE "UserIntent" AS ENUM ('PLAYER', 'RECRUITER');

-- CreateEnum
CREATE TYPE "RecruiterRole" AS ENUM ('MANAGER', 'COACH', 'ANALYST');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('MIX', 'STACK', 'TEAM');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "intent" "UserIntent";

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN "openToOrganizations" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "RecruiterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RecruiterRole" NOT NULL,
    "displayName" TEXT NOT NULL,
    "contacts" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruiterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationProfile" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "name" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "targetEloMin" INTEGER NOT NULL,
    "targetEloMax" INTEGER NOT NULL,
    "neededRoles" TEXT[],
    "languages" TEXT[],
    "description" TEXT NOT NULL,
    "isRecruiting" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "ProfileVisibility" NOT NULL DEFAULT 'VISIBLE',
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamApplication" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterProfile_userId_key" ON "RecruiterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationProfile_ownerUserId_key" ON "OrganizationProfile"("ownerUserId");

-- CreateIndex
CREATE INDEX "OrganizationProfile_game_region_isRecruiting_visibility_mod_idx" ON "OrganizationProfile"("game", "region", "isRecruiting", "visibility", "moderationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "TeamApplication_organizationId_playerProfileId_key" ON "TeamApplication"("organizationId", "playerProfileId");

-- CreateIndex
CREATE INDEX "TeamApplication_organizationId_status_idx" ON "TeamApplication"("organizationId", "status");

-- CreateIndex
CREATE INDEX "TeamApplication_playerProfileId_status_idx" ON "TeamApplication"("playerProfileId", "status");

-- AddForeignKey
ALTER TABLE "RecruiterProfile" ADD CONSTRAINT "RecruiterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamApplication" ADD CONSTRAINT "TeamApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamApplication" ADD CONSTRAINT "TeamApplication_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
