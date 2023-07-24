import { ReactNode } from 'react'
import { Header } from './components/Header'
import { TabBar } from './components/TabBar'
import { Sidebar } from './components/Sidebar'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Sidebar />
      {children}
      <TabBar />
    </>
  )
}
