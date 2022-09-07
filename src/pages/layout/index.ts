import type { CascaderOption } from 'element-plus'
import * as icons from '@icon-park/svg'
import { AzimdEditorContext } from '@/type/editor'

export const insertDom = {
  mounted: (el: HTMLElement, { value }: { value: string }) => {
    const i = document.createElement('i')
    i.innerHTML = value
    el.appendChild(i)
  },
}

export interface OptionItem extends CascaderOption {
  icon?: string
  shortcut?: string
  cheatsheet?: string
  // eslint-disable-next-line no-unused-vars
  click?: (context: AzimdEditorContext) => void
  children?: Omit<OptionItem, 'children'>[]
}

export interface IconListItem {
  title: string
  options: OptionItem[]
}

export const iconList: IconListItem[] = [
  {
    title: '编辑',
    options: [
      {
        label: '标题',
        value: 'title',
        children: [
          {
            label: '一级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: (context: AzimdEditorContext) => {
              context.replaceLines((line: string) => {
                line = line.trim().replace(/^#*/, '').trim()
                line = '#'.repeat(1) + ' ' + line
                return line
              })
              context.editor.focus()
            },
          },
          {
            label: '二级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: () => {
              console.log('h1')
            },
          },
          {
            label: '三级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: () => {
              console.log('h1')
            },
          },
          {
            label: '四级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: () => {
              console.log('h1')
            },
          },
          {
            label: '五级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: () => {
              console.log('h1')
            },
          },
          {
            label: '六级标题',
            value: 'h1',
            icon: icons.H1({}),
            click: () => {
              console.log('h1')
            },
          },
        ],
      },
      {
        label: '文字样式',
        value: 'text',
        children: [
          {
            label: '加粗',
            value: 'bold',
            icon: icons.TextBold({}),
            click: () => {
              console.log('bold')
            },
          },
          {
            label: '斜体',
            value: 'italic',
            icon: icons.TextItalic({}),
            click: () => {
              console.log('italic')
            },
          },
        ],
      },
    ],
  },
]
