import { serialize } from 'next-mdx-remote/serialize'

import { captureTextBetweenBackticks } from './captureTextBetweenBackticks'

export async function compileMdx(content: string) {
  const textsbetweenBacktcks = captureTextBetweenBackticks(content)

  let contentbetweenBackticks = content

  for (const text of textsbetweenBacktcks) {
    contentbetweenBackticks = contentbetweenBackticks.replace(
      `\`${text}\``,
      text
    )
  }

  const source = await serialize(
    contentbetweenBackticks.length > 0 ? contentbetweenBackticks : content
  )

  if (textsbetweenBacktcks.length)
    for (const text of textsbetweenBacktcks) {
      source.compiledSource = source.compiledSource.replace(
        ` ${text} `,
        `\`${text}\``
      )
    }

  return source
}
