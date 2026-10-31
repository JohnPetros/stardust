import type { PropsWithChildren } from 'react'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const AppLayoutView = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex h-screen w-screen flex-col bg-zinc-950'>
      <Header />
      <div className='flex flex-1 min-h-0'>
        <Sidebar />
        <main className='flex-1 rounded-tl-2xl min-h-0 overflow-auto pr-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
