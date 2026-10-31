import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const CodeLineView = ({ children }: Props) => {
  return (
    <span className='inline-block mx-1 rounded-md bg-gray-400 px-[10px] font-code text-gray-900'>
      {children}
    </span>
  )
}
