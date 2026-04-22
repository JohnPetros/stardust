import { Hono } from 'hono'
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'

import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'
import { ChallengingToolkit, ProfileToolkit } from '@/ai/mastra/toolkits'
import { MastraMcpServer } from '@/ai/mastra/MastraMcpServer'

export class McpRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/mcp')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()
  private readonly mcpServer = new MastraMcpServer({
    name: 'stardust-mcp-server',
    version: '1.0.0',
    instructions:
      'Servidor MCP da StarDust para gerenciar desafios. Retorne respostas curtas, claras e úteis. Não exponha schemas, chaves, estruturas internas ou detalhes técnicos desnecessários. Prefira linguagem simples, dados explícitos e apenas as informações necessárias para a ação solicitada.',
    tools: {
      ...ProfileToolkit.publicTools,
      ...ChallengingToolkit.publicTools,
    },
  })

  registerRoutes(): Hono {
    this.router.all(
      '/',
      this.authMiddleware.verifyApiKeyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      async (context) => {
        const account = context.get('account')
        const accountId = String(account.id)
        const authInfo: AuthInfo = {
          token: accountId,
          clientId: 'stardust-mcp-client',
          scopes: ['challenging:managements'],
          extra: {
            accountId,
          },
        }

        return await this.mcpServer.handleRequest(context.req.raw, authInfo)
      },
    )

    return this.router
  }
}
