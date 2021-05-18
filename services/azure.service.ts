import { interpolate } from '@pulumi/pulumi'
import { resources, storage, storagesync } from '@pulumi/azure-native'

export const azure_createBucket = async (data: { name: string, project: string }) => {
  const resourceGroup = new resources.ResourceGroup(`${data.name}-${data.project}-rg`, {
    location: 'switzerlandnorth'
  })

  const storageAccount = new storage.StorageAccount(`${data.name.replace(/-/g, "")}`, {
    resourceGroupName: resourceGroup.name,
    sku: {
      name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.BlobStorage,
    location: 'switzerlandnorth',
    accessTier: storage.AccessTier.Cool
  });

  new storage.BlobContainer("blobContainer", {
    accountName: interpolate`${storageAccount.name}`,
    containerName: 'artifacts',
    resourceGroupName: interpolate`${resourceGroup.name}`,
  });

  return { bucket_url: "" }
}