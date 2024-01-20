import { REGEX } from '@/utils/constants'

const mdxComponentRegex = REGEX.mdxComponent

export function formatDescription(description: string) {
  const mdxComponents: string[] = []
  let match: RegExpExecArray | null

  while ((match = mdxComponentRegex.exec(description)) !== null) {
    mdxComponents.push(match[0])
  }

  return mdxComponents
}
