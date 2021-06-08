import { pipeline } from "../db"
import { gc_uploadToBucket, gc_getBucketFiles, gc_downloadFile } from './gc.service'
import { azure_downloadFile, azure_getBucketFiles, azure_uploadToBucket } from './azure.service'
import { fileType } from 'DTO/datasets-and-artifacts'

export const uploadData = async (id: number, files: fileType[]) => {
  try {
    const p = await pipeline(id)

    if (p.platform === 'GOOGLE') {
      await gc_uploadToBucket({ name: p.name, project_id: p.project_id }, files)
    } else if (p.platform === 'AZURE') {
      await azure_uploadToBucket({ name: p.name, project: p.project }, files)
    }

    return {}
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchBucketFiles = async (pipeline_id: number) => {
  try {
    const p = await pipeline(pipeline_id)

    if (p.platform === 'GOOGLE') {
      return await gc_getBucketFiles(p.name)
    } else if (p.platform === 'AZURE') {
      return await azure_getBucketFiles(p.name)
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchFile = async (pipeline_id: number, filename: string) => {
  try {
    const p = await pipeline(pipeline_id)

    if (p.platform === 'GOOGLE') {
      return await gc_downloadFile(p.name, filename)
    } else {
      return await azure_downloadFile(p.name, filename)
    }
  } catch (e) {
    throw new Error(e)
  }
}