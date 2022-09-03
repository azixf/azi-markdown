import { readConfigFile, writeConfigFile } from '@/renderer'

export function changeTheme(theme: string, isHighlight?: boolean) {
  readConfigFile('system.json').then((res: any) => {
    const data = res
    if (isHighlight) {
      data.editor.highlight = theme
    } else {
      data.editor.theme = theme
    }
    writeConfigFile('system.json', JSON.stringify(data))
  })
  const origin = 'http://cdn.xieblog.ltd/cdn/css'
  const url = isHighlight
    ? `${origin}/highlight/styles/${theme}.css`
    : `${origin}/juejin-markdown-themes/dist/${theme}.min.css`

  const head = document.getElementsByTagName('head')[0]
  const links = document.getElementsByTagName('link')
  if (links.length) {
    const items = [].slice.call(links, 0)
    items.map((item: HTMLElement) => {
      if (
        (isHighlight && item.dataset.highlight) ||
        (!isHighlight && item.dataset.theme)
      ) {
        item?.parentNode?.removeChild(item)
      }
    })
  }
  const link = document.createElement('link')
  link.href = url
  if (isHighlight) {
    link.dataset.highlight = theme
  } else {
    link.dataset.theme = theme
  }
  link.rel = 'stylesheet'
  link.type = 'text/css'
  head.appendChild(link)
}
