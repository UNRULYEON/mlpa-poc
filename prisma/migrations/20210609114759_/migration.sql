/*
  Warnings:

  - The values [SUCCESS,FAILED] on the enum `RunStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RunStatus_new" AS ENUM ('PROVISIONING', 'STAGING', 'RUNNING', 'STOPPING', 'TERMINATED');
ALTER TABLE "Run" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Run" ALTER COLUMN "status" TYPE "RunStatus_new" USING ("status"::text::"RunStatus_new");
ALTER TYPE "RunStatus" RENAME TO "RunStatus_old";
ALTER TYPE "RunStatus_new" RENAME TO "RunStatus";
DROP TYPE "RunStatus_old";
ALTER TABLE "Run" ALTER COLUMN "status" SET DEFAULT 'RUNNING';
COMMIT;

-- AlterTable
ALTER TABLE "Pipeline" ALTER COLUMN "run" SET DEFAULT 0;
