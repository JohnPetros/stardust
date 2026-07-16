export type LspCompletionKind =
  | 'keyword'
  | 'snippet'
  | 'function'
  | 'variable'
  | 'parameter'
  | 'literal'
  | 'control-flow'

export type LspCompletion = {
  label: string
  code: string
  kind: LspCompletionKind
}
