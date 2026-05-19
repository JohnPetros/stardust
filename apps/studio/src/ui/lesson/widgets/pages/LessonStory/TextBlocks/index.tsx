import type { ComponentProps } from 'react'

import { TextBlocksView } from './TextBlocksView'

type Props = ComponentProps<typeof TextBlocksView>

export const TextBlocks = (props: Props) => {
  return <TextBlocksView {...props} />
}
