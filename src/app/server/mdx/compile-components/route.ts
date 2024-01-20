import { NextRequest, NextResponse } from 'next/server'

import { compileMdxComponent } from './compileMdxComponent'

export async function POST(request: NextRequest) {
  const { components } = (await request.json()) as { components: string[] }

  if (!components)
    return NextResponse.json(
      { message: 'Components not provided' },
      { status: 400 }
    )

  const compiledMdxComponents: string[] = []

  for (const component of components) {
    const mdx = await compileMdxComponent(component)

    compiledMdxComponents.push(JSON.stringify(mdx))
  }

  return NextResponse.json({ compiledMdxComponents })
}
