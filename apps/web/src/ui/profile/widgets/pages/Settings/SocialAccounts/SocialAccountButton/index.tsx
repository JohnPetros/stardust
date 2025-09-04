'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useSocialAccountButton } from './useSocialAccountButton'
import { SocialAccountButtonView } from './SocialAccountButtonView'

type Props = {
  name: string
  logoUrl: string
  isConnected: boolean
  provider: 'google' | 'github'
}

export const SocialAccountButton = ({ name, logoUrl, isConnected, provider }: Props) => {
  const { authService } = useRest()
  const { handleSocialAccountConnect, handleSocialAccountDisconnect } =
    useSocialAccountButton({ authService, socialAccountProvider: provider })

  return (
    <SocialAccountButtonView
      name={name}
      logoUrl={logoUrl}
      isConnected={isConnected}
      onDisconnect={handleSocialAccountDisconnect}
      onConnect={handleSocialAccountConnect}
    />
  )
}
