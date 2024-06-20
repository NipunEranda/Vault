import utils from ".";
// const { BlockBlobClient, BlobServiceClient } = require('@azure/storage-blob');
import { BlockBlobClient, BlobServiceClient } from "@azure/storage-blob";

const getServiceClient = async () => {
    const config = await utils.readConfig();
    return BlobServiceClient.fromConnectionString(JSON.parse(config).connectionURL);
}

const loadContainers = async () => {
    const list = [];
    const blobServiceClient = await getServiceClient();
    for await (const container of blobServiceClient.listContainers()) {
        const obj = {
            name: container.name,
            modifiedOn: container.properties.lastModified,
            type: "folder"
        };
        list.push(obj);
    }
    return list;
}

export default {
    loadContainers
};