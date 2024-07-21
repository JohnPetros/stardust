import { ROUTES } from '@/modules/global/constants'
import { Body } from './shared/Body'
import { Box } from './shared/Box'
import { Header } from './shared/Header'
import { Link } from './shared/Link'
import { Paragraph } from './shared/Paragraph'

export function ConfirmSignUpTemplate() {
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

        <Link
          href={`{{ .SiteURL }}${ROUTES.server.auth.confirmEmail}?token={{ .TokenHash }}&action=signup-confirmation`}
        >
          Confirmar cadastro
        </Link>
      </Box>
    </Body>
  )
}
