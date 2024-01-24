import { ReactNode } from 'react'
import { Lock } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'

import { useDictionaryDialog } from './useDictionaryDialog'

type DictionaryDialogProps = {
  children: ReactNode
}

export function DictionaryDialog({ children }: DictionaryDialogProps) {
  const { isLoading, topics } = useDictionaryDialog()

  return (
    <Dialog>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Dicionário</DialogHeader>
        <div className="mt-6 grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              className="w-full max-w-[12rem] cursor-not-allowed"
            >
              <Button
                className={twMerge(
                  'text-sm text-gray-100',
                  topic.isUnlocked
                    ? 'bg-gray-600'
                    : 'pointer-events-none bg-gray-600 text-gray-400 opacity-70 focus:opacity-[1]'
                )}
              >
                <div className="flex w-full items-center px-4">
                  {!topic.isUnlocked && (
                    <Lock className="text-lg text-gray-400" />
                  )}
                  <p className="flex-1">{topic.title}</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
