import { act, renderHook, waitFor } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import { TextBlocksFaker } from '@stardust/core/lesson/entities/fakers'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import { useLessonStoryPage } from '../useLessonStoryPage'

const mockSetIsExecuting = jest.fn()
const mockSetIsSuccessful = jest.fn()
const mockSetIsFailure = jest.fn()
const mockSetCanExecute = jest.fn()
const mockParseTextBlocksToMdx = jest.fn(() => ['preview-content'])

const mockTextBlocksFetch = {
  data: null as ReturnType<typeof TextBlocksFaker.fakeManyDto> | null,
  error: '',
  isLoading: false,
  refetch: jest.fn(),
}

const mockStoryFetch = {
  data: null as { story?: string } | null,
  error: '',
  isLoading: false,
  refetch: jest.fn(),
}

jest.mock('@/ui/global/widgets/components/Mdx/useMdx', () => ({
  useMdx: () => ({
    parseTextBlocksToMdx: mockParseTextBlocksToMdx,
  }),
}))

jest.mock('@/ui/global/stores/ActionButtonStore', () => ({
  useActionButtonStore: () => ({
    useIsExecuting: () => ({ setIsExecuting: mockSetIsExecuting }),
    useIsSuccessful: () => ({ setIsSuccessful: mockSetIsSuccessful }),
    useIsFailure: () => ({ setIsFailure: mockSetIsFailure }),
    useCanExecute: () => ({ setCanExecute: mockSetCanExecute }),
  }),
}))

jest.mock('@/ui/global/hooks/useFetch', () => ({
  useFetch: jest.fn(({ key }: { key: string }) => {
    if (key.includes('legacy-story')) {
      return mockStoryFetch
    }

    return mockTextBlocksFetch
  }),
}))

describe('useLessonStoryPage', () => {
  let lessonService: Mock<LessonService>
  let toastProvider: Mock<ToastProvider>

  const starId = IdFaker.fake()

  const Hook = () =>
    renderHook(() =>
      useLessonStoryPage({
        lessonService,
        toastProvider,
        starId,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    let sequence = 0
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: jest.fn(() => `editor-id-${++sequence}`),
    })

    lessonService = mock<LessonService>()
    toastProvider = mock<ToastProvider>()

    toastProvider.showError = jest.fn()

    mockTextBlocksFetch.data = TextBlocksFaker.fakeManyDto(2, { type: 'default' })
    mockTextBlocksFetch.error = ''
    mockTextBlocksFetch.isLoading = false
    mockTextBlocksFetch.refetch = jest.fn()

    mockStoryFetch.data = { story: '' }
    mockStoryFetch.error = ''
    mockStoryFetch.isLoading = false
    mockStoryFetch.refetch = jest.fn()

    lessonService.updateTextBlocks.mockResolvedValue(
      new RestResponse({
        statusCode: 200,
        body: mockTextBlocksFetch.data,
      }),
    )
  })

  it('should initialize editor state with fetched text blocks', async () => {
    const firstBlock = TextBlocksFaker.fakeDto({ type: 'default' })
    const secondBlock = TextBlocksFaker.fakeDto({ type: 'code', isRunnable: false })
    mockTextBlocksFetch.data = [firstBlock, secondBlock]

    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(2))

    expect(result.current.textBlocks[0]).toEqual(expect.objectContaining(firstBlock))
    expect(result.current.textBlocks[1]).toEqual(expect.objectContaining(secondBlock))
    expect(result.current.previewContent).toBe('preview-content')
    expect(mockParseTextBlocksToMdx).toHaveBeenCalled()
    expect(result.current.isSaveDisabled).toBe(true)
    expect(mockSetCanExecute).toHaveBeenCalledWith(false)
  })

  it('should block editing when unsupported text block types are loaded', async () => {
    const supportedBlock = TextBlocksFaker.fakeDto({ type: 'default' })
    const unsupportedBlock = TextBlocksFaker.fakeDto({ type: 'list' })
    mockTextBlocksFetch.data = [supportedBlock, unsupportedBlock]

    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(1))

    expect(result.current.isBlocked).toBe(true)
    expect(result.current.blockingReason).toContain('list')
    expect(result.current.isSaveDisabled).toBe(true)
  })

  it('should block editing when there is only legacy story content', async () => {
    mockTextBlocksFetch.data = []
    mockStoryFetch.data = { story: 'story legado' }

    const { result } = Hook()

    await waitFor(() => expect(result.current.isBlocked).toBe(true))

    expect(result.current.blockingReason).toContain('story legado')
    expect(result.current.isSaveDisabled).toBe(true)
  })

  it('should add, expand and remove blocks locally', async () => {
    const firstBlock = TextBlocksFaker.fakeDto({ type: 'default' })
    mockTextBlocksFetch.data = [firstBlock]

    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(1))

    act(() => {
      result.current.onAddBlock('code')
    })

    expect(result.current.textBlocks).toHaveLength(2)
    expect(result.current.textBlocks[1]).toEqual(
      expect.objectContaining({
        type: 'code',
        content: 'Insira seu código aqui',
        isRunnable: false,
      }),
    )
    expect(result.current.expandedBlockId).toBe(result.current.textBlocks[1].id)

    const blockToRemove = result.current.textBlocks[1].id
    act(() => {
      result.current.onRemoveBlock(blockToRemove)
    })

    expect(result.current.textBlocks).toHaveLength(1)
    expect(result.current.expandedBlockId).toBe(result.current.textBlocks[0].id)
  })

  it('should save blocks successfully when data changes', async () => {
    const block = TextBlocksFaker.fakeDto({ type: 'user', content: 'Conteudo inicial' })
    mockTextBlocksFetch.data = [block]

    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(1))

    act(() => {
      result.current.onContentChange(
        result.current.textBlocks[0].id,
        'Conteudo atualizado',
      )
    })

    await waitFor(() => expect(result.current.isSaveDisabled).toBe(false))

    lessonService.updateTextBlocks.mockResolvedValueOnce(
      new RestResponse({
        statusCode: 200,
        body: [
          TextBlocksFaker.fakeDto({
            type: 'user',
            content: 'Conteudo atualizado',
          }),
        ],
      }),
    )

    await act(async () => {
      await result.current.onSave()
    })

    expect(lessonService.updateTextBlocks).toHaveBeenCalledWith(
      starId,
      expect.arrayContaining([
        expect.objectContaining({
          type: 'user',
          content: 'Conteudo atualizado',
        }),
      ]),
    )
    expect(mockSetIsExecuting).toHaveBeenCalledWith(true)
    expect(mockSetIsExecuting).toHaveBeenLastCalledWith(false)
    expect(mockSetIsSuccessful).toHaveBeenCalledWith(true)
  })

  it('should show error and set failure state when save fails', async () => {
    const block = TextBlocksFaker.fakeDto({ type: 'user', content: 'Conteudo inicial' })
    mockTextBlocksFetch.data = [block]

    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(1))

    act(() => {
      result.current.onContentChange(
        result.current.textBlocks[0].id,
        'Conteudo atualizado',
      )
    })

    await waitFor(() => expect(result.current.isSaveDisabled).toBe(false))

    lessonService.updateTextBlocks.mockResolvedValueOnce(
      new RestResponse({
        statusCode: 400,
        errorMessage: 'Erro ao salvar',
      }),
    )

    await act(async () => {
      await result.current.onSave()
    })

    expect(toastProvider.showError).toHaveBeenCalledWith('Erro ao salvar')
    expect(mockSetIsFailure).toHaveBeenCalledWith(true)
    expect(mockSetIsExecuting).toHaveBeenLastCalledWith(false)
  })

  it('should refetch both requests when retry is triggered', async () => {
    const { result } = Hook()

    await waitFor(() => expect(result.current.textBlocks).toHaveLength(2))

    act(() => {
      result.current.onRetry()
    })

    expect(mockTextBlocksFetch.refetch).toHaveBeenCalled()
    expect(mockStoryFetch.refetch).toHaveBeenCalled()
  })
})
