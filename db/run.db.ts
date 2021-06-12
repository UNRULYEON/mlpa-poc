import { Platform, Prisma, RunStatus } from '@prisma/client'
import { prisma } from './'
import { Run } from '@prisma/client'
import { truncateSync } from 'fs'

export const run = async (run_id: number) => {
  return await prisma.run.findUnique({
    where: {
      id: run_id
    },
    select: {
      id: true,
      name: true,
      date: true,
      config: true,
      status: true,
      pipeline: {
        select: {
          id: true,
          name: true,
          run: true,
          platform: true
        }
      }
    }
  })
}

export const runs = async (pipeline_id: number) => {
  return await prisma.pipeline.findUnique({
    where: {
      id: pipeline_id
    },
    select: {
      Run: true
    }
  })
}

export const newRun = async (pipeline_id: number, platform: Platform, name: string, status: RunStatus) => {
  const { configurations } = await prisma.pipeline.findUnique({
    where: {
      id: pipeline_id
    },
    select: {
      configurations: true
    }
  })

  configurations.sort((a, b) => {
    if (a.date < b.date) {
      return -1
    } else if (a.date > b.date) {
      return 1
    } else {
      return 0
    }
  })

  return await prisma.run.create({
    data: {
      output: '',
      platform: platform,
      name: name,
      status: status,
      pipeline: {
        connect: {
          id: pipeline_id
        }
      },
      config: {
        connect: {
          id: configurations[0].id
        }
      }
    },
  })
}

export const updateRun = async (run_id: number, data: Partial<Run>) => {
  return await prisma.run.update({
    where: {
      id: run_id
    },
    data: {
      ...data
    },
  })
}