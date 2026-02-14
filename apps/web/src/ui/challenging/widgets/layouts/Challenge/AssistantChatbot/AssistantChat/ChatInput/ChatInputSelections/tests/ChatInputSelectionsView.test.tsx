import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInputSelectionsView } from '../ChatInputSelectionsView'
import type { ChatInputSelectionItem } from '../useChatInputSelections'
import type { ReactNode } from 'react'

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/Tooltip', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => (
    <div data-testid='tooltip'>{children}</div>
  ),
}))

describe('ChatInputSelectionsView', () => {
  const View = (selectionItems?: ChatInputSelectionItem[]) =>
    render(
      <ChatInputSelectionsView
        selectionItems={
          selectionItems ?? [
            {
              id: 'text',
              iconName: 'description',
              tooltipContent: 'texto completo',
              label: 'texto curto',
              badgeClassName: 'badge-text',
              labelClassName: 'label-text',
              removeButtonClassName: 'remove-text',
              removeAriaLabel: 'Remover seleção de texto',
              onRemove: jest.fn(),
            },
            {
              id: 'code',
              iconName: 'code',
              tooltipContent: 'codigo completo',
              label: 'Linha - 1-2',
              badgeClassName: 'badge-code',
              labelClassName: 'label-code',
              removeButtonClassName: 'remove-code',
              removeAriaLabel: 'Remover seleção de código',
              onRemove: jest.fn(),
            },
          ]
        }
      />,
    )

  it('should render selection labels', () => {
    View()

    expect(screen.getByText('texto curto')).toBeInTheDocument()
    expect(screen.getByText('Linha - 1-2')).toBeInTheDocument()
  })

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemoveText = jest.fn()
    const onRemoveCode = jest.fn()

    View([
      {
        id: 'text',
        iconName: 'description',
        tooltipContent: 'texto completo',
        label: 'texto curto',
        badgeClassName: 'badge-text',
        labelClassName: 'label-text',
        removeButtonClassName: 'remove-text',
        removeAriaLabel: 'Remover seleção de texto',
        onRemove: onRemoveText,
      },
      {
        id: 'code',
        iconName: 'code',
        tooltipContent: 'codigo completo',
        label: 'Linha - 3-4',
        badgeClassName: 'badge-code',
        labelClassName: 'label-code',
        removeButtonClassName: 'remove-code',
        removeAriaLabel: 'Remover seleção de código',
        onRemove: onRemoveCode,
      },
    ])

    await user.click(screen.getByLabelText('Remover seleção de texto'))
    await user.click(screen.getByLabelText('Remover seleção de código'))

    expect(onRemoveText).toHaveBeenCalled()
    expect(onRemoveCode).toHaveBeenCalled()
  })
})
