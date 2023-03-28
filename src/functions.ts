import { BrowserWindow } from 'electron';
import * as path from 'path';
import { PythonShell, PythonShellError } from 'python-shell';
import * as util from 'util';

export async function getSheetNames(
  files: {
    name: string;
    path: string;
  }[]
): Promise<Map<string, string[]>> {
  const sheetNames = new Map<string, string[]>();

  const pyshell = new PythonShell('./src/python/getSheetNames.py');
  const end = util.promisify(pyshell.end).bind(pyshell);
  pyshell.send(JSON.stringify(files));
  pyshell.on('message', function (message: string) {
    if (message.includes('.xls')) {
      const messageArray = message.replace(/[[\]']/g, '').split(', ');
      sheetNames.set(messageArray[0], [
        ...messageArray.slice(1, message.length),
      ]);
    }
  });
  pyshell.end(async function (
    err: PythonShellError,
    code: number,
    signal: string
  ) {
    if (err) throw err;
  });
  await end();
  return sheetNames;
}

export async function createDB(
  files: { sheet: any; name: string; path: string }[]
) {
  console.log('1:', files);

  const db: any = [];

  const pyshell = new PythonShell('./src/python/createTable.py');
  const end = util.promisify(pyshell.end).bind(pyshell);
  pyshell.send(JSON.stringify(files)); // convert the object to a string and send it to Python
  pyshell.on('message', function (message: string) {
    db.push(message);
    console.log(message);
  });
  pyshell.end(async function (
    err: PythonShellError,
    code: number,
    signal: string
  ) {
    if (err) throw err;
  });
  await end();
  return db;
}

let sheetNamesWindow: BrowserWindow;
export function createNewProductWindow(sheetNames: Map<string, string[]>) {
  sheetNamesWindow = new BrowserWindow({
    width: 500,
    height: 330,
    title: 'Select one of the sheets',
    alwaysOnTop: true,
    webPreferences: {
      // to use the comunication between the preload.ts and the main.ts is necessary to use this config
      preload: path.join(__dirname, '../dist/sheet-view/sheet.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });
  sheetNamesWindow.webContents.openDevTools();
  sheetNamesWindow.setMenu(null);

  sheetNamesWindow.loadFile('../src/sheet-view/sheet.html');

  setTimeout(() => {
    sheetNamesWindow.webContents.send('sheetNames', sheetNames);
  }, 0);
  sheetNamesWindow.on('closed', () => {
    sheetNamesWindow = null;
  });
  return;
}

export function closeWindow() {
  sheetNamesWindow.close();
  return;
}
