import fs from 'node:fs'
import path from 'node:path'

/** Lista recursivamente os arquivos sob `dir` que satisfazem `accept`. */
export function walkFiles(dir: string, accept: (filePath: string) => boolean): string[] {
  const found: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'build' || entry.name === '.next') continue
      found.push(...walkFiles(fullPath, accept))
    } else if (entry.isFile() && accept(fullPath)) {
      found.push(fullPath)
    }
  }
  return found
}

/** Aceita arquivos `.ts`/`.tsx` de produção (exclui testes e fakers). */
export function isProductionSource(filePath: string): boolean {
  if (!/\.tsx?$/.test(filePath)) return false
  if (/\.test\.tsx?$/.test(filePath)) return false
  if (/\.spec\.tsx?$/.test(filePath)) return false
  if (filePath.includes(`${path.sep}tests${path.sep}`)) return false
  if (filePath.includes(`${path.sep}fakers${path.sep}`)) return false
  return true
}
