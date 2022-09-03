<script setup lang="ts">
import * as bytemd from 'bytemd'
import 'bytemd/dist/index.css'
import zhHans from 'bytemd/locales/zh_Hans.json'
import gfm from '@bytemd/plugin-gfm'
import frontMatter from '@bytemd/plugin-frontmatter'
import breaks from '@bytemd/plugin-breaks'
// import injectstyle from '@bytemd/plugin-inject-style'
import importHtml from '@bytemd/plugin-import-html'
import gmoji from '@bytemd/plugin-gemoji'
import math from '@bytemd/plugin-math'
import highlight from '@bytemd/plugin-highlight'
import zoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import { changeTheme } from '@/utils/changetheme'
import { readConfigFile } from '@/renderer'
// import copycode from '@uvdream/bytemd-plugin-code-copy'

interface ImgAttr {
  title: string
  url: string
  alt: string
}

// interface Props {
//   modelValue: string
//   mode?: 'split' | 'auto' | ''
// }

interface Props {
  value?: string
  mode?: 'split' | 'tab' | 'auto'
  placeholder?: string
  plugins?: any
  previewDebounce?: number
  locale?: any
  uploadImages?: (files: [File]) => [ImgAttr]
  maxLength?: number
  editorConfig?: any
  theme?: string
  highlight?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 10000,
  mode: 'split',
  placeholder: '',
  previewDebounce: 300,
  uploadImages: undefined,
  value: '',
  locale: zhHans,
  editorConfig: {},
  theme: '',
  highlight: '',
  plugins: [
    gfm(),
    frontMatter(),
    math(),
    breaks(),
    // injectstyle(),
    importHtml(),
    // footnotes(),
    highlight(),
    zoom(),
    // vega(),
    mermaid(),
    // copycode({
    //   copyText: 'copy',
    // }),
    gmoji(),
  ],
})

const emits = defineEmits<{
  (e: 'change', id: string): void
}>()

const editor = ref<bytemd.Editor | null>()
const instance = getCurrentInstance()

onMounted(() => {
  editor.value = new bytemd.Editor({
    target: instance?.subTree.el as HTMLElement,
    props: props as any,
  })

  editor.value.$on('change', (e: { detail: { value: string } }) => {
    emits('change', e.detail.value)
  })
  readConfigFile('system.json').then((res: any) => {
    changeTheme(props.theme || res.editor.theme)
    changeTheme(props.highlight || res.editor.highlight, true)
  })
})

watch(props, (newval, oldval) => {
  editor.value?.$set(
    Object.fromEntries(Object.entries(newval).filter((v) => v))
  )
})

watch(
  () => props.theme,
  (val) => {
    let style = val
    // if (!val) {
    //   style = 'channing-cyan'
    // }
    changeTheme(style)
  }
)

watch(
  () => props.highlight,
  (val) => {
    let style = val
    // if (!val) {
    //   style = 'vs'
    // }
    changeTheme(style, true)
  }
)
</script>

<template>
  <h1>EditorComp</h1>
</template>

<script lang="ts">
export default {
  name: 'EditorComp',
}
</script>

<style lang="scss" scoped></style>
