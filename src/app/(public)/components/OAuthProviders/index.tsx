'use client'

import Image from 'next/image'

import { useOAuthProviders } from './useOAuthProviders'

export function OAuthProviders() {
  const { handleOAuthProvider } = useOAuthProviders()

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label="Faça login com sua conta do Github"
        className="grid place-content-center rounded-md"
        onClick={() => handleOAuthProvider('github')}
      >
        <Image
          src="/images/github.png"
          className="rounded-full"
          width={64}
          height={64}
          alt="Github"
        />
      </button>
    </div>
  )
}
