import { Container, Img, Text } from '@react-email/components'
import * as React from 'react'

void React

type HeaderProps = {
  children: string
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <Container>
      <Img
        width={180}
        height={30}
        alt='StarDust'
        src='https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/marketing/logo.png'
      />

      <Text className='mb-6 mt-6 text-2xl font-semibold leading-8 text-green-400'>
        {children}
      </Text>
    </Container>
  )
}
