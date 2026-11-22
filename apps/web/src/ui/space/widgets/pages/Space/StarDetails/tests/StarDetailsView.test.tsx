import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { type Props, StarDetailsView } from '../StarDetailsView'
import type { StarDetails } from '../useStarDetails'

describe('StarDetailsView', () => {
  const details: StarDetails = {
    caption: 'Estrela 2 · Aurora',
    name: 'Variáveis',
    description: 'Estrela de história sobre variáveis.',
    typeLabel: 'História',
    isChallenge: false,
    isCompleted: false,
    stateLabel: 'Disponível',
    actionLabel: 'Começar história',
  }

  const View = (props?: Partial<Props>) => {
    render(
      <StarDetailsView
        details={details}
        isPending={false}
        onAction={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the star information and the action', () => {
    View()

    expect(screen.getByText('Estrela 2 · Aurora')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Variáveis' })).toBeInTheDocument()
    expect(screen.getByText('História')).toBeInTheDocument()
    expect(screen.getByText('Disponível')).toBeInTheDocument()
    expect(screen.getByText('Estrela de história sobre variáveis.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar história' })).toBeInTheDocument()
  })

  it('should omit the description when it is null and never show rewards', () => {
    View({ details: { ...details, description: null } })

    expect(
      screen.queryByText('Estrela de história sobre variáveis.'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/recompensas/i)).not.toBeInTheDocument()
  })

  it('should render the completed review variant of a challenge', () => {
    View({
      details: {
        ...details,
        isChallenge: true,
        isCompleted: true,
        typeLabel: 'Desafio de código',
        stateLabel: 'Concluída',
        actionLabel: 'Revisar desafio',
      },
    })

    expect(screen.getByText('Desafio de código')).toBeInTheDocument()
    expect(screen.getByText('Concluída')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revisar desafio' })).toBeInTheDocument()
  })

  it('should call onAction when the action is clicked', async () => {
    const user = userEvent.setup()
    const onAction = jest.fn()
    View({ onAction })

    await user.click(screen.getByRole('button', { name: 'Começar história' }))

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('should render nothing without details', () => {
    const { container } = render(
      <StarDetailsView details={null} isPending={false} onAction={jest.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should keep the sentence case eyebrow and a decorative icon inside the action', () => {
    View()

    expect(screen.getByText('Estrela 2 · Aurora')).not.toHaveClass('uppercase')
    expect(
      screen
        .getByRole('button', { name: 'Começar história' })
        .querySelector('[aria-hidden="true"]'),
    ).not.toBeNull()
  })

  it('should render the flat variant without a nested card surface', () => {
    View({ variant: 'flat' })

    expect(screen.getByRole('region', { name: 'Detalhes da estrela' })).not.toHaveClass(
      'border',
      'bg-theme-surface',
    )
  })
})
