import type { RefObject } from 'react'

import type { Achievement } from '@/@core/domain/entities'

import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types'
import { AlertDialog } from '@/modules/global/components/shared/AlertDialog'
import { Animation } from '@/modules/global/components/shared/Animation'
import { Button } from '@/modules/global/components/shared/Button'
import { AchievementCard } from '@/modules/app/components/shared/AchievementCard'

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
        type={'earning'}
        title={'Uau! Parece que você ganhou recompensa(s)'}
        body={
          <div className='max-h-64 overflow-auto px-6'>
            {achievements.map((achievement) => (
              <div key={achievement.id} className='relative'>
                <span className='absolute block' style={{ top: -18, left: -31.5 }}>
                  <Animation name='shinning' size={110} />
                </span>

                <AchievementCard
                  id={achievement.id}
                  icon={achievement.icon.value}
                  description={achievement.description}
                  name={achievement.name.value}
                  requiredCount={achievement.requiredCount.value}
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
