import { Body } from '../components/Body'
import { Box } from '../components/Box'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Paragraph } from '../components/Paragraph'

const ConfirmSignUpTemplate = () => {
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

export default ConfirmSignUpTemplate
