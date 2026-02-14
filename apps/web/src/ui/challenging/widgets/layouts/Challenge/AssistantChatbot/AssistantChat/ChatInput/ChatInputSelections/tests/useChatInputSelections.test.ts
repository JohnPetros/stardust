import { renderHook } from '@testing-library/react'
import {
  useChatInputSelections,
  type ChatInputSelectionsParams,
} from '../useChatInputSelections'
import {
  CodeSelectionFaker,
  TextSelectionFaker,
} from '@stardust/core/global/structures/fakers'

describe('useChatInputSelections', () => {
  let onRemoveTextSelection: jest.Mock
  let onRemoveCodeSelection: jest.Mock

  const Hook = (params?: Partial<ChatInputSelectionsParams>) =>
    renderHook(() =>
      useChatInputSelections({
        textSelection: null,
        codeSelection: null,
        onRemoveTextSelection,
        onRemoveCodeSelection,
        ...params,
      }),
    )

  beforeEach(() => {
    onRemoveTextSelection = jest.fn()
    onRemoveCodeSelection = jest.fn()
  })

  it('should return empty selection items when no selections are provided', () => {
    const { result } = Hook()

    expect(result.current.selectionItems).toEqual([])
  })

  it('should map text selection with proper metadata', () => {
    const textSelection = TextSelectionFaker.fake({
      content: 'texto completo',
      preview: 'texto curto',
    })

    const { result } = Hook({ textSelection })

    expect(result.current.selectionItems).toHaveLength(1)
    expect(result.current.selectionItems[0]).toEqual(
      expect.objectContaining({
        id: 'text',
        iconName: 'description',
        tooltipContent: 'texto completo',
        label: 'texto curto',
        removeAriaLabel: 'Remover seleção de texto',
      }),
    )

    result.current.selectionItems[0].onRemove()
    expect(onRemoveTextSelection).toHaveBeenCalled()
  })

  it('should map code selection with proper label and metadata', () => {
    const codeSelection = CodeSelectionFaker.fake({
      content: 'conteudo do codigo',
      startLine: 3,
      endLine: 8,
    })

    const { result } = Hook({ codeSelection })

    expect(result.current.selectionItems).toHaveLength(1)
    expect(result.current.selectionItems[0]).toEqual(
      expect.objectContaining({
        id: 'code',
        iconName: 'code',
        tooltipContent: 'conteudo do codigo',
        label: 'Linha - 3-8',
        removeAriaLabel: 'Remover seleção de código',
      }),
    )

    result.current.selectionItems[0].onRemove()
    expect(onRemoveCodeSelection).toHaveBeenCalled()
  })

  it('should return text selection before code selection', () => {
    const textSelection = TextSelectionFaker.fake({ preview: 'primeiro' })
    const codeSelection = CodeSelectionFaker.fake({ startLine: 1, endLine: 2 })

    const { result } = Hook({ textSelection, codeSelection })

    expect(result.current.selectionItems).toHaveLength(2)
    expect(result.current.selectionItems[0].id).toBe('text')
    expect(result.current.selectionItems[1].id).toBe('code')
  })
})
