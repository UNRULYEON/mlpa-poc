import express from "express";

import { getPipeline, getPipelines } from '../controllers'

const router = express.Router()

router.get('/pipeline/:id', getPipeline)
router.get('/pipelines', getPipelines)

export default router