import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'next-mdx-remote/serialize'

import { REGEX } from '@/utils/constants'
const backticksRegex = REGEX.backticks

function captureTextBetweenBackticks(text: string) {
  const matches = Array.from(text.matchAll(backticksRegex), (match) => match[1])

  return matches
}

export async function POST(request: NextRequest) {
  const { content } = await request.json()

  if (!content)
    return NextResponse.json(
      { message: 'Content not provided' },
      { status: 400 }
    )

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

  return NextResponse.json({ source })
}
