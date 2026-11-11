import Link from 'next/link'
import Image from 'next/image'
import { CLIENT_ENV, ROUTES } from '@/constants'

const returnUrl = `${CLIENT_ENV.stardustWebUrl}${ROUTES.auth.socialAccountConfirmation}`

const SOCIAL_LINK_CLASS_NAME =
  'flex h-theme-control items-center justify-center rounded-theme border-theme-control border-theme-border bg-theme-surface px-3 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action'

export const SocialLinksView = () => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Link
        href={`${ROUTES.server.auth.signInWithGoogle}?returnUrl=${returnUrl}`}
        className={SOCIAL_LINK_CLASS_NAME}
        aria-label='Entrar com Google'
      >
        <Image src='/images/google-logo.svg' alt='' width={28} height={28} />
      </Link>
      <Link
        href={`${ROUTES.server.auth.signInWithGithub}?returnUrl=${returnUrl}`}
        className={SOCIAL_LINK_CLASS_NAME}
        aria-label='Entrar com GitHub'
      >
        <Image src='/images/github-logo.svg' alt='' width={28} height={28} />
      </Link>
    </div>
  )
}
