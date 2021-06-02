import { DTO_CreatePipeline } from "DTO/pipeline"
import { pipeline, pipelines, createPipelineInDb, pipelineStatus, configurationStatus, removePipeline } from "../db"
import { azure_createBucket, azure_createResourceGroup, azure_getBucket } from './azure.service'
import { gc_createBucket, gc_getBucket } from './gc.service'

export const fetchPipeline = async (id: number) => {
  try {
    return await pipeline(id)
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchPipelines = async () => {
  try {
    return await pipelines()
  } catch (e) {
    throw new Error(e)
  }
}

export const createPipeline = async (data: DTO_CreatePipeline) => {
  try {

    const pipeline = await createPipelineInDb(data)
    if (data.platform === 'GOOGLE') {
      await gc_createBucket({ name: data.name, project_id: data.project_id })
    } else if (data.platform === 'AZURE') {
      await azure_createResourceGroup({ name: data.name, project: data.project })
      await azure_createBucket({ name: data.name, project: data.project })
    }

    return pipeline
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchPipelineStatus = async (id: number) => {
  try {
    return await pipelineStatus(id)
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchPipelineConfigurationStatus = async (id: number) => {
  try {
    return await configurationStatus(id)
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchPipelineArtifactsBucketStatus = async (id: number) => {
  try {
    const p = await pipeline(id)

    let bucket_url = ''

    if (p.platform === 'GOOGLE') {
      bucket_url = await gc_getBucket({ name: p.name, project_id: p.project_id })
    } else if (p.platform === 'AZURE') {
      bucket_url = await azure_getBucket({ name: p.name, project: p.project })
    }

    return { deployed: bucket_url.length > 0 ? true : false, endpoint: bucket_url }
  } catch (e) {
    throw new Error(e)
  }
}

export const deletePipelineInDb = async (id: number) => {
  try {
    return await removePipeline(id)
  } catch (e) {
    throw new Error(e)
  }
}