import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'next-mdx-remote/serialize'

export async function POST(request: NextRequest) {
  const { content } = await request.json()

  const source = await serialize(content)

  return NextResponse.json({ source })
}
