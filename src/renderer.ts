const excel = document.querySelector('#excel');
const excel1 = document.querySelector('#excel-1');
const buttonDB = document.querySelector('#db-button');
const filename = document.querySelector('#excel-label');
const filename1 = document.querySelector('#excel-1-label');

const dic = new Map<string, string>()
dic.set(filename.id, null)
dic.set(filename1.id, null)

excel.addEventListener('change', (e: Event) => loadImage(e, filename))
excel1.addEventListener('change', (e: Event) => loadImage(e, filename1))

buttonDB.addEventListener('click', mergeFiles)

function loadImage(e: Event, fileName: Element) {
  const file = (e.target as HTMLInputElement).files[0]
  if(!isExcel(file)) {
    fileName.innerHTML = ''
    dic.set(fileName.id, null)
    buttonDB.classList.add("hidden");
    return
  }
  fileName.innerHTML = file.name
  dic.set(fileName.id, file.path);
  if(!Array.from(dic.values()).every(it => it)) {
    return
  }
  buttonDB.classList.remove("hidden");
}


// check file is an excel
function isExcel(file: File) {
  const acceptedFiles = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  return file && acceptedFiles.includes(file['type'])
}

async function mergeFiles() {
  await (window as any).files.merge('mergeFiles:clicked', Array.from(dic.values()))
  // TODO build the new view where the table will be displayed
}

