const excel = document.querySelector('#excel');
const excel1 = document.querySelector('#excel-1');
const buttonDB = document.querySelector('#db-button');
const filename = document.querySelector('#excel-label');
const filename1 = document.querySelector('#excel-1-label');

const mapFiles = new Map<string, string>()
mapFiles.set(filename.id, null)
mapFiles.set(filename1.id, null)

excel.addEventListener('change', (e: Event) => loadImage(e, filename))
excel1.addEventListener('change', (e: Event) => loadImage(e, filename1))
buttonDB.addEventListener('click', mergeFiles)

function loadImage(e: Event, fileName: Element) {
  const file = (e.target as HTMLInputElement).files[0]
  if(!isExcel(file)) {
    fileName.innerHTML = ''
    mapFiles.set(fileName.id, null)
    buttonDB.classList.add("hidden");
    return
  }
  fileName.innerHTML = file.name
  mapFiles.set(fileName.id, file.path);
  if(!Array.from(mapFiles.values()).every(it => it)) {
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
  const excelMerged: string[] = await (window as any).files.merge('mergeFiles:clicked', Array.from(mapFiles.values()))

  const excelDic = new Map<string,  Map<string, string | number>>()

  const replace = (val: string[]) => {
    return val.map(it => it.replace(/[' ]/g, ''))
  }
  
  excelMerged.forEach(it => {
    const auxMap = new Map<string, string | number>()
    it.replace(/[{}]/g, '').split(',').forEach(element => {
      const [key, value] = replace(element.split(':'))
      auxMap.set(key, value)
    });
    excelDic.set(auxMap.get('fragment') as string, auxMap)
  }) 
}
