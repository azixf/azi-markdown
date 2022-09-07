import { OptionItem } from '@/pages/home'
import { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import remarkGfm from 'remark-gfm'
import * as icon from '@icon-park/svg'

export default function gfm(): AzimdPlugin {
  return {
    remark: (processor) => {
      devLog('remark-gfm is active!!!')
      return processor.use(remarkGfm)
    },
    actions: <OptionItem[]>[
      {
        label: '删除线',
        value: 'strike',
        icon: icon.Strikethrough({}),
        cheatsheet: '~~文本~~',
        click: ({ wrapText, editor }) => {
          wrapText('~~')
          editor.focus()
        },
      },
      {
        label: '任务列表',
        value: 'task',
        cheatsheet: '- [] 任务事项',
        icon: icon.CheckCorrect({}),
        click: ({ replaceLines, editor }) => {
          replaceLines((line) => '- [] ' + line)
          editor.focus()
        },
      },
      {
        label: '表格',
        value: 'table',
        icon: icon.InsertTable({}),
        click: ({ editor, appendBlock, codemirror }) => {
          const { line } = appendBlock('| 标题 | |\n| --- | --- |\n|  |  |\n')
          editor.setSelection(codemirror.Pos(line, 2), codemirror.Pos(line, 4))
          editor.focus()
        },
      },
    ],
  }
}
