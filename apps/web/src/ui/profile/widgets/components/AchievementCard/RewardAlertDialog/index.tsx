import type { ReactNode } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import Image from 'next/image'
import { Button } from '@/ui/global/widgets/components/Button'

type RewardAlertDialogProps = {
  children: ReactNode
  achivementReward: number
  achivementName: string
  achivementImage: string
  onClose: VoidFunction
}

export function RewardAlertDialog({
  children,
  achivementReward,
  achivementImage,
  achivementName,
  onClose,
}: RewardAlertDialogProps) {
  return (
    <AlertDialog
      type='earning'
      title='Recompensa resgatada!'
      body={
        <div className='flex flex-col items-center'>
          <p className='text-center font-medium text-gray-100'>
            Parabéns! Você acabou de ganhar{' '}
            <span className='text-lg font-semibold text-yellow-400'>
              {achivementReward}
            </span>{' '}
            de poeira estela pela conquista:
          </p>
          <div className='mt-6 flex flex-col items-center justify-center'>
            <Image src={achivementImage} width={72} height={72} alt='' />
            <p className='mt-2 text-center font-semibold text-green-500'>
              {achivementName}
            </p>
          </div>
        </div>
      }
      action={
        <Button className='mt-6' onClick={onClose}>
          Entendido
        </Button>
      }
    >
      {children}
    </AlertDialog>
  )
}
