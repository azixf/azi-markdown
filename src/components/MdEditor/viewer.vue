<script lang="ts" setup>
import type { Root } from 'hast'
import type { VFile } from 'vfile'
import type { Plugin } from 'unified'
import type { AzimdPlugin, ViewerProps as Props } from '@/type/editor'
import { getProcessor } from './utils'

interface PropsType {
  value?: Props['value']
  plugins?: Props['plugins']
  sanitize?: Props['sanitize']
  remarkRehype?: Props['remarkRehype']
}

const props = withDefaults(defineProps<PropsType>(), {
  value: '',
  plugins: undefined,
  sanitize: undefined,
  remarkRehype: undefined,
})

const emit = defineEmits<{
  (e: 'hast', { hast, file }: { hast: Root; file: VFile }): void
}>()

const markdownBody = ref<HTMLElement | null>()

const dispatchPlugin: Plugin<any[], Root> = () => (tree, file) => {
  nextTick(() => {
    emit('hast', { hast: tree, file })
  })
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let i = 0
const file = computed(() => {
  try {
    const file = getProcessor({
      sanitize: props.sanitize,
      plugins: [
        ...(props.plugins ? props.plugins : []),
        {
          rehype: (processor) => processor.use(dispatchPlugin),
        },
      ],
      remarkRehype: props.remarkRehype,
    }).processSync(props.value)
    i++
    return file
  } catch (err) {
    console.error(err)
    return null
  }
})

const html = computed(() => {
  return `${file.value}<!--${i}-->`
})

let cbs: ReturnType<NonNullable<AzimdPlugin['viewerEffect']>>[] = []

function on() {
  cbs = props.plugins
    ? props.plugins.map((plugin) =>
        plugin.viewerEffect?.({
          markdownBody: markdownBody.value!,
          file: file.value!,
        })
      )
    : []
}

function off() {
  cbs?.forEach((cb) => cb?.())
}

onUpdated(() => {
  off()
  on()
})

onMounted(() => {
  watchEffect((onDestroy) => {
    const clickHandler = (e: MouseEvent) => {
      const $ = e.target as HTMLElement
      if ($.tagName !== 'A') return

      const href = $.getAttribute('href')
      if (!href?.startsWith('#')) return

      markdownBody.value
        ?.querySelector('#user-content-' + href.slice(1))
        ?.scrollIntoView()
    }

    markdownBody.value?.addEventListener('click', clickHandler)

    onDestroy(() => {
      markdownBody.value?.removeEventListener('click', clickHandler)
    })
  })
})

onBeforeUnmount(off)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="markdownBody" class="markdown-body" v-html="html"></div>
</template>

<script lang="ts">
export default {
  name: 'MdViewer',
}
</script>

<style lang="scss" scoped></style>
