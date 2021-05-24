import express from "express";

import {
  getPipeline,
  getPipelines,
  postPipeline,
  getPipelineStatus,
  getPipelineConfigurationStatus,
  getPipelineDatasetAndArtifactsStatus,
  deletePipeline,
  getRun,
  getRuns
} from '../controllers'

const router = express.Router()

router.get('/pipeline/:id', getPipeline)
router.get('/pipelines', getPipelines)
router.post('/pipeline', postPipeline)
router.get('/pipeline/:id/status', getPipelineStatus)
router.get('/pipeline/:id/config/status', getPipelineConfigurationStatus)
router.get('/pipeline/:id/dataset-and-artifacts/status', getPipelineDatasetAndArtifactsStatus)
router.delete('/pipeline/:id', deletePipeline)

router.get('/run/:id', getRun)
router.get('/pipeline/:id/runs', getRuns)


export default router