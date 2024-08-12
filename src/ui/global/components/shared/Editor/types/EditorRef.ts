export type EditorRef = {
  getValue: () => string
  setValue: (value: string) => void
  reloadValue: () => void
}
