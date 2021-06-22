import { sum } from './hello'
import fetch from "jest-fetch-mock"


describe('API', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  it('gets all the pipelines', () => {
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'pipeline-name', platform: 'GOOGLE', project: 'my-project', project_id: '', run: 0, status: 'IDLE' }]))

    fetch()
  })
})
