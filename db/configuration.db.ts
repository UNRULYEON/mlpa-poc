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