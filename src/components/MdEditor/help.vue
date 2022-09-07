<script lang="ts" setup>
import { insertDom as vInsertDom, iconList, OptionItem } from '@/pages/layout'
import type { AzimdAction } from '@/type/editor'

interface PropsType {
  actions: AzimdAction[]
  visible: boolean
}

const props = defineProps<PropsType>()

const flatItems = (options: OptionItem[]) => {
  let items: Omit<OptionItem, 'children'>[] = []
  const actions = options.map((item) => item.children)

  actions.forEach((action) => {
    if (action) {
      items.push(...action)
    }
  })

  return items
}

const items = computed(() => {
  return flatItems(iconList[0].options)
})
</script>

<template>
  <h1>MdHelp</h1>
  <div v-if="props.visible" class="azimd-help p-l-8 p-r-8">
    <h2>Markdown 语法</h2>
    <ul>
      <template v-for="item in items">
        <li class="flex align-center justify-between p-l-8 p-r-8">
          <div>
            <div v-insert-dom="item.icon" class="azimd-help-icon p-r-6"></div>
            <div class="azimd-help-title">{{ item.label }}</div>
          </div>
          <div class="azimd-help-content">
            <!-- TODO -->
            <code>{{ item.label }}</code>
          </div>
        </li>
      </template>
    </ul>
    <h2>快捷键</h2>
    <ul>
      <template v-for="item in items">
        <li class="flex align-center justify-between p-l-8 p-r-8">
          <div>
            <div v-insert-dom="item.icon" class="azimd-help-icon p-r-6"></div>
            <div class="azimd-help-title">{{ item.label }}</div>
          </div>
          <div class="azimd-help-content">
            <!-- TODO -->
            <code>{{ item.label }}</code>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MdHelp',
}
</script>

<style lang="scss">
.azimd {
  &-help {
    font-size: 13px;
    ul {
      line-height: 20px;
      list-style: none;
      svg {
        width: 16px;
        height: 16px;
        display: block;
      }
    }
    li {
      margin-bottom: 12px;
    }

    &-content {
      font-size: 12px;
    }
  }
}
</style>
