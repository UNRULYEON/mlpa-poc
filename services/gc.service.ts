import { storage } from '@pulumi/gcp'

const createBucketName = (name: string): string => `${name}-artifacts`

const createBucket = (data: { name: string, project_id: string }) => {
  return new storage.Bucket(createBucketName(data.name), {
    project: data.project_id,
    location: 'EUROPE-WEST4'
  })
}

export const gc_createBucket = async (data: { name: string, project_id: string }) => {
  const bucket = createBucket(data)

  return { bucket_url: bucket.url }
}

export const gc_getBucket = async (data: { name: string, project_id: string }) => {
  const bucket = createBucket(data)

  return { bucket_url: bucket.url }
}

// disco-sky-312109