import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('files', {
  merge: (
    channel: string,
    data: {
      name: string;
      path: string;
    }[]
  ) => ipcRenderer.invoke(channel, data),
  sheet: (channel: string, data: any[]) => {
    ipcRenderer.invoke(channel, data);
  },
});
