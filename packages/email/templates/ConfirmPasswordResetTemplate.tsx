import { Body } from '../partials/Body'
import { Box } from '../partials/Box'
import { Header } from '../partials/Header'
import { Link } from '../partials/Link'
import { Paragraph } from '../partials/Paragraph'
import { render } from '@react-email/render'
import * as React from 'react'

export const ConfirmPasswordResetTemplateView = () => {
  return (
    <Body>
      <Header>Pedido de redefinição de senha.</Header>

      <Box>
        <Paragraph>
          Foi feita uma solicitação de recuperação de senha para a sua conta (). Se você
          não foi o responsável por essa ação, por favor, ignore este e-mail.
        </Paragraph>

        <Paragraph>
          Para continuar com a recuperação de senha clique no botão abaixo para criar uma
          nova senha. Ah, esse link expira em 48h.
        </Paragraph>

        <Paragraph>- Equipe StarDust! 🚀</Paragraph>

        <Link href='{{ .RedirectTo }}/confirm-password-reset?token={{ .TokenHash }}'>
          Redefinir senha
        </Link>
      </Box>
    </Body>
  )
}

export const ConfirmPasswordResetTemplateRender = () => ({
  generateHtml() {
    return render(React.createElement(ConfirmPasswordResetTemplateView))
  },
})

export default ConfirmPasswordResetTemplateView
