import { User } from '@/types/user'
import { Statistic } from './Statistic'

interface StatisticsProps {
  data: User
}

export function Statistics({
  data: { unlocked_stars, completed_planets, unlocked_achievements },
}: StatisticsProps) {
  return (
    <div className="flex md:flex-col md:justify-between h-full gap-3 mt-6 md:py-6">
      <Statistic
        title="Estrelas completadas"
        image="/icons/coin.svg"
        value={unlocked_stars}
      />
      <span className="bg-gray-300 w-[1px] md:h-[1px] md:w-full rounded-md" />
      <Statistic
        title="Planetas concluídos"
        image="/icons/planet.svg"
        value={completed_planets}
      />
      <span className="bg-gray-300 w-[1px] md:h-[1px] md:w-full rounded-md" />
      <Statistic
        title="Conquistas adquiridas"
        image="/icons/flag.svg"
        value={unlocked_achievements}
      />
    </div>
  )
}
