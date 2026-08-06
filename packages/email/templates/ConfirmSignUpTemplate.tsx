import { Body } from '../partials/Body'
import { Box } from '../partials/Box'
import { Header } from '../partials/Header'
import { Link } from '../partials/Link'
import { Paragraph } from '../partials/Paragraph'
import { render } from '@react-email/render'
import * as React from 'react'

export const ConfirmSignUpTemplateView = () => {
  return (
    <Body>
      <Header>Confirmação de cadastro.</Header>

      <Box>
        <Paragraph>
          Seja bem-vindo(a) ao nosso incrível universo de aprendizado! Estamos muito
          felizes por você ter se juntado a nós.
        </Paragraph>

        <Paragraph>
          Estamos ansiosos para ver você alcançar novos patamares e desbravar os desafios
          que preparamos para você. Lembre-se de manter o foco e a dedicação!
        </Paragraph>

        <Paragraph>
          Clique no botão abaixo para confirmar o seu cadastro. Ah, é melhor você clicar o
          quanto antes porque esse link expira em 1 hora.
        </Paragraph>

        <Paragraph>- Equipe StarDust! 🚀</Paragraph>

        <Link href='{{ .RedirectTo }}/confirm-email?token={{ .TokenHash }}'>
          Confirmar cadastro
        </Link>
      </Box>
    </Body>
  )
}

export const ConfirmSignUpTemplateRender = () => ({
  generateHtml() {
    return render(React.createElement(ConfirmSignUpTemplateView))
  },
})

export default ConfirmSignUpTemplateView
