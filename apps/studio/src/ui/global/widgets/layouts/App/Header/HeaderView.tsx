import type { ReactNode } from 'react'

type Props = {
  left?: ReactNode
  right?: ReactNode
  className?: string
}

export const HeaderView = ({ left, right, className = '' }: Props) => {
  return (
    <header
      className={`flex items-center h-12 px-4 bg-zinc-900 border-b border-zinc-800 justify-between ${className}`}
    >
      <div className='flex items-center gap-4'>
        {left ?? (
          <>
            <img src='/images/rocket.svg' alt='' className='w-8 h-8' />
            <span className='block bg-slate-500 w-0.5 h-6 rotate-[30deg] rounded-full' />
            <img src='/images/logo.svg' alt='StarDust' className='w-24 h-24' />
          </>
        )}
      </div>
      <div className='flex items-center'>
        {right ?? (
          <div className='w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center'>
            <span className='text-zinc-400 text-xl'>👤</span>
          </div>
        )}
      </div>
    </header>
  )
}
