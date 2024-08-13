import { Info } from './Info'

type ChallengeInfo = {
  isCompleted: boolean
  downvotes: number
  upvotes: number
  totalCompletitions: number
  authorSlug: string
}

export function ChallengeInfo({
  isCompleted,
  totalCompletitions,
  downvotes,
  upvotes,
  authorSlug,
}: ChallengeInfo) {
  const totalVotes = upvotes + downvotes
  const acceptanceRate = totalVotes ? (upvotes / totalVotes) * 100 : 0
  // const userName = deslugify(authorSlug)
  const userName = ''

  return (
    <ul className='flex items-center gap-3'>
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
      <Info
        icon='rate'
        label={`${acceptanceRate}%`}
        tooltipText={`Taxa de aceitação de usuários que que deram upvote para esse desafio de um total de ${totalVotes} votos.`}
      />
      <Info
        icon='target'
        label={totalCompletitions}
        tooltipText={'Número de usuários que concluiram esse desafio.'}
      />
      {/* <Link href={`/profile/${userSlug}`}>
        <Info icon={User} label={userName} tooltipText={'Criador desse desafio.'} />
      </Link> */}
    </ul>
  )
}
