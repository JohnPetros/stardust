import { NameFieldView, type NameFieldViewProps } from './NameFieldView'

const NAME_ALREADY_USED_MESSAGE = 'Nome já utilizado por outro usuário'

type Props = Omit<NameFieldViewProps, 'errorMessage'> & {
  errorMessage?: string
}

export const NameField = ({ errorMessage, ...props }: Props) => {
  return (
    <NameFieldView
      {...props}
      errorMessage={errorMessage === NAME_ALREADY_USED_MESSAGE ? errorMessage : ''}
    />
  )
}
