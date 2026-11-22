import { Statistic } from './Statistic'

type Props = {
  completedStarsCount: number
  completedPlanetsCount: number
  unlockedAchievementsCount: number
}

export const StatisticsView = ({
  completedStarsCount,
  completedPlanetsCount,
  unlockedAchievementsCount,
}: Props) => {
  return (
    <div className='mt-6 flex h-full gap-3 md:flex-col md:justify-between md:py-6'>
      <Statistic
        title='Estrelas concluídas'
        image='/icons/coin.svg'
        value={completedStarsCount}
      />
      <span className='w-[1px] rounded-md bg-gray-700 md:h-[1px] md:w-full' />
      <Statistic
        title='Planetas concluídos'
        image='/icons/planet.svg'
        value={completedPlanetsCount}
      />
      <span className='w-[1px] rounded-md bg-gray-700 md:h-[1px] md:w-full' />
      <Statistic
        title='Conquistas adquiridas'
        image='/icons/flag.svg'
        value={unlockedAchievementsCount}
      />
    </div>
  )
}
