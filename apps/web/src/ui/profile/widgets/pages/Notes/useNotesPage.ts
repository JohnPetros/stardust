import { useMemo, useState } from 'react'
import { Id, Integer, Text } from '@stardust/core/global/structures'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useDebounce } from '@/ui/global/hooks/useDebounce'

const ITEMS_PER_PAGE = 8

type Params = {
  profileService: ProfileService
  userId: string | null
  showError: (message: string) => void
  showSuccess: (message: string) => void
}

type NotesListData = {
  items: NoteDto[]
  totalItemsCount: number
}

type PendingDiscardAction =
  | { type: 'open-create' }
  | { type: 'select-note'; note: NoteDto }
  | { type: 'back-to-list' }

function sortNotes(notes: NoteDto[]) {
  return [...notes].sort((firstNote, secondNote) => {
    const firstUpdatedAt = new Date(
      firstNote.updatedAt ?? firstNote.createdAt ?? 0,
    ).getTime()
    const secondUpdatedAt = new Date(
      secondNote.updatedAt ?? secondNote.createdAt ?? 0,
    ).getTime()

    return secondUpdatedAt - firstUpdatedAt
  })
}

export function useNotesPage({ profileService, userId, showError, showSuccess }: Params) {
  const { md: isMobile } = useBreakpoint()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState<NoteDto | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)
  const [isMobileEditorVisible, setIsMobileEditorVisible] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pendingDiscardAction, setPendingDiscardAction] =
    useState<PendingDiscardAction | null>(null)

  const debouncedSearch = useDebounce((value: unknown) => {
    setPage(1)
    setSearch(String(value))
  }, 350)

  async function fetchNotes() {
    if (!userId) {
      return { items: [], totalItemsCount: 0 } satisfies NotesListData
    }

    const response = await profileService.fetchNotes({
      page: Integer.create(page),
      itemsPerPage: Integer.create(ITEMS_PER_PAGE),
      search: Text.create(search),
    })

    if (response.isFailure) {
      throw new Error(response.errorMessage)
    }

    return response.body
  }

  const { data, isLoading, isRefetching, error, refetch, updateCache } =
    useCache<NotesListData>({
      key: CACHE.keys.notesList,
      fetcher: fetchNotes,
      dependencies: [userId, page, search],
      shouldRefetchOnFocus: false,
    })

  const notes = useMemo(() => data?.items ?? [], [data])
  const totalItemsCount = data?.totalItemsCount ?? 0
  const totalPagesCount = Math.ceil(totalItemsCount / ITEMS_PER_PAGE)
  const hasNotes = notes.length > 0

  function updateNotesCache(updater: (current: NotesListData) => NotesListData) {
    if (!data) return
    updateCache(updater(data), { shouldRevalidate: false })
  }

  function matchesCurrentSearch(note: NoteDto) {
    if (!search.trim()) return true
    return note.title.toLowerCase().includes(search.trim().toLowerCase())
  }

  function openCreateNote() {
    setSelectedNote(null)
    setIsMobileEditorVisible(true)
  }

  function openSelectedNote(note: NoteDto) {
    setSelectedNote(note)
    setIsMobileEditorVisible(true)
  }

  function runDiscardAction(action: PendingDiscardAction) {
    if (action.type === 'open-create') {
      openCreateNote()
      return
    }

    if (action.type === 'select-note') {
      openSelectedNote(action.note)
      return
    }

    setIsMobileEditorVisible(false)
  }

  function executeWithDiscardGuard(action: PendingDiscardAction) {
    if (!isFormDirty) {
      runDiscardAction(action)
      return
    }

    setPendingDiscardAction(action)
    setIsDiscardDialogOpen(true)
  }

  async function handleSubmitNote(formData: { title: string; content: string }) {
    if (!userId) {
      showError('Voce precisa estar autenticado para salvar anotações')
      return false
    }

    setIsSaving(true)

    try {
      if (selectedNote?.id) {
        const response = await profileService.updateNote({
          noteId: Id.create(selectedNote.id),
          noteTitle: Text.create(formData.title),
          noteContent: Text.create(formData.content),
        })

        if (response.isFailure) {
          showError(response.errorMessage)
          return false
        }

        const updatedNote = response.body
        setSelectedNote(updatedNote)

        updateNotesCache((current) => {
          const filteredNotes = current.items.filter((item) => item.id !== updatedNote.id)
          const nextItems = matchesCurrentSearch(updatedNote)
            ? sortNotes([updatedNote, ...filteredNotes])
            : filteredNotes

          return {
            items: nextItems,
            totalItemsCount: matchesCurrentSearch(updatedNote)
              ? current.totalItemsCount
              : Math.max(current.totalItemsCount - 1, 0),
          }
        })

        showSuccess('anotação atualizada')
        return true
      }

      const response = await profileService.createNote({
        noteTitle: Text.create(formData.title),
        noteContent: Text.create(formData.content),
      })

      if (response.isFailure) {
        showError(response.errorMessage)
        return false
      }

      const createdNote = response.body
      setSelectedNote(createdNote)

      updateNotesCache((current) => {
        if (!matchesCurrentSearch(createdNote)) {
          return current
        }

        const reconciledItems =
          page === 1
            ? sortNotes([createdNote, ...current.items]).slice(0, ITEMS_PER_PAGE)
            : current.items

        return {
          items: reconciledItems,
          totalItemsCount: current.totalItemsCount + 1,
        }
      })

      showSuccess('anotação criada')
      return true
    } catch {
      showError('Nao foi possivel salvar a anotação')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmDelete() {
    if (!userId) {
      showError('Voce precisa estar autenticado para excluir anotações')
      return false
    }

    if (!selectedNote?.id || !data) {
      setIsDeleteDialogOpen(false)
      return false
    }

    setIsDeleting(true)
    const noteToDelete = selectedNote
    const remainingNotes = sortNotes(
      data.items.filter((item) => item.id !== noteToDelete.id),
    )

    updateNotesCache((current) => ({
      items: current.items.filter((item) => item.id !== noteToDelete.id),
      totalItemsCount: Math.max(current.totalItemsCount - 1, 0),
    }))
    setSelectedNote(isMobile ? null : (remainingNotes[0] ?? null))
    if (isMobile) {
      setIsMobileEditorVisible(false)
    }
    setIsDeleteDialogOpen(false)

    const response = await profileService.deleteNote(Id.create(noteToDelete.id))
    setIsDeleting(false)

    if (response.isFailure) {
      updateNotesCache((current) => ({
        items: sortNotes([noteToDelete, ...current.items]).slice(0, ITEMS_PER_PAGE),
        totalItemsCount: current.totalItemsCount + 1,
      }))
      setSelectedNote(noteToDelete)
      showError(response.errorMessage)
      return false
    }

    showSuccess('anotação excluida')
    return true
  }

  function getErrorMessage(value: unknown) {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof Error) return value.message
    return 'Nao foi possivel carregar as anotações'
  }

  return {
    notes,
    selectedNote,
    page,
    totalPagesCount,
    totalItemsCount,
    isLoading,
    isListRefetching: isRefetching,
    isSaving,
    isDeleting,
    hasNotes,
    isMobileEditorVisible,
    isSidebarCollapsed,
    isDeleteDialogOpen,
    isDiscardDialogOpen,
    errorMessage: getErrorMessage(error),
    handleSearchChange: (value: string) => debouncedSearch(value),
    handlePreviousPageClick: () => setPage((currentPage) => Math.max(currentPage - 1, 1)),
    handleNextPageClick: () =>
      setPage((currentPage) =>
        totalPagesCount > 0 ? Math.min(currentPage + 1, totalPagesCount) : currentPage,
      ),
    handleCreateNoteClick: () => executeWithDiscardGuard({ type: 'open-create' }),
    handleSelectNote: (note: NoteDto) =>
      executeWithDiscardGuard({ type: 'select-note', note }),
    handleBackToList: () => executeWithDiscardGuard({ type: 'back-to-list' }),
    handleSidebarToggle: () => setIsSidebarCollapsed((current) => !current),
    handleOpenDeleteDialog: () => setIsDeleteDialogOpen(true),
    handleDeleteDialogOpenChange: (isOpen: boolean) => setIsDeleteDialogOpen(isOpen),
    handleConfirmDelete,
    handleDiscardDialogOpenChange: (isOpen: boolean) => {
      setIsDiscardDialogOpen(isOpen)
      if (!isOpen) setPendingDiscardAction(null)
    },
    handleConfirmDiscard: () => {
      if (pendingDiscardAction) {
        runDiscardAction(pendingDiscardAction)
      }

      setPendingDiscardAction(null)
      setIsDiscardDialogOpen(false)
    },
    handleRetryList: refetch,
    handleNoteSubmit: handleSubmitNote,
    handleFormDirtyChange: (isDirty: boolean) => setIsFormDirty(isDirty),
  }
}
