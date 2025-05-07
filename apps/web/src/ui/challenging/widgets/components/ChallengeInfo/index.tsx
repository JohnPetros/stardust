import Link from 'next/link'

import { Percentage } from '@stardust/core/global/structures'

import { Info } from '@/ui/global/widgets/components/Info'

type ChallengeInfo = {
  isCompleted: boolean
  downvotes: number
  upvotes: number
  completionsCount: number
  authorName: string
  authorSlug: string
}

export function ChallengeInfo({
  isCompleted,
  completionsCount,
  authorName,
  downvotes,
  upvotes,
  authorSlug,
}: ChallengeInfo) {
  const totalVotes = upvotes + downvotes
  const acceptanceRate = Percentage.create(upvotes, totalVotes)

  return (
    <ul className='flex items-center gap-3'>
      <li>
        <Info
          icon={isCompleted ? 'checked' : 'unchecked'}
          iconStyle={isCompleted ? 'text-green-500' : 'text-red-700'}
          label={isCompleted ? 'Resolvido' : 'Não resolvido'}
          tooltipText={
            isCompleted
              ? 'O que você está esperando? resolva esse desafio.'
              : 'Você ainda pode resolver esse desafio quantas vezes quiser.'
          }
        />
      </li>
      <li>
        <Info
          icon='rate'
          label={`${acceptanceRate.value}%`}
          tooltipText={`Taxa de aceitação de usuários que que deram upvote para esse desafio de um total de ${totalVotes} votos.`}
        />
      </li>
      <li>
        <Info
          icon='target'
          label={completionsCount}
          tooltipText={'Número de usuários que concluiram esse desafio.'}
        />
      </li>
      <li>
        <Link href={`/profile/${authorSlug}`}>
          <Info icon='person' label={authorName} tooltipText={'Criador desse desafio.'} />
        </Link>
      </li>
    </ul>
  )
}
