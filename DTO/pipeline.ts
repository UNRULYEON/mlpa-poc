export type DTO_CreatePipeline = {
  name: string
  project: string
  project_id: string
  platform: Platform
}

export type Platform = 'AZURE' | 'GOOGLE'