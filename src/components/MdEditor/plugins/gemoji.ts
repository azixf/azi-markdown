import { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import remarkGemoji from 'remark-gemoji'

export default function gemoji(): AzimdPlugin {
  return {
    remark: (processor) => {
      devLog('remark-gemoji is active!!!')
      return processor.use(remarkGemoji)
    },
  }
}
