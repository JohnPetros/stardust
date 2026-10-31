import { BlockActionsView } from './BlockActionsView'

type Props = {
  isExpanded: boolean
  hasPicture: boolean
  onExpand: () => void
  onRemove: () => void
}

export const BlockActions = (props: Props) => {
  return <BlockActionsView {...props} />
}
