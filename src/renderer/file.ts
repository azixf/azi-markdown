import { ipcRenderer } from 'electron'
import fs from 'fs'
import { LRU } from '@/utils/lru'
import path from 'path'

const dist =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../data')
    : path.resolve(process.cwd(), './src/data')

export const readConfigFile = (file: string) => {
  const filepath = path.resolve(dist, file)
  // return new Promise((resolve, reject) => {
  //   fs.readFile(filepath, 'utf-8', (err, data) => {
  //     if (err) reject(err)
  //     try {
  //       resolve(JSON.parse(data))
  //     } catch {
  //       resolve(data)
  //     }
  //   })
  // })
  return readFile(filepath)
}

export const writeConfigFile = (dir: string, data: string) => {
  const filepath = path.resolve(dist, dir)
  return writeFile(filepath, data)
}

export const readFile = (filepath: string) => {
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

export const writeFile = (filepath: string, data: string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf-8', (err) => {
      if (err) reject(err)
      resolve('file successfully saved!!!')
    })
  })
}

export const openFileBox = (accept: string[] = ['md']) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('open-file', accept)
    ipcRenderer.on('opend-file', (event, ...args) => {
      const filepath = args[0]
      if (filepath) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
          if (err) return reject(err)
          addRecentOpendFile(filepath).then(() => {
            resolve({
              path: filepath,
              data,
            })
          })
        })
      } else {
        resolve(null)
      }
    })
  })
}

export const addRecentOpendFile = async (path: string) => {
  const system: any = await readConfigFile('system.json')
  const list = new LRU(system.recentFiles || [])
  list.add(path)
  system.recentFiles = list.all()
  const res = await writeConfigFile('system.json', JSON.stringify(system))
  console.log(res)
}
