import type { ReactNode } from 'react'
import { Body as Container, Tailwind } from '@react-email/components'
import { Html } from '@react-email/html'

type BodyProps = {
  children: ReactNode
}

export function Body({ children }: BodyProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              default: 'var(--font-poppins)',
              code: 'var(--font-roboto-mono)',
            },

            colors: {
              green: {
                900: '#07303B',
                800: '#027558',
                700: '#20925D',
                600: '#38C76D',
                500: '#0FE983',
                400: '#00FF88',
                300: '#4affab',
                200: '#adffd9',
                100: '#dafff0',
              },
              yellow: {
                900: '#1c1400',
                700: '#674F00',
                500: '#B08C18',
                400: '#FFCE31',
              },
              gray: {
                950: '#0b0e0f',
                900: '#141A1B',
                800: '#1E2626',
                700: '#303030',
                600: '#595959',
                500: '#868686',
                400: '#AFB6C2',
                300: '#d3d7e1',
                200: '#EBEBEB',
                100: '#f2f2f2',
              },
              blue: {
                700: '#022F43',
                300: '#00D1FF',
              },
              red: {
                700: '#FF3737',
                300: '#FF8484',
              },
              purple: {
                700: '#514869',
              },
            },
            screens: {
              xs: '440px',
              sm: '640px',
              md: '768px',
              lg: '1024px',
              xl: '1280px',
            },
          },
        },
      }}
    >
      <Html lang='pt-br'>
        <Container className='font-sans rounded-md bg-black/90 p-8'>{children}</Container>
      </Html>
    </Tailwind>
  )
}
