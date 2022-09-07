import type { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import remarkFrontmatter from 'remark-frontmatter'
import { load } from 'js-yaml'

export interface AzimdPluginFrontmatterOptions {
  // eslint-disable-next-line no-unused-vars
  onError?(err: any): void
}

declare module 'vfile' {
  interface VFile {
    frontmatter: ReturnType<typeof load>
  }
}

/**
 * FrontMatter 是指文件最顶部对正文进行配置的部分
 */

export default function frontmatter({
  onError,
}: AzimdPluginFrontmatterOptions = {}): AzimdPlugin {
  return {
    remark: (processor) => {
      devLog('remark-frontmatter plugin is active !!!')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-nocheck
      return processor
        .use(remarkFrontmatter)
        .use(() => (tree: any, file: any) => {
          const firstNode = tree.children[0]
          if (firstNode?.type !== 'yaml') return

          try {
            file.frontmatter = load(firstNode.value)
          } catch (err) {
            onError?.(err)
          }
        })
    },
  }
}
