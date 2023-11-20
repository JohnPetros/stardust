export type TextType =
  | 'default'
  | 'quote'
  | 'alert'
  | 'list'
  | 'image'
  | 'code'
  | 'user'

export type Text = {
  type: TextType
  content: string
  title?: string
  items?: string[]
  picture?: string
  hasAnimation?: boolean
  isRunnable?: boolean
}
