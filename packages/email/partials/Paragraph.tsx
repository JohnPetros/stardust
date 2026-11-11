import { Text } from '@react-email/components'
import * as React from 'react'

void React

type ParagraphProps = {
  children: string | string[]
  className?: string
}

export const Paragraph = ({ children, className = '' }: ParagraphProps) => {
  return (
    <Text
      className={`mx-0 mb-5 mt-0 text-base font-normal leading-7 text-gray-300 ${className}`}
    >
      {children}
    </Text>
  )
}
