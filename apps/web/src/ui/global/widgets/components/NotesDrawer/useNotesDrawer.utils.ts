'use client'

import type { NoteDto } from '@stardust/core/profile/entities/dtos'

export type NotesListData = {
  items: NoteDto[]
  totalItemsCount: number
}

export const ITEMS_PER_PAGE = 8

export function getErrorMessage(errorValue: unknown): string | null {
  if (!errorValue) return null
  if (typeof errorValue === 'string') return errorValue
  if (errorValue instanceof Error) return errorValue.message
  return 'Nao foi possivel carregar as anotações'
}

export function matchesCurrentSearch(note: NoteDto, search: string) {
  if (!search.trim()) return true
  return note.title.toLowerCase().includes(search.trim().toLowerCase())
}

export function sortNotes(notes: NoteDto[]) {
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
