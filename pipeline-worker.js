const { parentPort, workerData } = require('worker_threads')

let runs_to_watch = []

// while (true) {
//   if (runs_to_watch.length > 0) {
//     parentPort.once('message', message => parentPort.postMessage(`[WORKER] - Found ${runs_to_watch.length} runs to watch`))
//   }
// }



