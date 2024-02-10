import { NextRequest, NextResponse } from 'next/server'

import compileDescription from './compileDescription'
import { getMdxComponents } from './getMdxComponents'

import { formatCode, getComponentContent } from '@/global/helpers'

const CONTENT_PLACEHOLDER = '@component-content'

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as { description: string }

  const mdxComponents = getMdxComponents(description)

  let descriptionWithoutMdxComponents = description

  for (const mdxComponent of mdxComponents) {
    const mdxComponentContent = getComponentContent(mdxComponent)

    if (!mdxComponentContent) {
      descriptionWithoutMdxComponents.replace(mdxComponent, '')
      continue
    }

    const mdxComponentWithoutContent = mdxComponent.replace(
      mdxComponentContent,
      CONTENT_PLACEHOLDER
    )

    descriptionWithoutMdxComponents = descriptionWithoutMdxComponents.replace(
      mdxComponent,
      mdxComponentWithoutContent
    )
  }

  const compiledDescription = await compileDescription(
    descriptionWithoutMdxComponents
  )

  for (const mdxComponent of mdxComponents) {
    const mdxComponentContent = getComponentContent(mdxComponent)
    if (!mdxComponentContent) continue

    compiledDescription.compiledSource =
      compiledDescription.compiledSource.replace(
        CONTENT_PLACEHOLDER,
        formatCode(mdxComponentContent, 'encode')
      )
  }

  return NextResponse.json({
    compiledDescription: JSON.stringify(compiledDescription),
  })
}
