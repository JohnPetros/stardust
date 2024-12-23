import '../ui/global/styles/global.css'

import type { Metadata } from 'next'

import { RootLayout } from '@/ui/global/widgets/layouts/Root'

export const metadata: Metadata = {
  title: 'StarDust',
  description: 'Aprenda lógica de programação explorando o espaço.',
}

export default async function Root({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayout>OII</RootLayout>
}
