import { CLIENT_ENV } from './client-env'

const STARDUST_ICON =
  'https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/marketing/favicon.png'

export const STARDUST_METADATA = {
  title: 'Stardust',
  description: 'Aprenda lógica de programação explorando o espaço.',
  keywords: [
    'Educação',
    'Programação',
    'Jogos',
    'Lógica de programação',
    'Desafios de código',
  ],
  icons: {
    icon: STARDUST_ICON,
  },
  openGraph: {
    title: 'Stardust',
    description: 'Aprenda lógica de programação explorando o espaço.',
    url: CLIENT_ENV.stardustWebUrl,
    siteName: 'Stardust.com',
    images: [
      {
        url: STARDUST_ICON,
        width: 1200,
        height: 630,
        alt: 'Imagem de um foguete esverdeado em um fundo verde escuro.',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
}
