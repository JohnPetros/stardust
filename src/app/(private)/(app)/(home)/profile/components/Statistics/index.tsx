import { Statistic } from './Statistic'

import { User } from '@/@types/user'

interface StatisticsProps {
  data: User
}

export function Statistics({
  data: { unlocked_stars, completed_planets, unlocked_achievements },
}: StatisticsProps) {
  return (
    <div className="mt-6 flex h-full gap-3 md:flex-col md:justify-between md:py-6">
      <Statistic
        title="Estrelas completadas"
        image="/icons/coin.svg"
        value={unlocked_stars}
      />
      <span className="w-[1px] rounded-md bg-gray-300 md:h-[1px] md:w-full" />
      <Statistic
        title="Planetas concluídos"
        image="/icons/planet.svg"
        value={completed_planets}
      />
      <span className="w-[1px] rounded-md bg-gray-300 md:h-[1px] md:w-full" />
      <Statistic
        title="Conquistas adquiridas"
        image="/icons/flag.svg"
        value={unlocked_achievements}
      />
    </div>
  )
}
