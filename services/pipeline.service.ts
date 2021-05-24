import { DTO_CreatePipeline } from "DTO/pipeline"
import { LocalWorkspace } from "@pulumi/pulumi/automation"
import { pipeline, pipelines, createPipelineInDb, pipelineStatus, configurationStatus, removePipeline } from "../db"
import { azure_createBucket, azure_getBucket } from './azure.service'
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

    let project_stack = await LocalWorkspace.createOrSelectStack({
      stackName: `${data.name}-bucket`,
      projectName: data.project,
      program: async () => {
        if (data.platform === 'GOOGLE') {
          gc_createBucket({ name: data.name, project_id: data.project_id })
        } else if (data.platform === 'AZURE') {
          azure_createBucket({ name: data.name, project: data.project })
        }
      }
    })

    await project_stack.up({ onOutput: console.log })

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

    let project_stack = await LocalWorkspace.createOrSelectStack({
      stackName: `${p.name}-bucket`,
      projectName: p.project,
      program: async () => {
        if (p.platform === 'GOOGLE') {
          return gc_getBucket({ name: p.name, project_id: p.project_id })
        } else if (p.platform === 'AZURE') {
          return azure_getBucket({ name: p.name, project: p.project })
        }
      }
    })

    const stack = await project_stack.up({ onOutput: console.log })

    return { deployed: true, endpoint: stack.outputs.bucket_url.value }
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