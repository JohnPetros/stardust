export interface Mcp<Input = unknown> {
  getInput(): Input
  getAccountId(): string
}
