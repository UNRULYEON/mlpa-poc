import { Prisma } from '@prisma/client'
import { prisma } from './'

export const run = async (run_id: number) => {
  return await prisma.run.findUnique({
    where: {
      id: run_id
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