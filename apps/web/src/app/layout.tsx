import '../ui/global/styles/global.css'

import type { Metadata } from 'next'

import { RootLayout } from '@/ui/global/widgets/layouts/Root'

export const metadata: Metadata = {
  title: 'StarDust',
  description: 'Aprenda lógica de programação explorando o espaço.',
  icons: {
    icon: 'https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/marketing/favicon.png',
  },
}

type RootProps = {
  children: React.ReactNode
}

const Root = async ({ children }: RootProps) => {
  return <RootLayout>{children}</RootLayout>
}

export default Root
