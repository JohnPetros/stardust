import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { AppError } from '@/errors/app-error'

import { evalCaseSchema } from '@/mastra/agents/pr-reviewer/schemas/eval-case-schema'
import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'

const DATASETS_DIRECTORY = fileURLToPath(new URL('../datasets/', import.meta.url))
const CASE_FILE_SUFFIX = '-case.json'
const MISSING_API_KEY_PLACEHOLDER = 'test-anthropic-key'
const TEST_VALUE_PREFIX = 'test-'
const COMPOSIO_VARIABLES = [
  'COMPOSIO_API_KEY',
  'COMPOSIO_USER_ID',
  'COMPOSIO_GITHUB_CONNECTED_ACCOUNT_ID',
]

type EvalDatasetsHelperDependencies = {
  directory?: string
}

export class EvalDatasetsHelper {
  private readonly directory: string

  constructor({ directory = DATASETS_DIRECTORY }: EvalDatasetsHelperDependencies = {}) {
    this.directory = directory
  }

  load(): EvalCase[] {
    let fileNames: string[]

    try {
      fileNames = readdirSync(this.directory)
        .filter((fileName) => fileName.endsWith(CASE_FILE_SUFFIX))
        .sort()
    } catch {
      return []
    }

    return fileNames.map((fileName) => this.readCase(fileName))
  }

  assertPrerequisites(datasets: EvalCase[], apiKey = process.env.ANTHROPIC_API_KEY) {
    if (datasets.length === 0) {
      throw new AppError(
        'No eval datasets found. Add <name>-case.json files to src/mastra/agents/pr-reviewer/evals/datasets/.',
        'Eval setup',
        { code: 'eval_datasets_missing' },
      )
    }

    if (!apiKey || apiKey === MISSING_API_KEY_PLACEHOLDER) {
      throw new AppError(
        'ANTHROPIC_API_KEY is required to run the pr-reviewer evals.',
        'Eval setup',
        { code: 'eval_api_key_missing' },
      )
    }

    const missingComposioVariables = COMPOSIO_VARIABLES.filter(
      (name) => !process.env[name] || process.env[name]?.startsWith(TEST_VALUE_PREFIX),
    )

    if (missingComposioVariables.length > 0) {
      throw new AppError(
        `${missingComposioVariables.join(', ')} required to run the pr-reviewer evals: the reviewers read the repository through the real Composio connection.`,
        'Eval setup',
        { code: 'eval_composio_missing' },
      )
    }
  }

  private readCase(fileName: string): EvalCase {
    const parsed = evalCaseSchema.safeParse(
      JSON.parse(readFileSync(`${this.directory}${fileName}`, 'utf8')),
    )

    if (!parsed.success) {
      const fields = parsed.error.issues.map((issue) => issue.path.join('.'))
      throw new AppError(
        `Invalid dataset ${fileName}: ${fields.join(', ')}`,
        'Invalid dataset',
        { code: 'invalid_eval_dataset' },
      )
    }

    if (`${parsed.data.name}${CASE_FILE_SUFFIX}` !== fileName) {
      throw new AppError(
        `Dataset ${fileName} must have name "${fileName.slice(0, -CASE_FILE_SUFFIX.length)}".`,
        'Invalid dataset',
        { code: 'invalid_eval_dataset' },
      )
    }

    return parsed.data
  }
}
