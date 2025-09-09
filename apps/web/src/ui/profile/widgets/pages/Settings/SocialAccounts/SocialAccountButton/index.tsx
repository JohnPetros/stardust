'use client'

import { useSocialAccountButton } from './useSocialAccountButton'
import { SocialAccountButtonView } from './SocialAccountButtonView'
import { useSocialAccountActions } from './useSocialAccountActions'

type Props = {
  name: string
  logoUrl: string
  isConnected: boolean
  provider: 'google' | 'github'
}

export const SocialAccountButton = ({ name, logoUrl, isConnected, provider }: Props) => {
  const { connectSocialAccount, disconnectSocialAccount } =
    useSocialAccountActions(provider)
  const { handleSocialAccountConnect, handleSocialAccountDisconnect } =
    useSocialAccountButton({
      onConnectSocialAccount: connectSocialAccount,
      onDisconnectSocialAccount: disconnectSocialAccount,
    })

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
