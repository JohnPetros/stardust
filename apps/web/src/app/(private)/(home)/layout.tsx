import type { ReactNode } from 'react'

import { HomeLayout } from '@/ui/profile/widgets/layouts/Home'
import { SidebarProvider } from '@/ui/profile/contexts/SidebarContext'

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
