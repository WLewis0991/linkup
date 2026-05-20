/*
  Warnings:

  - Made the column `avatar` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://rhjxqgkffelxklsgfwdw.supabase.co/storage/v1/object/public/avatars/831e5af2-f838-483f-8970-15455e6f1001/avatar.png';
