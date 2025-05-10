import { Body } from '../components/Body'
import { Box } from '../components/Box'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Paragraph } from '../components/Paragraph'

type RequestPasswordResetTemplateProps = {
  baseUrl: string
}

export const RequestPasswordResetTemplate = ({
  baseUrl,
}: RequestPasswordResetTemplateProps) => {
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

        <Link
          href={`{{ .SiteURL }}${baseUrl}?token={{ .TokenHash }}&action=password_reset`}
        >
          Redefinir senha
        </Link>
      </Box>
    </Body>
  )
}

export default RequestPasswordResetTemplate

/**
 * <h2>Redefinição de senha - <span style="color: #00FF88">Star</span><span style="color: #027558">Dust</span></h2>

<p>Clique no link abaixo para mudar sua senha:</p>
<p><a href="{{ .SiteURL }}/server/auth/confirm?token={{ .TokenHash }}&action=password_reset">Redefinir Senha</a></p>
 */

