'use client'

import { Pencil, ShareNetwork, Terminal, Trash } from '@phosphor-icons/react'
import Link from 'next/link'

import { usePlaygroundCard } from './usePlaygroundCard'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/app/components/Dialog'
import { Input } from '@/app/components/Input'
import { Prompt } from '@/app/components/Prompt'
import { Separator } from '@/app/components/Separator'
import { Toolbar } from '@/app/components/Toolbar'
import { ToolbarButton } from '@/app/components/Toolbar/ToolbarButton'
import { ROUTES } from '@/utils/constants'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'

type PlaygroundCardProps = {
  id: string
  title: string
}

export function PlaygroundCard({
  id,
  title: initialTitle,
}: PlaygroundCardProps) {
  const {
    title,
    playgroundUrl,
    promptRef,
    handleDeletePlayground,
    handleEditPlaygroundTitle,
    handleSharePlayground,
  } = usePlaygroundCard(id, initialTitle)

  return (
    <>
      <div
        className="flex min-w-[16rem] cursor-pointer flex-col gap-3 rounded-md bg-green-900 p-4 shadow-md"
      >
        <Link 
         href={playgroundUrl}
        className="flex items-center gap-2 w-full">
          <Terminal className="text-lg text-green-500" weight="bold" />
          <strong className="flex items-center gap-3 text-gray-100">
            {title}
          </strong>
        </Link>
        <Separator className="bg-green-700" isColumn={false} />
        <Toolbar className="justify-end">
          <Alert
            type="crying"
            title="Você está preste a deletar um filho seu 😢!"
            body={
              <p className="text-center text-gray-100">
                Você tem certeza que deseja deletar esse código da sua coleção?
              </p>
            }
            action={
              <Button onClick={handleDeletePlayground} className="bg-red-700 text-gray-100">
                Sim, eu tenho certeza
              </Button>
            }
            cancel={<Button>Não, eu mudei de ideia</Button>}
            canPlaySong={false}
          >
            <ToolbarButton
              icon={Trash}
            >
              Deletar código
            </ToolbarButton>
          </Alert>
          <Prompt
            ref={promptRef}
            title="Digite o novo título"
            onConfirm={handleEditPlaygroundTitle}
          >
            <ToolbarButton icon={Pencil}>Editar código</ToolbarButton>
          </Prompt>
          <Dialog>
            <DialogContent>
              <Input
                type="text"
                label="Url desse playground"
                icon={ShareNetwork}
                value={playgroundUrl}
                readOnly
              />
              <div className="mt-6 grid grid-cols-2 items-center gap-2">
                <DialogClose asChild>
                  <Button
                    className="text-gray-900"
                    onClick={handleSharePlayground}
                  >
                    Copiar
                  </Button>
                </DialogClose>
                <DialogClose>Cancelar</DialogClose>
              </div>
            </DialogContent>
            <DialogTrigger>
              <ToolbarButton icon={ShareNetwork}>
                Compartilhar código
              </ToolbarButton>
            </DialogTrigger>
          </Dialog>
        </Toolbar>
      </div>
    </>
  )
}
