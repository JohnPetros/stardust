import fs from 'node:fs'
import path from 'node:path'

import type { Metrics } from '../define-metrics'
import { fromRepoRoot, type WorkspaceConfig } from '../get-workspace'
import { isProductionSource, walkFiles } from './walk-files'

/**
 * Lista os arquivos acima do limite de linhas (os "offenders").
 *
 * A catraca congela os offenders atuais com sua contagem: nenhum arquivo novo
 * pode cruzar o limite e nenhum offender existente pode crescer.
 */
export function collectFileSize(workspace: WorkspaceConfig): Metrics['fileSize'] {
  const workspaceRoot = fromRepoRoot(workspace.dir)
  const srcRoot = path.join(workspaceRoot, workspace.srcDir)
  const files = walkFiles(srcRoot, isProductionSource)

  const offenders: Record<string, number> = {}
  for (const file of files) {
    const relativeFromWorkspace = path.relative(workspaceRoot, file)
    if (workspace.isIgnored?.(relativeFromWorkspace)) continue
    const lines = fs.readFileSync(file, 'utf8').split('\n').length
    if (lines > workspace.fileSizeLimit) {
      offenders[relativeFromWorkspace.split(path.sep).join('/')] = lines
    }
  }

  return { limit: workspace.fileSizeLimit, offenders }
}
