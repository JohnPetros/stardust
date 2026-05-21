import type { ComponentProps } from 'react'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { TextBlocksView } from './TextBlocksView'
import { useTextBlocks } from './useTextBlocks'

type Props = Omit<
  ComponentProps<typeof TextBlocksView>,
  | 'search'
  | 'isSearchVisible'
  | 'filteredSortableItems'
  | 'hasAudioGenerationInProgress'
  | 'hasStoredAudioFile'
  | 'onSearchChange'
  | 'onSearchToggle'
>

export const TextBlocks = (props: Props) => {
  const { storageService } = useRestContext()
  const textBlocks = useTextBlocks({
    textBlocks: props.textBlocks,
    sortableItems: props.sortableItems,
    isGeneratingAudiosInBatch: props.isGeneratingAudiosInBatch,
    isGeneratingAudioByBlockId: props.isGeneratingAudioByBlockId,
    storageService,
  })

  return (
    <TextBlocksView
      {...props}
      {...textBlocks}
      onSearchChange={textBlocks.setSearch}
      onSearchToggle={textBlocks.handleSearchToggle}
    />
  )
}
