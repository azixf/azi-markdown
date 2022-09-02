<script setup lang="ts">
import { Minus, Close, FullScreen } from '@element-plus/icons-vue'
import {
  windowOperate,
  readConfigFile,
  writeConfigFile,
} from '@/renderer/window'

const dialogVisible = ref(false)
const closeType = ref('')
const remember = ref(false)
let system: any = {}

const handleIconClick = (type: string) => {
  if (type === 'close') {
    readConfigFile('system.json').then((res: any) => {
      console.log(res)
      system = res
      if (!system.close || system.close === 'inquirer') {
        dialogVisible.value = true
      } else if (system.close === 'close') {
        windowOperate('close')
      } else {
        windowOperate('tray')
      }
    })
  } else {
    windowOperate(type)
  }
}

const cancel = () => {
  closeType.value = ''
  remember.value = false
  dialogVisible.value = false
}

const confirm = () => {
  console.log('confirm')
  dialogVisible.value = false
  windowOperate(closeType.value)
  if (remember.value) {
    Object.assign(system, {
      close: closeType.value,
    })
    writeConfigFile('system.json', JSON.stringify(system)).then((res) => {
      console.log(res)
    })
  }
}
</script>

<template>
  <div class="layout-page">
    <header class="layout-header flex align-center">
      <div class="header-left flex align-center">
        <div
          class="icon-wrapper danger flex space-center"
          @click="handleIconClick('close')"
        >
          <el-tooltip effect="dark" content="关闭" placement="bottom">
            <el-icon :size="12" color="#ffffff">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
        <div
          class="icon-wrapper warning flex space-center"
          @click="handleIconClick('fullscreen')"
        >
          <el-tooltip effect="dark" content="全屏" placement="bottom">
            <el-icon :size="12" color="#ffffff">
              <FullScreen />
            </el-icon>
          </el-tooltip>
        </div>
        <div
          class="icon-wrapper success flex space-center"
          @click="handleIconClick('minimize')"
        >
          <el-tooltip effect="dark" content="最小化" placement="bottom">
            <el-icon :size="12" color="#ffffff">
              <Minus />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </header>
    <div class="ocupier"></div>
    <router-view></router-view>
    <el-dialog v-model="dialogVisible" title="关闭窗口" width="45%" center>
      <el-radio-group v-model="closeType">
        <el-radio label="close" size="large">直接退出</el-radio>
        <el-radio label="tray" size="large">最小化到托盘</el-radio>
      </el-radio-group>
      <el-checkbox v-model="remember" class="m-t-8">记住我的选择</el-checkbox>
      <div class="m-t-16">
        <el-space class="flex justify-center" :size="24">
          <el-button @click="cancel">取消</el-button>
          <el-button :disabled="!closeType" type="primary" @click="confirm"
            >确定</el-button
          >
        </el-space>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayoutPage',
}
</script>

<style lang="scss" scoped>
.layout-page {
  width: 100vw;
  height: 100vh;
  .layout-header {
    height: 24px;
    width: 100vw;
    padding: 0 8px;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #eee;
    box-shadow: 0 1px 10px #eee;
    -webkit-app-region: drag;
    .icon-wrapper {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
    .icon-wrapper:not(:last-of-type) {
      margin-right: 4px;
    }
    .danger {
      background-color: var(--el-color-error);
    }
    .warning {
      background-color: var(--el-color-warning);
    }
    .success {
      background-color: var(--el-color-success);
    }
  }
  .ocupier {
    height: 24px;
  }
}
</style>
