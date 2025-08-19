import { EmailImputView } from './EmailImputView'

type Props = {
  value: string
}

export const EmailImput = ({ value }: Props) => {
  return <EmailImputView value={value} />
}
