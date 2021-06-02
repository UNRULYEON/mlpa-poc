import { RouteFunction } from './'
import {
  uploadData
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
