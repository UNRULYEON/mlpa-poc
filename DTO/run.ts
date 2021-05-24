export type Runs = {
  id: number
  status: RunStatus
  name: string
  date: string
}[]

type RunStatus = 'RUNNING' | 'SUCCESS' | 'FAILED'