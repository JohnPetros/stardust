import '../styles/global.css'
import 'swiper/css'
import 'swiper/css/navigation'

import type { Metadata } from 'next'

import { Providers } from '@/providers/components'
import { poppins, roboto_mono } from '@/styles/fonts'

export const metadata: Metadata = {
  title: 'StarDust',
  description: 'Aprenda lógica de programação explorando o espaço.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto_mono.variable} ${poppins.variable} relative h-screen w-screen bg-gray-900 font-normal`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
