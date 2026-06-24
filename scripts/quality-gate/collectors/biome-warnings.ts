import { execFileSync } from 'node:child_process'

import { fromRepoRoot, type WorkspaceConfig } from '../config'

/**
 * Conta os diagnostics de severidade "warn" do Biome.
 *
 * O script `lint` do projeto roda com `--diagnostic-level=error`, então esses
 * warnings nunca falham o CI e acumulam invisíveis. A catraca congela essa
 * contagem para impedir que cresça.
 */
export function collectBiomeWarnings(workspace: WorkspaceConfig): number {
  const cwd = fromRepoRoot(workspace.dir)
  let raw: string
  try {
    raw = execFileSync(
      'npx',
      ['biome', 'lint', workspace.srcDir, '--reporter=json', '--max-diagnostics=none'],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
  } catch (error) {
    // Biome sai com código != 0 quando há diagnostics; o JSON ainda vem no stdout.
    const stdout = (error as { stdout?: string }).stdout
    if (!stdout) throw error
    raw = stdout
  }

  const report = JSON.parse(raw) as { summary?: { warnings?: number } }
  return report.summary?.warnings ?? 0
}
