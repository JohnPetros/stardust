import '../styles/global.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { Providers } from '@/providers'

const poppins = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StarDust',
  description: 'Aprenda lógica de programação de maneira gamificada',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-gray-900 h-screen w-screen font-normal`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
