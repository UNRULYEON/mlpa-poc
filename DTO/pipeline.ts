export type DTO_CreatePipeline = {
  name: string
  project: string
  project_id: string
  platform: Platform
}

export type DTO_PipelineDetails = {
  name: string
  project: string
  status: PipelineStatus
  platform: Platform
  project_id: string
}

export type DTO_PipelineStatus = {
  status: PipelineStatus
  Run: []
  platform: Platform
}

export type DTO_PipelineConfigurationStatus = {
  status: PipelineConfigurationStatus
  date: string
}

export type DTO_PipelineDatasetsAndArtifactsStatus = {
  deployed: boolean
  endpoint: string
}

export type Platform = 'AZURE' | 'GOOGLE'

export type PipelineStatus = 'IDLE' | 'RUNNING' | 'ERROR'

export type PipelineConfigurationStatus = 'INVALID' | 'VALID'