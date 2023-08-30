import { ReactNode } from 'react'

interface TitleProps {
  children: ReactNode
}

export function Title({ children }: TitleProps) {
  return <h3 className="text-gray-100 font-semibold text-lg">{children}</h3>
}
