import {
  ChartLine,
  CheckCircle,
  Circle,
  Target,
  User,
} from '@phosphor-icons/react'
import Link from 'next/link'

import { Info } from './Info'

import { Vote } from '@/@types/vote'
import { deslugify } from '@/utils/helpers'

type ChallengeInfo = {
  isCompleted: boolean
  downvotes: number
  upvotes: number
  totalCompletitions: number
  userSlug: string
  userVote?: Vote
}

export function ChallengeInfo({
  isCompleted,
  totalCompletitions,
  downvotes,
  upvotes,
  userSlug,
  userVote,
}: ChallengeInfo) {
  const totalVotes = upvotes + downvotes
  const acceptanceRate = totalVotes ? (upvotes / totalVotes) * 100 : 0
  const userName = deslugify(userSlug)

  return (
    <ul className="flex items-center gap-3">
      <Info
        icon={isCompleted ? CheckCircle : Circle}
        iconStyle={isCompleted ? 'text-green-500' : 'text-red-700'}
        label={isCompleted ? 'Resolvido' : 'Não resolvido'}
        tooltipText={
          isCompleted
            ? 'O que você está esperando? resolva esse desafio.'
            : 'Você ainda pode resolver esse desafio quantas vezes quiser.'
        }
      />
      <Info
        icon={ChartLine}
        label={acceptanceRate + '%'}
        tooltipText={`Taxa de aceitação de usuários que que deram upvote para esse desafio de um total de ${totalVotes} votos. Desafios deve ser concluídos primeiro antes de serem votados.`}
      />
      <Info
        icon={Target}
        label={totalCompletitions}
        tooltipText={'Número de vezes que esse desafio foi concluído.'}
      />
      <Link href={`/profile/${userSlug}`}>
        <Info
          icon={User}
          label={userName}
          tooltipText={'Criador desse desafio.'}
        />
      </Link>
    </ul>
  )
}
