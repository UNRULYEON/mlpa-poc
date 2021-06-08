import { currentPipelineConfiguration, createPipelineConfiguration, updatePipelineConfiguration } from '../db'

export const fetchPipelineConfiguration = async (pipeline_id: number) => {
  try {
    return await currentPipelineConfiguration(pipeline_id)
  } catch (e) {
    throw new Error(e)
  }
}

export const createNewPipelineConfiguration = async (pipeline_id: number, config: string) => {
  try {
    return await createPipelineConfiguration(pipeline_id, config)
  } catch (e) {
    throw new Error(e)
  }
}

export const updateExistingPipelineConfiguration = async (pipeline_id: number, config: string) => {
  try {
    return await updatePipelineConfiguration(pipeline_id, config)
  } catch (e) {
    throw new Error(e)
  }
}