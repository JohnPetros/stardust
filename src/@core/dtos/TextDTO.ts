export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

export type TextDTO = {
  type: TextType
  content: string
  title?: string
  picture?: string
  hasAnimation?: boolean
  isRunnable?: boolean
}
