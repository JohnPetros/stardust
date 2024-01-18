import { NextRequest, NextResponse } from 'next/server'

import { getMdxComponent } from './getMdxComponent'

import type { Text } from '@/@types/text'

export async function POST(request: NextRequest) {
  const { texts } = (await request.json()) as { texts: Text[] }

  if (!texts)
    return NextResponse.json({ message: 'Texts not provided' }, { status: 400 })

  const mdxComponents = texts.map(getMdxComponent)

  return NextResponse.json({ mdxComponents })
}
