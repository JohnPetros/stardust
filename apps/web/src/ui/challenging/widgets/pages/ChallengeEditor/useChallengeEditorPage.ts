'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { contentSchema, nameSchema } from '@stardust/validation/schemas'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'

const challengeSchema = z.object({
  title: nameSchema,
  function: z.object({
    name: nameSchema,
    params: z
      .array(
        z.object({
          name: nameSchema,
          value: z.unknown(),
        }),
      )
      .min(1),
  }),
  description: contentSchema,
  testCases: z.array(z.unknown()).min(1),
})

export type ChallengeEditorFields = z.infer<typeof challengeSchema>

export function useChallengeEditorPage(savedChallengeDto?: ChallengeDto) {
  const form = useForm<ChallengeEditorFields>({
    resolver: zodResolver(challengeSchema),
  })

  return {
    form,
  }
}
