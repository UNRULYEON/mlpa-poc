import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export {
  pipeline,
  pipelines,
  createPipelineInDb,
  pipelineStatus,
  removePipeline,
  updatePipeline
} from './pipeline.db'

export {
  configurationStatus,
  currentPipelineConfiguration,
  createPipelineConfiguration,
  updatePipelineConfiguration
} from './configuration.db'

export {
  run,
  runs,
  newRun,
  updateRun
} from './run.db'