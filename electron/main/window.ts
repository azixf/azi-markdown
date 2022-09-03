import { BrowserWindow, ipcMain } from 'electron'
let win: BrowserWindow | null = null
export const initWindow = (wind: BrowserWindow) => {
  win = wind
}

// 窗口操作相关
ipcMain.on('window-operation', (event, ...args) => {
  const type = args[0]
  if (type === 'minimize') {
    // 最小化
    win.minimize()
  } else if (type === 'fullscreen') {
    // 全屏
    if (!win.isFullScreen()) {
      win.setFullScreen(true)
    } else {
      win.setFullScreen(false)
    }
  } else if (type === 'close') {
    // 关闭窗口
    win.destroy()
  } else if (type === 'tray') {
    win.hide()
  }
})
