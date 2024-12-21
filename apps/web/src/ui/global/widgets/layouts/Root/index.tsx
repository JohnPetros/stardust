// import 'swiper/css'
// import 'swiper/css/navigation'
import '@/ui/global/styles/global.css'

import { Providers } from './providers'
import { roboto_mono, poppins } from '@/constants/fonts'

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
