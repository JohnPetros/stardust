import { Body } from './components/Body'
import { Box } from './components/Box'
import { Header } from './components/Header'
import { Link } from './components/Link'
import { Paragraph } from './components/Paragraph'

import { ROUTES } from '@/utils/constants'
import { getAppBaseUrl } from '@/utils/helpers'

type RequestPasswordResetEmailProps = {
  passwordToken: string
  userEmail: string
}

export function RequestPasswordResetTemplate({
  passwordToken,
  userEmail,
}: RequestPasswordResetEmailProps) {
  return (
    <Body>
      <Header>Pedido de redefinição de senha.</Header>

      <Box>
        <Paragraph>
          Foi feita uma solicitação de recuperação de senha para a sua conta (
          {userEmail}). Se você não foi o responsável por essa ação, por favor,
          ignore este e-mail.
        </Paragraph>

        <Paragraph>
          Para continuar com a recuperação de senha clique no botão abaixo para
          criar uma nova senha. Ah, esse link expira em 48h.
        </Paragraph>

        <Paragraph>- Equipe StarDust! 🚀</Paragraph>

        <Link
          href={`${getAppBaseUrl()}/${
            ROUTES.server.auth.confirm
          }?password_token=${passwordToken}`}
        >
          Redefinir senha
        </Link>
      </Box>
    </Body>
  )
}
