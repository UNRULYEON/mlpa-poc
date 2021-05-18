import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export { pipeline, pipelines, createPipelineInDb } from './pipeline.db'