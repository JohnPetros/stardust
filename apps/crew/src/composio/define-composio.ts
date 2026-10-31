import { SessionPreset } from '@composio/core'
import type { ToolsInput } from '@mastra/core/agent'
import { AppError } from '@/errors/app-error'

import { composioClient } from '@/composio/composio-client'
import {
  type ToolResultTransform,
  withResultTransform,
} from '@/composio/with-result-transform'

export type ComposioConnection = {
  createToolset(): Promise<ToolsInput>
}

export type ComposioSessionClient = {
  sessions: {
    create(
      userId: string,
      config: {
        sessionPreset: typeof SessionPreset.DIRECT_TOOLS
        toolkits: string[]
        tools: Record<string, string[]>
        connectedAccounts: Record<string, string>
        manageConnections: false
        sandbox: { enable: false }
      },
    ): Promise<{ tools(): Promise<ToolsInput> }>
  }
}

type DefineComposioConfig = {
  userId: string
  toolkits: string[]
  tools: Record<string, string[]>
  connectedAccounts: Record<string, string>
  allowedRepository: string
  resultTransforms?: Record<string, ToolResultTransform>
}

type RepositoryInput = { owner?: unknown; repo?: unknown }

export const defineComposio = (
  config: DefineComposioConfig,
  client: ComposioSessionClient = composioClient,
): ComposioConnection => {
  const allowedSlugs = Object.values(config.tools).flat()
  const allowedRepository = config.allowedRepository.toLowerCase()

  function assertAllowedRepository(inputData: unknown) {
    const { owner, repo } = (inputData ?? {}) as RepositoryInput
    const requestedRepository =
      typeof owner === 'string' && typeof repo === 'string'
        ? `${owner}/${repo}`.toLowerCase()
        : undefined

    if (requestedRepository !== allowedRepository) {
      throw new AppError(
        'A ferramenta só pode acessar o repositório configurado.',
        'Repositório não permitido',
        { code: 'repository_not_allowed' },
      )
    }
  }

  function guardTool(slug: string, tool: ToolsInput[string]): ToolsInput[string] {
    const toolAction = tool as { execute?: (...args: unknown[]) => Promise<unknown> }
    const execute = toolAction.execute

    if (!execute) {
      throw new AppError(
        `A ferramenta ${slug} não pode ser executada.`,
        'Ferramenta inválida',
        { code: 'composio_tools_missing' },
      )
    }

    const guardedTool = Object.assign(
      Object.create(Object.getPrototypeOf(tool)),
      tool,
    ) as typeof toolAction

    guardedTool.execute = async (inputData, ...rest) => {
      assertAllowedRepository(inputData)
      return execute.call(tool, inputData, ...rest)
    }

    const transform = config.resultTransforms?.[slug]

    return transform
      ? withResultTransform(guardedTool as ToolsInput[string], transform)
      : (guardedTool as ToolsInput[string])
  }

  return {
    async createToolset() {
      const session = await client.sessions.create(config.userId, {
        sessionPreset: SessionPreset.DIRECT_TOOLS,
        toolkits: config.toolkits,
        tools: config.tools,
        connectedAccounts: config.connectedAccounts,
        manageConnections: false,
        sandbox: { enable: false },
      })
      const sessionTools = await session.tools()

      const missingSlugs = allowedSlugs.filter((slug) => !(slug in sessionTools))

      if (missingSlugs.length > 0) {
        throw new AppError(
          `Ferramentas do Composio ausentes: ${missingSlugs.join(', ')}.`,
          'Ferramentas ausentes',
          { code: 'composio_tools_missing', slugs: missingSlugs },
        )
      }

      return Object.fromEntries(
        allowedSlugs.map((slug) => [slug, guardTool(slug, sessionTools[slug])]),
      )
    },
  }
}
