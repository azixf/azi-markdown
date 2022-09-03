import { ipcRenderer } from 'electron'

export const windowOperate = (type: string) => {
  ipcRenderer.send('window-operation', type)
}
