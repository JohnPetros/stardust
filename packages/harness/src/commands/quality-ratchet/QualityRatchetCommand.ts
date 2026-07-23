import fs from 'node:fs'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import type { CliCommand } from '../CliCommand'
import { buildReport } from './build-report'
import { collectMetrics } from './collect-metrics'
import { compare } from './compare-baseline'
import type { Baseline, Violation } from './define-metrics'
import { getWorkspace } from './get-workspace'

type QualityRatchetOptions = {
  workspace: string
  updateBaseline?: boolean
}

type QualityRatchetResult = {
  passed: boolean
  workspace: string
  baselineUpdated: boolean
  violations: Violation[]
}

export class QualityRatchetCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('quality-ratchet')
      .description('Compara métricas do workspace com o baseline versionado')
      .requiredOption('--workspace <name>', 'Workspace a verificar')
      .option('--update-baseline', 'Atualiza o baseline com as métricas atuais')
      .action((options: QualityRatchetOptions) => this.run(options))
  }

  run(options: QualityRatchetOptions): void {
    try {
      const result = this.execute(options)
      if (!result.passed) process.exitCode = 1
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }

  execute(options: QualityRatchetOptions): QualityRatchetResult {
    const workspace = getWorkspace(options.workspace)

    console.log(`Quality Ratchet · ${workspace.name}\n`)
    const metrics = collectMetrics(workspace)

    if (options.updateBaseline) {
      const baseline: Baseline = {
        workspace: workspace.name,
        generatedAt: new Date().toISOString().slice(0, 10),
        metrics,
      }
      const file = this.baselinePath(options.workspace)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, `${JSON.stringify(baseline, null, 2)}\n`)
      console.log(`\n✅ Baseline congelado em baselines/${options.workspace}.json`)
      return {
        passed: true,
        workspace: workspace.name,
        baselineUpdated: true,
        violations: [],
      }
    }

    const file = this.baselinePath(options.workspace)
    if (!fs.existsSync(file)) {
      throw new Error(`Baseline ausente: ${file}. Gere com --update-baseline.`)
    }
    const baseline = JSON.parse(fs.readFileSync(file, 'utf8')) as Baseline
    const violations = compare(metrics, baseline)
    const report = buildReport(metrics, baseline, violations)
    console.log(`\n${report}`)
    this.writeStepSummary(report)
    this.writeReportFile(report)

    if (violations.length > 0) {
      console.error(`\n❌ Quality ratchet falhou: ${violations.length} regressão(ões).`)
    } else {
      console.log('\n✅ Quality ratchet passou.')
    }

    return {
      passed: violations.length === 0,
      workspace: workspace.name,
      baselineUpdated: false,
      violations,
    }
  }

  private baselinePath(workspaceKey: string): string {
    return path.resolve(__dirname, '../../..', 'baselines', `${workspaceKey}.json`)
  }

  private writeStepSummary(markdown: string): void {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY
    if (summaryFile) fs.appendFileSync(summaryFile, `${markdown}\n`)
  }

  private writeReportFile(markdown: string): void {
    const reportFile =
      process.env.QUALITY_RATCHET_REPORT_FILE ?? process.env.QUALITY_GATE_REPORT_FILE
    if (reportFile) fs.writeFileSync(reportFile, `${markdown}\n`)
  }
}
