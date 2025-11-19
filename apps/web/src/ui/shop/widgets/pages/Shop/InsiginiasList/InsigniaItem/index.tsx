import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { InsigniaItemView } from './InsigniaItemView'
import { useInsigniaItem } from './useInsigniaItem'
import { useImage } from '@/ui/global/hooks/useImage'
import { Integer } from '@stardust/core/global/structures'
import { useRest } from '@/ui/global/hooks/useRest'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { Insignia } from '@stardust/core/shop/entities'

type Props = {
  insignia: Insignia
}

export const InsigniaItem = ({ insignia }: Props) => {
  const { user, updateUserCache } = useAuthContext()
  const { profileService } = useRest()
  const toastProvider = useToastContext()
  const audioProvider = useAudioContext()
  const { handleAvatarAcquire } = useInsigniaItem({
    service: profileService,
    toastProvider,
    audioProvider,
    insigniaRole: insignia.role,
    insigniaPrice: insignia.price,
    acquiredInsigniaRoleCount: user?.insigniaRolesCount,
    onAcquireInsignia: updateUserCache,
  })
  const insigniaImage = useImage('insignias', insignia.image.value)

  if (user)
    return (
      <InsigniaItemView
        image={insigniaImage}
        name={insignia.name.value}
        description='Permite que você escreva e publique desafios de código para outros usuários'
        price={insignia.price.value}
        isAcquired={user.hasInsignia(insignia.role).isTrue}
        isBuyable={user.canAcquire(Integer.create(insignia.price.value)).isTrue}
        onAcquire={handleAvatarAcquire}
      />
    )
}
