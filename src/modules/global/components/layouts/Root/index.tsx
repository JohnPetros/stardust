// import 'swiper/css'
// import 'swiper/css/navigation'
import '@/modules/global/styles/global.css'

import { poppins, roboto_mono } from '@/modules/global/styles/fonts'
import { Providers } from './providers'

export async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='pt-BR'>
      <body
        className={`${roboto_mono.variable} ${poppins.variable} relative h-screen w-screen bg-gray-900 font-normal`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
