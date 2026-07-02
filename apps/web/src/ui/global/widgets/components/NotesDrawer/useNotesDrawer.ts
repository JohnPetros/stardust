'use client'

import { useMemo, useState } from 'react'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { Id, Integer, Text } from '@stardust/core/global/structures'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { noteSchema } from '@stardust/validation/profile/schemas'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'

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

const ITEMS_PER_PAGE = 8

export function useNotesDrawer({
  profileService,
  userId,
  showError,
  showSuccess,
}: Params) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeNote, setActiveNote] = useState<NoteDto | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const debouncedSearch = useDebounce((value: unknown) => {
    setPage(1)
    setSearch(String(value))
  }, 350)

  async function fetchNotes() {
    if (!userId) {
      return {
        items: [],
        totalItemsCount: 0,
      } satisfies NotesListData
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

  const {
    data: notesData,
    isLoading,
    error,
    refetch,
    updateCache,
  } = useCache<NotesListData>({
    key: CACHE.keys.notesList,
    fetcher: fetchNotes,
    dependencies: [userId, page, search],
    isEnabled: isDialogOpen,
  })

  const notes = useMemo(() => notesData?.items ?? [], [notesData])
  const totalPagesCount = useMemo(() => {
    const totalItemsCount = notesData?.totalItemsCount ?? 0
    return Math.ceil(totalItemsCount / ITEMS_PER_PAGE)
  }, [notesData])

  function confirmDiscardChanges() {
    if (!isDirty) return true
    return window.confirm('Descartar alteracoes nao salvas?')
  }

  function syncNotesCache(
    updater: (currentNotes: NoteDto[]) => { notes: NoteDto[]; totalItemsCount: number },
  ) {
    if (!notesData) return

    const { notes: nextNotes, totalItemsCount } = updater(notesData.items)

    updateCache(
      {
        ...notesData,
        items: nextNotes,
        totalItemsCount,
      },
      { shouldRevalidate: false },
    )
  }

  function matchesCurrentSearch(note: NoteDto) {
    if (!search.trim()) return true
    return note.title.toLowerCase().includes(search.trim().toLowerCase())
  }

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

  function clearForm() {
    setActiveNote(null)
    setTitle('')
    setContent('')
    setFieldError(null)
    setIsDirty(false)
  }

  function validateForm() {
    const parsedForm = noteSchema.safeParse({ title, content })

    if (!parsedForm.success) {
      setFieldError(parsedForm.error.issues[0]?.message ?? 'Dados invalidos')
      return false
    }

    setFieldError(null)
    return true
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    setIsDirty(true)
  }

  function handleContentChange(value: string) {
    setContent(value)
    setIsDirty(true)
  }

  function closeDrawer() {
    if (!confirmDiscardChanges()) {
      return
    }

    clearForm()
    setIsDrawerOpen(false)
  }

  function handleDrawerOpenChange(isOpen: boolean) {
    if (!isOpen && isDialogOpen) {
      return
    }

    if (!isOpen) {
      closeDrawer()
      return
    }

    setIsDrawerOpen(isOpen)
  }

  function handleManualDrawerClose() {
    closeDrawer()
  }

  function handleNotesDialogOpen() {
    setIsDialogOpen(true)
  }

  function handleNotesDialogOpenChange(isOpen: boolean) {
    setIsDialogOpen(isOpen)
  }

  function handleSearchChange(value: string) {
    debouncedSearch(value)
  }

  function handlePreviousPageClick() {
    setPage((previousPage) => Math.max(previousPage - 1, 1))
  }

  function handleNextPageClick() {
    setPage((previousPage) => {
      if (!totalPagesCount) return previousPage
      return Math.min(previousPage + 1, totalPagesCount)
    })
  }

  function handleSelectNote(note: NoteDto) {
    if (!confirmDiscardChanges()) {
      return
    }

    setActiveNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsDirty(false)
    setFieldError(null)
    setIsDialogOpen(false)
    setIsDrawerOpen(true)
  }

  async function handleSaveClick() {
    if (!userId) {
      showError('Voce precisa estar autenticado para salvar anotações')
      return
    }

    if (!validateForm()) return

    setIsSaving(true)

    try {
      if (activeNote?.id) {
        const response = await profileService.updateNote({
          noteId: Id.create(activeNote.id),
          noteTitle: Text.create(title),
          noteContent: Text.create(content),
        })

        if (response.isFailure) {
          showError(response.errorMessage)
          return
        }

        setActiveNote(response.body)
        setIsDirty(false)
        syncNotesCache((currentNotes) => {
          const filteredNotes = currentNotes.filter(
            (note) => note.id !== response.body.id,
          )
          const nextNotes = matchesCurrentSearch(response.body)
            ? sortNotes([response.body, ...filteredNotes])
            : filteredNotes

          return {
            notes: nextNotes,
            totalItemsCount: matchesCurrentSearch(response.body)
              ? (notesData?.totalItemsCount ?? nextNotes.length)
              : Math.max((notesData?.totalItemsCount ?? filteredNotes.length) - 1, 0),
          }
        })
        showSuccess('anotação atualizada')
        return
      }

      const response = await profileService.createNote({
        noteTitle: Text.create(title),
        noteContent: Text.create(content),
      })

      if (response.isFailure) {
        showError(response.errorMessage)
        return
      }

      setActiveNote(response.body)
      setIsDirty(false)
      syncNotesCache((currentNotes) => {
        if (!matchesCurrentSearch(response.body)) {
          return {
            notes: currentNotes,
            totalItemsCount: notesData?.totalItemsCount ?? currentNotes.length,
          }
        }

        const nextNotes = sortNotes([response.body, ...currentNotes]).slice(
          0,
          ITEMS_PER_PAGE,
        )

        return {
          notes: nextNotes,
          totalItemsCount: (notesData?.totalItemsCount ?? currentNotes.length) + 1,
        }
      })
      showSuccess('anotação criada')
    } catch {
      showError('Nao foi possivel salvar a anotação')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteClick() {
    if (!userId) {
      showError('Voce precisa estar autenticado para excluir anotações')
      return
    }

    if (!activeNote?.id) {
      clearForm()
      return
    }

    const shouldDelete = window.confirm('Deseja excluir esta anotação?')
    if (!shouldDelete) return

    setIsDeleting(true)
    const previousNote = activeNote

    syncNotesCache((currentNotes) => ({
      notes: currentNotes.filter((note) => note.id !== previousNote.id),
      totalItemsCount: Math.max(
        (notesData?.totalItemsCount ?? currentNotes.length) - 1,
        0,
      ),
    }))

    clearForm()

    try {
      const response = await profileService.deleteNote(Id.create(previousNote.id))

      if (response.isFailure) {
        setActiveNote(previousNote)
        setTitle(previousNote.title)
        setContent(previousNote.content)
        syncNotesCache((currentNotes) => ({
          notes: sortNotes([previousNote, ...currentNotes]).slice(0, ITEMS_PER_PAGE),
          totalItemsCount: (notesData?.totalItemsCount ?? currentNotes.length) + 1,
        }))
        showError(response.errorMessage)
        return
      }

      showSuccess('anotação excluida')
    } catch {
      setActiveNote(previousNote)
      setTitle(previousNote.title)
      setContent(previousNote.content)
      syncNotesCache((currentNotes) => ({
        notes: sortNotes([previousNote, ...currentNotes]).slice(0, ITEMS_PER_PAGE),
        totalItemsCount: (notesData?.totalItemsCount ?? currentNotes.length) + 1,
      }))
      showError('Nao foi possivel excluir a anotação')
    } finally {
      setIsDeleting(false)
    }
  }

  function getErrorMessage(errorValue: unknown): string | null {
    if (!errorValue) return null
    if (typeof errorValue === 'string') return errorValue
    if (errorValue instanceof Error) return errorValue.message
    return 'Nao foi possivel carregar as anotações'
  }

  return {
    isDrawerOpen,
    isDialogOpen,
    isLoading,
    isSaving,
    isDeleting,
    hasActiveNote: Boolean(activeNote?.id),
    title,
    content,
    fieldError,
    notes,
    page,
    totalPagesCount,
    errorMessage: getErrorMessage(error),
    isEmpty: notes.length === 0,
    handleDrawerOpenChange,
    handleManualDrawerClose,
    handleNotesDialogOpen,
    handleNotesDialogOpenChange,
    handleSearchChange,
    handlePreviousPageClick,
    handleNextPageClick,
    handleSelectNote,
    handleTitleChange,
    handleContentChange,
    handleSaveClick,
    handleDeleteClick,
    handleCreateNewClick: () => {
      if (!confirmDiscardChanges()) {
        return
      }

      clearForm()
    },
    handleRetryList: refetch,
  }
}
