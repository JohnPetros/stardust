import type { ReactNode } from 'react'

import { HomeLayout } from '@/ui/app/components/layouts/Home'
import { SidebarProvider } from '@/ui/app/contexts/SidebarContext'

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
