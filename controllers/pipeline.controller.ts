import { DTO_CreatePipeline, DTO_PipelineConfigurationStatus } from 'DTO/pipeline'
import { RouteFunction } from './'
import {
  fetchPipeline,
  fetchPipelines,
  createPipeline,
  fetchPipelineStatus,
  fetchPipelineConfigurationStatus,
  fetchPipelineArtifactsBucketStatus,
  deletePipelineInDb
} from '../services'

export const getPipeline: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const pipeline = await fetchPipeline(id)

    if (pipeline) {
      res.json(pipeline)
    } else {
      res.status(404).end()
    }
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getPipelines: RouteFunction = async (req, res) => {
  try {
    const pipelines = await fetchPipelines()
    return res.json(pipelines)
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const postPipeline: RouteFunction = async (req, res) => {
  const data: DTO_CreatePipeline = req.body

  const pipeline = await createPipeline(data)

  return res.status(201).json(pipeline)
}

export const getPipelineStatus: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const pipelineStatus = await fetchPipelineStatus(id)

    if (pipelineStatus) {
      res.json(pipelineStatus)
    } else {
      res.status(404).end()
    }
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getPipelineConfigurationStatus: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const pipelineConfigStatus = await fetchPipelineConfigurationStatus(id)
    const payload: DTO_PipelineConfigurationStatus = pipelineConfigStatus.length > 0 ? {
      status: pipelineConfigStatus[0].config.length > 0 ? 'VALID' : 'INVALID',
      date: pipelineConfigStatus[0].date.toUTCString(),
    } : {
      status: 'INVALID',
      date: '-'
    }

    res.json(payload)
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getPipelineDatasetAndArtifactsStatus: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const pipelineDatasetAndArtifactsStatus = await fetchPipelineArtifactsBucketStatus(id)

    res.json(pipelineDatasetAndArtifactsStatus)
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const deletePipeline: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)

  try {
    await deletePipelineInDb(id)
    return res.send(200)
  } catch (e) {
    return res.status(500).json(e)
  }
}