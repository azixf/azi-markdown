import { ipcMain, dialog, BrowserWindow } from 'electron'

export const initFile = (win: BrowserWindow) => {
  ipcMain.on('open-file', (event, ...args) => {
    const accept = args[0]
    dialog
      .showOpenDialog(win, {
        title: '打开markdown文件',
        filters: [
          {
            name: '',
            extensions: accept,
          },
        ],
        properties: ['openFile'],
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          event.reply('opend-file', filePaths[0])
        } else {
          event.reply('opend-file', null)
        }
      })
  })
}
