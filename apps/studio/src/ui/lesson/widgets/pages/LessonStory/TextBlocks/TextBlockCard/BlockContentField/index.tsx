import { BlockContentFieldView } from './BlockContentFieldView'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
}

export const BlockContentField = (props: Props) => {
  return <BlockContentFieldView {...props} />
}
