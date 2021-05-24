import { RouteFunction } from './'
import {
  fetchRun,
  fetchRuns
} from '../services'

export const getRun: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const run = await fetchRun(id)

    if (run) {
      res.json(run)
    } else {
      res.status(404).end()
    }
  } catch (e) {
    return res.status(500).json(e)
  }
}


export const getRuns: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const { Run } = await fetchRuns(id)

    res.json(Run)
  } catch (e) {
    return res.status(500).json(e)
  }
}
