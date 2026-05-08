'use client'

import type { PropsWithChildren } from 'react'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useNotesDrawer } from './useNotesDrawer'
import { NotesDrawerView } from './NotesDrawerView'

export const NotesDrawer = ({ children }: PropsWithChildren) => {
  const { profileService } = useRestContext()
  const { user } = useAuthContext()
  const toast = useToastContext()

  const {
    isDrawerOpen,
    isDialogOpen,
    isLoading,
    isSaving,
    isDeleting,
    hasActiveNote,
    title,
    content,
    fieldError,
    notes,
    page,
    totalPagesCount,
    errorMessage,
    isEmpty,
    handleDrawerOpenChange,
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
    handleCreateNewClick,
    handleRetryList,
  } = useNotesDrawer({
    profileService,
    userId: user?.id.value ?? null,
    showError: toast.showError,
    showSuccess: toast.showSuccess,
  })

  if (!user) {
    return null
  }

  return (
    <NotesDrawerView
      isDrawerOpen={isDrawerOpen}
      isDialogOpen={isDialogOpen}
      isLoadingNotes={isLoading}
      isSaving={isSaving}
      isDeleting={isDeleting}
      hasActiveNote={hasActiveNote}
      title={title}
      content={content}
      fieldError={fieldError}
      notes={notes}
      page={page}
      totalPagesCount={totalPagesCount}
      errorMessage={errorMessage}
      isEmpty={isEmpty}
      onDrawerOpenChange={handleDrawerOpenChange}
      onDialogOpenChange={handleNotesDialogOpenChange}
      onOpenNotesDialog={handleNotesDialogOpen}
      onSearchChange={handleSearchChange}
      onPreviousPageClick={handlePreviousPageClick}
      onNextPageClick={handleNextPageClick}
      onSelectNote={handleSelectNote}
      onTitleChange={handleTitleChange}
      onContentChange={handleContentChange}
      onSaveClick={handleSaveClick}
      onDeleteClick={handleDeleteClick}
      onCreateNewClick={handleCreateNewClick}
      onRetryList={handleRetryList}
    >
      {children}
    </NotesDrawerView>
  )
}
