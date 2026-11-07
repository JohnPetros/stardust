import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { InputView, type InputViewProps } from '../InputView'

jest.mock('../../Icon', () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <svg data-testid={`icon-${name}`} className={className} />
  ),
}))

describe('InputView', () => {
  const View = (props?: Partial<InputViewProps>) => {
    const onEyeClick = jest.fn()

    render(
      <InputView
        id='field'
        type='text'
        innerType='text'
        label='E-mail'
        testId='email-input'
        onEyeClick={onEyeClick}
        {...props}
      />,
    )

    return { onEyeClick }
  }

  it('should render the visible label associated with the field', () => {
    View()

    expect(screen.getByText('E-mail')).toHaveClass('text-theme-text-primary')
    expect(screen.getByLabelText('E-mail')).toBe(screen.getByTestId('email-input'))
  })

  it('should use the field tokens in the default state', () => {
    View()

    const field = screen.getByTestId('email-input').parentElement

    expect(field).toHaveClass(
      'h-theme-control',
      'rounded-theme',
      'border-theme-control',
      'border-theme-border',
      'bg-theme-surface',
      'px-theme-control-x',
      'gap-theme-control-gap',
    )
    expect(screen.getByTestId('email-input')).toHaveClass('text-theme-text-primary')
  })

  it('should show the action border and a 1px ring when the field has focus', () => {
    View()

    expect(screen.getByTestId('email-input').parentElement).toHaveClass(
      'focus-within:border-theme-action',
      'focus-within:ring-1',
      'focus-within:ring-theme-action',
    )
  })

  it('should use the action border when the field is active and focus it', () => {
    View({ isActive: true })

    const input = screen.getByTestId('email-input')

    expect(input.parentElement).toHaveClass('border-theme-action')
    expect(input).toHaveFocus()
  })

  it('should render the icon when provided', () => {
    View({ icon: 'mail' })

    expect(screen.getByTestId('icon-mail')).toBeInTheDocument()
  })

  it('should not render an icon when none is provided', () => {
    View()

    expect(screen.queryByTestId('icon-mail')).not.toBeInTheDocument()
  })

  it('should show the error message, label and border in the danger color', () => {
    View({ icon: 'mail', errorMessage: 'Informe um e-mail válido' })

    expect(screen.getByText('Informe um e-mail válido')).toHaveClass('text-theme-danger')
    expect(screen.getByText('E-mail')).toHaveClass('text-theme-danger')
    expect(screen.getByTestId('email-input').parentElement).toHaveClass(
      'border-theme-danger',
    )
    expect(screen.getByTestId('icon-mail')).toHaveClass('text-theme-danger')
  })

  it('should not render the error message when there is no error', () => {
    View()

    expect(screen.queryByText('Informe um e-mail válido')).not.toBeInTheDocument()
  })

  it('should not render the password toggle for non password fields', () => {
    View()

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render an accessible toggle to show a hidden password', async () => {
    const { onEyeClick } = View({
      type: 'password',
      innerType: 'password',
      label: 'Senha',
      testId: 'password-input',
    })

    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })

    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('icon-eye')).toBeInTheDocument()
    expect(toggle).toHaveClass(
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-theme-action',
    )

    await userEvent.click(toggle)

    expect(onEyeClick).toHaveBeenCalledTimes(1)
  })

  it('should render an accessible toggle to hide a visible password', () => {
    View({
      type: 'password',
      innerType: 'text',
      label: 'Senha',
      testId: 'password-input',
    })

    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'text')
    expect(screen.getByTestId('icon-eye-closed')).toBeInTheDocument()
  })

  it('should forward the ref and the native input attributes', () => {
    const ref = createRef<HTMLInputElement>()

    View({
      ref,
      placeholder: 'voce@exemplo.com',
      disabled: true,
    } as Partial<InputViewProps>)

    const input = screen.getByTestId('email-input')

    expect(ref.current).toBe(input)
    expect(input).toHaveAttribute('placeholder', 'voce@exemplo.com')
    expect(input).toBeDisabled()
  })
})
