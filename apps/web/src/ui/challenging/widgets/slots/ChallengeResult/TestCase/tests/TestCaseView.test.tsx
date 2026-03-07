import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { TestCaseView } from '../TestCaseView'

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/AnimatedArrow', () => ({
  AnimatedArrow: ({ isUp }: { isUp: boolean }) => (
    <div data-testid='animated-arrow' data-up={String(isUp)} />
  ),
}))

jest.mock('../AnimatedFieldsContainer', () => ({
  AnimatedFieldsContainer: ({ children, isOpen }: any) => (
    <div data-testid='animated-fields' data-open={String(isOpen)}>
      {children}
    </div>
  ),
}))

jest.mock('../Field', () => ({
  Field: ({ label, value, isFromUser }: any) => (
    <div
      data-testid={`field-${label}`}
      data-value={String(value)}
      data-from-user={String(Boolean(isFromUser))}
    />
  ),
}))

describe('TestCaseView', () => {
  type Props = ComponentProps<typeof TestCaseView>

  const handleButtonClick = jest.fn()

  const View = (props?: Partial<Props>) => {
    render(
      <TestCaseView
        position={3}
        isLocked={false}
        isCorrect={true}
        isOpen={true}
        translatedInputs='a b'
        translatedExpectedOutput='42'
        userOutput='21'
        handleButtonClick={handleButtonClick}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the success state and mapped field values', () => {
    View()

    expect(screen.getByText('Teste de caso #3')).toBeInTheDocument()
    expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    expect(screen.getByTestId('animated-arrow')).toHaveAttribute('data-up', 'true')
    expect(screen.getByTestId('animated-fields')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('field-Entrada')).toHaveAttribute('data-value', 'a b')
    expect(screen.getByTestId('field-Seu resultado')).toHaveAttribute('data-value', '21')
    expect(screen.getByTestId('field-Seu resultado')).toHaveAttribute(
      'data-from-user',
      'true',
    )
    expect(screen.getByTestId('field-Resultado esperado')).toHaveAttribute(
      'data-value',
      '42',
    )
  })

  it('should render the locked state with fallback user output', () => {
    View({ isLocked: true, isCorrect: false, isOpen: false, userOutput: null })

    expect(screen.getByTestId('icon-close')).toBeInTheDocument()
    expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    expect(screen.queryByTestId('animated-arrow')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('field-Seu resultado')).toHaveAttribute(
      'data-value',
      'sem resultado',
    )
  })

  it('should call handleButtonClick when the toggle button is clicked', async () => {
    const user = userEvent.setup()

    View({ isLocked: false })

    await user.click(screen.getByRole('button'))

    expect(handleButtonClick).toHaveBeenCalledTimes(1)
  })
})
