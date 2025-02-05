import type { RefObject } from 'react'

import type { Achievement } from '@stardust/core/profile/entities'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Button } from '@/ui/global/widgets/components/Button'
import { AchievementCard } from '@/ui/profile/widgets/components/AchievementCard'

type NewUnlockedAchievementsAlertDialogProps = {
  alertDialogRef: RefObject<AlertDialogRef>
  achievements: Achievement[]
  onClose: VoidFunction
}

export function NewUnlockedAchievementsAlertDialog({
  alertDialogRef,
  achievements,
  onClose,
}: NewUnlockedAchievementsAlertDialogProps) {
  return (
    <div className='absolute'>
      <AlertDialog
        ref={alertDialogRef}
        type='earning'
        title='Uau! Parece que você ganhou recompensa(s)'
        shouldPlayAudio
        body={
          <div className='max-h-80 overflow-auto px-6'>
            {achievements.map((achievement) => (
              <div key={achievement.id} className='relative'>
                <span className='absolute block' style={{ top: -18, left: -15.5 }}>
                  <Animation name='shinning' size={110} />
                </span>

                <AchievementCard
                  id={achievement.id}
                  icon={achievement.icon.value}
                  description={achievement.description}
                  name={achievement.name.value}
                  reward={achievement.reward.value}
                  isUnlocked={true}
                  isRescuable={false}
                />
              </div>
            ))}
          </div>
        }
        action={
          <div className='mt-8 w-full'>
            <Button onClick={onClose}>Entendido</Button>
          </div>
        }
      />
    </div>
  )
}
