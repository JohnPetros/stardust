import { ReactNode } from 'react'
import { Header } from './components/Header'
import { TabBar } from './components/TabBar'
import { Sidebar } from './components/Sidebar'
import { Sidenav } from './components/Sidenav'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Sidenav />
      <Sidebar />
      {children}
      <TabBar />
    </>
  )
}
