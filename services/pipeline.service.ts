import { pipeline, pipelines } from "../db"

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