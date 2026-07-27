import type { CodePlaybackPanelDto } from '@stardust/core/global/structures/dtos'

import { CodePlaybackPanelView } from './CodePlaybackPanelView'

export type Props = {
  panel: CodePlaybackPanelDto
}

export function CodePlaybackPanel({ panel }: Props) {
  return <CodePlaybackPanelView panel={panel} />
}
