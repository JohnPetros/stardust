import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'next-mdx-remote/serialize'

import { REGEX } from '@/utils/constants'
const backticksRegex = REGEX.backticks

function captureTextWithinBackticks(text: string) {
  let capturedText
  const texts = []

  while ((capturedText = backticksRegex.exec(text))) {
    texts.push(capturedText[1])
  }

  return texts
}

export async function POST(request: NextRequest) {
  const { content } = await request.json()

  if (!content)
    return NextResponse.json(
      { message: 'Content not provided' },
      { status: 400 }
    )

  const textsWithinBacktcks = captureTextWithinBackticks(content)

  let contentWithoutBackticks = content

  for (const text of textsWithinBacktcks) {
    contentWithoutBackticks = contentWithoutBackticks.replace(
      `\`${text}\``,
      text
    )
  }

  const source = await serialize(
    contentWithoutBackticks.length > 0 ? contentWithoutBackticks : content
  )

  if (textsWithinBacktcks.length)
    for (const text of textsWithinBacktcks) {
      source.compiledSource = source.compiledSource.replace(text, `\`${text}\``)
    }

  return NextResponse.json({ source })
}
