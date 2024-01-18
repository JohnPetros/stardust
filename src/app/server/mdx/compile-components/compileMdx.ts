import { serialize } from 'next-mdx-remote/serialize'

import { captureTextBetweenBackticks } from './captureTextBetweenBackticks'

import { formatCode } from '@/utils/helpers'

export async function compileMdx(component: string) {
  const textsbetweenBacktcks = captureTextBetweenBackticks(component)

  const isCodeComponent = component.slice(-7) === '</Code>'

  let formattedComponent = ''

  if (isCodeComponent) {
    const closeTagIndex = component.indexOf('>')

    formattedComponent =
      component.slice(0, closeTagIndex) +
      formatCode(component.slice(closeTagIndex), 'encode')
  } else {
    formattedComponent = component
  }

  for (const text of textsbetweenBacktcks) {
    formattedComponent = formattedComponent.replace(`\`${text}\``, text)
  }

  const mdx = await serialize(
    formattedComponent.length > 0 ? formattedComponent : component
  )

  if (textsbetweenBacktcks.length)
    for (const text of textsbetweenBacktcks) {
      mdx.compiledSource = mdx.compiledSource.replace(
        ` ${text} `,
        `\`${text}\``
      )
    }

  return mdx
}