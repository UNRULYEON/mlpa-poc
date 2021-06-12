import express from "express"
import multer from 'multer'

import {
  getPipeline,
  getPipelines,
  postPipeline,
  getPipelineStatus,
  getPipelineConfigurationStatus,
  getPipelineDatasetAndArtifactsStatus,
  deletePipeline,
  getRun,
  getRuns,
  upload,
  getPipelineConfiguration,
  savePipelineConfiguration,
  getBucketFiles,
  getFile,
  startPipeline,
  // getSerialPortOutput
  getRunUpdate,
  stopPipelineRun
} from '../controllers'

const router = express.Router()
const uploadMulter = multer({ dest: './temp' })

router.get('/pipeline/:id', getPipeline)
router.get('/pipelines', getPipelines)
router.post('/pipeline', postPipeline)
router.get('/pipeline/:id/status', getPipelineStatus)
router.delete('/pipeline/:id', deletePipeline)
router.get('/pipeline/:id/start', startPipeline)

router.get('/run/:id', getRun)
router.get('/pipeline/:id/runs', getRuns)
router.get('/pipeline/:id/update', getRunUpdate)
router.get('/pipeline/:id/terminate', stopPipelineRun)

router.get('/pipeline/:id/dataset-and-artifacts/status', getPipelineDatasetAndArtifactsStatus)
router.post('/pipeline/:id/dataset-and-artifacts/upload', uploadMulter.any(), upload)
router.get('/pipeline/:id/dataset-and-artifacts/files', getBucketFiles)
router.get('/pipeline/:id/dataset-and-artifacts/file/:filename', getFile)

router.get('/pipeline/:id/config/status', getPipelineConfigurationStatus)
router.get('/pipeline/:id/configuration', getPipelineConfiguration)
router.post('/pipeline/:id/configuration', savePipelineConfiguration)

export default router