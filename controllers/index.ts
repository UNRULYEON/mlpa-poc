import { Request, Response, NextFunction } from 'express'

export type RouteFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>

export {
  getPipeline,
  getPipelines,
  postPipeline,
  getPipelineStatus,
  getPipelineConfigurationStatus,
  getPipelineDatasetAndArtifactsStatus,
  deletePipeline
} from './pipeline.controller'

export {
  getRun,
  getRuns
} from './run.controller'

export {
  upload,
  getBucketFiles,
  getFile
} from './datasets-and-artifacts.controller'

export {
  getPipelineConfiguration,
  savePipelineConfiguration,
} from './configuration.controller'