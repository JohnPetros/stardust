import type { RefObject } from 'react'

import type { TextEditorWidget } from './TextEditorWidget'
import type { TextEditorRef } from './TextEditorRef'

export type TextEditorContextValue = {
  textEditorRef: RefObject<TextEditorRef | null>
  insertWidget(widget: TextEditorWidget, props?: string[][]): void
}
