<script setup lang="ts">
import { readConfigFile } from '@/renderer'
import { changeTheme } from '@/utils/changetheme'

const themes = [
  'arknights',
  'awesome-green',
  'channing-cyan',
  'Chinese-red',
  'condensed-night-purple',
  'cyanosis',
  'devui-blue',
  'fancy',
  'geek-black',
  'github',
  'greenwillow',
  'healer-readable',
  'hydrogen',
  'juejin',
  'jzman',
  'mk-cute',
  'nico',
  'orange',
  'qklhk-chocolate',
  'scrolls-light',
  'simplicity-green',
  'smartblue',
  'v-green',
  'vue-pro',
  'vuepress',
]

const highlights = [
  'a11y-dark',
  'a11y-light',
  'agate',
  'an-old-hope',
  'androidstudio',
  'arduino-light',
  'arta',
  'ascetic',
  'atom-one-dark-reasonable',
  'atom-one-dark',
  'atom-one-light',
  'brown-paper',
  'codepen-embed',
  'color-brewer',
  'dark',
  'default',
  'devibeans',
  'docco',
  'far',
  'felipec',
  'foundation',
  'github-dark-dimmed',
  'github-dark',
  'github',
  'gml',
  'googlecode',
  'gradient-dark',
  'gradient-light',
  'grayscale',
  'hybrid',
  'idea',
  'intellij-light',
  'ir-black',
  'isbl-editor-dark',
  'isbl-editor-light',
  'kimbie-dark',
  'kimbie-light',
  'lightfair',
  'lioshi',
  'magula',
  'mono-blue',
  'monokai-sublime',
  'monokai',
  'night-owl',
  'nnfx-dark',
  'nnfx-light',
  'nord',
  'obsidian',
  'paraiso-dark',
  'paraiso-light',
  'pojoaque',
  'purebasic',
  'qtcreator-dark',
  'rainbow',
  'routeros',
  'school-book',
  'shades-of-purple',
  'srcery',
  'stackoverflow-light',
  'sunburst',
  'tokyo-night-dark',
  'tokyo-night-light',
  'tomorrow-night-blue',
  'tomorrow-night-bright',
  'vs',
  'vs2015',
  'xcode',
  'xt256',
]

const text = ref('')
const handleChange = (e: string) => {
  text.value = e
}

const theme = ref('')
const highlight = ref('')

onMounted(() => {
  readConfigFile('system.json').then((res: any) => {
    theme.value = res.editor.theme
    highlight.value = res.editor.highlight
  })
})

const onHighlightChanged = (val: string) => {
  highlight.value = val
  changeTheme(val, true)
}

const onThemeChanged = (val: string) => {
  theme.value = val
  changeTheme(val)
}
</script>

<template>
  <h1>TestPage</h1>
  <div>
    <el-select v-model="theme" placeholder="选择主题" @change="onThemeChanged">
      <el-option
        v-for="item in themes"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-select
      v-model="highlight"
      placeholder="选择代码样式"
      @change="onHighlightChanged"
    >
      <el-option
        v-for="item in highlights"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
  <div>
    <md-editor v-model:value="text" @change="handleChange"></md-editor>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TestPage',
}
</script>

<style lang="scss" scoped></style>
