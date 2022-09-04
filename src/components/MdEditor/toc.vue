<script lang="ts" setup>
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

interface PropsType {
  hast: Root
  currentBlockIndex: number
  visible: boolean
}

const props = defineProps<PropsType>()

const emit = defineEmits<{
  (e: 'click', index: number): void
}>()

let items: { level: number; text: string }[]
const minLevel = ref(6)

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const currentHeadingIndex = ref(0)

function stringifyHeading(e: Element) {
  let result = ''
  visit(e, (node) => {
    if (node.type === 'text') result += node.value
  })
  return result
}

const headingItems = computed(() => {
  items = []
  currentHeadingIndex.value = 0

  props.hast.children
    .filter((v): v is Element => v.type === 'element')
    .forEach((node, index) => {
      if (node.tagName[0] === 'h' && !!node.children.length) {
        const i = Number(node.tagName[1])
        minLevel.value = Math.min(minLevel.value, i)
        items.push({
          level: i,
          text: stringifyHeading(node),
        })
      }

      if (props.currentBlockIndex >= index) {
        currentHeadingIndex.value = items.length - 1
      }
    })
  return items
})

const onHeadingClicked = (index: number) => {
  emit('click', index)
  currentHeadingIndex.value = index
}

const style = computed(() => {
  return function (level: number) {
    return {
      paddingLeft: (level - minLevel.value) * 16 + 8 + 'px',
    }
  }
})
</script>

<template>
  <h1>MdToc</h1>
  <div v-if="props.visible" class="azimd-toc">
    <ul>
      <template v-for="(item, index) in headingItems">
        <li
          :class="[
            `azimd-toc-${item.level}`,
            {
              'azimd-toc-active': currentHeadingIndex === index,
              'azimd-toc-first': item.level === minLevel,
            },
          ]"
          :style="style(item.level)"
          @click="onHeadingClicked(index)"
        >
          {{ item.text }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MdToc',
}
</script>

<style lang="scss" scoped>
.azimd-toc {
  li {
    list-style: none;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 2;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  &-active {
    color: var(--el-color-primary);
    background-color: #f6f8fa;
  }
  &-first {
    font-weight: 500;
  }
}
</style>
