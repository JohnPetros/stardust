import { render } from '@react-email/components'

import { Container } from './components/Container'
import { Header } from './components/Header'
import { Link } from './components/Link'

import { ROUTES } from '@/utils/constants'
import { getAppBaseUrl } from '@/utils/helpers'

interface RequestPasswordResetEmailProps {
  passwordToken: string
}

export function RequestPasswordReset({
  passwordToken,
}: RequestPasswordResetEmailProps) {
  return (
    <Container>
      <Header>Teste de E-mail</Header>
      <Link
        href={`${getAppBaseUrl()}/${
          ROUTES.server.auth.confirm
        }?password_token=${passwordToken}`}
      >
        Fazer teste
      </Link>
    </Container>
  )
}
