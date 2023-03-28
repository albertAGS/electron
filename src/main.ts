import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import {
  closeWindow,
  createDB,
  createNewProductWindow,
  getSheetNames,
} from './functions';

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform !== 'darwin';

const excelFiles: { name: string; path: string; sheet?: string }[] = [];

let mainWindow: BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 700,
    width: 1000,
    webPreferences: {
      // to use the comunication between the preload.ts and the main.ts is necessary to use this config
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  // open devTools in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // build the menu
  // const mainMenu = Menu.buildFromTemplate(getMenu(isMac))
  // Menu.setApplicationMenu(mainMenu)

  //handle submit when getSheet is clicked
  ipcMain.handle('getSheet:clicked', getSheets);
}

// get the name of the sheets
async function getSheets(
  e: any,
  files: {
    name: string;
    path: string;
  }[]
) {
  excelFiles.splice(0, excelFiles.length);
  files
    .map((it) => it.path.replace(/\\/g, '/').replace('\n', ''))
    .map((it) => 'r' + it);
  excelFiles.push(...files);
  handleMerging();
  return;
  //TODO open a new view with the sheets to select them
  const sheetNames = await getSheetNames(files);
  createNewProductWindow(sheetNames);
}

// Ipc Renderer Events
ipcMain.on('sheets:name', (e, filesAndSheet) => {
  console.log({ filesAndSheet });
  closeWindow();
});

const mockMap = new Map();
mockMap.set('Project Order Status.xlsx', 'RN Liste mit Check');
mockMap.set('philotech_kpi_acme.xlsm', 'Performance Control');

function handleMerging() {
  const mergedFiles = excelFiles.map((file) => {
    const sheet = mockMap.get(file.name);
    return { ...file, sheet };
  });
  createDB(mergedFiles);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
