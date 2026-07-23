import { ValidationError } from '../errors'
import type {
  CodePlaybackPanelBaseDto,
  CodePlaybackDto,
  CodePlaybackPanelDto,
  CodePlaybackStateItemDto,
  CodePlaybackValue,
} from './dtos/CodePlaybackDto'

const VISUAL_STATES = [
  'active',
  'visited',
  'matched',
  'success',
  'error',
  'muted',
] as const

const OVERFLOW_VALUES = ['wrap', 'scroll'] as const
const PANEL_TYPES = ['sequence', 'scalar', 'map', 'set', 'grid', 'result'] as const

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value)

const isArrayIndex = (key: string, length: number) => {
  const index = Number(key)
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < 2 ** 32 - 1 &&
    index < length &&
    String(index) === key
  )
}

const isOneOf = <Value extends string>(
  value: unknown,
  values: readonly Value[],
): value is Value => typeof value === 'string' && values.includes(value as Value)

const fieldError = (path: string, message: string): ValidationError =>
  new ValidationError([{ name: path, messages: [message] }])

function validateArrayShape(
  value: unknown,
  path: string,
  minimumLength = 0,
): asserts value is unknown[] {
  if (!Array.isArray(value)) throw fieldError(path, 'must be an array')
  if (value.length < minimumLength)
    throw fieldError(path, `must contain at least ${minimumLength} item(s)`)
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw fieldError(path, 'must not contain symbol keys')
  }
  for (const key of Object.getOwnPropertyNames(value)) {
    if (key === 'length') continue
    if (!isArrayIndex(key, value.length)) {
      throw fieldError(`${path}.${key}`, 'must be a JSON array index')
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (
      !descriptor ||
      !descriptor.enumerable ||
      !('value' in descriptor) ||
      descriptor.value === undefined
    ) {
      throw fieldError(`${path}[${key}]`, 'must be a data property')
    }
  }
  for (let index = 0; index < value.length; index++) {
    if (!Object.hasOwn(value, index)) {
      throw fieldError(`${path}[${index}]`, 'sparse arrays are not supported')
    }
  }
}

function validateStructuralObject(
  value: unknown,
  path: string,
  requiredKeys: readonly string[],
  optionalKeys: readonly string[] = [],
): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw fieldError(path, 'must be an object')
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw fieldError(path, 'must not contain symbol keys')
  }
  const allowedKeys = new Set([...requiredKeys, ...optionalKeys])
  for (const key of Object.getOwnPropertyNames(value)) {
    if (!allowedKeys.has(key))
      throw fieldError(`${path}.${key}`, 'is not part of the contract')
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (
      !descriptor ||
      !descriptor.enumerable ||
      !('value' in descriptor) ||
      descriptor.value === undefined
    ) {
      throw fieldError(`${path}.${key}`, 'must be a JSON data property')
    }
  }
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) throw fieldError(`${path}.${key}`, 'is required')
  }
}

function validateString(
  value: unknown,
  path: string,
  required = true,
): asserts value is string {
  if (typeof value !== 'string' || (required && value.trim().length === 0)) {
    throw fieldError(path, required ? 'must be a non-empty string' : 'must be a string')
  }
}

function validateOverflow(value: unknown, path: string) {
  if (!isOneOf(value, OVERFLOW_VALUES)) throw fieldError(path, 'must be wrap or scroll')
}

function validateVisualState(value: unknown, path: string) {
  if (!isOneOf(value, VISUAL_STATES))
    throw fieldError(path, 'has an invalid visual state')
}

function validateValue(
  value: unknown,
  path: string,
  ancestors: Set<object>,
): asserts value is CodePlaybackValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return
  if (typeof value === 'number') {
    if (!Number.isFinite(value))
      throw fieldError(path, 'must contain only finite numbers')
    return
  }

  if (typeof value !== 'object' || (!Array.isArray(value) && !isRecord(value))) {
    throw fieldError(path, 'must be a JSON value')
  }

  if (ancestors.has(value)) throw fieldError(path, 'must not contain cyclic references')
  ancestors.add(value)

  if (Array.isArray(value)) {
    validateArrayShape(value, path)
    for (let index = 0; index < value.length; index++) {
      validateValue(value[index], `${path}[${index}]`, ancestors)
    }
  } else {
    if (Object.getOwnPropertySymbols(value).length > 0) {
      throw fieldError(path, 'must not contain symbol keys')
    }
    for (const key of Object.getOwnPropertyNames(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) {
        throw fieldError(`${path}.${key}`, 'must be a JSON data property')
      }
      validateValue(descriptor.value, `${path}.${key}`, ancestors)
    }
  }

  ancestors.delete(value)
}

function validateStateItem(item: unknown, path: string, ancestors: Set<object>) {
  validateStructuralObject(item, path, ['value'], ['state'])
  validateValue(item.value, `${path}.value`, ancestors)
  if (item.state !== undefined) validateVisualState(item.state, `${path}.state`)
}

function validatePanelBase(panel: Record<string, unknown>, path: string) {
  validateString(panel.title, `${path}.title`)
  if (panel.overflow !== undefined) validateOverflow(panel.overflow, `${path}.overflow`)
  if (panel.emptyLabel !== undefined)
    validateString(panel.emptyLabel, `${path}.emptyLabel`)
}

function validateHighlights(highlights: unknown, itemsCount: number, path: string) {
  validateArrayShape(highlights, path)
  const ranges: Array<{ startIndex: number; endIndex: number }> = []

  highlights.forEach((highlight, index) => {
    const highlightPath = `${path}[${index}]`
    validateStructuralObject(highlight, highlightPath, [
      'startIndex',
      'endIndex',
      'state',
    ])
    const startIndex = highlight.startIndex
    const endIndex = highlight.endIndex
    if (!isInteger(startIndex) || !isInteger(endIndex)) {
      throw fieldError(highlightPath, 'indices must be integers')
    }
    if (startIndex < 0 || endIndex < startIndex || endIndex >= itemsCount) {
      throw fieldError(highlightPath, 'indices must be within the sequence')
    }
    validateVisualState(highlight.state, `${highlightPath}.state`)
    ranges.forEach((range) => {
      if (startIndex <= range.endIndex && endIndex >= range.startIndex) {
        throw fieldError(highlightPath, 'ranges must not overlap')
      }
    })
    ranges.push({ startIndex, endIndex })
  })
}

function validatePanel(panel: unknown, index: number, ancestors: Set<object>) {
  const path = `steps[].panels[${index}]`
  if (!isRecord(panel)) throw fieldError(path, 'must be an object')
  if (!isOneOf(panel.type, PANEL_TYPES))
    throw fieldError(`${path}.type`, 'has an invalid panel type')
  if (panel.type === 'sequence') {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'kind', 'items', 'showIndices'],
      ['overflow', 'emptyLabel', 'pointers', 'highlights'],
    )
  } else if (panel.type === 'scalar') {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'value'],
      ['overflow', 'emptyLabel', 'state'],
    )
  } else if (panel.type === 'map') {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'entries'],
      ['overflow', 'emptyLabel'],
    )
  } else if (panel.type === 'set') {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'items'],
      ['overflow', 'emptyLabel'],
    )
  } else if (panel.type === 'grid') {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'rows', 'showIndices'],
      ['overflow', 'emptyLabel'],
    )
  } else {
    validateStructuralObject(
      panel,
      path,
      ['type', 'title', 'value', 'status'],
      ['overflow', 'emptyLabel'],
    )
  }
  validatePanelBase(panel, path)

  const typedPanel = panel as CodePlaybackPanelDto

  if (typedPanel.type === 'sequence') {
    if (!isOneOf(typedPanel.kind, ['array', 'string', 'list']))
      throw fieldError(`${path}.kind`, 'has an invalid kind')
    validateArrayShape(typedPanel.items, `${path}.items`)
    typedPanel.items.forEach((item, itemIndex) =>
      validateValue(item, `${path}.items[${itemIndex}]`, ancestors),
    )
    if (typeof typedPanel.showIndices !== 'boolean')
      throw fieldError(`${path}.showIndices`, 'must be a boolean')
    if (typedPanel.pointers !== undefined) {
      validateArrayShape(typedPanel.pointers, `${path}.pointers`)
      const labels = new Set<string>()
      typedPanel.pointers.forEach((pointer, pointerIndex) => {
        const pointerPath = `${path}.pointers[${pointerIndex}]`
        validateStructuralObject(pointer, pointerPath, ['label', 'index'])
        validateString(pointer.label, `${pointerPath}.label`)
        if (
          !isInteger(pointer.index) ||
          pointer.index < 0 ||
          pointer.index >= typedPanel.items.length
        ) {
          throw fieldError(`${pointerPath}.index`, 'must point to an item')
        }
        if (labels.has(pointer.label))
          throw fieldError(`${pointerPath}.label`, 'must be unique')
        labels.add(pointer.label)
      })
    }
    if (typedPanel.highlights !== undefined)
      validateHighlights(
        typedPanel.highlights,
        typedPanel.items.length,
        `${path}.highlights`,
      )
    return
  }

  if (typedPanel.type === 'scalar' || typedPanel.type === 'result') {
    validateValue(typedPanel.value, `${path}.value`, ancestors)
    if (typedPanel.type === 'scalar' && typedPanel.state !== undefined)
      validateVisualState(typedPanel.state, `${path}.state`)
    if (
      typedPanel.type === 'result' &&
      !isOneOf(typedPanel.status, ['neutral', 'success', 'error'])
    ) {
      throw fieldError(`${path}.status`, 'has an invalid result status')
    }
    return
  }

  if (typedPanel.type === 'map') {
    validateArrayShape(typedPanel.entries, `${path}.entries`)
    typedPanel.entries.forEach((entry, entryIndex) => {
      const entryPath = `${path}.entries[${entryIndex}]`
      validateStructuralObject(entry, entryPath, ['key', 'value'], ['state'])
      if (!(typeof entry.key === 'string' || isFiniteNumber(entry.key))) {
        throw fieldError(`${entryPath}.key`, 'must be a string or finite number')
      }
      validateValue(entry.value, `${entryPath}.value`, ancestors)
      if (entry.state !== undefined)
        validateVisualState(entry.state, `${entryPath}.state`)
    })
    return
  }

  if (typedPanel.type === 'set') {
    validateArrayShape(typedPanel.items, `${path}.items`)
    typedPanel.items.forEach((item, itemIndex) =>
      validateStateItem(item, `${path}.items[${itemIndex}]`, ancestors),
    )
    return
  }

  validateArrayShape(typedPanel.rows, `${path}.rows`)
  if (typeof typedPanel.showIndices !== 'boolean')
    throw fieldError(`${path}.showIndices`, 'must be a boolean')
  const rowLength =
    typedPanel.rows.length > 0 && Array.isArray(typedPanel.rows[0])
      ? typedPanel.rows[0].length
      : null
  typedPanel.rows.forEach((row, rowIndex) => {
    validateArrayShape(row, `${path}.rows[${rowIndex}]`)
    if (rowLength !== null && row.length !== rowLength)
      throw fieldError(`${path}.rows[${rowIndex}]`, 'must be rectangular')
    row.forEach((item, columnIndex) =>
      validateStateItem(item, `${path}.rows[${rowIndex}][${columnIndex}]`, ancestors),
    )
  })
}

const cloneValue = (value: CodePlaybackValue): CodePlaybackValue => {
  if (Array.isArray(value)) return value.map(cloneValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneValue(item)]),
    )
  }
  return value
}

const clonePanelBase = (panel: CodePlaybackPanelDto): CodePlaybackPanelBaseDto => {
  const base: CodePlaybackPanelBaseDto = { title: panel.title }
  if (panel.overflow !== undefined) base.overflow = panel.overflow
  if (panel.emptyLabel !== undefined) base.emptyLabel = panel.emptyLabel
  return base
}

const cloneStateItem = (item: CodePlaybackStateItemDto): CodePlaybackStateItemDto => {
  const cloned: CodePlaybackStateItemDto = { value: cloneValue(item.value) }
  if (item.state !== undefined) cloned.state = item.state
  return cloned
}

const clonePanel = (panel: CodePlaybackPanelDto): CodePlaybackPanelDto => {
  if (panel.type === 'sequence') {
    const cloned: Extract<CodePlaybackPanelDto, { type: 'sequence' }> = {
      ...clonePanelBase(panel),
      type: panel.type,
      kind: panel.kind,
      items: panel.items.map(cloneValue),
      showIndices: panel.showIndices,
    }
    if (panel.pointers !== undefined)
      cloned.pointers = panel.pointers.map((pointer) => ({
        label: pointer.label,
        index: pointer.index,
      }))
    if (panel.highlights !== undefined)
      cloned.highlights = panel.highlights.map((highlight) => ({
        startIndex: highlight.startIndex,
        endIndex: highlight.endIndex,
        state: highlight.state,
      }))
    return cloned
  }
  if (panel.type === 'scalar' || panel.type === 'result')
    return panel.type === 'scalar'
      ? {
          ...clonePanelBase(panel),
          type: panel.type,
          value: cloneValue(panel.value),
          ...(panel.state === undefined ? {} : { state: panel.state }),
        }
      : {
          ...clonePanelBase(panel),
          type: panel.type,
          value: cloneValue(panel.value),
          status: panel.status,
        }
  if (panel.type === 'map') {
    return {
      ...clonePanelBase(panel),
      type: panel.type,
      entries: panel.entries.map((entry) => ({
        key: entry.key,
        value: cloneValue(entry.value),
        ...(entry.state === undefined ? {} : { state: entry.state }),
      })),
    }
  }
  if (panel.type === 'set') {
    return {
      ...clonePanelBase(panel),
      type: panel.type,
      items: panel.items.map(cloneStateItem),
    }
  }
  return {
    ...clonePanelBase(panel),
    type: panel.type,
    rows: panel.rows.map((row) => row.map(cloneStateItem)),
    showIndices: panel.showIndices,
  }
}

const cloneDto = (dto: CodePlaybackDto): CodePlaybackDto => ({
  code: dto.code,
  input: { content: dto.input.content, overflow: dto.input.overflow },
  steps: dto.steps.map((step) => ({
    activeLineRanges: step.activeLineRanges.map((range) => ({ ...range })),
    explanation: step.explanation,
    panels: step.panels.map(clonePanel),
  })),
})

export class CodePlayback {
  private constructor(private readonly value: CodePlaybackDto) {}

  static create(dto: CodePlaybackDto): CodePlayback {
    validateStructuralObject(dto, 'codePlayback', ['code', 'input', 'steps'])
    validateString(dto.code, 'code', false)
    const totalLines = dto.code.split('\n').length

    validateStructuralObject(dto.input, 'input', ['content', 'overflow'])
    validateString(dto.input.content, 'input.content', false)
    validateOverflow(dto.input.overflow, 'input.overflow')

    validateArrayShape(dto.steps, 'steps', 1)
    dto.steps.forEach((step, stepIndex) => {
      const path = `steps[${stepIndex}]`
      validateStructuralObject(step, path, ['activeLineRanges', 'explanation', 'panels'])
      validateArrayShape(step.activeLineRanges, `${path}.activeLineRanges`, 1)
      step.activeLineRanges.forEach((range, rangeIndex) => {
        const rangePath = `${path}.activeLineRanges[${rangeIndex}]`
        validateStructuralObject(range, rangePath, ['startLine', 'endLine'])
        if (!isInteger(range.startLine) || !isInteger(range.endLine))
          throw fieldError(rangePath, 'must contain integer line bounds')
        if (
          range.startLine < 1 ||
          range.startLine > range.endLine ||
          range.endLine > totalLines
        ) {
          throw fieldError(rangePath, 'must be within the code lines')
        }
      })
      validateString(step.explanation, `${path}.explanation`)
      validateArrayShape(step.panels, `${path}.panels`)
      step.panels.forEach((panel, panelIndex) =>
        validatePanel(panel, panelIndex, new Set()),
      )
    })

    return new CodePlayback(cloneDto(dto))
  }

  get dto(): CodePlaybackDto {
    return cloneDto(this.value)
  }
}
