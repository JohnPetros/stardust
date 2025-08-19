import { EmailInputView } from './EmailInputView'

type Props = {
  value: string
}

export const EmailInput = ({ value }: Props) => {
  return <EmailInputView value={value} />
}
