import express from "express"
import path from "path"
import routes from './routes'
import { Worker } from 'worker_threads'

const app = express();
const port = process.env.PORT || 8000

// const worker = new Worker('./pipeline-worker.js', { workerData: [] })

// worker.once("online", () => console.log('[WORKER] Pipeline worker is online'))

// worker.postMessage('ping')

// worker.once("message", message => console.log(message))

app.use(express.json())

app.use('/api', routes)

app.get("/health", (_, res) => res.sendStatus(200))

app.use(express.static(path.join(__dirname, "./client")))

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"))
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
