export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

export type TextDto = {
  id?: string
  type: TextType
  content: string
  title?: string
  picture?: string
  hasAnimation?: boolean
  isRunnable?: boolean
}
