const excel = document.querySelector('#excel');
const excel1 = document.querySelector('#excel-1');
const buttonDB = document.querySelector('#db-button');
const labelLeft = document.querySelector('#excel-label');
const labelRight = document.querySelector('#excel-1-label');

const mapFiles = new Map<string, { name: string; path: string }>();
mapFiles.set(labelLeft.id, null);
mapFiles.set(labelRight.id, null);

buttonDB.addEventListener('click', getNamesSheet);
excel.addEventListener('change', (e: Event) => setFileToMap(e, labelLeft));
excel1.addEventListener('change', (e: Event) => setFileToMap(e, labelRight));

function setFileToMap(e: Event, fileName: Element) {
  const file = (e.target as HTMLInputElement).files[0];
  if (!isExcel(file)) {
    fileName.innerHTML = '';
    mapFiles.set(fileName.id, null);
    buttonDB.classList.add('hidden');
    return;
  }
  fileName.innerHTML = file.name;
  mapFiles.set(fileName.id, { path: file.path, name: file.name });
  if (!Array.from(mapFiles.values()).every((it) => it)) {
    return;
  }
  buttonDB.classList.remove('hidden');
}

// check file is an excel
function isExcel(file: File) {
  const acceptedFiles = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  return (
    (file && acceptedFiles.includes(file['type'])) ||
    (file['type'] == '' && file['path'].split('.')[1] === 'xlsm')
  );
}

async function getNamesSheet() {
  // get the sheets names to the user could select the name
  const sheetNames: Map<string, string[]> = await (window as any).files.sheet(
    'getSheet:clicked',
    Array.from(mapFiles.values())
  );
  // console.log({sheetNames});
}

async function mergeFiles() {
  // should send the name of the sheets that the user wants to merge
  const excelMerged: string[] = await (window as any).files.merge(
    'mergeFiles:clicked',
    Array.from(mapFiles.values())
  );

  if (!excelMerged) return;

  const excelDic = new Map<string, Map<string, string | number>>();

  const replace = (val: string[]) => {
    return val.map((it) => it.replace(/[' ]/g, ''));
  };

  // excelMerged?.forEach(it => {
  //   const auxMap = new Map<string, string | number>()
  //   it.replace(/[{}]/g, '').split(',').forEach(element => {
  //     const [key, value] = replace(element.split(':'))
  //     auxMap.set(key, value)
  //   });
  //   excelDic.set(auxMap.get('fragment') as string, auxMap)
  // })
}
