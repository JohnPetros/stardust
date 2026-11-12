import { Body } from '../partials/Body'
import { Box } from '../partials/Box'
import { Footer } from '../partials/Footer'
import { Header } from '../partials/Header'
import { Link } from '../partials/Link'
import { Paragraph } from '../partials/Paragraph'
import { Link as Anchor, Text } from '@react-email/components'
import { render } from '@react-email/render'
import * as React from 'react'

const RESET_URL =
  '{{ .RedirectTo }}/api/auth/confirm-password-reset?token={{ .TokenHash }}'

export const ConfirmPasswordResetTemplateView = () => {
  return (
    <Body preview='Use o link para criar uma nova senha na StarDust.'>
      <Header>Redefinição de senha</Header>

      <Box>
        <Paragraph>
          Recebemos uma solicitação para redefinir a senha da sua conta na StarDust.
        </Paragraph>

        <Paragraph>
          Clique no botão abaixo para criar uma nova senha. O link expira em 48 horas.
        </Paragraph>

        <Link href={RESET_URL}>Redefinir senha</Link>

        <Text className='mx-0 mb-5 mt-0 text-sm leading-6 text-gray-400'>
          Se o botão não funcionar, copie e cole este link no navegador:{' '}
          <Anchor href={RESET_URL} className='break-all text-green-400'>
            {RESET_URL}
          </Anchor>
        </Text>

        <Paragraph>— Equipe StarDust 🚀</Paragraph>
      </Box>

      <Footer>
        Se você não pediu para redefinir a senha, ignore este e-mail. Sua senha atual
        continua a mesma.
      </Footer>
    </Body>
  )
}

export const ConfirmPasswordResetTemplateRender = () => ({
  generateHtml() {
    return render(React.createElement(ConfirmPasswordResetTemplateView))
  },
})

export default ConfirmPasswordResetTemplateView
