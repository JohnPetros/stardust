export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

export type Text = {
  type: TextType
  title?: string
  content: string | string[]
  picture?: string
  isUser?: boolean
  hasAnimation?: boolean
  isRunnable?: boolean
}