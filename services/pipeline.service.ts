import { DTO_CreatePipeline } from "DTO/pipeline"
import { pipeline, pipelines, createPipelineInDb, pipelineStatus, configurationStatus, removePipeline, runs, updateRun, run } from "../db"
import { azure_createBucket, azure_createResourceGroup, azure_getBucket } from './azure.service'
import { gc_createBucket, gc_getBucket, gc_getRunStatus, gc_startPipeline, gc_stopRun } from './gc.service'

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

export const runPipeline = async (id: number) => {
  try {
    const p = await pipeline(id)

    if (p.platform === 'GOOGLE') {
      return await gc_startPipeline(p.id, p.name, p.run + 1)
    } else if (p.platform === 'AZURE') {
    }
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export const fetchRunStatus = async (id: number) => {
  try {
    const r = await run(id)

    if (r.pipeline.platform === 'GOOGLE') {
      return await gc_getRunStatus(r.pipeline.name, r.pipeline.run, r.id)
    } else if (r.pipeline.platform === 'AZURE') {
    }
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export const stopRun = async (id: number) => {
  try {
    const r = await run(id)

    if (r.pipeline.platform === 'GOOGLE') {
      return await gc_stopRun(r.pipeline.name, r.pipeline.run, r.id)
    } else if (r.pipeline.platform === 'AZURE') {
    }
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

// export const fetchSerialOutput = async (id: number) => {
//   try {
//     const p = await pipeline(id)
//     const { Run } = await runs(p.id)

//     const output = await gc_getSerialPortOutput(p.name, p.run)

//     await updateRun(Run[0].id, {
//       output: output[1].contents
//     })

//     return output[1].contents
//   } catch (e) {
//     console.log(e)
//     throw new Error(e)
//   }
// }