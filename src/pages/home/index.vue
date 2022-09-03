<script lang="ts" setup>
import { openFileBox, addRecentOpendFile, readConfigFile } from '@/renderer'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import fs from 'fs'

const left = ref<HTMLElement>()
const resizer = ref<HTMLElement>()

const wrapper = ref<HTMLElement>()

const mdFile = ref({
  path: '',
  data: '',
  saved: true,
})

const recentFiles = ref<string[]>([])

onMounted(() => {
  watchEffect((ondestroy) => {
    resizer.value!.onpointerdown = (edown: PointerEvent) => {
      resizer.value!.onpointermove = function (emove: PointerEvent) {
        left.value!.style.width = emove.clientX + 'px'
        resizer.value?.setPointerCapture(edown.pointerId)
      }
      resizer.value!.onpointerup = (eup: PointerEvent) => {
        resizer.value!.onpointermove = null
        resizer.value?.releasePointerCapture(eup.pointerId)
      }
    }
    ondestroy(() => {
      resizer.value && (resizer.value.onpointerdown = null)
    })
  })

  watchEffect((ondestroy) => {
    if (wrapper.value) {
      wrapper.value.ondrop = function (e) {
        e.preventDefault()
        if (e.dataTransfer?.files) {
          if (e.dataTransfer.files.length > 1) {
            ElMessage.warning(`请只打开一个文件`)
            return
          }
          const file = e.dataTransfer.files[0]
          if (!file.name.endsWith('.md')) {
            ElMessage.warning(`请打开Markdown文件`)
            return
          }
          fs.readFile(file.path, 'utf-8', (err, data) => {
            if (err) {
              ElMessage.error(err.message)
              return
            }
            addRecentOpendFile(file.path).then(() => {
              mdFile.value = {
                path: file.path,
                data,
                saved: true,
              }
              getRencentFiles()
            })
          })
        }
      }

      wrapper.value.ondragover = function (e) {
        e.preventDefault()
      }
    }
    ondestroy(() => {
      if (wrapper.value) {
        wrapper.value.ondragover = null
        wrapper.value.ondrop = null
      }
    })
  })

  getRencentFiles()
})

const getRencentFiles = () => {
  readConfigFile('system.json').then((data: any) => {
    recentFiles.value = data?.recentFiles
  })
}

const openFile = () => {
  openFileBox().then((res: any) => {
    console.log(res)
    if (res) {
      mdFile.value = {
        ...res,
        saved: true,
      }
      getRencentFiles()
    }
  })
}

const activeNames = ref([])
const collapseChanged = (val: string[]) => {
  getRencentFiles()
}
</script>
<template>
  <div class="home-page flex">
    <div ref="left" class="file-preview" draggable>
      <el-scrollbar>
        <el-collapse v-model="activeNames" @change="collapseChanged">
          <el-collapse-item title="打开的文件" name="now">
            <div v-show="mdFile.path" class="opend-file active">
              <span v-show="!mdFile.saved" class="save-icon"></span>
              <span>{{ mdFile.path }}</span>
            </div>
            <div v-show="!mdFile.path" class="empty flex space-center">空</div>
          </el-collapse-item>
          <el-collapse-item title="最近打开的文件" name="recent">
            <template v-if="recentFiles">
              <div v-for="file in recentFiles" class="recent-file">
                {{ file }}
              </div>
            </template>
            <div v-else class="empty flex space-center">空</div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <div ref="resizer" class="dividerline"></div>
    <div class="file-wrapper flex-1">
      <el-scrollbar>
        <div v-if="!mdFile.path" class="darg-upload flex space-center">
          <div
            ref="wrapper"
            class="icon-wrapper flex flex-col space-center"
            @click="openFile"
          >
            <el-icon :size="36">
              <Plus />
            </el-icon>
            <p class="icon-tip m-t-24">拖拽或者点击打开文件</p>
          </div>
        </div>
        <div v-else>
          {{ mdFile.data }}
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomePage',
}
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  .file-preview {
    width: 200px;
    min-width: 120px;
    // background: pink;
  }
  .dividerline {
    position: relative;
    width: 1px;
    background: var(--el-color-info-light-5);
    cursor: w-resize;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -2px;
      width: 2px;
      height: 100%;
      display: inline-block;
      cursor: w-resize;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 2px;
      width: 2px;
      height: 100%;
      display: inline-block;
      cursor: w-resize;
    }
  }
  .file-wrapper {
    min-width: 360px;
  }

  .darg-upload {
    height: calc(100vh - 24px);
  }

  .icon-wrapper {
    width: 240px;
    height: 180px;
    border-radius: 16px;
    cursor: pointer;
    color: var(--el-color-primary-light-3);
    border: 4px dashed var(--el-color-primary-light-3);
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }
    .icon-tip {
      color: var(--el-color-info);
    }
  }
}

:deep(.el-collapse-item__header) {
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
}

.file-preview {
  .save-icon {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    margin-right: 4px;
  }
  .opend-file,
  .recent-file {
    padding: 0 10px;
    cursor: pointer;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .recent-file {
    &:hover {
      background: var(--el-color-info-light-9);
    }
  }
  .active {
    background: var(--el-color-info-light-7);
  }
}
</style>
