import { Body } from '../partials/Body'
import { Box } from '../partials/Box'
import { Footer } from '../partials/Footer'
import { Header } from '../partials/Header'
import { Link } from '../partials/Link'
import { Paragraph } from '../partials/Paragraph'
import { Link as Anchor, Text } from '@react-email/components'
import { render } from '@react-email/render'
import * as React from 'react'

const CONFIRMATION_URL = '{{ .RedirectTo }}/api/auth/confirm-email?token={{ .TokenHash }}'

export const ConfirmSignUpTemplateView = () => {
  return (
    <Body preview='Confirme seu cadastro para começar sua jornada na StarDust.'>
      <Header>Confirme o seu cadastro</Header>

      <Box>
        <Paragraph>
          Seja bem-vindo(a) ao nosso incrível universo de aprendizado! Estamos muito
          felizes por você ter se juntado a nós.
        </Paragraph>

        <Paragraph>
          Falta só um passo: confirme o seu e-mail para desbravar os desafios que
          preparamos para você. O link expira em 1 hora, então não deixe para depois.
        </Paragraph>

        <Link href={CONFIRMATION_URL}>Confirmar cadastro</Link>

        <Text className='mx-0 mb-5 mt-0 text-sm leading-6 text-gray-400'>
          Se o botão não funcionar, copie e cole este link no navegador:{' '}
          <Anchor href={CONFIRMATION_URL} className='break-all text-green-400'>
            {CONFIRMATION_URL}
          </Anchor>
        </Text>

        <Paragraph>— Equipe StarDust 🚀</Paragraph>
      </Box>

      <Footer>
        Você recebeu este e-mail porque alguém criou uma conta na StarDust com este
        endereço. Se não foi você, é só ignorar esta mensagem.
      </Footer>
    </Body>
  )
}

export const ConfirmSignUpTemplateRender = () => ({
  generateHtml() {
    return render(React.createElement(ConfirmSignUpTemplateView))
  },
})

export default ConfirmSignUpTemplateView
