import { RouteFunction } from './'
import { fetchPipelineConfiguration, createNewPipelineConfiguration, updateExistingPipelineConfiguration } from '../services'
import { DTO_PipelineConfiguration } from '../DTO/configuration'

const defaultConfig = `import pickle

# S1 - Data ingestion


# S2 - Data validation


# S3 - Data preprocessing
X_train, X_validation, Y_train, Y_validation = train_test_split(X, y, test_size=0.20, random_state=1)


# S4-S5 - Model Training - Model tuning


# S6-S7 - Model analysis - Model validation


# S8 - Save model
pickle.dump(model, open("model.sav", "wb"))
`

export const getPipelineConfiguration: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const pipelineConfiguration = await fetchPipelineConfiguration(id)

    if (pipelineConfiguration) {
      res.json({ config: pipelineConfiguration.config })
    } else {
      res.json({ config: defaultConfig })
    }
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const savePipelineConfiguration: RouteFunction = async (req, res, next) => {
  const id = Number(req.params.id)
  const data: DTO_PipelineConfiguration = req.body

  try {
    let pipelineConfiguration = await fetchPipelineConfiguration(id)

    if (pipelineConfiguration) {
      pipelineConfiguration = await updateExistingPipelineConfiguration(pipelineConfiguration.id, data.config)
    } else {
      pipelineConfiguration = await createNewPipelineConfiguration(id, data.config)
    }

    res.json({ config: pipelineConfiguration.config })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}