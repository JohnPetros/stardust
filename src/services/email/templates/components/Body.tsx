import { ReactNode } from 'react'
import { Body as Container, Tailwind } from '@react-email/components'
import { Html } from '@react-email/html'

import { poppins } from '@/styles/fonts'

type ContainerProps = {
  children: ReactNode
}

export function Body({ children }: ContainerProps) {
  return (
    <Tailwind>
      <Html lang="pt-br">
        <Container
          className={`rounded-md bg-black/90 p-8 ${poppins.className}`}
        >
          {children}
        </Container>
      </Html>
    </Tailwind>
  )
}
