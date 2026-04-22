import { AsyncLocalStorage } from 'node:async_hooks'

import { Tool, type ToolAction } from '@mastra/core/tools'
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { ElicitResultSchema } from '@modelcontextprotocol/sdk/types.js'

export type ToolRegistry = Record<string, ToolAction<any, any, any, any, any>>

type Params = {
  name: string
  version: string
  instructions?: string
  tools: ToolRegistry
}

export class MastraMcpServer {
  private readonly server: McpServer
  private readonly transport: WebStandardStreamableHTTPServerTransport
  private readonly connectionPromise: Promise<void>
  private readonly authInfoStorage = new AsyncLocalStorage<AuthInfo>()

  constructor({ name, version, instructions, tools }: Params) {
    this.server = new McpServer(
      {
        name,
        version,
      },
      {
        instructions,
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
      },
    )

    this.transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    this.registerTools(tools)
    this.connectionPromise = this.server.connect(this.transport)
  }

  async handleRequest(request: Request, authInfo: AuthInfo): Promise<Response> {
    try {
      await this.connectionPromise

      return await this.authInfoStorage.run(
        authInfo,
        async () =>
          await this.transport.handleRequest(request, {
            authInfo,
          }),
      )
    } catch (error) {
      console.error('[MastraMcpServer] Global request error:', error)

      return new Response(
        JSON.stringify({
          error: 'MCP_SERVER_ERROR',
          message: this.getErrorMessage(error),
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        },
      )
    }
  }

  async close(): Promise<void> {
    await this.server.close()
  }

  private registerTools(tools: ToolRegistry) {
    Object.entries(tools).forEach(([toolKey, tool]) => {
      if (!(tool instanceof Tool) || !tool.execute) {
        return
      }

      const execute = tool.execute
      const toolId = tool.id ?? toolKey

      this.server.registerTool(
        toolId,
        {
          description: tool.description,
          inputSchema: tool.inputSchema as any,
          outputSchema: tool.outputSchema as any,
        },
        async (input: unknown, extra: RequestHandlerExtra<any, any>) => {
          try {
            const authInfo = this.authInfoStorage.getStore()
            const output = await execute(input as any, {
              mcp: {
                extra: {
                  ...extra,
                  authInfo,
                },
                elicitation: {
                  sendRequest: async (request: Record<string, unknown>) =>
                    extra
                      ? await extra.sendRequest(
                          {
                            method: 'elicitation/create',
                            params: request,
                          },
                          ElicitResultSchema,
                        )
                      : { action: 'cancelled' },
                },
              },
            })

            if (output === undefined) {
              return {
                content: [{ type: 'text' as const, text: 'ok' }],
              }
            }

            return {
              structuredContent: output as Record<string, unknown>,
              content: [{ type: 'text' as const, text: JSON.stringify(output) }],
            }
          } catch (error) {
            const message = this.getErrorMessage(error)

            console.error(`[MastraMcpServer] Tool ${toolId} execution error:`, error)

            return {
              structuredContent: {
                error: 'TOOL_EXECUTION_ERROR',
                message,
              },
              content: [
                {
                  type: 'text' as const,
                  text: `Tool execution failed: ${message}`,
                },
              ],
              isError: true,
            }
          }
        },
      )
    })
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }

    if (typeof error === 'string') {
      return error
    }

    return 'Unexpected MCP server error'
  }
}
