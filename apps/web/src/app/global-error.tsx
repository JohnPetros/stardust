'use client'

import '../ui/global/styles/global.css'
import { ErrorPage } from '@/ui/global/widgets/pages/Error'
import { roboto_mono, poppins } from '@/constants/fonts'

type Props = {
  error: Error & { digest?: string }
}

export const GlobalError = (props: Props) => {
  return (
    <html lang='pt-BR'>
      <body
        className={`${roboto_mono.variable} ${poppins.variable} relative h-screen bg-gray-900 font-normal`}
      >
        <ErrorPage error={props.error} />
      </body>
    </html>
  )
}

export default GlobalError
