import { DTO_CreatePipeline } from "DTO/pipeline"
import { storage } from '@pulumi/gcp'
import { LocalWorkspace } from "@pulumi/pulumi/automation"
import { pipeline, pipelines, createPipelineInDb } from "../db"
import { azure_createBucket } from './azure.service'
import { gc_createBucket } from './gc.service'

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
      stackName: data.name,
      projectName: data.project,
      program: async () => {
        if (data.platform === 'GOOGLE') {
          gc_createBucket({ name: data.name, project_id: data.project_id })
        } else if (data.platform === 'AZURE') {
          azure_createBucket({ name: data.name, project: data.project })
        }
      }
    })

    const stack = await project_stack.up()

    return pipeline
  } catch (e) {
    throw new Error(e)
  }
}