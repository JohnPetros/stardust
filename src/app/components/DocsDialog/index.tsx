'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Lock } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'
import { Loading } from '../Loading'
import { Mdx } from '../Mdx'

import { useDocsDialog } from './useDocsDialog'

type DocsDialogProps = {
  children: ReactNode
}

const mdx = `
## Princípios e Comandos Básicos

### Variáveis

<Text>
  Variáveis são as primeiras estruturas de dados que todo programador aprende. São caracterizadas por ter um nome e armazenar um valor em memória.
</Text>

As variáveis são declaradas escrevendo a palavra-chave **var**.

<code>
  // Aqui estou declarando uma variável chamada "valor", que armazena o valor "1"
  var valor = "1"
</code>

Além disso, variáveis podem ter seus valores alterados a qualquer momento do código.

<Code>
  var a = "1"
  a = "2"
  escreva(a) // escreve 2 como resultado.
</Code>

### Entrada e saída

Existem duas funções nativas para entrada e saída de dados:

<Quote>
  **escreva()**: usado para escrever uma variável ou literal na saída-padrão.
</Quote>

<Quote>
  **leia()**: usado para escrever uma variável ou literal na saída-padrão.
</Quote>

### escreva()

<Text>
  A função *escreva()* pode aceitar N valores.
</Text>

<Code>
  escreva(1) // Escreverá 1
  var a = 'Texto'
  escreva(a) // Escreverá 'Texto'
  escreva(a, 1, 2, 3) // Escreverá 'Texto' 1 2 3
</Code>
`

export function DocsDialog({ children }: DocsDialogProps) {
  const {
    isLoading,
    content,
    docs,
    handleDialogOpen,
    handleDocButton,
    handleBackButton,
  } = useDocsDialog()

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
                <Mdx>{mdx}</Mdx>
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
            </>
          )}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
