import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import type { NoteDto } from '@stardust/core/profile/entities/dtos'

jest.mock('vaul', () => {
  const Root = ({ children }: any) => <div data-testid='drawer-root'>{children}</div>
  const Trigger = ({ children }: any) => (
    <button type='button' aria-label='Abrir anotacoes'>
      {children}
    </button>
  )
  const Portal = ({ children }: any) => <>{children}</>
  const Overlay = ({ children, ...props }: any) => <div {...props}>{children}</div>
  const Content = ({ children, ...props }: any) => <div {...props}>{children}</div>
  const Title = ({ children, ...props }: any) => <div {...props}>{children}</div>

  return {
    Drawer: {
      Root,
      Trigger,
      Portal,
      Overlay,
      Content,
      Title,
    },
  }
})

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children, onClick, isLoading, disabled, ...props }: any) => (
    <button
      type='button'
      onClick={onClick}
      data-loading={String(Boolean(isLoading))}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/WYSIWYGEditor', () => ({
  WYSIWYGEditor: ({ value, onChange }: any) => (
    <textarea
      aria-label='Editor de anotacao'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

jest.mock('../NotesListDialog', () => ({
  NotesListDialog: ({
    isOpen,
    isLoading,
    errorMessage,
    isEmpty,
    notes,
    page,
    totalPagesCount,
    onOpenChange,
    onSearchChange,
    onSelectNote,
    onCreateNewClick,
    onPreviousPageClick,
    onNextPageClick,
    onRetry,
  }: any) => (
    <div data-testid='notes-list-dialog' data-open={String(isOpen)}>
      <span data-testid='dialog-loading'>{String(isLoading)}</span>
      <span data-testid='dialog-error'>{errorMessage ?? ''}</span>
      <span data-testid='dialog-empty'>{String(isEmpty)}</span>
      <span data-testid='dialog-page'>{page}</span>
      <span data-testid='dialog-total-pages'>{totalPagesCount}</span>
      <span data-testid='dialog-notes'>
        {notes.map((note: NoteDto) => note.title).join(',')}
      </span>
      <button type='button' onClick={() => onOpenChange(false)}>
        Fechar lista
      </button>
      <button type='button' onClick={() => onSearchChange('algoritmo')}>
        Buscar nota
      </button>
      <button type='button' onClick={() => onSelectNote(notes[0])}>
        Selecionar primeira nota
      </button>
      <button type='button' onClick={onCreateNewClick}>
        Nova nota via dialogo
      </button>
      <button type='button' onClick={onPreviousPageClick}>
        Pagina anterior
      </button>
      <button type='button' onClick={onNextPageClick}>
        Proxima pagina
      </button>
      <button type='button' onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  ),
}))

import { NotesDrawerView } from '../NotesDrawerView'

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

describe('NotesDrawerView', () => {
  type Props = ComponentProps<typeof NotesDrawerView>

  const View = (props?: Partial<Props>) => {
    render(
      <NotesDrawerView
        isDrawerOpen={true}
        isDialogOpen={false}
        isLoadingNotes={false}
        isSaving={false}
        isDeleting={false}
        hasActiveNote={false}
        errorMessage={null}
        fieldError={null}
        isEmpty={false}
        title='Titulo atual'
        content='Conteudo atual'
        page={1}
        totalPagesCount={2}
        notes={[makeNote('1'), makeNote('2')]}
        onDrawerOpenChange={jest.fn()}
        onManualDrawerClose={jest.fn()}
        onDialogOpenChange={jest.fn()}
        onOpenNotesDialog={jest.fn()}
        onTitleChange={jest.fn()}
        onContentChange={jest.fn()}
        onSearchChange={jest.fn()}
        onSelectNote={jest.fn()}
        onPreviousPageClick={jest.fn()}
        onNextPageClick={jest.fn()}
        onSaveClick={jest.fn()}
        onDeleteClick={jest.fn()}
        onCreateNewClick={jest.fn()}
        onRetryList={jest.fn()}
        {...props}
      >
        <span data-testid='drawer-trigger'>Abrir drawer</span>
      </NotesDrawerView>,
    )
  }

  it('should render the main trigger and default form content', () => {
    View()

    expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument()
    expect(screen.getByText('Nova nota')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Titulo atual')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Conteudo atual')).toBeInTheDocument()
    expect(screen.getByTestId('notes-list-dialog')).toHaveAttribute('data-open', 'false')
  })

  it('should hide the new-note heading and show field error for an active note', () => {
    View({ hasActiveNote: true, fieldError: 'Titulo obrigatorio' })

    expect(screen.queryByText('Nova nota')).not.toBeInTheDocument()
    expect(screen.getByText('Titulo obrigatorio')).toBeInTheDocument()
  })

  it('should call the main drawer actions and form handlers', async () => {
    const user = userEvent.setup()
    const onDrawerOpenChange = jest.fn()
    const onManualDrawerClose = jest.fn()
    const onOpenNotesDialog = jest.fn()
    const onTitleChange = jest.fn()
    const onContentChange = jest.fn()
    const onCreateNewClick = jest.fn()
    const onSaveClick = jest.fn()
    const onDeleteClick = jest.fn()

    View({
      onDrawerOpenChange,
      onManualDrawerClose,
      onOpenNotesDialog,
      onTitleChange,
      onContentChange,
      onCreateNewClick,
      onSaveClick,
      onDeleteClick,
      hasActiveNote: true,
    })

    await user.click(screen.getByRole('button', { name: 'Abrir anotacoes' }))
    await user.click(screen.getByRole('button', { name: 'Ver notas existentes' }))
    await user.type(screen.getByLabelText('Editor de anotacao'), ' atualizado')
    await user.clear(screen.getByLabelText('Título'))
    await user.type(screen.getByLabelText('Título'), 'Titulo novo')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    await user.click(screen.getByRole('button', { name: 'Salvar anotação' }))
    await user.click(screen.getByRole('button', { name: 'Excluir anotação' }))
    await user.click(screen.getByRole('button', { name: 'Fechar anotações' }))

    expect(onOpenNotesDialog).toHaveBeenCalledTimes(1)
    expect(onTitleChange).toHaveBeenCalled()
    expect(onContentChange).toHaveBeenCalled()
    expect(onCreateNewClick).toHaveBeenCalledTimes(1)
    expect(onSaveClick).toHaveBeenCalledTimes(1)
    expect(onDeleteClick).toHaveBeenCalledTimes(1)
    expect(onDrawerOpenChange).not.toHaveBeenCalled()
    expect(onManualDrawerClose).toHaveBeenCalledTimes(1)
  })

  it('should pass list state and dialog actions through NotesListDialog', async () => {
    const user = userEvent.setup()
    const notes = [makeNote('10'), makeNote('11')]
    const onDialogOpenChange = jest.fn()
    const onSearchChange = jest.fn()
    const onSelectNote = jest.fn()
    const onCreateNewClick = jest.fn()
    const onPreviousPageClick = jest.fn()
    const onNextPageClick = jest.fn()
    const onRetryList = jest.fn()

    View({
      isDialogOpen: true,
      isLoadingNotes: true,
      errorMessage: 'Falha ao carregar',
      isEmpty: false,
      page: 2,
      totalPagesCount: 4,
      notes,
      onDialogOpenChange,
      onSearchChange,
      onSelectNote,
      onCreateNewClick,
      onPreviousPageClick,
      onNextPageClick,
      onRetryList,
    })

    expect(screen.getByTestId('dialog-loading')).toHaveTextContent('true')
    expect(screen.getByTestId('dialog-error')).toHaveTextContent('Falha ao carregar')
    expect(screen.getByTestId('dialog-page')).toHaveTextContent('2')
    expect(screen.getByTestId('dialog-total-pages')).toHaveTextContent('4')
    expect(screen.getByTestId('dialog-notes')).toHaveTextContent('Nota 10,Nota 11')

    await user.click(screen.getByRole('button', { name: 'Fechar lista' }))
    await user.click(screen.getByRole('button', { name: 'Buscar nota' }))
    await user.click(screen.getByRole('button', { name: 'Selecionar primeira nota' }))
    await user.click(screen.getByRole('button', { name: 'Nova nota via dialogo' }))
    await user.click(screen.getByRole('button', { name: 'Pagina anterior' }))
    await user.click(screen.getByRole('button', { name: 'Proxima pagina' }))
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onDialogOpenChange).toHaveBeenCalledWith(false)
    expect(onSearchChange).toHaveBeenCalledWith('algoritmo')
    expect(onSelectNote).toHaveBeenCalledWith(notes[0])
    expect(onCreateNewClick).toHaveBeenCalledTimes(1)
    expect(onPreviousPageClick).toHaveBeenCalledTimes(1)
    expect(onNextPageClick).toHaveBeenCalledTimes(1)
    expect(onRetryList).toHaveBeenCalledTimes(1)
  })
})
