import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { DeleteNoteDialog } from './dialogs/DeleteNoteDialog'
import { DiscardChangesDialog } from './dialogs/DiscardChangesDialog'
import { NoteEditor } from './NoteEditor'
import { NotesSidebar } from './NotesSidebar'

type Props = {
  notes: NoteDto[]
  selectedNote: NoteDto | null
  page: number
  totalPagesCount: number
  totalItemsCount: number
  isLoading: boolean
  isListRefetching: boolean
  isSaving: boolean
  isDeleting: boolean
  hasNotes: boolean
  isMobileEditorVisible: boolean
  isSidebarCollapsed: boolean
  isDeleteDialogOpen: boolean
  isDiscardDialogOpen: boolean
  errorMessage: string | null
  handleSearchChange: (value: string) => void
  handlePreviousPageClick: () => void
  handleNextPageClick: () => void
  handleCreateNoteClick: () => void
  handleSelectNote: (note: NoteDto) => void
  handleBackToList: () => void
  handleSidebarToggle: () => void
  handleOpenDeleteDialog: () => void
  handleDeleteDialogOpenChange: (isOpen: boolean) => void
  handleConfirmDelete: () => Promise<boolean>
  handleDiscardDialogOpenChange: (isOpen: boolean) => void
  handleConfirmDiscard: () => void
  handleRetryList: () => void
  handleNoteSubmit: (formData: { title: string; content: string }) => Promise<boolean>
  handleFormDirtyChange: (isDirty: boolean) => void
}

export const NotesPageView = ({
  notes,
  selectedNote,
  page,
  totalPagesCount,
  totalItemsCount,
  isLoading,
  isListRefetching,
  isSaving,
  isDeleting,
  hasNotes,
  isMobileEditorVisible,
  isSidebarCollapsed,
  isDeleteDialogOpen,
  isDiscardDialogOpen,
  errorMessage,
  handleSearchChange,
  handlePreviousPageClick,
  handleNextPageClick,
  handleCreateNoteClick,
  handleSelectNote,
  handleBackToList,
  handleSidebarToggle,
  handleOpenDeleteDialog,
  handleDeleteDialogOpenChange,
  handleConfirmDelete,
  handleDiscardDialogOpenChange,
  handleConfirmDiscard,
  handleRetryList,
  handleNoteSubmit,
  handleFormDirtyChange,
}: Props) => {
  const { md } = useBreakpoint()
  const isMobile = md

  return (
    <main className='mx-auto max-w-[1536px] px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-8'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-extrabold tracking-tight text-gray-100'>Notas</h1>
        <Button
          className='h-9 w-full px-4 text-gray-900 sm:w-max'
          onClick={handleCreateNoteClick}
        >
          Nova nota
        </Button>
      </div>

      <div
        className='grid gap-5'
        style={{
          gridTemplateColumns: isMobile
            ? 'minmax(0, 1fr)'
            : isSidebarCollapsed
              ? '92px minmax(0, 1fr)'
              : '360px minmax(0, 1fr)',
        }}
      >
        {(!isMobile || !isMobileEditorVisible) && (
          <NotesSidebar
            notes={notes}
            page={page}
            totalPagesCount={totalPagesCount}
            totalItemsCount={totalItemsCount}
            isLoading={isLoading}
            isPaginationDisabled={isListRefetching}
            errorMessage={errorMessage}
            selectedNoteId={selectedNote?.id ?? null}
            onSearchChange={handleSearchChange}
            onSelectNote={handleSelectNote}
            onCreateNoteClick={handleCreateNoteClick}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
            onPreviousPageClick={handlePreviousPageClick}
            onNextPageClick={handleNextPageClick}
            onRetry={handleRetryList}
          />
        )}

        {(!isMobile || isMobileEditorVisible) && (
          <div className='min-w-0'>
            {isMobile && (
              <button
                type='button'
                onClick={handleBackToList}
                className='mb-4 flex items-center gap-1 text-sm font-semibold text-green-300'
                aria-label='Voltar para lista de notas'
              >
                <Icon name='arrow-left' size={14} />
                Voltar para lista
              </button>
            )}

            <NoteEditor
              selectedNote={selectedNote}
              isSaving={isSaving}
              isDeleting={isDeleting}
              hasNotes={hasNotes}
              onDeleteClick={handleOpenDeleteDialog}
              onSubmit={handleNoteSubmit}
              onDirtyChange={handleFormDirtyChange}
            />
          </div>
        )}
      </div>

      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={handleConfirmDelete}
      />

      <DiscardChangesDialog
        isOpen={isDiscardDialogOpen}
        onOpenChange={handleDiscardDialogOpenChange}
        onConfirm={handleConfirmDiscard}
      />
    </main>
  )
}
