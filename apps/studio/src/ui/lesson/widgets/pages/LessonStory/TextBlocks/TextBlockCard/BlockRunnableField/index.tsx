import { BlockRunnableFieldView } from './BlockRunnableFieldView'

type Props = {
  isRunnable: boolean
  onChange: (isRunnable: boolean) => void
}

export const BlockRunnableField = (props: Props) => {
  return <BlockRunnableFieldView {...props} />
}
