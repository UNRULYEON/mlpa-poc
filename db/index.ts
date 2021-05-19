import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export { pipeline, pipelines, createPipelineInDb, pipelineStatus } from './pipeline.db'
export { configurationStatus } from './configuration.db'