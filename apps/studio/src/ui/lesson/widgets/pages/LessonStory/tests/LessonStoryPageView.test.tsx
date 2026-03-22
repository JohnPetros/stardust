import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, type ComponentProps } from 'react'

import { TextBlocksFaker } from '@stardust/core/lesson/entities/fakers'

import { LessonStoryPageView } from '../LessonStoryPageView'

const mockTextBlocks = jest.fn((_props: unknown) => <div data-testid='text-blocks' />)

jest.mock('../Header', () => ({
  Header: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='header'>{children}</div>
  ),
}))

jest.mock('../TextBlocks', () => ({
  TextBlocks: (props: unknown) => mockTextBlocks(props),
}))

jest.mock('@/ui/global/widgets/components/ActionButton', () => ({
  ActionButton: ({
    onExecute,
    isDisabled,
  }: {
    onExecute: () => void
    isDisabled: boolean
  }) => (
    <button type='button' onClick={onExecute} disabled={isDisabled}>
      Salvar
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/Loading', () => ({
  Loading: () => <div data-testid='loading' />,
}))

jest.mock('@/ui/global/widgets/components/Mdx', () => ({
  Mdx: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='mdx'>{children}</div>
  ),
}))

describe('LessonStoryPageView', () => {
  type Props = ComponentProps<typeof LessonStoryPageView>

  const textBlocks = TextBlocksFaker.fakeManyDto(2, { type: 'default' }).map(
    (textBlock, index) => ({
      ...textBlock,
      id: `block-${index + 1}`,
      type: 'default' as const,
    }),
  )

  const sortableItems = textBlocks.map((textBlock) => ({
    id: textBlock.id,
    data: textBlock,
  }))

  const defaultProps: Props = {
    textBlocks,
    textBlocksScrollRef: createRef<HTMLDivElement>(),
    previewScrollRef: createRef<HTMLDivElement>(),
    expandedBlockId: null,
    sortableItems,
    previewContent: 'Conteudo preview',
    isLoading: false,
    isBlocked: false,
    blockingReason: '',
    isEmpty: false,
    isSaveDisabled: false,
    errorMessage: '',
    onRetry: jest.fn(),
    onAddBlock: jest.fn(),
    onExpandBlock: jest.fn(),
    onRemoveBlock: jest.fn(),
    onContentChange: jest.fn(),
    onPictureChange: jest.fn(),
    onRunnableChange: jest.fn(),
    onReorder: jest.fn(),
    onSave: jest.fn(),
    onTextBlocksScrollToTop: jest.fn(),
    onTextBlocksScrollToBottom: jest.fn(),
    onPreviewScrollToTop: jest.fn(),
    onPreviewScrollToBottom: jest.fn(),
  }

  const View = (props?: Partial<Props>) =>
    render(<LessonStoryPageView {...defaultProps} {...props} />)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state', () => {
    View({ isLoading: true })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Carregando blocos da história...')).toBeInTheDocument()
  })

  it('should render error state and trigger retry', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    View({ errorMessage: 'Falha ao carregar', onRetry })

    expect(screen.getByText('Não foi possível carregar a aba')).toBeInTheDocument()
    expect(screen.getByText('Falha ao carregar')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalled()
  })

  it('should render blocked state with the blocking reason', () => {
    View({ isBlocked: true, blockingReason: 'Blocos legados encontrados' })

    expect(screen.getByText('Edição bloqueada')).toBeInTheDocument()
    expect(screen.getByText('Blocos legados encontrados')).toBeInTheDocument()
  })

  it('should render editor layout and trigger action handlers', async () => {
    const user = userEvent.setup()
    const onSave = jest.fn()
    const onTextBlocksScrollToTop = jest.fn()
    const onTextBlocksScrollToBottom = jest.fn()
    const onPreviewScrollToTop = jest.fn()
    const onPreviewScrollToBottom = jest.fn()

    View({
      onSave,
      onTextBlocksScrollToTop,
      onTextBlocksScrollToBottom,
      onPreviewScrollToTop,
      onPreviewScrollToBottom,
    })

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('text-blocks')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await user.click(screen.getAllByRole('button', { name: 'Topo' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Fim' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Topo' })[1])
    await user.click(screen.getAllByRole('button', { name: 'Fim' })[1])

    expect(onSave).toHaveBeenCalled()
    expect(onTextBlocksScrollToTop).toHaveBeenCalled()
    expect(onTextBlocksScrollToBottom).toHaveBeenCalled()
    expect(onPreviewScrollToTop).toHaveBeenCalled()
    expect(onPreviewScrollToBottom).toHaveBeenCalled()
    expect(mockTextBlocks).toHaveBeenCalledWith(
      expect.objectContaining({
        textBlocks,
        sortableItems,
      }),
    )
  })

  it('should render empty preview state', () => {
    View({ isEmpty: true, previewContent: '' })

    expect(screen.getByText('Nenhum bloco criado')).toBeInTheDocument()
    expect(
      screen.getByText('Adicione um tipo de bloco para iniciar a narrativa.'),
    ).toBeInTheDocument()
  })

  it('should render mdx preview when preview content exists', () => {
    View({ isEmpty: false, previewContent: '# Preview em MDX' })

    expect(screen.getByTestId('mdx')).toBeInTheDocument()
    expect(screen.getByText('# Preview em MDX')).toBeInTheDocument()
  })
})
