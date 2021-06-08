// import { storage } from '@pulumi/gcp'
import { Storage, GetBucketResponse } from '@google-cloud/storage'
import { fileType } from '../DTO/datasets-and-artifacts'
import { DTO_PipelineDatasetsAndArtifactsFile } from '../DTO/datasets-and-artifacts'
import fs from 'fs'

const gc_storage = new Storage()

const createBucketName = (name: string): string => `${name}-artifacts`

export const gc_createBucket = async (data: { name: string, project_id: string }) => {
  const storage = new Storage()

  return await storage.createBucket(createBucketName(data.name), {
    location: 'EUROPE-WEST4'
  })
}

export const gc_getBucket = async (data: { name: string, project_id: string }) => {
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  const bucket: GetBucketResponse = await gc_bucket.get()

  return `gs://${bucket[0].id}`
}

export const gc_uploadToBucket = async (data: { name: string, project_id: string }, files: fileType[]) => {
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  console.log(`Uploading to bucket: ${gc_bucket.name}`)

  files.map(file => {
    gc_bucket.upload(file.path, { destination: file.name, public: true })
      .then(r => console.log('done uploading'))
      .catch(e => console.log(e))
  })

  return {}
}

export const gc_getBucketFiles = async (name: string) => {
  const gc_bucket = gc_storage.bucket(createBucketName(name))

  const bucket_files = await gc_bucket.getFiles()

  const files: DTO_PipelineDatasetsAndArtifactsFile[] = bucket_files[0].map(file => {
    const f = gc_bucket.file(file.name)

    return ({
      name: file.name,
      download_id: file.name,
      content_type: file.metadata.contentType as string,
      size: file.metadata.size as string
    })
  })

  return files
}

export const gc_downloadFile = async (name: string, file_name: string) => {
  const gc_bucket = gc_storage.bucket(createBucketName(name))
  const bucket_file = gc_bucket.file(file_name)

  const [arrayBuffer] = await bucket_file.download()

  const file = Buffer.from(arrayBuffer)

  return { buffer: file, content_type: bucket_file.metadata.contentType }
}

// disco-sky-312109