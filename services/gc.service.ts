// import { storage } from '@pulumi/gcp'
import { Storage, GetBucketResponse } from '@google-cloud/storage'
import { fileType } from '../DTO/datasets-and-artifacts'

const createBucketName = (name: string): string => `${name}-artifacts`

export const gc_createBucket = async (data: { name: string, project_id: string }) => {
  const storage = new Storage()

  return await storage.createBucket(createBucketName(data.name), {
    location: 'EUROPE-WEST4'
  })
}

export const gc_getBucket = async (data: { name: string, project_id: string }) => {
  const gc_storage = new Storage()
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  const bucket: GetBucketResponse = await gc_bucket.get()

  return `gs://${bucket[0].id}`
}

export const gc_uploadToBucket = async (data: { name: string, project_id: string }, files: fileType[]) => {
  const gc_storage = new Storage()
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  console.log(`Uploading to bucket: ${gc_bucket.name}`)

  files.map(file => {
    gc_bucket.upload(file.path, { destination: file.name })
      .then(r => console.log('done uploading'))
      .catch(e => console.log(e))
  })

  return {}
}

// disco-sky-312109