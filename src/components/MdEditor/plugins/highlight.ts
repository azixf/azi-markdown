import { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import rehypeHighlight, { type Options } from 'rehype-highlight'

export default function hight({
  subset = false,
  ignoreMissing = true,
  ...rest
}: Options = {}): AzimdPlugin {
  return {
    rehype: (processor) => {
      devLog('rehype-highlight is active !!!')
      return processor.use(rehypeHighlight, { subset, ignoreMissing, ...rest })
    },
  }
}
