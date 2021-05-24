import { run, runs } from '../db'

export const fetchRun = async (id: number) => {
  try {
    return await run(id)
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchRuns = async (id: number) => {
  try {
    return await runs(id)
  } catch (e) {
    throw new Error(e)
  }
}