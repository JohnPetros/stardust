import type { PropsWithChildren } from 'react'
import Script from 'next/script'

import '@/ui/global/styles/global.css'
import { roboto_mono, poppins } from '@/constants/fonts'
import { ServerProviders } from './ServerProviders'
import { SERVER_ENV } from '@/constants/server-env'

export const RootLayoutView = ({ children }: PropsWithChildren) => {
  return (
    <html lang='pt-BR' className='scroll-smooth'>
      <body
        className={`${roboto_mono.variable} ${poppins.variable} relative h-screen bg-gray-900 font-normal`}
      >
        {SERVER_ENV.mode === 'production' && (
          <>
            <Script
              src='https://www.googletagmanager.com/gtag/js?id=G-S77CE2QV3E'
              strategy='afterInteractive'
            />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-S77CE2QV3E');
              `}
            </Script>
          </>
        )}
        <ServerProviders>{children}</ServerProviders>
      </body>
    </html>
  )
}
