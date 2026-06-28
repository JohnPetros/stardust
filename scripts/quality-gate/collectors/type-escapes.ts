import fs from 'node:fs'
import path from 'node:path'

import { fromRepoRoot, type WorkspaceConfig } from '../config'
import type { Metrics } from '../types'
import { isProductionSource, walkFiles } from './walk'

/**
 * Conta os "escape hatches" de tipagem que entram silenciosos: como
 * `noExplicitAny` está desligado no Biome, um `any` não dispara nenhum aviso.
 * A catraca congela essa contagem para que o projeto não vaze tipagem.
 */
const ANY_PATTERN = /:\s*any\b|\bas\s+any\b|<any>|Array<any>|Promise<any>/g
const TS_IGNORE_PATTERN = /@ts-ignore|@ts-expect-error/g

export function collectTypeEscapes(workspace: WorkspaceConfig): Metrics['typeEscapes'] {
  const workspaceRoot = fromRepoRoot(workspace.dir)
  const srcRoot = fromRepoRoot(workspace.dir, workspace.srcDir)
  const files = walkFiles(srcRoot, isProductionSource)

  let any = 0
  let tsIgnore = 0
  for (const file of files) {
    if (workspace.isIgnored?.(path.relative(workspaceRoot, file))) continue
    const content = fs.readFileSync(file, 'utf8')
    any += content.match(ANY_PATTERN)?.length ?? 0
    tsIgnore += content.match(TS_IGNORE_PATTERN)?.length ?? 0
  }

  return { any, tsIgnore, total: any + tsIgnore }
}
