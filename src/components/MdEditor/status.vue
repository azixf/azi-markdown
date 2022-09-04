<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import wordCount from 'word-count'
import { CheckboxValueType } from 'element-plus'
interface PropsType {
  showAsync?: boolean
  value?: string
  syncEnabled?: boolean
  isLimited?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  value: '',
  showAsync: true,
  syncEnabled: true,
  isLimited: false,
})

const emit = defineEmits<{
  (e: 'sync', value: boolean): void
  (e: 'top'): void
}>()

const sync = computed({
  get() {
    return props.syncEnabled
  },
  set(value: boolean) {
    emit('sync', value)
  },
})

const words = computed(() => {
  return wordCount(props.value)
})

const lines = computed(() => {
  return props.value.split('\n').length
})

const onSyncChanged = (value: CheckboxValueType) => {
  sync.value = !!value
}

const onGoToTop = () => {
  emit('top')
}
</script>

<template>
  <div class="azimd-status flex align-center justify-between">
    <div class="azimd-status-left">
      <span>
        总字数: <strong>{{ words }}</strong></span
      >
      <span>
        总行数: <strong>{{ lines }}</strong></span
      >
      <span v-if="props.isLimited" class="azimd-status-error"
        >已达最大字符限制</span
      >
    </div>

    <div class="azimd-status-right flex align-center">
      <el-space :size="12">
        <template v-if="props.showAsync">
          <el-checkbox v-model="sync" size="small" @change="onSyncChanged"
            >同步滚动</el-checkbox
          >
        </template>
        <el-link :underline="false" @click="onGoToTop">回到顶部</el-link>
      </el-space>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MdStatusComp',
}
</script>

<style lang="scss" scoped>
.azimd-status {
  font-size: 12px;
  border-top: 1px solid #ddd;
  user-select: none;
  &-left {
    span {
      padding-left: 16px;
    }
    strong {
      font-weight: 600;
      color: var(--el-color-primary);
    }
  }

  &-error {
    color: var(--el-primary-error);
  }

  :deep(.el-link) {
    font-size: 12px;
  }
}
</style>
