import { act, renderHook, waitFor } from '@testing-library/react'
import { PaginationResponse } from '@stardust/core/global/responses'
import { RestResponse } from '@stardust/core/global/responses'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { type Mock, mock } from 'ts-jest-mocker'

import { useCache } from '@/ui/global/hooks/useCache'
import { useNotesDrawer } from '../useNotesDrawer'

jest.mock('@/ui/global/hooks/useCache', () => ({
  useCache: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useDebounce', () => ({
  useDebounce: (callback: (value: unknown) => void) => callback,
}))

type Params = Parameters<typeof useNotesDrawer>[0]

type NotesListData = {
  items: NoteDto[]
  totalItemsCount: number
}

type UseCacheConfig = {
  key: string
  fetcher: () => Promise<NotesListData>
  dependencies: unknown[]
  isEnabled: boolean
}

function createRestResponse<T>(props: {
  body?: T
  statusCode?: number
  errorMessage?: string
}) {
  return new RestResponse<T>(props)
}

function makeNote(id: string, overrides?: Partial<NoteDto>): NoteDto {
  return {
    id,
    title: `Nota ${id}`,
    content: `Conteudo ${id}`,
    userId: 'user-1',
    createdAt: new Date('2026-05-01T10:00:00.000Z'),
    updatedAt: new Date('2026-05-01T10:00:00.000Z'),
    ...overrides,
  }
}

describe('useNotesDrawer', () => {
  let profileService: Mock<ProfileService>
  let showError: jest.Mock
  let showSuccess: jest.Mock
  let cacheData: NotesListData | undefined
  let cacheError: string
  let refetch: jest.Mock
  let updateCache: jest.Mock
  let lastUseCacheConfig: UseCacheConfig

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useNotesDrawer({
        profileService,
        userId: 'user-1',
        showError,
        showSuccess,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    cacheData = {
      items: [],
      totalItemsCount: 0,
    }
    cacheError = ''
    refetch = jest.fn()
    updateCache = jest.fn((nextData: NotesListData) => {
      cacheData = nextData
    })
    lastUseCacheConfig = {
      key: '',
      fetcher: async () => ({ items: [], totalItemsCount: 0 }),
      dependencies: [],
      isEnabled: false,
    }

    jest.mocked(useCache).mockImplementation((config: any) => {
      lastUseCacheConfig = config

      return {
        data: cacheData,
        isLoading: false,
        error: cacheError,
        isRefetching: false,
        refetch,
        updateCache,
      }
    })

    profileService = mock<ProfileService>()
    showError = jest.fn()
    showSuccess = jest.fn()

    profileService.fetchNotes.mockResolvedValue(
      createRestResponse({
        body: new PaginationResponse({
          items: [],
          totalItemsCount: 0,
          itemsPerPage: 8,
        }),
        statusCode: 200,
      }),
    )
    profileService.createNote.mockResolvedValue(
      createRestResponse({
        body: makeNote('created-note'),
        statusCode: 200,
      }),
    )
    profileService.updateNote.mockResolvedValue(
      createRestResponse({
        body: makeNote('updated-note'),
        statusCode: 200,
      }),
    )
    profileService.deleteNote.mockResolvedValue(createRestResponse({ statusCode: 200 }))

    jest.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('should show authentication error when saving without an authenticated user', async () => {
    const { result } = Hook({ userId: null })

    await act(async () => {
      await result.current.handleSaveClick()
    })

    expect(showError).toHaveBeenCalledWith(
      'Voce precisa estar autenticado para salvar anotações',
    )
    expect(profileService.createNote).not.toHaveBeenCalled()
    expect(profileService.updateNote).not.toHaveBeenCalled()
  })

  it('should validate the form before creating a note', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.handleSaveClick()
    })

    expect(result.current.fieldError).toBe('Titulo deve conter pelo menos 1 caractere')
    expect(profileService.createNote).not.toHaveBeenCalled()
  })

  it('should show service error when save fails', async () => {
    profileService.createNote.mockResolvedValueOnce(
      createRestResponse({
        statusCode: 400,
        errorMessage: 'Falha ao criar nota',
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.handleTitleChange('Nova nota')
      result.current.handleContentChange('Conteudo de teste')
    })

    await act(async () => {
      await result.current.handleSaveClick()
    })

    expect(showError).toHaveBeenCalledWith('Falha ao criar nota')
    expect(showSuccess).not.toHaveBeenCalled()
    expect(result.current.isSaving).toBe(false)
  })

  it('should show authentication error when deleting without an authenticated user', async () => {
    const { result } = Hook({ userId: null })

    await act(async () => {
      await result.current.handleDeleteClick()
    })

    expect(showError).toHaveBeenCalledWith(
      'Voce precisa estar autenticado para excluir anotações',
    )
    expect(profileService.deleteNote).not.toHaveBeenCalled()
  })

  it('should keep local changes when note selection discard is rejected and replace them when accepted', () => {
    const selectedNote = makeNote('selected-note', {
      title: 'Nota salva',
      content: 'Conteudo salvo',
    })
    const { result } = Hook()

    act(() => {
      result.current.handleTitleChange('Rascunho local')
      result.current.handleContentChange('Conteudo em edicao')
      result.current.handleNotesDialogOpen()
    })

    jest.mocked(window.confirm).mockReturnValueOnce(false)

    act(() => {
      result.current.handleSelectNote(selectedNote)
    })

    expect(result.current.title).toBe('Rascunho local')
    expect(result.current.content).toBe('Conteudo em edicao')
    expect(result.current.hasActiveNote).toBe(false)
    expect(result.current.isDialogOpen).toBe(true)

    jest.mocked(window.confirm).mockReturnValueOnce(true)

    act(() => {
      result.current.handleSelectNote(selectedNote)
    })

    expect(result.current.title).toBe('Nota salva')
    expect(result.current.content).toBe('Conteudo salvo')
    expect(result.current.hasActiveNote).toBe(true)
    expect(result.current.isDialogOpen).toBe(false)
    expect(result.current.isDrawerOpen).toBe(true)
  })

  it('should update page and search state for notes listing and fetch with the current filters', async () => {
    profileService.fetchNotes.mockResolvedValueOnce(
      createRestResponse({
        body: new PaginationResponse({
          items: [makeNote('page-2-note')],
          totalItemsCount: 17,
          page: 1,
          itemsPerPage: 8,
        }),
        statusCode: 200,
      }),
    )
    cacheData = {
      items: [makeNote('existing')],
      totalItemsCount: 17,
    }

    const { result } = Hook()

    expect(lastUseCacheConfig.isEnabled).toBe(false)

    act(() => {
      result.current.handleNotesDialogOpen()
    })

    expect(result.current.isDialogOpen).toBe(true)
    expect(lastUseCacheConfig.isEnabled).toBe(true)

    act(() => {
      result.current.handleNextPageClick()
    })

    expect(result.current.page).toBe(2)
    expect(lastUseCacheConfig.dependencies).toEqual(['user-1', 2, ''])

    act(() => {
      result.current.handleSearchChange('algoritmo')
    })

    expect(result.current.page).toBe(1)
    expect(lastUseCacheConfig.dependencies).toEqual(['user-1', 1, 'algoritmo'])

    await lastUseCacheConfig.fetcher()

    expect(profileService.fetchNotes).toHaveBeenCalledWith(
      expect.objectContaining({
        page: expect.objectContaining({ value: 1 }),
        itemsPerPage: expect.objectContaining({ value: 8 }),
        search: expect.objectContaining({ value: 'algoritmo' }),
      }),
    )
  })

  it('should reconcile local cache after creating a note', async () => {
    const olderNote = makeNote('older-note', {
      title: 'Nota antiga',
      updatedAt: new Date('2026-05-01T08:00:00.000Z'),
    })
    const createdNote = makeNote('created-note', {
      title: 'Nota nova',
      content: 'Conteudo novo',
      updatedAt: new Date('2026-05-03T08:00:00.000Z'),
    })

    cacheData = {
      items: [olderNote],
      totalItemsCount: 1,
    }
    profileService.createNote.mockResolvedValueOnce(
      createRestResponse({ body: createdNote, statusCode: 200 }),
    )

    const { result } = Hook()

    act(() => {
      result.current.handleTitleChange('Nota nova')
      result.current.handleContentChange('Conteudo novo')
    })

    await act(async () => {
      await result.current.handleSaveClick()
    })

    await waitFor(() => {
      expect(result.current.notes.map((note) => note.id)).toEqual([
        'created-note',
        'older-note',
      ])
    })

    expect(updateCache).toHaveBeenCalledWith(
      expect.objectContaining({ totalItemsCount: 2 }),
      { shouldRevalidate: false },
    )
    expect(showSuccess).toHaveBeenCalledWith('anotação criada')
    expect(result.current.hasActiveNote).toBe(true)
  })

  it('should restore the previous note and cache when delete fails', async () => {
    const previousNote = makeNote('note-to-delete', {
      title: 'Nota que volta',
      content: 'Corpo anterior',
      updatedAt: new Date('2026-05-04T08:00:00.000Z'),
    })

    cacheData = {
      items: [previousNote],
      totalItemsCount: 1,
    }
    profileService.deleteNote.mockResolvedValueOnce(
      createRestResponse({
        statusCode: 400,
        errorMessage: 'Falha ao excluir nota',
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.handleSelectNote(previousNote)
    })

    await act(async () => {
      await result.current.handleDeleteClick()
    })

    await waitFor(() => {
      expect(result.current.notes.map((note) => note.id)).toEqual(['note-to-delete'])
    })

    expect(result.current.hasActiveNote).toBe(true)
    expect(result.current.title).toBe('Nota que volta')
    expect(result.current.content).toBe('Corpo anterior')
    expect(showError).toHaveBeenCalled()
  })
})
