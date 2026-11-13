import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  UnconfirmedEmailNoticeView,
  type UnconfirmedEmailNoticeViewProps,
} from '../UnconfirmedEmailNoticeView'

describe('UnconfirmedEmailNoticeView', () => {
  const email = 'apollo@gmail.com'

  const View = (props?: Partial<UnconfirmedEmailNoticeViewProps>) => {
    render(
      <UnconfirmedEmailNoticeView
        email={email}
        isResending={false}
        onResend={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the title, the submitted email and the expiration time', () => {
    View()

    expect(screen.getByText('Confirme seu e-mail para entrar')).toBeVisible()
    expect(
      screen.getByText(
        `Enviamos um link de confirmação para ${email}. Ele expira em 1 hora.`,
      ),
    ).toBeVisible()
  })

  it('should announce the notice politely to assistive technologies', () => {
    View()

    const notice = screen.getByTestId('unconfirmed-email-notice')

    expect(notice).toHaveAttribute('role', 'status')
    expect(notice).toHaveAttribute('aria-live', 'polite')
  })

  it('should use the reward surface token for the fill and the reward token for the border', () => {
    View()

    expect(screen.getByTestId('unconfirmed-email-notice')).toHaveClass(
      'bg-theme-reward-surface',
      'border-theme-reward',
    )
  })

  it('should call onResend when the resend button is clicked', async () => {
    const onResend = jest.fn()
    View({ onResend })

    await userEvent.click(
      screen.getByRole('button', { name: 'Reenviar e-mail de confirmação' }),
    )

    expect(onResend).toHaveBeenCalledTimes(1)
  })

  it('should render the resend button as a non submitting button', () => {
    View()

    expect(screen.getByTestId('resend-confirmation-email-button')).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('should disable the resend button and hide its label while resending', () => {
    View({ isResending: true })

    const button = screen.getByTestId('resend-confirmation-email-button')

    expect(button).toBeDisabled()
    expect(screen.queryByText('Reenviar e-mail de confirmação')).toBeNull()
  })
})
