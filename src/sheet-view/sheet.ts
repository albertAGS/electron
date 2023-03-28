/* eslint-disable no-debugger */
import { ipcRenderer } from 'electron';
let labelLeft: Element;
let selectLeft: HTMLSelectElement;
let labelRight: Element;
let selectRight: HTMLSelectElement;
let submit: Element;
const mapSelect = new Map<string, string>();
ipcRenderer.on('sheetNames', (event, sheet: Map<string, string[]>) => {
  labelLeft = document.querySelector('#selectSheetLabelL');
  selectLeft = document.querySelector('#selectSheetL') as HTMLSelectElement;
  labelRight = document.querySelector('#selectSheetLabelR');
  selectRight = document.querySelector('#selectSheetR') as HTMLSelectElement;
  submit = document.querySelector('#submit');

  selectLeft.addEventListener('change', (e: Event) =>
    selectChanged(e, selectLeft, labelLeft)
  );
  selectRight.addEventListener('change', (e: Event) =>
    selectChanged(e, selectRight, labelRight)
  );

  submit.addEventListener('click', submitForm);

  [...sheet.entries()].forEach(([key, values], index) => {
    if (index === 1) {
      populateSelect(key, values, labelLeft, selectLeft);
      mapSelect.set(key, null);
      return;
    }
    populateSelect(key, values, labelRight, selectRight);
    mapSelect.set(key, null);
  });
});

function submitForm() {
  console.log(mapSelect);
  ipcRenderer.send('sheets:name', mapSelect);
}
//
function selectChanged(e: Event, sel: HTMLSelectElement, label: Element) {
  mapSelect.set(label.innerHTML, sel.value);

  console.log(mapSelect);
  if (sel.value === 'Choose a sheet') {
    submit.classList.add('hidden');
    mapSelect.set(label.innerHTML, null);
    return;
  }
  if (
    !Array.from(mapSelect.values()).every((it) => it && it !== 'Choose a sheet')
  ) {
    return;
  }
  submit.classList.remove('hidden');
}

function populateSelect(
  key: string,
  values: string[],
  label: Element,
  select: Element
) {
  for (let i = 0; i < values.length; i++) {
    const opt = values[i];
    const el = document.createElement('option');
    el.textContent = opt;
    el.value = opt;
    select?.appendChild(el);
    label.innerHTML = key;
  }
}
