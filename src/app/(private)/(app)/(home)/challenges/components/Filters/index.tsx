'use client'
import { useState } from 'react'
import { useChallengesList } from '@/hooks/useChallengesList'
import { CheckCircle, Circle, Minus } from '@phosphor-icons/react'
import { Select } from '../Select'
import type { Difficulty, Status } from '@/contexts/ChallengesListContext'

export function Filters() {
  const { state, dispatch } = useChallengesList()

  function handleStatusChange(newStatus: Status) {
    dispatch({ type: 'setStatus', payload: newStatus })
  }

  function handleDifficultyChange(newDifficulty: Difficulty) {
    dispatch({ type: 'setDifficulty', payload: newDifficulty })
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        <Select.Container
          onValueChange={(newStatus: string) =>
            handleStatusChange(newStatus as Status)
          }
        >
          <Select.Trigger value="Status" />
          <Select.Content>
            <Select.Item
              value="all"
              icon={<Minus className="text-gray-500 text-lg" weight="bold" />}
              text="Todos"
            />
            <Select.Separator />
            <Select.Item
              value="completed"
              icon={
                <CheckCircle className="text-green-500 text-lg" weight="bold" />
              }
              text="Resolvido"
            />
            <Select.Separator />
            <Select.Item
              value="not-completed"
              icon={<Circle className="text-red-700 text-lg" weight="bold" />}
              text="Não Resolvido"
            />
          </Select.Content>
        </Select.Container>

        <Select.Container
          onValueChange={(newDifficulty: string) =>
            handleDifficultyChange(newDifficulty as Difficulty)
          }
        >
          <Select.Trigger value="Dificuldade" />
          <Select.Content>
            <Select.Item value="easy" text="Fácil" textStye="text-green-500" />
            <Select.Separator />
            <Select.Item
              value="medium"
              text="Médio"
              textStye="text-yellow-400"
            />
            <Select.Separator />
            <Select.Item value="hard" text="Difícil" textStye="text-red-700" />
          </Select.Content>
        </Select.Container>
      </div>

      
    </div>
  )
}
