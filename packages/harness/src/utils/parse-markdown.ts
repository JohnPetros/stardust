export type MarkdownDocument = {
  frontmatter: Record<string, string>
  body: string
  headings: Array<{ depth: number; title: string; line: number }>
}

function unquote(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function parseMarkdown(source: string): MarkdownDocument {
  const normalized = source.replaceAll('\r\n', '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  const frontmatter: Record<string, string> = {}

  if (match) {
    for (const line of match[1].split('\n')) {
      if (!line.trim() || line.trimStart().startsWith('#')) continue
      const separatorIndex = line.indexOf(':')
      if (separatorIndex < 1 || /^\s/.test(line)) continue
      const key = line.slice(0, separatorIndex).trim()
      frontmatter[key] = unquote(line.slice(separatorIndex + 1))
    }
  }

  const body = match ? normalized.slice(match[0].length) : normalized
  const headings = body.split('\n').flatMap((line, index) => {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    return heading
      ? [{ depth: heading[1].length, title: heading[2], line: index + 1 }]
      : []
  })

  return { frontmatter, body, headings }
}

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function sectionBody(
  document: MarkdownDocument,
  headingPattern: RegExp,
): string | null {
  const lines = document.body.split('\n')
  const headingIndex = document.headings.findIndex((heading) =>
    headingPattern.test(normalizeText(heading.title)),
  )
  if (headingIndex < 0) return null

  const heading = document.headings[headingIndex]
  const startLineIndex = heading.line
  const nextHeading = document.headings
    .slice(headingIndex + 1)
    .find((candidate) => candidate.depth <= heading.depth)
  const endLineIndex = nextHeading ? nextHeading.line - 1 : lines.length
  return lines.slice(startLineIndex, endLineIndex).join('\n')
}
