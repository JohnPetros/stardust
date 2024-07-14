import type { ReactNode } from 'react'

import { HomeLayout } from '@/modules/app/components/layouts/Home'
import { SidebarProvider } from '@/modules/app/contexts/SidebarContext'

type HomeProps = {
  children: ReactNode
}

export default function Home({ children }: HomeProps) {
  return (
    <SidebarProvider>
      <HomeLayout>{children}</HomeLayout>
    </SidebarProvider>
  )
}
