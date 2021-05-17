-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('AZURE', 'GOOGLE', 'AWS');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('DATASET', 'MODEL');

-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('IDLE', 'RUNNING', 'ERROR');

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "status" "PipelineStatus" NOT NULL DEFAULT E'IDLE',
    "platform" "Platform" NOT NULL,
    "project_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineConfiguration" (
    "id" SERIAL NOT NULL,
    "config" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pipelineId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RunStatus" NOT NULL DEFAULT E'RUNNING',
    "output" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "pipelineId" INTEGER NOT NULL,
    "pipelineConfigurationId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "artifactId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunArtifacts" (
    "runId" INTEGER NOT NULL,
    "artifactId" INTEGER NOT NULL,
    "generated_by_run" BOOLEAN NOT NULL,

    PRIMARY KEY ("runId","artifactId")
);

-- AddForeignKey
ALTER TABLE "PipelineConfiguration" ADD FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD FOREIGN KEY ("pipelineConfigurationId") REFERENCES "PipelineConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunArtifacts" ADD FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunArtifacts" ADD FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
