import type { ReactNode } from 'react'

import { HomeLayout } from '@/ui/space/widgets/layouts/Home'
import { SidebarProvider } from '@/ui/space/contexts/SidebarContext'

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
