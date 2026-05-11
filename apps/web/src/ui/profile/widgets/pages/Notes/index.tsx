'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useNotesPage } from './useNotesPage'
import { NotesPageView } from './NotesPageView'

export const NotesPage = () => {
  const { profileService } = useRestContext()
  const { user } = useAuthContext()
  const toast = useToastContext()

  const notesPage = useNotesPage({
    profileService,
    userId: user?.id.value ?? null,
    showError: toast.showError,
    showSuccess: toast.showSuccess,
  })

  return <NotesPageView {...notesPage} />
}
