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

const confirm = async () => {
  dialogVisible.value = false
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 200)
  })
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
    <header class="layout-header flex align-center justify-between">
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
      <div class="header-right flex align-center">
        <el-popover placement="bottom" :width="180" trigger="hover">
          <template #reference>
            <el-button text size="small">文件</el-button>
          </template>
          <div class="pop-content">
            <div class="pop-item">打开文件 Ctrl + O</div>
            <div class="pop-item">打开最近文件</div>
            <div class="pop-item">创建文件</div>
            <div class="pop-item">保存文件 Ctrl + S</div>
            <div class="pop-item">文件另存为 Ctrl + Shift + S</div>
            <div class="pop-item divider"></div>
            <div class="pop-item">退出编辑器</div>
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <el-button text size="small">编辑</el-button>
          </template>
          <div class="pop-content">
            <div class="pop-item">撤销 Ctrl + Z</div>
            <div class="pop-item">恢复 Ctrl + Y</div>
            <div class="pop-item divider"></div>
            <div class="pop-item">剪切 Crtl + X</div>
            <div class="pop-item">复制 Ctrl + C</div>
            <div class="pop-item">粘贴 Ctrl + V</div>
            <div class="pop-item divider"></div>
            <div class="pop-item">查找 Ctrl + F</div>
            <div class="pop-item">替换 Ctrl + H</div>
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <el-button text size="small">选择</el-button>
          </template>
          <div class="pop-content">
            <div class="pop-item">全选 Ctrl + A</div>
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <el-button text size="small">帮助</el-button>
          </template>
          <div class="pop-content">
            <div class="pop-item">检查更新</div>
            <div class="pop-item divider"></div>
            <div class="pop-item">关于</div>
          </div>
        </el-popover>
      </div>
    </header>
    <div class="ocupier"></div>
    <el-scrollbar>
      <div class="content">
        <router-view></router-view>
      </div>
    </el-scrollbar>
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

<style lang="scss">
.el-popover.el-popper {
  padding: 0;
}

.el-popper {
  top: -10px !important;
}
</style>

<style lang="scss" scoped>
.layout-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .layout-header {
    height: 24px;
    width: 100vw;
    padding: 0 8px;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #eee;
    box-shadow: 0 1px 10px #eee;
    background-color: #fff;
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
    .header-right {
      -webkit-app-region: no-drag;
    }
  }
  .ocupier {
    height: 24px;
  }
  .content {
    height: calc(100vw - 24px);
  }
}

.el-popper {
  .pop-content {
    width: 100%;
    font-size: 12px;
    padding: 8px 0;
  }
  .pop-item {
    cursor: pointer;
    padding: 0 8px;
    &:not(:last-of-type) {
      margin-bottom: 4px;
    }
    &:hover {
      background: var(--el-color-info-light-7);
    }
  }
  .divider {
    height: 1px;
    margin: 8px 0;
    overflow: hidden;
    background: var(--el-color-info-light-9);
    pointer-events: none;
  }
}
</style>
