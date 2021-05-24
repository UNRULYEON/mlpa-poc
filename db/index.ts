import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export {
  pipeline,
  pipelines,
  createPipelineInDb,
  pipelineStatus,
  removePipeline
} from './pipeline.db'

export {
  configurationStatus
} from './configuration.db'

export {
  run,
  runs
} from './run.db'