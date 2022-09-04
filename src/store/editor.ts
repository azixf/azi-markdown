import { defineStore } from 'pinia'

const useEdtorStore = defineStore('edtor', {
  state: () => {
    return {}
  },
  actions: {},
})

const store = useEdtorStore()

store.$subscribe((mutation, state) => {
  localStorage.setItem('edtor-store', JSON.stringify({ ...state }))
})

const value = localStorage.getItem('editor-store')
if (value) {
  store.$state = JSON.parse(value)
}

export { useEdtorStore }
