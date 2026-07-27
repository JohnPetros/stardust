import fs from 'node:fs'
import type { Command as CommanderCommand } from 'commander'

import {
  type CheckFinding,
  type CheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import { printResult } from '../../../utils/print-check-result'
import { runCommand } from '../../../utils/run-command'
import type { CliCommand } from '../../CliCommand'

type ContractCriterion = {
  id: string
  requirements: string[]
}

export type ContractEvidence = {
  criterion: string
  command: string[]
  cwd?: string
}

export function isIntegrationEvidence(evidence: ContractEvidence): boolean {
  return evidence.command.includes('test:integration')
}

type ContractOptions = {
  spec: string
  run?: boolean
}

type ContractInspection = {
  result: CheckResult
  evidence: ContractEvidence[]
}

const CRITERION_PATTERN = /\b(?:AC|AR)-\d+\b/g
const REQUIREMENT_PATTERN = /\bREQ-\d+\b/g
const EVIDENCE_PATTERN = /<!--\s*harness:evidence\s+(\{.*?\})\s*-->/g

export class ContractCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('contract')
      .description('Valida o Contract e suas evidências automatizadas')
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .option('--run', 'Executa as evidências declaradas')
      .action((options: ContractOptions) => this.run(options))
  }

  async run(options: ContractOptions): Promise<void> {
    try {
      const inspection = this.execute(fs.readFileSync(options.spec, 'utf8'))
      if (!inspection.result.passed || !options.run) {
        printResult(inspection.result)
        return
      }

      const findings: CheckFinding[] = []
      const executed = []
      const skipped = []
      for (const evidence of inspection.evidence) {
        if (isIntegrationEvidence(evidence)) {
          skipped.push({
            criterion: evidence.criterion,
            command: evidence.command,
            reason: 'integration fora do contract-check',
          })
          continue
        }
        const result = await runCommand(evidence.command, { cwd: evidence.cwd })
        executed.push({
          criterion: evidence.criterion,
          command: evidence.command,
          exitCode: result.exitCode,
        })
        if (result.exitCode !== 0) {
          findings.push({
            code: 'CONTRACT_EVIDENCE_FAILED',
            message: `${evidence.criterion}: ${evidence.command.join(' ')}`,
            detail: result.stderr || result.stdout,
          })
        }
      }

      printResult({
        ...inspection.result,
        passed: findings.length === 0,
        findings,
        evidence: { ...inspection.result.evidence, executed, skipped },
      })
    } catch (error) {
      printResult(errorResult('contract-check', error))
    }
  }

  execute(content: string): ContractInspection {
    const findings: CheckFinding[] = []
    const contractHeading = /^#{1,3}\s+.*\bContract\b.*$/im.exec(content)
    if (!contractHeading) {
      findings.push({
        code: 'CONTRACT_SECTION_MISSING',
        message: 'Seção Contract não encontrada na Spec',
      })
    }
    const contractStart = contractHeading?.index ?? 0
    const afterContract = content.slice(contractStart)
    const technicalHeading =
      /^#{1,4}\s+.*\b(?:Especifica(?:ç|c)[aã]o|Solu(?:ç|c)[aã]o)\s+T[eé]cnica\b.*$/im.exec(
        afterContract.slice(contractHeading?.[0].length ?? 0),
      )
    const contractEnd =
      technicalHeading === null
        ? content.length
        : contractStart + (contractHeading?.[0].length ?? 0) + technicalHeading.index
    const contractContent = content.slice(contractStart, contractEnd)
    const criteria = new Map<string, ContractCriterion>()

    for (const line of contractContent.split('\n')) {
      const ids = line.match(CRITERION_PATTERN) ?? []
      const requirements = [...new Set(line.match(REQUIREMENT_PATTERN) ?? [])]
      for (const id of ids) {
        const current = criteria.get(id) ?? { id, requirements: [] }
        current.requirements = [...new Set([...current.requirements, ...requirements])]
        criteria.set(id, current)
      }
    }

    if (criteria.size === 0) {
      findings.push({
        code: 'CONTRACT_CRITERIA_MISSING',
        message: 'Nenhum critério AC-* ou AR-* encontrado',
      })
    }
    for (const criterion of criteria.values()) {
      if (criterion.requirements.length === 0) {
        findings.push({
          code: 'UNTRACED_CONTRACT_CRITERION',
          message: `${criterion.id} não referencia requisito REQ-*`,
        })
      }
    }

    const evidence: ContractEvidence[] = []
    for (const match of contractContent.matchAll(EVIDENCE_PATTERN)) {
      try {
        const item = JSON.parse(match[1]) as ContractEvidence
        if (
          !criteria.has(item.criterion) ||
          !Array.isArray(item.command) ||
          item.command.length === 0
        ) {
          throw new Error('criterion existente e command não vazio são obrigatórios')
        }
        evidence.push(item)
      } catch (error) {
        findings.push({
          code: 'INVALID_CONTRACT_EVIDENCE',
          message: 'Declaração harness:evidence inválida',
          detail: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return {
      result: {
        check: 'contract-check',
        passed: findings.length === 0,
        findings,
        evidence: {
          criteria: [...criteria.keys()].sort(),
          automatedEvidence: evidence.map((item) => item.criterion),
        },
      },
      evidence,
    }
  }
}
