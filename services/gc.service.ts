import { storage } from '@pulumi/gcp'

export const gc_createBucket = async (data: { name: string, project_id: string }) => {
  const bucket = new storage.Bucket(`${data.name}-artifacts`, {
    project: data.project_id,
    location: 'EUROPE-WEST4'
  })

  return { bucket_url: bucket.url }
}