import express from "express";

import { getPipeline, getPipelines, postPipeline } from '../controllers'

const router = express.Router()

router.get('/pipeline/:id', getPipeline)
router.get('/pipelines', getPipelines)
router.post('/pipeline', postPipeline)

export default router