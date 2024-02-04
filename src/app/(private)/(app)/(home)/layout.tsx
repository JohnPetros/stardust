import { ReactNode } from 'react'

import { HomeLayout } from './components/HomeLayout'

import { SidebarProvider } from '@/contexts/SidebarContext'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <HomeLayout>{children}</HomeLayout>
    </SidebarProvider>
  )
}
