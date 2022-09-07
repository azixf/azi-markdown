<script lang="ts" setup>
import { debounce, throttle } from 'azi-utils'
import type { Root, Element } from 'hast'
import type { VFile } from 'vfile'
import type { Editor, KeyMap } from 'codemirror'
import MdStatus from './status.vue'
import MdViewer from './viewer.vue'
import MdToc from './toc.vue'
import type {
  AzimdEditorContext,
  AzimdPlugin,
  EditorProps as Props,
} from '@/type/editor'
import {
  createCodeMirror,
  createEditorUtils,
  findStartIndex,
  getBuiltinActions,
  handleImageUpload,
} from './editor'

import remarkBreaks from './plugins/breaks'
import remarkFrontmatter from './plugins/frontmatter'
import highlight from './plugins/highlight'
import mediumZoom from './plugins/medium-zoom'
import math from './plugins/math'
import gfm from './plugins/gfm'
import gemoji from './plugins/gemoji'
import copyCode from './plugins/copycode'
import { ElMessage } from 'element-plus'

interface PropsType {
  value: Props['value']
  plugins?: Props['plugins']
  sanitize?: Props['sanitize']
  remarkRehype?: Props['remarkRehype']
  mode?: Props['mode']
  previewDebounce?: Props['previewDebounce']
  placeholder?: Props['placeholder']
  editorConfig?: Props['editorConfig']
  uploadImages?: Props['uploadImages']
  overriderPreview?: Props['overridePreview']
  maxLength?: Props['maxLength']
}

const props = withDefaults(defineProps<PropsType>(), {
  value: '',
  plugins: undefined,
  sanitize: undefined,
  remarkRehype: undefined,
  mode: 'split',
  previewDebounce: 300,
  placeholder: '',
  editorConfig: undefined,
  uploadImages: undefined,
  overriderPreview: undefined,
  maxLength: Infinity,
})

const plugins = computed(() => {
  return [
    remarkBreaks(),
    remarkFrontmatter(),
    highlight(),
    gemoji(),
    math(),
    gfm(),
    mediumZoom(),
    copyCode({
      copySuccess: () => {
        ElMessage.success('复制成功！')
      },
      copyError: () => {
        ElMessage.error('复制失败！')
      },
    }),
    ...(props.plugins ?? []),
  ]
})

const emit = defineEmits<{
  (e: 'change', { value }: { value: string | undefined }): void
}>()

const root = ref<HTMLElement | null>()
const editorEl = ref<HTMLElement | null>()
const previewEl = ref<HTMLElement | null>()
const containerWidth = ref(Infinity)
const activeTab = ref<false | 'preview' | 'write'>(false)
const codemirror = ref<ReturnType<typeof createCodeMirror>>()
const editor = ref<Editor>()
// const sidebar = ref<false | 'help' | 'toc'>()

const actions = computed(() => {
  return getBuiltinActions(props.plugins || [], props.uploadImages)
})

const context = computed(() => {
  console.log('ctx')
  const ctx: AzimdEditorContext = {
    codemirror: codemirror.value!,
    editor: editor.value!,
    root: root.value!,
    ...createEditorUtils(codemirror.value!, editor.value!),
  }
  return ctx
})

let cbs: ReturnType<NonNullable<AzimdPlugin['editorEffect']>>[] = []
let keyMap: KeyMap

function on() {
  cbs = plugins.value.map((plugin) => {
    plugin.editorEffect?.(context.value)
  })
  keyMap = {}
  // TODO: add actions
  actions.value.forEach(({ handler }) => {
    if (handler?.type === 'action' && handler.shortcut) {
      keyMap[handler.shortcut] = () => {
        handler.click(context.value)
      }
    }
  })
  editor.value?.addKeyMap(keyMap)
}

function off() {
  cbs.forEach((cb) => cb && cb())
  editor.value?.removeKeyMap(keyMap)
}

// eslint-disable-next-line vue/no-setup-props-destructure
const debouncedValue = ref(props.value)

const setDebuncedValue = debounce((value: string) => {
  debouncedValue.value = value

  props.overriderPreview?.(previewEl.value!, {
    value: debouncedValue.value,
    plugins: plugins.value,
    sanitize: props.sanitize,
    remarkRehype: props.remarkRehype,
  })
}, props.previewDebounce)

watch(
  () => editor.value,
  (newvalue: any) => {
    if (newvalue) {
      off()
      nextTick(on)
    }
  }
)

watch(
  () => props.value,
  (newval) => {
    setDebuncedValue(newval)
    if (editor.value && props.value !== editor.value.getValue()) {
      editor.value.setValue(props.value)
    }
  },
  {
    deep: true,
  }
)
const split = ref(false)
watch(
  () => props.mode,
  (newval) => {
    split.value =
      newval === 'split' || (newval === 'auto' && containerWidth.value >= 800)
    if (split) {
      activeTab.value = false
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

// scroll sync vars
const syncEnabled = ref(true)
let editCalled = false
let previewCalled = false
let editPs: number[] = []
let previewPs: number[] = []
const hast = ref<Root>({ type: 'root', children: [] })
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const vFile = ref<VFile>()
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let currentBlockIndex = 0

onMounted(async () => {
  codemirror.value = createCodeMirror()
  editor.value = codemirror.value(editorEl.value!, {
    value: props.value,
    mode: 'yaml-frontmatter',
    lineWrapping: true,
    tabSize: 4,
    indentUnit: 4,
    placeholder: props.placeholder,
    extraKeys: {
      Enter: 'newlineAndIndentContinueMarkdownList',
    },
    ...props.editorConfig,
  })

  editor.value.addKeyMap({
    Tab: 'indetMore',
    'Shift-Tab': 'indetLess',
  })

  editor.value.on('change', () => {
    console.log('change')
    emit('change', { value: editor.value?.getValue() })
  })

  const updateBlockPostions = throttle(() => {
    editPs = []
    previewPs = []

    const scrollInfo = editor.value!.getScrollInfo()
    const body = previewEl.value?.childNodes[0]
    if (!(body instanceof HTMLElement)) return

    const leftNodes = hast.value.children.filter(
      (v): v is Element => v.type === 'element'
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rightNodes = [...body.childNodes].filter(
      (v): v is HTMLElement => v instanceof HTMLElement
    )

    for (let i = 0; i < leftNodes.length; i++) {
      const leftnode = leftNodes[i]
      const rightnode = rightNodes[i]

      if (!leftnode.position) continue

      const left =
        editor.value!.heightAtLine(leftnode.position.start.line - 1, 'local') /
        (scrollInfo.height - scrollInfo.clientHeight)

      const right =
        (rightnode.offsetTop - body.offsetTop) /
        (previewEl.value!.scrollHeight - previewEl.value!.clientHeight)

      if (left >= 1 || right >= 1) break

      editPs.push(left)
      previewPs.push(right)
    }
  }, 1000)

  const editorScrollHandler = () => {
    // if(props.overriderPreview) return

    if (!syncEnabled.value) return

    if (previewCalled) {
      previewCalled = false
      return
    }

    updateBlockPostions()

    const info = editor.value!.getScrollInfo()
    const leftRatio = info.top / (info.height - info.clientHeight)

    const startIndex = findStartIndex(leftRatio, editPs)

    const rightRatio =
      ((leftRatio - editPs[startIndex]) *
        (previewPs[startIndex + 1] - previewPs[startIndex])) /
        (editPs[startIndex + 1] - editPs[startIndex]) +
      previewPs[startIndex]

    previewEl.value?.scrollTo(
      0,
      rightRatio *
        (previewEl.value!.scrollHeight - previewEl.value!.clientHeight)
    )

    editCalled = true
  }

  const previewScrollHandler = () => {
    // if(props.overriderPreview) return
    updateBlockPostions()

    currentBlockIndex = findStartIndex(
      previewEl.value!.scrollTop /
        (previewEl.value!.scrollHeight - previewEl.value!.offsetHeight),
      previewPs
    )

    if (!syncEnabled.value) return

    if (editCalled) {
      editCalled = false
      return
    }

    const rightRatio =
      previewEl.value!.scrollTop /
      (previewEl.value!.scrollHeight - previewEl.value!.clientHeight)

    const startIndex = findStartIndex(rightRatio, previewPs)

    const leftRatio =
      ((rightRatio - previewPs[startIndex]) *
        (editPs[startIndex + 1] - editPs[startIndex])) /
        (previewPs[startIndex + 1] - previewPs[startIndex]) +
      editPs[startIndex]

    if (isNaN(leftRatio)) return

    const info = editor.value!.getScrollInfo()
    editor.value!.scrollTo(0, leftRatio * (info.height - info.clientHeight))
    previewCalled = true
  }

  editor.value!.on('scroll', editorScrollHandler)

  previewEl.value?.addEventListener('scroll', previewScrollHandler, {
    passive: true,
  })

  const handleImages = async (
    e: Event,
    itemList: DataTransferItemList | undefined
  ) => {
    if (!props.uploadImages) return

    const files = Array.from(itemList ?? [])
      .map((item) => {
        if (item.type.startsWith('image/')) return item.getAsFile()
      })
      .filter((f): f is File => f !== null)

    if (files.length) {
      e.preventDefault()
      await handleImageUpload(context.value, props.uploadImages, files)
    }
  }

  editor.value?.on('drop', (_, e: any) => {
    handleImages(e, e.dataTransfer?.items)
  })

  editor.value?.on('paste', (_, e: any) => {
    handleImages(e, e.clipboardData?.items)
  })

  new ResizeObserver((entries) => {
    containerWidth.value = entries[0].contentRect.width
    console.log(containerWidth.value)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }).observe(root.value, { box: 'border-box' })
})

onBeforeUnmount(off)

const goToTop = () => {
  editor.value?.scrollTo(null, 0)
  previewEl.value?.scrollTo({
    top: 0,
  })
}

const onViewerHast = (e: any) => {
  hast.value = e.hast
  vFile.value = e.file
}

const onTocClick = (index: number) => {
  const headings = previewEl.value?.querySelectorAll('h1,h2,h3,h4,h5,h6')
  const target = headings![index] as HTMLElement
  if (target && previewEl.value) {
    previewEl.value.scrollTop = target.offsetTop - previewEl.value.offsetTop
  }
  // headings?.[index]?.scrollIntoView()
}
</script>

<template>
  <div ref="root" class="azimd">
    <div class="azimd-body flex">
      <div ref="editorEl" class="azimd-editor flex-1"></div>
      <div ref="previewEl" class="azimd-preview flex-1">
        <md-viewer
          v-model:value="debouncedValue"
          :plugins="plugins"
          :sanitize="props.sanitize"
          :remark-rehype="props.remarkRehype"
          @hast="onViewerHast"
        ></md-viewer>
      </div>
    </div>
    <md-status
      v-model:value="debouncedValue"
      :show-async="split"
      :sync-enabled="syncEnabled"
      :is-limited="props.value.length > props.maxLength"
      @sync="
        (value) => {
          syncEnabled = value
        }
      "
      @top="goToTop"
    ></md-status>
    <md-toc
      :hast="hast"
      :current-block-index="currentBlockIndex"
      visible
      @click="onTocClick"
    ></md-toc>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CodeMirrorComp',
}
</script>

<style lang="scss">
@import 'codemirror-ssr/lib/codemirror.css';

.azimd {
  height: 300px;
  .CodeMirror-scroll,
  .CodeMirror-sizer,
  .CodeMirror-gutter,
  .CodeMirror-gutters,
  .CodeMirror-linenumber {
    box-sizing: content-box;
  }

  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  color: black;
  border: 1px solid #ddd;
  background-color: white;

  .CodeMirror,
  code,
  kbd {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }
  // background: orange;
  &-body {
    height: 100%;
    overflow: auto;
  }

  &-editor {
    width: 100%;
    height: 100%;
    overflow: auto;
    scroll-behavior: smooth;
    vertical-align: top;
    border-right: 1px solid #ddd;
    .CodeMirror {
      height: 100%;
      font-size: 14px;
      line-height: 1.5;
      pre.CodeMirror-placeholder {
        color: gray;
      }
      .CodeMirror-lines {
        margin: 0 auto;
        max-width: 800px;
        padding: 16px 0;
      }
      pre.CodeMirror-line,
      pre.CodeMirror-line-like {
        padding: 0 4%;
      }
    }
  }

  &-preview {
    vertical-align: top;
    height: 100%;
    overflow: auto;
    scroll-behavior: smooth;
    .markdown-body {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px 4%;
    }
  }
}
</style>
