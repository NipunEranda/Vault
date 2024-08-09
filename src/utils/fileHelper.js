
import { run, showModal, hideModal } from "./index";

const uploadFiles = async (root, files, route, loading, loadData) => {
    new Promise(async (resolve, reject) => {
        await Promise.all(
            files.map(async (file) => {
                await run("UPLOAD_FILE", JSON.stringify({ name: file.fullPath.substring(1), filePath: `${root}${file.fullPath}`, container: atob(route.query.root).split("/")[0], root: atob(route.query.root).split("/").splice(1, atob(route.query.root).split("/").length).join("/") }));
            })
        );
        resolve(true);
    }).then(() => {
        loadData().then(() => {
            loading.value = false;
        })
    })
}

const dragAndDroppedFiles = async (e) => {
    const supportsFileSystemAccessAPI =
        "getAsFileSystemHandle" in DataTransferItem.prototype;
    const supportsWebkitGetAsEntry =
        "webkitGetAsEntry" in DataTransferItem.prototype;

    // Prevent navigation.
    e.preventDefault();
    if (!supportsFileSystemAccessAPI && !supportsWebkitGetAsEntry) {
        return;
    }

    const files = await getAllFileEntries(e.dataTransfer.items);
    let selectedUploads = files.reduce((acc, val) => acc.concat(val), []);

    selectedUploads = selectedUploads.filter(u => !u.name.includes('.DS_Store'));
    return selectedUploads;
}

const getAllFileEntries = async (dataTransferItemList) => {
    let fileEntries = [];
    // Use BFS to traverse entire directory/file structure
    let queue = [];
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }
    while (queue.length > 0) {
        let entry = queue.shift();
        if (entry.isFile) {
            fileEntries.push(entry);
        } else if (entry.isDirectory) {
            let reader = entry.createReader();
            queue.push(...(await readAllDirectoryEntries(reader)));
        }
    }

    // return fileEntries;
    return fileEntries;
};

// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
const readAllDirectoryEntries = async (directoryReader) => {
    let entries = [];
    let readEntries = await readEntriesPromise(directoryReader);
    while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader);
    }
    return entries;
};

// Wrap readEntries in a promise to make working with readEntries easier
const readEntriesPromise = async (directoryReader) => {
    try {
        return await new Promise((resolve, reject) => {
            directoryReader.readEntries(resolve, reject);
        });
    } catch (err) {
        console.error(err);
    }
};

export default {
    uploadFiles,
    dragAndDroppedFiles
};