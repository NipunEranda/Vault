import utils from ".";
// const { BlockBlobClient, BlobServiceClient } = require('@azure/storage-blob');
import { BlockBlobClient, BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";

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
    return { folders: list };
}

const loadFiles = async (root) => {
    const files = [], folders = [];
    try {
        const blobServiceClient = await getServiceClient();
        let containerClient = blobServiceClient.getContainerClient(root.split("/")[0]);
        const hBlobs = containerClient.listBlobsByHierarchy("/", { prefix: root.split("/").splice(1, root.split("/").length - 1).join("/") != '' ? `${root.split("/").splice(1, root.split("/").length - 1).join("/")}/` : '' });

        for await (const blob of hBlobs) {
            const blobClient = blob.kind == 'prefix' ? containerClient.getBlobClient(`${blob.name}.info.mytypefi`) : containerClient.getBlobClient(blob.name);
            const properties = await new Promise((resolve, reject) => {
                blobClient.getProperties().then((properties) => resolve(properties)).catch(() => resolve(null));
            });

            const fullPath = blob.kind == 'prefix' ? blob.name.split('/').splice(0, blob.name.split('/').length - 2).join("/") : blob.name.split('/').splice(0, blob.name.split('/').length - 1).join("/");
            const rootPath = blob.kind == 'prefix' ? blob.name.split('/')[blob.name.split('/').length - 3] : blob.name.split('/')[blob.name.split('/').length - 2];

            const obj = {
                name: blob.kind == 'prefix' ? blob.name.split('/')[blob.name.split('/').length - 2] : blob.name,
                mimeType: blob.kind == 'prefix' ? null : properties.contentType,
                size: blob.kind == 'prefix' ? null : properties.contentLength,
                uploader: properties ? properties.metadata ? properties.metadata.uploader : null : null,
                root: rootPath ? rootPath : '/',
                createdOn: properties ? properties.createdOn : null,
                modifiedOn: properties ? properties.lastModified : null,
                fullPath: fullPath != '' ? `${fullPath}/` : '/',
            };

            if (blob.kind == 'prefix') {
                obj.type = 'folder';
                folders.push(obj);
            } else {
                // Blob
                if (!obj.name.includes('.mytypefi')) {
                    obj.type = 'file';
                    files.push(obj);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    return { files, folders };
}

const createContainer = async (name) => {
    const blobServiceClient = await getServiceClient();
    await blobServiceClient.createContainer(name, { publicAccessLevel: 'blob' });
    return await loadContainers();
}

const createFolder = async (folder) => {
    folder = JSON.parse(folder);
    const container = Buffer.from(folder.root, 'base64').toString().split("/")[0];
    const root = Buffer.from(folder.root, 'base64').toString().split("/").splice(1, Buffer.from(folder.root, 'base64').toString().split("/").length).join("/");
    const blobServiceClient = await getServiceClient();
    const containerClient = blobServiceClient.getContainerClient(container);
    const data = 'Azure Blob Folder';
    const blockBlobClient = containerClient.getBlockBlobClient(`${root != '' ? `${root}/` : ''}${folder.name}/.info.mytypefi`);
    await blockBlobClient.upload(data, data.length);
    return await loadFiles(`${container}${root != '' ? `/${root}` : ''}`);
}

const uploadFile = async (file) => {
    const blobName = file.name, blobServiceClient = await getServiceClient();

    const containerClient = blobServiceClient.getContainerClient(file.container);
    const blockBlobClient = containerClient.getBlockBlobClient(`${file.root != '' ? `${file.root}/` : ''}${blobName}`);
    const fileStream = fs.createReadStream(file.filePath);
    await blockBlobClient.uploadStream(fileStream, Math.ceil(fs.statSync(file.filePath).size / 100), 20);
    return true;
}

export default {
    loadContainers,
    loadFiles,
    createContainer,
    createFolder,
    uploadFile
};