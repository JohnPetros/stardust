import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'

jest.mock('@/ui/global/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}))

jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type='button' onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('../NotesSidebar', () => ({
  NotesSidebar: ({
    isCollapsed,
    selectedNoteId,
    onToggleCollapse,
    onCreateNoteClick,
  }: any) => (
    <div
      data-testid='notes-sidebar'
      data-collapsed={String(isCollapsed)}
      data-selected-note-id={selectedNoteId ?? ''}
    >
      <button type='button' onClick={onToggleCollapse}>
        Alternar sidebar
      </button>
      <button type='button' onClick={onCreateNoteClick}>
        Criar pela sidebar
      </button>
    </div>
  ),
}))

jest.mock('../NoteEditor', () => ({
  NoteEditor: ({ selectedNote, hasNotes, onDeleteClick }: any) => (
    <div
      data-testid='note-editor'
      data-selected-note-id={selectedNote?.id ?? ''}
      data-has-notes={String(hasNotes)}
    >
      <button type='button' onClick={onDeleteClick}>
        Abrir exclusao
      </button>
    </div>
  ),
}))

jest.mock('../dialogs/DeleteNoteDialog', () => ({
  DeleteNoteDialog: ({ isOpen, isDeleting }: any) => (
    <div
      data-testid='delete-note-dialog'
      data-open={String(isOpen)}
      data-deleting={String(isDeleting)}
    />
  ),
}))

jest.mock('../dialogs/DiscardChangesDialog', () => ({
  DiscardChangesDialog: ({ isOpen }: any) => (
    <div data-testid='discard-changes-dialog' data-open={String(isOpen)} />
  ),
}))

import { NotesPageView } from '../NotesPageView'

function makeNote(id: string): NoteDto {
  return {
    id,
    title: `Nota ${id}`,
    content: `Conteudo ${id}`,
    userId: 'user-1',
    createdAt: new Date('2026-05-01T10:00:00.000Z'),
    updatedAt: new Date('2026-05-01T10:00:00.000Z'),
  }
}

describe('NotesPageView', () => {
  type Props = ComponentProps<typeof NotesPageView>

  const View = (props?: Partial<Props>) => {
    render(
      <NotesPageView
        notes={[makeNote('1'), makeNote('2')]}
        selectedNote={makeNote('1')}
        page={1}
        totalPagesCount={3}
        totalItemsCount={2}
        isLoading={false}
        isListRefetching={false}
        isSaving={false}
        isDeleting={false}
        hasNotes={true}
        isMobileEditorVisible={false}
        isSidebarCollapsed={false}
        isDeleteDialogOpen={false}
        isDiscardDialogOpen={false}
        errorMessage={null}
        handleSearchChange={jest.fn()}
        handlePreviousPageClick={jest.fn()}
        handleNextPageClick={jest.fn()}
        handleCreateNoteClick={jest.fn()}
        handleSelectNote={jest.fn()}
        handleBackToList={jest.fn()}
        handleSidebarToggle={jest.fn()}
        handleOpenDeleteDialog={jest.fn()}
        handleDeleteDialogOpenChange={jest.fn()}
        handleConfirmDelete={jest.fn()}
        handleDiscardDialogOpenChange={jest.fn()}
        handleConfirmDiscard={jest.fn()}
        handleRetryList={jest.fn()}
        handleNoteSubmit={jest.fn()}
        handleFormDirtyChange={jest.fn()}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should keep the sidebar and editor visible together on desktop', async () => {
    const user = userEvent.setup()
    const handleCreateNoteClick = jest.fn()
    const handleSidebarToggle = jest.fn()
    const handleOpenDeleteDialog = jest.fn()

    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })

    View({
      isMobileEditorVisible: false,
      isSidebarCollapsed: true,
      isDeleteDialogOpen: true,
      isDiscardDialogOpen: true,
      handleCreateNoteClick,
      handleSidebarToggle,
      handleOpenDeleteDialog,
    })

    expect(screen.getByTestId('notes-sidebar')).toHaveAttribute('data-collapsed', 'true')
    expect(screen.getByTestId('note-editor')).toHaveAttribute(
      'data-selected-note-id',
      '1',
    )
    expect(
      screen.queryByRole('button', { name: 'Voltar para lista de notas' }),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('delete-note-dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('discard-changes-dialog')).toHaveAttribute(
      'data-open',
      'true',
    )

    await user.click(screen.getByRole('button', { name: 'Nova nota' }))
    await user.click(screen.getByRole('button', { name: 'Alternar sidebar' }))
    await user.click(screen.getByRole('button', { name: 'Abrir exclusao' }))

    expect(handleCreateNoteClick).toHaveBeenCalledTimes(1)
    expect(handleSidebarToggle).toHaveBeenCalledTimes(1)
    expect(handleOpenDeleteDialog).toHaveBeenCalledTimes(1)
  })

  it('should show only the notes list on mobile when the editor is hidden', () => {
    jest.mocked(useBreakpoint).mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
    })

    View({ isMobileEditorVisible: false })

    expect(screen.getByTestId('notes-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('note-editor')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Voltar para lista de notas' }),
    ).not.toBeInTheDocument()
  })

  it('should switch to the editor on mobile when the editor is visible', async () => {
    const user = userEvent.setup()
    const handleBackToList = jest.fn()

    jest.mocked(useBreakpoint).mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
    })

    View({
      isMobileEditorVisible: true,
      handleBackToList,
    })

    expect(screen.queryByTestId('notes-sidebar')).not.toBeInTheDocument()
    expect(screen.getByTestId('note-editor')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Voltar para lista de notas' }))

    expect(handleBackToList).toHaveBeenCalledTimes(1)
  })
})
