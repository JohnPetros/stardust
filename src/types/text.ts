export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code'

export type Text = {
  type: TextType
  title?: string
  content: string | string[]
  picture?: string
  isUser?: boolean
}
