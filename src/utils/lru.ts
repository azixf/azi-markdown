export class LRU {
  public list: string[]
  public size: number
  constructor(list: string[] = [], size = 10) {
    this.list = list
    this.size = size
  }

  all() {
    return this.list
  }

  get(value: string) {
    const index = this.list.indexOf(value)
    if (index > -1) {
      if (index !== 0) {
        this.list.splice(index, 1)
        this.list.unshift(value)
      }
      return value
    }
    return undefined
  }

  add(value: string) {
    const index = this.list.indexOf(value)
    if (index > -1) {
      if (index !== 0) {
        this.list.splice(index, 1)
        this.list.unshift(value)
      }
    } else {
      this.list.unshift(value)
    }
    if (this.list.length > this.size) this.list.pop()
  }

  remove(value: string) {
    const index = this.list.indexOf(value)
    if (index > -1) {
      this.list.splice(index, 1)
    }
  }

  length() {
    return this.list.length
  }
}
