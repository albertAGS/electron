
import { app } from 'electron';
import { PythonShell, PythonShellError } from 'python-shell';
import * as util from 'util';
import path = require( 'path' );

export function getDB() {
  const data = "Cool Weather"
  const pyshell = new PythonShell('./src/db.py')
  pyshell.send(data)
  pyshell.on('message', function (message:string) {
    console.log(message+" HI")
  })
  pyshell.end(function (err:PythonShellError, code:number, signal:string) {
    if (err) throw err;
    console.log(code + ' ' + signal);
  })
}

export async function createDB(files: string[], callback?: (a: string) => string) {
  // promisify the pyshell.end() method
  
  files.map(it => it.replace(/\\/g, '/')).map(it => 'r'+ it)
  const pyshell = new PythonShell('./src/createdb/createTable.py')
  const end = util.promisify(pyshell.end).bind(pyshell);
  pyshell.send(files)
  pyshell.on('message',  function (message:string) {
    // return message
  })
  pyshell.end(async function (err:PythonShellError, code:number, signal:string) {
    if(err) throw(err) 
    console.log(code, signal)
  })
  await end();
  return true
}


export function getMenu(isMac: boolean): (Electron.MenuItem | Electron.MenuItemConstructorOptions)[] {
  const menu = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: 'About',
                click: createAboutWindow
              },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' },
      ...(!isMac
        ? [
            {
              label: 'Help',
              submenu: [
                {
                  label: 'About',
                  click: createAboutWindow
                },
              ],
            },
          ]
        : []),
  ];
  
  return menu
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add file',
          accelerator: 'Ctrl+O',
          click() {
            console.log('add File');
          },
        },
      ],
    },
  ];
}


function createAboutWindow() {
  // const aboutWindow = new BrowserWindow({
  //   title: 'About electron',
  //   height: 300,
  //   width: 300
  // });
  // aboutWindow.loadFile(path.join(__dirname, '../about.html'))
}