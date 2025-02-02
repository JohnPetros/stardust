import { AbountSection } from './AboutSection'
import { CodeSection } from './CodeSection'
import { StreakSection } from './StreakSection'
import { HeroSection } from './HeroSection'
import { AchievementsSection } from './AchievementsSection'
import { Header } from './Header'
import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      {/* <Header />
      <HeroSection /> */}
      <div className='space-y-24 py-24'>
        <StreakSection />
        {/* <CodeSection /> */}
        {/* <RankingSection /> */}
        {/* <AbountSection /> */}
        {/* <AchievementsSection /> */}
      </div>
    </div>
  )
}
