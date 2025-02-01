import type { ReactNode } from 'react'
import { Body as Container, Tailwind } from '@react-email/components'
import { Html } from '@react-email/html'

type BodyProps = {
  children: ReactNode
}

export function Body({ children }: BodyProps) {
  return (
    <Tailwind>
      <Html lang='pt-br'>
        <Container className='rounded-md bg-black/90 p-8'>{children}</Container>
      </Html>
    </Tailwind>
  )
}
