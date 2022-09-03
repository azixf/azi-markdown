import { ipcRenderer } from 'electron'
import path from 'path'
import fs from 'fs'

const dist =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../data')
    : path.resolve(process.cwd(), './src/data')

export const windowOperate = (type: string) => {
  ipcRenderer.send('window-operation', type)
}

export const readConfigFile = (file: string) => {
  const filepath = path.resolve(dist, file)
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) reject(err)
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(data)
      }
    })
  })
}

export const writeConfigFile = (dir: string, data: string) => {
  const filepath = path.resolve(dist, dir)
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf-8', (err) => {
      if (err) reject(err)
      resolve('file successfully saved!!!')
    })
  })
}
