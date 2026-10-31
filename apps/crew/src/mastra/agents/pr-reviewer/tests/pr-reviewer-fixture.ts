import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  type Agent,
  assembleAgentFromFsEntry,
  type FsAgentConfig,
  type FsAgentEntry,
} from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'

import parentConfig from '@/mastra/agents/pr-reviewer/config'
import architectureConfig from '@/mastra/agents/pr-reviewer/subagents/architecture/config'
import performanceConfig from '@/mastra/agents/pr-reviewer/subagents/performance/config'
import regressionConfig from '@/mastra/agents/pr-reviewer/subagents/regression/config'
import requirementsConfig from '@/mastra/agents/pr-reviewer/subagents/requirements/config'
import securityConfig from '@/mastra/agents/pr-reviewer/subagents/security/config'
import type { ReviewerFindings } from '@/mastra/agents/pr-reviewer/types/reviewer-findings'
import { type ScriptedStep, ScriptedModel } from '@/tests/scripted-model'

type AgentModel = NonNullable<FsAgentConfig['model']>

type LoadPrReviewerAgentOptions = {
  model?: AgentModel

  modelsByAgent?: Record<string, AgentModel>
}

const AGENT_DIRECTORY = fileURLToPath(new URL('../', import.meta.url))

const SUBAGENT_CONFIGS: Record<string, FsAgentConfig> = {
  security: securityConfig,
  requirements: requirementsConfig,
  architecture: architectureConfig,
  regression: regressionConfig,
  performance: performanceConfig,
}

export class PrReviewerFixture {
  loadPrReviewerAgent({
    model,
    modelsByAgent = {},
  }: LoadPrReviewerAgentOptions = {}): Agent {
    const withModel = (agentName: string, config: FsAgentConfig): FsAgentConfig => {
      const replacement = modelsByAgent[agentName] ?? model

      return replacement ? { ...config, model: replacement } : config
    }

    const subagents: FsAgentEntry[] = Object.entries(SUBAGENT_CONFIGS).map(
      ([area, config]) => ({
        name: area,
        config: withModel(area, config),
        instructionsMd: this.readText(`subagents/${area}/instructions.md`),
        skills: [this.loadSkill(area)],
        defaultWorkspaceBasePath: this.buildWorkspaceBasePath(`pr-reviewer/${area}`),
      }),
    )

    return assembleAgentFromFsEntry({
      name: 'pr-reviewer',
      config: withModel('pr-reviewer', parentConfig),
      instructionsMd: this.readText('instructions.md'),
      subagents,
      defaultWorkspaceBasePath: this.buildWorkspaceBasePath('pr-reviewer'),
    })
  }

  scriptedModel(steps: ScriptedStep[]): ScriptedModel {
    return new ScriptedModel(steps)
  }

  toStrictFindings(findings: ReviewerFindings | string) {
    return typeof findings === 'string'
      ? findings
      : { ...findings, blocked_reason: findings.blocked_reason ?? null }
  }

  private buildWorkspaceBasePath(name: string): string {
    return join(tmpdir(), 'crew-test-workspace', name)
  }

  private readText(relativePath: string): string {
    return readFileSync(`${AGENT_DIRECTORY}${relativePath}`, 'utf8')
  }

  private readFrontmatterValue(frontmatter: string, key: string): string {
    const line = frontmatter
      .split('\n')
      .find((candidate) => candidate.startsWith(`${key}:`))
    const value = line?.slice(key.length + 1).trim() ?? ''

    return value.replace(/^"(.*)"$/, '$1').replaceAll('\\"', '"')
  }

  private loadSkill(area: string) {
    const content = this.readText(`subagents/${area}/skills/${area}-review/SKILL.md`)
    const [, frontmatter = '', ...body] = content.split(/^---$/m)

    return createSkill({
      name: this.readFrontmatterValue(frontmatter, 'name'),
      description: this.readFrontmatterValue(frontmatter, 'description'),
      instructions: body.join('---').trim(),
    })
  }
}
