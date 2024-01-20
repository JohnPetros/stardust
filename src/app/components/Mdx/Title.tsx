import { ReactNode } from 'react'

type TitleProps = {
  children: ReactNode
}

export function Title({ children }: TitleProps) {
  return <h3 className="text-lg font-semibold text-gray-100">{children}</h3>
}
