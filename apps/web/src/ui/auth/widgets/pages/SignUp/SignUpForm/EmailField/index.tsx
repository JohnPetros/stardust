import { EmailFieldView, type EmailFieldViewProps } from './EmailFieldView'

const EMAIL_ALREADY_USED_MESSAGE = 'E-mail já utilizado por outro usuário'

type Props = Omit<EmailFieldViewProps, 'errorMessage'> & {
  errorMessage?: string
}

export const EmailField = ({ errorMessage, ...props }: Props) => {
  return (
    <EmailFieldView
      {...props}
      errorMessage={errorMessage === EMAIL_ALREADY_USED_MESSAGE ? errorMessage : ''}
    />
  )
}
