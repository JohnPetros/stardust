import '../styles/global.css'
import 'swiper/css'
import 'swiper/css/navigation'

import type { Metadata } from 'next'
import { Poppins, Roboto_Mono } from 'next/font/google'

import { Providers } from '@/providers'

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const roboto_mono = Roboto_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

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
        className={`${roboto_mono.className} ${poppins.className} h-screen w-screen bg-gray-900 font-normal`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
