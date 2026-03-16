-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- Creates User, SavedReview, Conversation if they don't exist

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_key" ON "User"("clerkId");

CREATE TABLE IF NOT EXISTS "SavedReview" (
    "id" TEXT NOT NULL,
    "userClerkId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Review',
    "code" TEXT,
    "language" TEXT,
    "reviewResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SavedReview_userClerkId_createdAt_idx" ON "SavedReview"("userClerkId", "createdAt");

CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL,
    "userClerkId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Conversation_userClerkId_createdAt_idx" ON "Conversation"("userClerkId", "createdAt");

-- Add FKs only if they don't exist (run once; ignore errors if already added)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedReview_userClerkId_fkey') THEN
    ALTER TABLE "SavedReview" ADD CONSTRAINT "SavedReview_userClerkId_fkey"
      FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Conversation_userClerkId_fkey') THEN
    ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userClerkId_fkey"
      FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
