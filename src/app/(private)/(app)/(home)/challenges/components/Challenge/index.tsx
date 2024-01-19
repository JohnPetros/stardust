'use client'

import {
  ChartLine,
  CheckCircle,
  Circle,
  Target,
  User,
} from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

import { Category } from './Category'
import { Info } from './Info'

import type { Challenge } from '@/@types/challenge'
import { DifficultyBadge } from '@/app/components/DifficultyBadge'

const challengeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

interface ChallengeProps {
  data: Challenge
}

export function Challenge({
  data: {
    id,
    title,
    difficulty,
    upvotes,
    downvotes,
    total_completitions,
    categories,
    created_by,
    user_id,
    isCompleted,
  },
}: ChallengeProps) {
  const totalVotes = upvotes + downvotes
  const acceptanceRate = totalVotes ? upvotes / totalVotes : 0

  return (
    <motion.div
      variants={challengeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5 rounded-md bg-gray-800 p-6"
    >
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={difficulty} />
        <Link
          href={`/challenges/${id}`}
          className="font-semibold text-green-500 transition-colors duration-200 hover:text-green-700"
        >
          {title}
        </Link>
      </div>
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
          label={total_completitions}
          tooltipText={'Número de vezes que esse desafio foi concluído.'}
        />
        {created_by && (
          <Link href={`/profile/${user_id}`}>
            <Info
              icon={User}
              label={created_by}
              tooltipText={'Criador desse desafio.'}
            />
          </Link>
        )}
      </ul>
      {categories && (
        <ul className="flex items-start gap-3">
          {categories.map((category) => {
            if (category)
              return <Category key={category?.id} name={category?.name} />
          })}
        </ul>
      )}
    </motion.div>
  )
}
