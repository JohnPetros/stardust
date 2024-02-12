import { SelectItemText } from '@radix-ui/react-select'

type TextProps = {
  children: string
}

export function Text({ children }: TextProps) {
  return <SelectItemText>{children}</SelectItemText>
}
