import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import utils from './utils';
import azure from './utils/azure';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 1000,
    minHeight: 720,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.maximize();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

ipcMain.on("READ_CONFIG", (event, args) => {
  const config = utils.readConfig();
  event.reply("READ_CONFIG", config);
});

ipcMain.on("WRITE_CONFIG", (event, args) => {
  utils.writeConfig(args);
  event.reply("WRITE_CONFIG", null);
});

ipcMain.on("LOAD_BLOBS", async (event, args) => {
  let data;
  if (!args)
    data = await azure.loadContainers();
  else
    data = await azure.loadFiles(Buffer.from(args, 'base64').toString());
  event.reply("LOAD_BLOBS", JSON.stringify(data, null, 2));
});

ipcMain.on("CREATE_BLOB_CONTAINER", async (event, args) => {
  const list = await azure.createContainer(args);
  event.reply("CREATE_BLOB_CONTAINER", JSON.stringify(list, null, 2));
})