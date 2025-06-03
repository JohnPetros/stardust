import { Body } from '../components/Body'
import { Box } from '../components/Box'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Paragraph } from '../components/Paragraph'

export default function ConfirmPasswordResetTemplate() {
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
