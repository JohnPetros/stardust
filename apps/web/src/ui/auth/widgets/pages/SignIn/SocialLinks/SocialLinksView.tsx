import Link from 'next/link'
import Image from 'next/image'
import { CLIENT_ENV, ROUTES } from '@/constants'

const returnUrl = `${CLIENT_ENV.stardustWebUrl}${ROUTES.auth.socialAccountConfirmation}`

export const SocialLinksView = () => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Link
        href={`${ROUTES.server.auth.signInWithGoogle}?returnUrl=${returnUrl}`}
        className='grid place-content-center rounded-md py-3 bg-white'
        aria-label='Entrar com Google'
      >
        <Image src='/images/google-logo.svg' alt='' width={28} height={28} />
      </Link>
      <Link
        href={`${ROUTES.server.auth.signInWithGithub}?returnUrl=${returnUrl}`}
        className='grid place-content-center rounded-md py-3 bg-black'
        aria-label='Entrar com GitHub'
      >
        <Image src='/images/github-logo.svg' alt='' width={28} height={28} />
      </Link>
    </div>
  )
}
