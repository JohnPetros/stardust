import type { TextBlockEditorItem } from '../../../types'

import { BlockTypeBadgeView } from './BlockTypeBadgeView'

type Props = {
  type: TextBlockEditorItem['type']
}

export const BlockTypeBadge = ({ type }: Props) => {
  return <BlockTypeBadgeView type={type} />
}
