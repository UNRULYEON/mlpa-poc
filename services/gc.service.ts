import { Storage, GetBucketResponse } from '@google-cloud/storage'
import Compute from '@google-cloud/compute'
import { fileType } from '../DTO/datasets-and-artifacts'
import { DTO_PipelineDatasetsAndArtifactsFile } from '../DTO/datasets-and-artifacts'
import { currentPipelineConfiguration, newRun, updatePipeline, updateRun } from '../db'
import { fetchPipeline } from './pipeline.service'
import fetch from 'node-fetch'
import key from '../gc-service-account-file.json'
import { RunStatus } from '.prisma/client'
import { fetchRun } from './run.service'

// const {
//   Worker, isMainThread, parentPort, workerData
// } = require('worker_threads');

const gc_storage = new Storage()

const createBucketName = (name: string): string => `${name}-artifacts`

export const gc_createBucket = async (data: { name: string, project_id: string }) => {
  const storage = new Storage()

  return await storage.createBucket(createBucketName(data.name), {
    location: 'EUROPE-WEST4'
  })
}

export const gc_getBucket = async (data: { name: string, project_id: string }) => {
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  const bucket: GetBucketResponse = await gc_bucket.get()

  return `gs://${bucket[0].id}`
}

export const gc_uploadToBucket = async (data: { name: string, project_id: string }, files: fileType[]) => {
  const gc_bucket = gc_storage.bucket(createBucketName(data.name))

  console.log(`Uploading to bucket: ${gc_bucket.name}`)

  files.map(file => {
    gc_bucket.upload(file.path, { destination: file.name, public: true })
      .then(r => console.log('done uploading'))
      .catch(e => console.log(e))
  })

  return {}
}

export const gc_getBucketFiles = async (name: string) => {
  const gc_bucket = gc_storage.bucket(createBucketName(name))

  const bucket_files = await gc_bucket.getFiles()

  const files: DTO_PipelineDatasetsAndArtifactsFile[] = bucket_files[0].map(file => {
    const f = gc_bucket.file(file.name)

    return ({
      name: file.name,
      url: file.publicUrl(),
      download_id: file.name,
      content_type: file.metadata.contentType as string,
      size: file.metadata.size as string
    })
  })

  return files.sort((a, b) => {
    if (a.name < b.name) {
      return 1
    } else if (a.name > b.name) {
      return -1
    } else {
      return 0
    }
  })
}

export const gc_downloadFile = async (name: string, file_name: string) => {
  const gc_bucket = gc_storage.bucket(createBucketName(name))
  const bucket_file = gc_bucket.file(file_name)

  const [arrayBuffer] = await bucket_file.download()

  const file = Buffer.from(arrayBuffer)

  return { buffer: file, content_type: bucket_file.metadata.contentType }
}

export const gc_startPipeline = async (pipeline_id: number, name: string, run: number) => {
  const compute = new Compute()
  const zone = compute.zone('europe-west4-a')
  const pipeline = await fetchPipeline(pipeline_id)
  const configuration = await currentPipelineConfiguration(pipeline_id)

  const config = {
    os: 'ubuntu',
    http: true,
    machineType: 'e2-small',
    metadata: {
      items: [
        {
          key: 'startup-script',
          value: `#! /bin/bash
apt-get update
apt-get install -y python3-pip
echo '[MLPA] - INSTALLING PIP PACKAGES'

sudo pip3 install pandas
sudo pip3 install numpy
sudo pip3 install matplotlib
sudo pip3 install scikit-learn

sudo mkdir ml

cd ml
sudo mkdir output
echo '[MLPA] - CREATED OUTPUT FOLDER'

sudo cat <<'EOF' >> main.py
${configuration.config}
EOF
echo '[MLPA] - CREATED PYTHON FILE'

sudo cat <<'EOF' >> key.json
${JSON.stringify(key, null, 2)}
EOF
echo '[MLPA] - CREATED KEY FILE'

sudo python3 main.py

gcloud auth activate-service-account --key-file key.json

cd output

for FILE in *; do sudo mv $FILE "$HOSTNAME-$FILE"; done
for FILE in *; do gsutil cp $FILE gs://test-pipeline-artifacts; done

echo
echo '[MLPA] - DONE'
`,
        }
      ]
    }
  }

  const vm = zone.vm(`${name}-${run}`)

  await updatePipeline(pipeline.id, { ...pipeline, status: 'RUNNING', run: pipeline.run + 1 })
  const _run = await newRun(pipeline_id, pipeline.platform, `${name}-${run}`, 'PROVISIONING')

  console.log(`Creating VM ${name}-${run}...`);
  const [, operation] = await vm.create(config)

  console.log(`Polling operation ${operation.id}...`);
  await operation.promise()

  console.log('Acquiring VM metadata...');
  const [metadata] = await vm.getMetadata()

  const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP
  console.log(`Booting new VM with IP http://${ip}...`);

  return { run_id: _run.id }
}

export const gc_getRunStatus = async (name: string, run: number, run_id: number) => {
  const compute = new Compute()
  const zone = compute.zone('europe-west4-a')
  const vm = zone.vm(`${name}-${run}`)

  const metadata = await vm.getMetadata()
  const output = await vm.getSerialPortOutput()

  await updateRun(run_id, { status: metadata[0].status, output: output[0] })

  return await output[0]
}

export const gc_stopRun = async (name: string, run: number, run_id: number) => {
  const compute = new Compute()
  const zone = compute.zone('europe-west4-a')
  const vm = zone.vm(`${name}-${run}`)

  await vm.delete()

  const _run = await fetchRun(run_id)


  await updateRun(run_id, { status: 'TERMINATED' })
  await updatePipeline(_run.pipeline.id, { status: 'IDLE' })

}

const watchRun = async (run_id: number, ip: string, initial_status: RunStatus, vm: any) => {
  let exit: boolean = false
  let status: RunStatus = initial_status

  while (!exit) {
    await new Promise(r => setTimeout(r, 2000))

    if (status === 'PROVISIONING') {
      console.log(``)
      console.log(`[PROVISIONING]`)
      console.log(``)

      try {
        const res = await fetch(`http://${ip}`)
        if (res.status !== 200) {
          throw new Error(`${res.status}`)
        }
        console.log(`Instance is ready`)
        await updateRun(run_id, { status: 'RUNNING' })
        status = 'RUNNING'
        console.log(`PROVISIONING -> RUNNING`)
      } catch (err) {
        console.log('Instance is provisioning...')
      }

    } else if (status === 'STAGING') {
    } else if (status === 'RUNNING') {
      console.log(``)
      console.log(`[RUNNING]`)
      console.log(``)

      let output = await vm.getSerialPortOutput()
      await updateRun(run_id, { output: output[1].contents })
      console.log(`Output updated`)
    } else if (status === 'STOPPING') {
      console.log(``)
      console.log(`[STOPPING]`)
      console.log(``)


    } else if (status === 'TERMINATED') {
      console.log(``)
      console.log(`[TERMINATED]`)
      console.log(``)


    }
    exit = true
  }
}

// disco-sky-312109