import type { ReactNode } from 'react'

type CodeLineProps = {
  children: ReactNode
}

export const CodeLineView = ({ children }: CodeLineProps) => {
  return (
    <span className='inline-block mx-1 rounded-md bg-gray-400 px-[8px] font-code text-sm text-gray-900'>
      {children}
    </span>
  )
}
