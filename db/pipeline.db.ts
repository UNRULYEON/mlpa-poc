import { Pipeline, Prisma } from '@prisma/client'
import { prisma } from './'
import { DTO_CreatePipeline } from '../DTO/pipeline'
import { ListPrivateCloudAdminCredentialsArgs } from '@pulumi/azure-native/avs'

export const pipeline = async (id: number) => {
  return await prisma.pipeline.findUnique({
    where: {
      id: id
    }
  })
}

export const pipelines = async () => {
  return await prisma.pipeline.findMany()
}

export const createPipelineInDb = async (data: DTO_CreatePipeline) => {
  return await prisma.pipeline.create({
    data: {
      name: data.name,
      project: data.project,
      platform: data.platform,
      project_id: data.project_id
    }
  })
}

export const pipelineStatus = async (id: number) => {
  return await prisma.pipeline.findUnique({
    where: {
      id: id
    },
    select: {
      status: true,
      Run: {
        orderBy: [
          {
            date: 'desc'
          }
        ],
        take: 1,
        select: {
          id: true,
          date: true
        }
      },
      platform: true,
    }
  })
}

export const removePipeline = async (id: number) => {
  return await prisma.pipeline.delete({
    where: {
      id: id
    }
  })
}

export const updatePipeline = async (id: number, data: Partial<Pipeline>) => {
  return await prisma.pipeline.update({
    where: {
      id: id
    },
    data: data
  })
}