import type { CodeSelection, TextSelection } from '@stardust/core/global/structures'

export type AssistantSelections = {
  textSelection: TextSelection | null
  codeSelection: CodeSelection | null
}
