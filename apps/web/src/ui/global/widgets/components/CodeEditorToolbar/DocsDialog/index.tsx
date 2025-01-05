'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Lock } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../../Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../Dialog'
import { Loading } from '../../Loading'
import { Mdx } from '../../Mdx'
import { useDocsDialog } from './useDocsDialog'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'


type DocsDialogProps = {
  children: ReactNode
}

export function DocsDialog({ children }: DocsDialogProps) {
  const {
    isLoading,
    content,
    docs,
    handleDialogOpen,
    handleDocButton,
    handleBackButton,
  } = useDocsDialog()
  const {user} = useAuthContext()

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Documentação</DialogHeader>
        <div className="mt-6 max-h-[32rem] overflow-auto">
          {content ? (
            <div>
              <button
                className="flex items-center gap-2 p-2 text-gray-100"
                onClick={handleBackButton}
              >
                <ArrowLeft
                  className="-translate-x-2 text-xl text-gray-100"
                  weight="bold"
                />
                Voltar
              </button>
              <div className="-mt-6 space-y-24">
                <Mdx>{content}</Mdx>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid h-full w-full place-content-center">
                  <Loading />
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3">
                  {docs?.map((doc) => {
                    if (doc)
                    return (
                      <div
                        key={doc.id}
                        className="w-full max-w-[12rem] cursor-not-allowed"
                      >
                        <Button
                          onClick={() => handleDocButton(doc.id)}
                          className={twMerge(
                            'text-sm text-gray-100',
                            user?.hasUnlockedDoc(doc.id).isTrue
                              ? 'bg-gray-600'
                              : 'pointer-events-none bg-gray-600 text-gray-400 opacity-70 focus:opacity-[1]'
                          )}
                        >
                          <div className="flex w-full items-center px-4">
                            { user?.hasUnlockedDoc(doc.id).isFalse && (
                              <Lock className="text-lg text-gray-400" />
                            )}
                            <p className="flex-1">{doc.title.value}</p>
                          </div>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
