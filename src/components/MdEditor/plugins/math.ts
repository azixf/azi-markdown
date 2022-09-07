import { AzimdPlugin } from '@/type/editor'
import remarkMath from 'remark-math'
import katex, { type Options } from 'rehype-katex'
import { devLog } from '@/utils/logger'
import { OptionItem } from '@/pages/home'
import * as icon from '@icon-park/svg'

export default function math(katexOptions: Options = {}): AzimdPlugin {
  return {
    remark: (processor) => {
      devLog('remark-math is active !!!')
      return processor.use(remarkMath)
    },
    rehype: (processor) => processor.use(katex, katexOptions),
    actions: <OptionItem[]>[
      {
        label: '行内公式',
        value: 'inlineFormula',
        icon: icon.Inline({}),
        cheatsheet: '$公式',
        click: ({ wrapText, editor }) => {
          wrapText('$')
          editor.focus()
        },
      },
      {
        label: '块级公式',
        value: 'blockFormula',
        icon: icon.Block({}),
        cheatsheet: '$$↵公式↵$$',
        click: ({ appendBlock, editor, codemirror }) => {
          const { line } = appendBlock('$$\n\\TeX\n$$')
          editor.setSelection(codemirror.Pos(line, 0), codemirror.Pos(line, 4))
          editor.focus()
        },
      },
    ],
  }
}
