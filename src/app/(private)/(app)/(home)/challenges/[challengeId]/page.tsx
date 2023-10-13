'use client'

import { useEffect, useRef, useState } from 'react'
import { useChallengeStore } from '@/hooks/useChallengeStore'
import { useRouter, useParams } from 'next/navigation'
import { useChallenge } from '@/hooks/useChallenge'
import { useAuth } from '@/hooks/useAuth'
import { useStar } from '@/hooks/useStar'

import { Header } from './components/Header'
import { Slider } from './components/Slider'
import { End, updateUserDataParam } from '../../../lesson/components/End'

import { CHALLENGE_EARNINGS_BY_DIFFICULTY } from '@/utils/constants'
import { formatSecondsToTime } from '@/utils/functions'
import { Problem } from './components/Problem'
import { Code } from './components/Code'
import { TransitionPageAnimation } from '../../../components/TransitionPageAnimation'

export default function Challenge() {
  const { challengeId } = useParams()
  const { user } = useAuth()

  const { challenge, addUserCompletedChallenge } = useChallenge({
    challengeId: String(challengeId),
    userId: user?.id,
  })

  const { updateUserData: updateUserStarData } = useStar(challenge?.star_id)

  const {
    state,
    action: { setChallenge, resetState },
  } = useChallengeStore()
  const router = useRouter()

  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)

  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')
  const seconds = useRef(0)

  function leaveChallenge() {
    router.push('/')
  }

  function getAccurance() {
    const accurance = ((5 - state.incorrectAnswersAmount) / 5) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  async function updateUserData({
    newCoins,
    newXp,
    user,
  }: updateUserDataParam) {
    let completed_challenges = user.completed_challenges

    if (challenge && !challenge.is_completed) {
      await addUserCompletedChallenge(challenge.id, user.id)
      completed_challenges++
    }

    if (challenge?.star_id) {
      const updatedStarData = await updateUserStarData({
        newCoins,
        newXp,
        user,
      })

      const updatedData = {
        completed_challenges,
        ...updatedStarData,
      }

      console.log({ updatedData })

      return updatedData
    }

    const updatedCoins = newCoins + user.coins
    const updatedXp = newXp + user.xp
    const updatedWeeklyXp = newXp + user.weekly_xp

    return {
      completed_challenges,
      coins: updatedCoins,
      xp: updatedXp,
      weekly_xp: updatedWeeklyXp,
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (challenge) {
      setChallenge(challenge)
      setIsTransitionPageVisible(false)
      timer = setTimeout(() => setIsTransitionPageVisible(false), 5000)
    }

    return () => {
      resetState()
      clearTimeout(timer)
    }
  }, [challenge])

  useEffect(() => {
    const timer = setTimeout(() => (seconds.current += 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds.current])

  useEffect(() => {
    if (challenge && state.isEnd) {
      const difficulty = CHALLENGE_EARNINGS_BY_DIFFICULTY[challenge?.difficulty]

      const coins = difficulty.coins / (challenge?.is_completed ? 2 : 1)
      const xp = difficulty.xp / (challenge?.is_completed ? 2 : 1)
      const accurance = getAccurance()
      const time = formatSecondsToTime(seconds.current)

      setCoins(coins)
      setXp(xp)
      setAccurance(accurance)
      setTime(time)
    }
  }, [challenge, state.isEnd])

  return (
    <div className="relative md:overflow-hidden">
      <TransitionPageAnimation isVisible={isTransitionPageVisible} hasTips={true} />

      {state.isEnd ? (
        <End
          coins={coins}
          xp={xp}
          time={time}
          accurance={accurance}
          userDataUpdater={updateUserData}
          onExit={leaveChallenge}
        />
      ) : (
        <>
          <Header />
          <main className="">
            <div className="md:hidden">
              <Slider />
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 overflow-hidden">
              <Problem />
              <Code />
            </div>
          </main>
        </>
      )}
    </div>
  )
}
