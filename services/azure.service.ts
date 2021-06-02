import { DefaultAzureCredential } from '@azure/identity'
import { ResourceManagementClient } from '@azure/arm-resources'
import { StorageManagementClient } from '@azure/arm-storage'
import { setLogLevel } from '@azure/logger'
import { BlobServiceClient } from '@azure/storage-blob'
import { fileType } from '../DTO/datasets-and-artifacts'
import { config } from 'dotenv'
import fs from 'fs'

config()

setLogLevel("info")

const credentials = new DefaultAzureCredential()
const rmc = new ResourceManagementClient(credentials as any, process.env.AZURE_SUBSCRIPTION_ID)
const smc = new StorageManagementClient(credentials as any, process.env.AZURE_SUBSCRIPTION_ID)

const createResourceGroupName = (data: { name: string, project: string }): string => `${data.name}-${data.project}-rg`

const createStorageAccountName = (name: string): string => name.replace(/-/g, "")

export const azure_createResourceGroup = async (data: { name: string, project: string }) => {
  return await rmc.resourceGroups.createOrUpdate(createResourceGroupName(data), {
    location: 'switzerlandnorth'
  })
}

export const azure_createBucket = async (data: { name: string, project: string }) => {
  await smc.storageAccounts.create(createResourceGroupName(data), createStorageAccountName(data.name), {
    kind: 'BlobStorage',
    sku: { name: 'Standard_LRS', tier: 'Standard' },
    location: 'switzerlandnorth',
    accessTier: 'Cool',
  })

  await smc.blobContainers.create(createResourceGroupName(data), createStorageAccountName(data.name), 'artifacts', {
    publicAccess: 'Container'
  })
}

export const azure_getBucket = async (data: { name: string, project: string }) => {
  const bsc = new BlobServiceClient(`https://${createStorageAccountName(data.name)}.blob.core.windows.net`, credentials)

  return bsc.url

  // const resourceGroup = createResourceGroup(data)
  // const storageAccount = createStorageAccount({ name: data.name, resourceGroupName: resourceGroup.name })
  // createBlobContainer({ storageAccountName: storageAccount.name, resourceGroupName: resourceGroup.name })

  // const rg = await resources.getResourceGroup({
  //   resourceGroupName: createResourceGroupName(data)
  // })

  // const sa = await storage.getStorageAccount({
  //   accountName: createStorageAccountName(data.name),
  //   resourceGroupName: rg.name
  // })

  // return { bucket_url: `${sa.primaryEndpoints.blob}artifacts` }
}

export const azure_uploadToBucket = async (data: { name: string, project: string }, files: fileType[]) => {
  // const bsc = new BlobServiceClient(`https://${createStorageAccountName(data.name)}.blob.core.windows.net/?${process.env.AZURE_STORAGE_SAS_TOKEN}`)
  const bsc = new BlobServiceClient(`https://${createStorageAccountName(data.name)}.blob.core.windows.net/`, credentials)

  const containerClient = bsc.getContainerClient('artifacts');

  files.map(async file => {
    const data = fs.readFileSync(file.path)
    const blockBlobClient = containerClient.getBlockBlobClient(file.name)
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length, {})

    console.log('done uploading')
  })
}