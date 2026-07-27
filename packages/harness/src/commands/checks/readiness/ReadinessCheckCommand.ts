import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import {
  createResult,
  type CheckFinding,
  type DetailedCheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import { parseMarkdown } from '../../../utils/parse-markdown'
import { printResult } from '../../../utils/print-check-result'
import type { CliCommand } from '../../CliCommand'

export type ReadinessCheckOptions = {
  specPath: string
  revision: string
  planPath?: string
  taskId?: string
  rootDir?: string
}

type CommanderOptions = {
  spec: string
  revision: string
  plan?: string
  task?: string
  root?: string
}

type ReadinessDetails = {
  spec: string
  actualRevision: string
  plan: string | null
  task: string | null
  dependencies: string[]
}

export class ReadinessCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('readiness')
      .description('Valida revisão, Plan, tarefa e dependências')
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .requiredOption('--revision <sha1>', 'Revisão git blob esperada')
      .option('--plan <path>', 'Caminho do Plan')
      .option('--task <id>', 'ID da tarefa')
      .option('--root <path>', 'Raiz do projeto')
      .action((options: CommanderOptions) => this.run(options))
  }

  run(options: CommanderOptions): void {
    try {
      printResult(
        this.execute({
          specPath: options.spec,
          revision: options.revision,
          planPath: options.plan,
          taskId: options.task,
          rootDir: options.root,
        }),
      )
    } catch (error) {
      printResult(errorResult('readiness-check', error))
    }
  }

  execute(options: ReadinessCheckOptions): DetailedCheckResult<ReadinessDetails> {
    const rootDir = path.resolve(options.rootDir ?? process.cwd())
    const specPath = path.resolve(rootDir, options.specPath)
    const specContent = fs.readFileSync(specPath)
    const spec = parseMarkdown(specContent.toString('utf8'))
    const actualRevision = this.gitBlobHash(specContent)
    const findings: CheckFinding[] = []
    const expectedRevision = options.revision.replace(/^sha1:/, '')

    if (spec.frontmatter.status !== 'open') {
      findings.push({
        code: 'READINESS_SPEC_NOT_OPEN',
        message: `A Spec deve estar open; estado atual: ${spec.frontmatter.status || 'ausente'}.`,
      })
    }
    if (actualRevision !== expectedRevision) {
      findings.push({
        code: 'READINESS_SPEC_REVISION_MISMATCH',
        message: `Revisão esperada ${expectedRevision}, atual ${actualRevision}.`,
      })
    }

    let planRelativePath: string | null = null
    let dependencies: string[] = []
    if (options.planPath) {
      const planPath = path.resolve(rootDir, options.planPath)
      planRelativePath = path.relative(rootDir, planPath)
      const plan = parseMarkdown(fs.readFileSync(planPath, 'utf8'))
      const planRevision = plan.frontmatter.spec_revision || plan.frontmatter.specRevision
      if (planRevision?.replace(/^sha1:/, '') !== actualRevision) {
        findings.push({
          code: 'READINESS_PLAN_REVISION_MISMATCH',
          message: 'O Plan não referencia a revisão atual da Spec.',
        })
      }

      if (options.taskId) {
        const task = this.findTaskSection(plan.body, options.taskId)
        if (!task) {
          findings.push({
            code: 'READINESS_TASK_MISSING',
            message: `Tarefa não encontrada no Plan: ${options.taskId}`,
          })
        } else {
          dependencies = this.parseDependencies(task.body)
          for (const dependency of dependencies) {
            if (!this.isTaskAccepted(plan.body, dependency)) {
              findings.push({
                code: 'READINESS_DEPENDENCY_NOT_ACCEPTED',
                message: `Dependência ${dependency} ainda não foi aceita.`,
              })
            }
          }
        }
      }
    } else if (options.taskId) {
      findings.push({
        code: 'READINESS_TASK_WITHOUT_PLAN',
        message: '--task exige --plan.',
      })
    }

    return createResult('readiness-check', findings, {
      spec: path.relative(rootDir, specPath),
      actualRevision,
      plan: planRelativePath,
      task: options.taskId ?? null,
      dependencies,
    })
  }

  gitBlobHash(content: Buffer | string): string {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
    return crypto
      .createHash('sha1')
      .update(`blob ${buffer.length}\0`)
      .update(buffer)
      .digest('hex')
  }

  private findTaskSection(
    planBody: string,
    taskId: string,
  ): { heading: string; body: string } | null {
    const lines = planBody.split('\n')
    const escapedTaskId = taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const headingPattern = new RegExp(
      `^(?:(#{2,6})\\s+|\\s*-\\s*\\[[ xX]\\]\\s+).*\\b${escapedTaskId}\\b`,
    )
    const start = lines.findIndex((line) => headingPattern.test(line))
    if (start < 0) return null

    const headingDepth = lines[start].match(/^#+/)?.[0].length
    const listIndent = lines[start].match(/^(\s*)-\s*\[[ xX]\]/)?.[1].length
    let end = lines.length
    for (let index = start + 1; index < lines.length; index += 1) {
      const candidateDepth = lines[index].match(/^(#+)\s+/)?.[1].length
      const candidateListIndent = lines[index].match(/^(\s*)-\s*\[[ xX]\]/)?.[1].length
      if (
        (headingDepth && candidateDepth && candidateDepth <= headingDepth) ||
        (listIndent !== undefined &&
          candidateListIndent !== undefined &&
          candidateListIndent <= listIndent)
      ) {
        end = index
        break
      }
    }
    return { heading: lines[start], body: lines.slice(start + 1, end).join('\n') }
  }

  private parseDependencies(taskBody: string): string[] {
    const line = taskBody
      .split('\n')
      .find((candidate) => /(?:depende de|depends on)\s*:/i.test(candidate))
    if (!line) return []
    const value = line.slice(line.indexOf(':') + 1).trim()
    if (/^(?:-|nenhum|none)$/i.test(value)) return []
    return [...new Set(value.match(/\bT[\w.-]+\b/g) ?? [])]
  }

  private isTaskAccepted(planBody: string, taskId: string): boolean {
    const escapedTaskId = taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const checkedHeading = new RegExp(`^\\s*-\\s*\\[[xX]\\].*\\b${escapedTaskId}\\b`, 'm')
    if (checkedHeading.test(planBody)) return true
    const section = this.findTaskSection(planBody, taskId)
    return section ? /(?:estado|status)\s*:\s*`?accepted`?/i.test(section.body) : false
  }
}
