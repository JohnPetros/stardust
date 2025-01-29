import { AbountSection } from './AboutSection'
import { AchievementsSection } from './AchievementsSection'
import { CodeSection } from './CodeSection'
import { HeroSection } from './HeroSection'
import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <div className='space-y-24 mt-24'>
        <AbountSection />
        {/* 
        <CodeSection />
        <RankingSection /> */}
        <AchievementsSection />
      </div>
    </div>
  )
}
