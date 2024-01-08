import { ReactNode } from 'react'
import { Body, Tailwind } from '@react-email/components'
import { Html } from '@react-email/html'

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <Tailwind>
      <Html lang="pt-br">
        <Body className="rounded-md bg-black/90 p-8 font-sans">{children}</Body>
      </Html>
    </Tailwind>
  )
}
