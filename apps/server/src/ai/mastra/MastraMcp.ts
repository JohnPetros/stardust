import type { Mcp } from '@stardust/core/global/interfaces'

type MastraToolExecutionContext = {
  mcp?: {
    extra?: {
      authInfo?: {
        token?: string
        extra?: Record<string, unknown>
      }
    }
  }
}

export type { MastraToolExecutionContext }

export class MastraMcp<Input = unknown> implements Mcp<Input> {
  constructor(
    private readonly input: Input,
    private readonly context?: MastraToolExecutionContext,
  ) {}

  getInput(): Input {
    return this.input
  }

  getAccountId(): string {
    const accountIdFromExtra = this.context?.mcp?.extra?.authInfo?.extra?.accountId

    if (typeof accountIdFromExtra === 'string' && accountIdFromExtra.trim()) {
      return accountIdFromExtra
    }

    throw new Error(
      'O identificador da conta do MCP é obrigatório no contexto de autenticação',
    )
  }
}
