import { RouteFunction } from './'
import {
  uploadData,
  fetchBucketFiles,
  fetchFile
} from '../services'
import { fileType } from 'DTO/datasets-and-artifacts'

type File = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export const upload: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)
  const files: File[] = (req as any).files

  const payload: fileType[] = files.map(file => {
    return {
      name: file.originalname,
      type: file.mimetype,
      path: `${file.destination}/${file.filename}`
    }
  })

  try {
    await uploadData(id, payload)

    return res.status(200).json({})
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getBucketFiles: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const files = await fetchBucketFiles(id)

    return res.status(200).json(files)
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const getFile: RouteFunction = async (req, res) => {
  const id = Number(req.params.id)
  const filename = req.params.filename

  try {
    const file = await fetchFile(id, filename)

    return res.set('Content-disposition', `attachment; filename=${filename}`).type(file.content_type).send(file.buffer)
  } catch (e) {
    return res.status(500).json(e)
  }
}