import { Text } from '@react-email/components'
import * as React from 'react'

void React

type ParagraphProps = {
  children: string | string[]
  className?: string
}

export const Paragraph = ({ children, className }: ParagraphProps) => {
  return (
    <Text className={`font-medium tracking-wider text-gray-100 ${className}`}>
      {children}
    </Text>
  )
}
