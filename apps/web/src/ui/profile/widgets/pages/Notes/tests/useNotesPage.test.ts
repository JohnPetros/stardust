import { act, renderHook } from '@testing-library/react'
import { RestResponse } from '@stardust/core/global/responses'
import { PaginationResponse } from '@stardust/core/global/responses'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { type Mock, mock } from 'ts-jest-mocker'

import { useCache } from '@/ui/global/hooks/useCache'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useNotesPage } from '../useNotesPage'

jest.mock('@/ui/global/hooks/useCache', () => ({
  useCache: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useDebounce', () => ({
  useDebounce: (callback: (value: unknown) => void) => callback,
}))

type Params = Parameters<typeof useNotesPage>[0]

type NotesListData = {
  items: NoteDto[]
  totalItemsCount: number
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

const OLD_NOTE_ID = '11111111-1111-4111-8111-111111111111'
const CREATED_NOTE_ID = '22222222-2222-4222-8222-222222222222'
const SELECTED_NOTE_ID = '33333333-3333-4333-8333-333333333333'

describe('useNotesPage', () => {
  let profileService: Mock<ProfileService>
  let showError: jest.Mock
  let showSuccess: jest.Mock
  let cacheData: NotesListData | undefined
  let updateCache: jest.Mock

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useNotesPage({
        profileService,
        userId: 'user-1',
        showError,
        showSuccess,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    cacheData = { items: [], totalItemsCount: 0 }
    updateCache = jest.fn((nextData: NotesListData) => {
      cacheData = nextData
    })

    jest.mocked(useCache).mockImplementation(() => ({
      data: cacheData,
      isLoading: false,
      error: '',
      isRefetching: false,
      refetch: jest.fn(),
      updateCache,
    }))

    profileService = mock<ProfileService>()
    showError = jest.fn()
    showSuccess = jest.fn()

    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })

    profileService.fetchNotes.mockResolvedValue(
      createRestResponse({
        body: new PaginationResponse({ items: [], totalItemsCount: 0, itemsPerPage: 8 }),
        statusCode: 200,
      }),
    )
    profileService.createNote.mockResolvedValue(
      createRestResponse({ body: makeNote(CREATED_NOTE_ID), statusCode: 200 }),
    )
    profileService.updateNote.mockResolvedValue(
      createRestResponse({ body: makeNote('updated-note'), statusCode: 200 }),
    )
    profileService.deleteNote.mockResolvedValue(createRestResponse({ statusCode: 200 }))
  })

  it('should update search filters with debounce callback and reset page', () => {
    const { result } = Hook()

    act(() => {
      result.current.handleNextPageClick()
      result.current.handleSearchChange('algoritmo')
    })

    expect(result.current.page).toBe(1)
  })

  it('should ask for discard confirmation before selecting another note', () => {
    const note = makeNote(SELECTED_NOTE_ID)
    const { result } = Hook()

    act(() => {
      result.current.handleCreateNoteClick()
    })

    act(() => {
      result.current.handleFormDirtyChange(true)
    })

    act(() => {
      result.current.handleSelectNote(note)
    })

    expect(result.current.isDiscardDialogOpen).toBe(true)

    act(() => {
      result.current.handleConfirmDiscard()
    })

    expect(result.current.selectedNote?.id).toBe(SELECTED_NOTE_ID)
  })

  it('should reconcile cache on create, update and delete actions', async () => {
    const previous = makeNote(OLD_NOTE_ID, {
      updatedAt: new Date('2026-05-01T08:00:00.000Z'),
    })
    const created = makeNote(CREATED_NOTE_ID, {
      title: 'Nova nota',
      updatedAt: new Date('2026-05-03T08:00:00.000Z'),
    })
    const updated = makeNote(CREATED_NOTE_ID, {
      title: 'Nota editada',
      updatedAt: new Date('2026-05-04T08:00:00.000Z'),
    })

    cacheData = {
      items: [previous],
      totalItemsCount: 1,
    }

    profileService.createNote.mockResolvedValueOnce(
      createRestResponse({ body: created, statusCode: 200 }),
    )

    profileService.updateNote.mockResolvedValueOnce(
      createRestResponse({ body: updated, statusCode: 200 }),
    )

    const { result } = Hook()

    await act(async () => {
      await result.current.handleNoteSubmit({ title: 'Nova nota', content: '' })
    })

    expect(updateCache).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([expect.objectContaining({ id: CREATED_NOTE_ID })]),
      }),
      { shouldRevalidate: false },
    )

    await act(async () => {
      result.current.handleOpenDeleteDialog()
      await result.current.handleConfirmDelete()
    })

    expect(updateCache).toHaveBeenCalled()

    cacheData = {
      items: [created, previous],
      totalItemsCount: 2,
    }

    const updateHook = Hook()

    act(() => {
      updateHook.result.current.handleSelectNote(created)
    })

    await act(async () => {
      await updateHook.result.current.handleNoteSubmit({
        title: 'Nota editada',
        content: 'Corpo',
      })
    })

    expect(profileService.updateNote).toHaveBeenCalledWith(
      expect.objectContaining({
        noteId: expect.objectContaining({ value: CREATED_NOTE_ID }),
        noteTitle: expect.objectContaining({ value: 'Nota editada' }),
      }),
    )
  })

  it('should select the next available note after deleting on desktop', async () => {
    const selected = makeNote(CREATED_NOTE_ID, {
      updatedAt: new Date('2026-05-04T08:00:00.000Z'),
    })
    const remaining = makeNote(OLD_NOTE_ID, {
      updatedAt: new Date('2026-05-03T08:00:00.000Z'),
    })

    cacheData = {
      items: [selected, remaining],
      totalItemsCount: 2,
    }

    const { result } = Hook()

    act(() => {
      result.current.handleSelectNote(selected)
      result.current.handleOpenDeleteDialog()
    })

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(result.current.selectedNote?.id).toBe(OLD_NOTE_ID)
    expect(result.current.isMobileEditorVisible).toBe(true)
  })

  it('should return to the list after deleting on mobile', async () => {
    jest.mocked(useBreakpoint).mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
    })

    const selected = makeNote(CREATED_NOTE_ID)

    cacheData = {
      items: [selected],
      totalItemsCount: 1,
    }

    const { result } = Hook()

    act(() => {
      result.current.handleSelectNote(selected)
      result.current.handleOpenDeleteDialog()
    })

    await act(async () => {
      await result.current.handleConfirmDelete()
    })

    expect(result.current.selectedNote).toBeNull()
    expect(result.current.isMobileEditorVisible).toBe(false)
  })
})
