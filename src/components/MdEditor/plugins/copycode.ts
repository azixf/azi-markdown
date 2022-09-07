import { AzimdPlugin } from '@/type/editor'
import * as icon from '@icon-park/svg'

export interface CopyCodeOptions {
  copyText?: string
  copyIcon?: string
  theme?: 'dark' | 'light'
  // eslint-disable-next-line no-unused-vars
  copySuccess?: (text?: string) => void
  // eslint-disable-next-line no-unused-vars
  copyError?: (err?: any) => void
  copyright?: string
}

export default function copyCode(options: CopyCodeOptions = {}): AzimdPlugin {
  function createElement(
    tag: string,
    innerHTML: string,
    className: string,
    id?: string
  ): HTMLElement {
    const element = document.createElement(tag)
    element.classList.add(className)
    id && element.setAttribute('id', id)
    element.innerHTML = innerHTML
    return element
  }

  function copyCode(node: HTMLElement) {
    node.onclick = () => {
      let str = ''
      node.parentNode?.parentNode?.children[0].childNodes.forEach((ele) => {
        str += ele.textContent
      })
      if (options.copyright) {
        str += options.copyright
      }
      navigator.clipboard.writeText(str).then(
        () => {
          typeof options.copySuccess === 'function' && options.copySuccess(str)
        },
        (err) => {
          typeof options.copyError === 'function' && options.copyError(err)
        }
      )
    }
  }

  return {
    viewerEffect({ markdownBody }) {
      ;(async (markdownBody: HTMLElement) => {
        ;[].slice
          .call(markdownBody.querySelectorAll('pre'))
          .forEach((ele: HTMLPreElement) => {
            const operateBtn = createElement('div', '', 'azmide-operate-btn')
            operateBtn.style.cssText = `
                float: right;
                font-size: 12px;
                margin: 8px 8px 8px 0;
                padding: 0 2px;
                border: 1px solid #1890ff;
                border-radius: 4px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: flex-end;
                `
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const lang = ele.childNodes[0]['className'].split('-')[1]
            if (lang) {
              const langBtn = createElement('div', lang, 'azimd-lang-btn')
              langBtn.style.cssText = `
                display: flex;
                align-items: center;
              `
              operateBtn.appendChild(langBtn)
            }
            ele.appendChild(operateBtn)

            let copyText: HTMLElement
            if (!options.copyIcon && !options.copyText) {
              copyText = createElement('div', icon.Copy({}), 'azimd-copy-btn')
            }
            if (options.copyIcon) {
              copyText = createElement(
                'div',
                options.copyIcon,
                'azimd-copy-btn'
              )
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            copyText.style.cssText = `
              margin-left: 2px;
              display: flex;
              align-items: center;
            `

            if (options.copyText) {
              copyText = createElement(
                'div',
                options.copyText,
                'azimd-copy-btn'
              )
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            operateBtn.appendChild(copyText)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            copyCode(copyText)
          })
      })(markdownBody)
    },
  }
}
