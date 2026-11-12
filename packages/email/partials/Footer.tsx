import { Container, Text } from '@react-email/components'
import * as React from 'react'

void React

type FooterProps = {
  children: string
}

export const Footer = ({ children }: FooterProps) => {
  return (
    <Container>
      <Text className='mt-6 text-center text-xs leading-5 text-gray-500'>{children}</Text>
    </Container>
  )
}
