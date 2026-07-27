import fs from 'node:fs'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import {
  createResult,
  type CheckFinding,
  type DetailedCheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import { normalizeText, parseMarkdown, sectionBody } from '../../../utils/parse-markdown'
import { printResult } from '../../../utils/print-check-result'
import type { CliCommand } from '../../CliCommand'

export type SpecCheckOptions = {
  specPath: string
  rootDir?: string
}

type CommanderOptions = {
  spec: string
  root?: string
}

type SpecCheckDetails = {
  spec: string
  requirements: string[]
  acceptanceCriteria: string[]
  nonFunctionalCriteria: string[]
  referencedPaths: string[]
}

const REQ_PATTERN = /\bREQ-\d+\b/g
const AC_PATTERN = /\bAC-\d+\b/g
const AR_PATTERN = /\bAR-\d+\b/g
const REPOSITORY_PATH_PATTERN =
  /^(?:apps|packages|scripts|documentation|supabase|\.github)\/[^\s`]+$/

export class SpecCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('spec')
      .description('Valida estrutura, Contract e rastreabilidade da Spec')
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .option('--root <path>', 'Raiz do projeto')
      .action((options: CommanderOptions) => this.run(options))
  }

  run(options: CommanderOptions): void {
    try {
      printResult(
        this.execute({
          specPath: options.spec,
          rootDir: options.root,
        }),
      )
    } catch (error) {
      printResult(errorResult('spec-check', error))
    }
  }

  execute(options: SpecCheckOptions): DetailedCheckResult<SpecCheckDetails> {
    const rootDir = path.resolve(options.rootDir ?? process.cwd())
    const specPath = path.resolve(rootDir, options.specPath)
    const source = fs.readFileSync(specPath, 'utf8')
    const document = parseMarkdown(source)
    const findings: CheckFinding[] = []

    if (!source.startsWith('---\n')) {
      findings.push({
        code: 'SPEC_FRONTMATTER_MISSING',
        message: 'A Spec deve iniciar com frontmatter YAML.',
      })
    }
    this.addMissingFrontmatterFindings(document.frontmatter, findings)

    const contract = sectionBody(document, /\b(contract|contrato)\b/)
    if (contract === null) {
      findings.push({
        code: 'SPEC_CONTRACT_SECTION_MISSING',
        message: 'Seção Contract/Contrato ausente.',
      })
    }

    const technical = sectionBody(
      document,
      /\b(especificacao tecnica|solucao tecnica|technical specification)\b/,
    )
    if (technical === null) {
      findings.push({
        code: 'SPEC_TECHNICAL_SECTION_MISSING',
        message: 'Seção de Especificação/Solução Técnica ausente.',
      })
    }

    const contractSource = contract ?? ''
    const requirements = this.uniqueMatches(contractSource, REQ_PATTERN)
    const acceptanceCriteria = this.uniqueMatches(contractSource, AC_PATTERN)
    const nonFunctionalCriteria = this.uniqueMatches(contractSource, AR_PATTERN)
    const contractIds = new Set([
      ...requirements,
      ...acceptanceCriteria,
      ...nonFunctionalCriteria,
    ])
    const allIds = this.uniqueMatches(source, /\b(?:REQ|AC|AR)-\d+\b/g)
    for (const id of allIds) {
      if (!contractIds.has(id)) {
        findings.push({
          code: 'SPEC_ID_OUTSIDE_CONTRACT',
          message: `${id} é citado, mas não está definido na seção Contract.`,
        })
      }
    }

    if (requirements.length === 0) {
      findings.push({
        code: 'SPEC_REQUIREMENTS_MISSING',
        message: 'Nenhum requisito REQ-* foi encontrado.',
      })
    }
    if (acceptanceCriteria.length + nonFunctionalCriteria.length === 0) {
      findings.push({
        code: 'SPEC_CRITERIA_MISSING',
        message: 'Nenhum critério AC-* ou AR-* foi encontrado.',
      })
    }

    const contractLines = (contract ?? '').split('\n')
    for (const criterion of [...acceptanceCriteria, ...nonFunctionalCriteria]) {
      const definingLines = contractLines.filter((line) => line.includes(criterion))
      if (definingLines.length === 0) {
        findings.push({
          code: 'SPEC_CRITERION_OUTSIDE_CONTRACT',
          message: `${criterion} não está definido na seção Contract.`,
        })
        continue
      }
      if (!definingLines.some((line) => /\bREQ-\d+\b/.test(line))) {
        findings.push({
          code: 'SPEC_CRITERION_WITHOUT_REQUIREMENT',
          message: `${criterion} não referencia um REQ-* na mesma linha.`,
        })
      }
    }

    for (const requirement of requirements) {
      const isCovered = contractLines.some(
        (line) =>
          line.includes(requirement) &&
          (line.match(AC_PATTERN)?.length || line.match(AR_PATTERN)?.length),
      )
      if (!isCovered) {
        findings.push({
          code: 'SPEC_REQUIREMENT_WITHOUT_CRITERION',
          message: `${requirement} não está associado a AC-* ou AR-* no Contract.`,
        })
      }
    }

    const referencedPaths = this.referencedRepositoryPaths(source)
    for (const repositoryPath of referencedPaths) {
      if (
        !fs.existsSync(path.join(rootDir, repositoryPath)) &&
        !this.isDeclaredNew(source, repositoryPath)
      ) {
        findings.push({
          code: 'SPEC_REFERENCED_PATH_MISSING',
          message: `Path citado não existe e não está marcado como novo: ${repositoryPath}`,
          path: repositoryPath,
        })
      }
    }

    return createResult('spec-check', findings, {
      spec: path.relative(rootDir, specPath),
      requirements,
      acceptanceCriteria,
      nonFunctionalCriteria,
      referencedPaths,
    })
  }

  private uniqueMatches(source: string, pattern: RegExp): string[] {
    return [...new Set(source.match(pattern) ?? [])]
  }

  private referencedRepositoryPaths(source: string): string[] {
    const paths: string[] = []
    for (const match of source.matchAll(/`([^`\n]+)`/g)) {
      const candidate = match[1].replace(/[),.;:]+$/, '')
      if (REPOSITORY_PATH_PATTERN.test(candidate)) paths.push(candidate)
    }
    return [...new Set(paths)]
  }

  private isDeclaredNew(source: string, repositoryPath: string): boolean {
    return source.split('\n').some((line) => {
      if (!line.includes(`\`${repositoryPath}\``)) return false
      const normalized = normalizeText(line)
      return /\b(novo|nova|criar|criado|new|create)\b/.test(normalized)
    })
  }

  private addMissingFrontmatterFindings(
    frontmatter: Record<string, string>,
    findings: CheckFinding[],
  ): void {
    for (const field of ['title', 'prd', 'apps', 'status', 'last_updated_at']) {
      if (!frontmatter[field]) {
        findings.push({
          code: 'SPEC_FRONTMATTER_FIELD_MISSING',
          message: `Campo obrigatório ausente no frontmatter: ${field}`,
        })
      }
    }
  }
}
