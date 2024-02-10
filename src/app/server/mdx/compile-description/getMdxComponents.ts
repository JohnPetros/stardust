import { REGEX } from '@/global/constants'

const mdxComponentRegex = REGEX.mdxComponent

export function getMdxComponents(description: string) {
  let match
  const mdxComponents: string[] = []

  while ((match = mdxComponentRegex.exec(description)) !== null) {
    mdxComponents.push(match[0])
  }

  return mdxComponents
}
