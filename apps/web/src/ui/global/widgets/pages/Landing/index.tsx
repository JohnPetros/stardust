import { AbountSection } from './AboutSection'
import { CodeSection } from './CodeSection'
import { HeroSection } from './HeroSection'
import { AchievementsSection } from './AchievementsSection'
import { Header } from './Header'
import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <div className='space-y-24 py-24'>
        {/* <RankingSection /> */}
        {/* <AbountSection /> */}
        {/* 
        <CodeSection />
        < */}
        <AchievementsSection />
      </div>
    </div>
  )
}
