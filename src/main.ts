import { app, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import { createDB, getMenu } from "./functions";

const isDev = process.env.NODE_ENV !== 'development'
const isMac = process.platform !== "darwin"

let mainWindow: BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 700,
    width: isDev ? 1000 : 500,
    webPreferences: {
      // to use the comunication between the preload.ts and the main.ts is necessary to use this config
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true
    },
  });

  // open devTools in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // build the menu
  const mainMenu = Menu.buildFromTemplate(getMenu(isMac))
  Menu.setApplicationMenu(mainMenu)
  
  //handle submit when it is clicked
  ipcMain.handle('mergeFiles:clicked', handleMerging)
}

async function handleMerging (e: any, files: string[]) {
  return await createDB(files)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
