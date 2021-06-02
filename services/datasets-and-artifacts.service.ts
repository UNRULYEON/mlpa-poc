import { LocalWorkspace } from "@pulumi/pulumi/automation"
import { pipeline } from "../db"
import { gc_uploadToBucket } from './gc.service'
import { azure_uploadToBucket } from './azure.service'
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