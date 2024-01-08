import { Poppins, Roboto_Mono } from 'next/font/google'

export const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const roboto_mono = Roboto_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})
