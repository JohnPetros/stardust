export type CodePlaybackPrimitive = string | number | boolean | null

export type CodePlaybackValue =
  | CodePlaybackPrimitive
  | CodePlaybackValue[]
  | { [key: string]: CodePlaybackValue }

export type CodePlaybackOverflow = 'wrap' | 'scroll'

export type CodePlaybackVisualState =
  | 'active'
  | 'visited'
  | 'matched'
  | 'success'
  | 'error'
  | 'muted'

export type CodePlaybackInputDto = {
  content: string
  overflow: CodePlaybackOverflow
}

export type CodePlaybackLineRangeDto = {
  startLine: number
  endLine: number
}

export type CodePlaybackPointerDto = {
  label: string
  index: number
}

export type CodePlaybackHighlightRangeDto = {
  startIndex: number
  endIndex: number
  state: CodePlaybackVisualState
}

export type CodePlaybackStateItemDto = {
  value: CodePlaybackValue
  state?: CodePlaybackVisualState
}

export type CodePlaybackPanelBaseDto = {
  title: string
  overflow?: CodePlaybackOverflow
  emptyLabel?: string
}

export type CodePlaybackSequencePanelDto = CodePlaybackPanelBaseDto & {
  type: 'sequence'
  kind: 'array' | 'string' | 'list'
  items: CodePlaybackValue[]
  showIndices: boolean
  pointers?: CodePlaybackPointerDto[]
  highlights?: CodePlaybackHighlightRangeDto[]
}

export type CodePlaybackScalarPanelDto = CodePlaybackPanelBaseDto & {
  type: 'scalar'
  value: CodePlaybackValue
  state?: CodePlaybackVisualState
}

export type CodePlaybackMapPanelDto = CodePlaybackPanelBaseDto & {
  type: 'map'
  entries: Array<{
    key: string | number
    value: CodePlaybackValue
    state?: CodePlaybackVisualState
  }>
}

export type CodePlaybackSetPanelDto = CodePlaybackPanelBaseDto & {
  type: 'set'
  items: CodePlaybackStateItemDto[]
}

export type CodePlaybackGridPanelDto = CodePlaybackPanelBaseDto & {
  type: 'grid'
  rows: CodePlaybackStateItemDto[][]
  showIndices: boolean
}

export type CodePlaybackResultPanelDto = CodePlaybackPanelBaseDto & {
  type: 'result'
  value: CodePlaybackValue
  status: 'neutral' | 'success' | 'error'
}

export type CodePlaybackPanelDto =
  | CodePlaybackSequencePanelDto
  | CodePlaybackScalarPanelDto
  | CodePlaybackMapPanelDto
  | CodePlaybackSetPanelDto
  | CodePlaybackGridPanelDto
  | CodePlaybackResultPanelDto

export type CodePlaybackStepDto = {
  activeLineRanges: CodePlaybackLineRangeDto[]
  explanation: string
  panels: CodePlaybackPanelDto[]
}

export type CodePlaybackDto = {
  code: string
  input: CodePlaybackInputDto
  steps: CodePlaybackStepDto[]
}
