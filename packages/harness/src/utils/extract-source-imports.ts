import fs from 'node:fs'
import path from 'node:path'

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]|(?:require|import)\(\s*['"]([^'"]+)['"]\s*\)/g

export type SourceImport = {
  source: string
  line: number
}

export function extractImports(file: string): SourceImport[] {
  const content = fs.readFileSync(file, 'utf8')
  const imports: SourceImport[] = []
  for (const match of content.matchAll(IMPORT_PATTERN)) {
    const source = match[1] ?? match[2]
    if (!source) continue
    imports.push({
      source,
      line: content.slice(0, match.index).split('\n').length,
    })
  }
  return imports
}

export function resolveRelativeImport(
  importer: string,
  source: string,
  extensions: string[],
): string | undefined {
  if (!source.startsWith('.')) return undefined
  const candidate = path.resolve(path.dirname(importer), source)
  const candidates = [
    candidate,
    ...extensions.map((extension) => `${candidate}${extension}`),
    ...extensions.map((extension) => path.join(candidate, `index${extension}`)),
  ]
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile())
}
