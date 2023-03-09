
import { PythonShell, PythonShellError } from 'python-shell';

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