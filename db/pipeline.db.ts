import { Prisma } from '@prisma/client'
import { prisma } from './'

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