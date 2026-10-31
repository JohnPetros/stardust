export type ReviewerToolCall = {
  name: string
  target?: string
  outcome: 'ok' | 'error'
  error?: string
}
