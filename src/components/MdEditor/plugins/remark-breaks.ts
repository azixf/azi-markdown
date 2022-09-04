import { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import remarkBreaks from 'remark-breaks'

/**
 * translate [enter] into <br />
 */
export default function breaks(): AzimdPlugin {
  return {
    remark: (processor) => {
      devLog('remark-breaks plugin is successfully installed !!!')
      return processor.use(remarkBreaks)
    },
  }
}
