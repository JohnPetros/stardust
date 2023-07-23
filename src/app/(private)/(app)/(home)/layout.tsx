import { ReactNode } from 'react'
import { Header } from './components/Header'
import { TabBar } from './components/TabBar'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <TabBar />
    </>
  )
}
