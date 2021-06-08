import { Prisma } from '@prisma/client'
import { prisma } from './'

export const configurationStatus = async (id: number) => {
  return await prisma.pipelineConfiguration.findMany({
    where: {
      pipelineId: id
    },
    orderBy: [
      { date: 'desc' }
    ],
    select: {
      config: true,
      date: true
    }
  })
}

export const currentPipelineConfiguration = async (pipeline_id: number) => {
  return await prisma.pipelineConfiguration.findFirst({
    where: {
      pipelineId: pipeline_id
    },
    orderBy: [
      { date: 'desc' }
    ],
    select: {
      id: true,
      config: true
    }
  })
}

export const createPipelineConfiguration = async (pipeline_id: number, config: string) => {
  return await prisma.pipelineConfiguration.create({
    data: {
      config: config,
      pipeline: {
        connect: {
          id: pipeline_id
        }
      }
    }
  })
}

export const updatePipelineConfiguration = async (pipeline_id: number, config: string) => {
  return await prisma.pipelineConfiguration.update({
    where: {
      id: pipeline_id
    },
    data: {
      config: config,
      date: new Date()
    }
  })
}