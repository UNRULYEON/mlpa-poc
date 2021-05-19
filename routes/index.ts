import express from "express";

import { getPipeline, getPipelines, postPipeline, getPipelineStatus, getPipelineConfigurationStatus } from '../controllers'

const router = express.Router()

router.get('/pipeline/:id', getPipeline)
router.get('/pipelines', getPipelines)
router.post('/pipeline', postPipeline)
router.get('/pipeline/:id/status', getPipelineStatus)
router.get('/pipeline/:id/config/status', getPipelineConfigurationStatus)

export default router