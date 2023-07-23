import { ReactNode } from 'react'
import { Header } from './components/Header'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
