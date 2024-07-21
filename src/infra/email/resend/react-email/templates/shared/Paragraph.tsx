import { Text } from '@react-email/components'

type ParagraphProps = {
  children: string | string[]
  className?: string
}

export function Paragraph({ children, className }: ParagraphProps) {
  return (
    <Text className={`font-medium tracking-wider text-gray-100 ${className}`}>
      {children}
    </Text>
  )
}
