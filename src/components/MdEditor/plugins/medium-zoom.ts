import { AzimdPlugin } from '@/type/editor'
import { devLog } from '@/utils/logger'
import type * as M from 'medium-zoom'

export interface AzimdPluginMediumZoomOptions extends M.ZoomOptions {
  // eslint-disable-next-line no-unused-vars
  filter?: (img: HTMLImageElement) => boolean
}

export default function mediumRoom(
  options?: AzimdPluginMediumZoomOptions
): AzimdPlugin {
  let m: typeof M
  devLog('medium-zoom plugin is active')
  return {
    viewerEffect({ markdownBody }) {
      const imgs = [].slice
        .call(markdownBody.querySelectorAll('img'), 0)
        .filter((img: HTMLImageElement) => {
          return (options?.filter?.(img) ?? true) && !img.closest('a')
        })
      if (imgs.length === 0) return
      ;(async () => {
        if (!m) {
          m = await import('medium-zoom')
        }
        m.default(imgs, options)
      })()
    },
  }
}
