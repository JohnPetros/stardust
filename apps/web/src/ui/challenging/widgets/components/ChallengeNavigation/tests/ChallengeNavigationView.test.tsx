import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/Tooltip', () => ({
  Tooltip: ({ children, content, direction }: any) => (
    <div data-testid='tooltip' data-content={content} data-direction={direction}>
      {children}
    </div>
  ),
}))

import { ChallengeNavigationView } from '../ChallengeNavigationView'

describe('ChallengeNavigationView', () => {
  type Props = ComponentProps<typeof ChallengeNavigationView>

  const View = (props?: Partial<Props>) => {
    render(
      <ChallengeNavigationView
        canNavigateToPrevious={true}
        canNavigateToNext={true}
        onPreviousChallengeClick={jest.fn()}
        onNextChallengeClick={jest.fn()}
        onOpenSidebar={jest.fn()}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the navigation header and sequential navigation tooltips', () => {
    View()

    expect(screen.getByText('Desafios')).toBeInTheDocument()
    expect(screen.getByTestId('icon-menu')).toBeInTheDocument()
    expect(screen.getByTestId('icon-simple-arrow-left')).toBeInTheDocument()
    expect(screen.getByTestId('icon-simple-arrow-right')).toBeInTheDocument()

    const tooltips = screen.getAllByTestId('tooltip')

    expect(tooltips).toHaveLength(2)
    tooltips.forEach((tooltip) => {
      expect(tooltip).toHaveAttribute('data-direction', 'bottom')
      expect(tooltip).toHaveAttribute(
        'data-content',
        'Navegacao sequencial pela ordem global de criacao dos desafios (ignora filtros).',
      )
    })
  })

  it('should call onOpenSidebar from the accessible Desafios trigger', async () => {
    const user = userEvent.setup()
    const onOpenSidebar = jest.fn()

    View({ onOpenSidebar })

    await user.click(
      screen.getByRole('button', { name: 'Abrir barra lateral de desafios' }),
    )

    expect(onOpenSidebar).toHaveBeenCalledTimes(1)
  })

  it('should disable navigation buttons when previous and next challenges are unavailable', () => {
    View({
      canNavigateToPrevious: false,
      canNavigateToNext: false,
    })

    expect(
      screen.getByRole('button', { name: 'Ir para desafio anterior' }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Ir para proximo desafio' })).toBeDisabled()
  })

  it('should call the navigation handlers when the buttons are clicked', async () => {
    const user = userEvent.setup()
    const onPreviousChallengeClick = jest.fn()
    const onNextChallengeClick = jest.fn()

    View({ onPreviousChallengeClick, onNextChallengeClick })

    await user.click(screen.getByRole('button', { name: 'Ir para desafio anterior' }))
    await user.click(screen.getByRole('button', { name: 'Ir para proximo desafio' }))

    expect(onPreviousChallengeClick).toHaveBeenCalledTimes(1)
    expect(onNextChallengeClick).toHaveBeenCalledTimes(1)
  })
})
