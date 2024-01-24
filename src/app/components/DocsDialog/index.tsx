'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Lock } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'
import { Mdx } from '../Mdx'

import { useDocsDialog } from './useDocsDialog'

type DocsDialogProps = {
  children: ReactNode
}

const mdx = `
# Princípios e Comandos Básicos

## Variáveis

As variáveis são declaradas com **var**.



`

export function DocsDialog({ children }: DocsDialogProps) {
  const { isLoading, content, docs, handleDocButton, handleBackButton } =
    useDocsDialog()

  return (
    <Dialog>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Documentação</DialogHeader>
        <div className="mt-6">
          {content ? (
            <div>
              <button onClick={handleBackButton}>
                <ArrowLeft className="text-lg text-gray-100" />
              </button>
              <Mdx>{mdx}</Mdx>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3">
              {docs?.map((doc) => (
                <div
                  key={doc.id}
                  className="w-full max-w-[12rem] cursor-not-allowed"
                >
                  <Button
                    onClick={() => handleDocButton(doc.id)}
                    className={twMerge(
                      'text-sm text-gray-100',
                      doc.isUnlocked
                        ? 'bg-gray-600'
                        : 'pointer-events-none bg-gray-600 text-gray-400 opacity-70 focus:opacity-[1]'
                    )}
                  >
                    <div className="flex w-full items-center px-4">
                      {!doc.isUnlocked && (
                        <Lock className="text-lg text-gray-400" />
                      )}
                      <p className="flex-1">{doc.title}</p>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
