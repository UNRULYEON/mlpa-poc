import { interpolate, Output } from '@pulumi/pulumi'
import { resources, storage } from '@pulumi/azure-native'

const createResourceGroupName = (data: { name: string, project: string }): string => `${data.name}-${data.project}-rg`

const createResourceGroup = (data: { name: string, project: string }) => {
  return new resources.ResourceGroup(`${data.name}-${data.project}-rg`, {
    location: 'switzerlandnorth',
    resourceGroupName: createResourceGroupName(data)
  })
}

const createStorageAccountName = (name: string): string => name.replace(/-/g, "")

const createStorageAccount = (data: { name: string, resourceGroupName: Output<string> }) => {
  return new storage.StorageAccount(`${data.name.replace(/-/g, "")}`, {
    resourceGroupName: data.resourceGroupName,
    accountName: createStorageAccountName(data.name),
    sku: {
      name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.BlobStorage,
    location: 'switzerlandnorth',
    accessTier: storage.AccessTier.Cool
  });
}

const createBlobContainer = (data: { storageAccountName: Output<string>, resourceGroupName: Output<string> }) => {
  return new storage.BlobContainer("blobContainer", {
    accountName: interpolate`${data.storageAccountName}`,
    containerName: 'artifacts',
    resourceGroupName: interpolate`${data.resourceGroupName}`,
    publicAccess: storage.PublicAccess.Container
  });
}

export const azure_createBucket = async (data: { name: string, project: string }) => {
  const resourceGroup = createResourceGroup(data)
  const storageAccount = createStorageAccount({ name: data.name, resourceGroupName: resourceGroup.name })
  createBlobContainer({ storageAccountName: storageAccount.name, resourceGroupName: resourceGroup.name })

  return { bucket_url: "" }
}

export const azure_getBucket = async (data: { name: string, project: string }) => {
  const resourceGroup = createResourceGroup(data)
  const storageAccount = createStorageAccount({ name: data.name, resourceGroupName: resourceGroup.name })
  createBlobContainer({ storageAccountName: storageAccount.name, resourceGroupName: resourceGroup.name })

  const rg = await resources.getResourceGroup({
    resourceGroupName: createResourceGroupName(data)
  })

  const sa = await storage.getStorageAccount({
    accountName: createStorageAccountName(data.name),
    resourceGroupName: rg.name
  })

  return { bucket_url: `${sa.primaryEndpoints.blob}artifacts` }
}