import type { Mcp } from './Mcp'

export interface Tool<Input = unknown, Output = unknown> {
  handle(mcp: Mcp<Input>): Promise<Output>
}
