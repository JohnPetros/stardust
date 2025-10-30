import type { PropsWithChildren } from 'react'
import { GoogleAnalytics } from "@next/third-parties/google"

import '@/ui/global/styles/global.css'
import { roboto_mono, poppins } from '@/constants/fonts'
import { ClientProviders } from './ClientProviders'
import { ServerProviders } from './ServerProviders'
import { SERVER_ENV } from '@/constants/server-env'

export const RootLayoutView = ({ children }: PropsWithChildren) => {
  return (
    <html lang='pt-BR' className='scroll-smooth'>
      <body
        className={`${roboto_mono.variable} ${poppins.variable} relative h-screen bg-gray-900 font-normal`}
      >
     {SERVER_ENV.mode === 'production' && <GoogleAnalytics gaId="G-S77CE2QV3E" />}
        <ServerProviders>
          <ClientProviders>{children}</ClientProviders>
        </ServerProviders>
      </body>
    </html>
  )
}
