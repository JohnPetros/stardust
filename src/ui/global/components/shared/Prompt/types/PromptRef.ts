export type PromptRef = {
  open: () => void
  close: () => void
  setTitle: (title: string) => void
  setValue: (value: string) => void
  value: string
}
