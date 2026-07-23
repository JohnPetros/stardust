import fs from 'node:fs'
import path from 'node:path'

export function walkFiles(
  root: string,
  extensions: string[],
  excluded: RegExp[],
): string[] {
  const absoluteRoot = path.resolve(root)
  if (!fs.existsSync(absoluteRoot)) return []
  const files: string[] = []

  const visit = (directory: string): void => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name)
      const relative = path.relative(process.cwd(), absolute).split(path.sep).join('/')
      if (excluded.some((pattern) => pattern.test(relative))) continue
      if (entry.isDirectory()) visit(absolute)
      else if (entry.isFile() && extensions.includes(path.extname(entry.name)))
        files.push(absolute)
    }
  }

  visit(absoluteRoot)
  return files.sort()
}
