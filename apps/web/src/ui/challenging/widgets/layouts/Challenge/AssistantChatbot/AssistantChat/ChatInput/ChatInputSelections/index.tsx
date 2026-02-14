'use client'

import { ChatInputSelectionsView } from './ChatInputSelectionsView'
import {
  useChatInputSelections,
  type ChatInputSelectionsParams,
} from './useChatInputSelections'

export const ChatInputSelections = (params: ChatInputSelectionsParams) => {
  const { selectionItems } = useChatInputSelections(params)

  return <ChatInputSelectionsView selectionItems={selectionItems} />
}
