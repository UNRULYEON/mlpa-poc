import { Request, Response, NextFunction } from 'express'
import { fetchPipeline, fetchPipelines } from '../services'

type RouteFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>

export const getPipeline: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const pipeline = await fetchPipeline(id)

    if (pipeline) {
      res.json(pipeline)
    } else {
      res.status(404).end()
    }
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getPipelines: RouteFunction = async (req, res, next) => {
  try {
    const pipelines = await fetchPipelines()
    return res.json(pipelines)
  } catch (e) {
    return res.status(500).json(e)
  }
}