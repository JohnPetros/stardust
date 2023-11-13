import { ReactNode } from 'react'

interface TitleProps {
  children: ReactNode
}

export function Title({ children }: TitleProps) {
  return <h3 className="text-lg font-semibold text-gray-100">{children}</h3>
}
