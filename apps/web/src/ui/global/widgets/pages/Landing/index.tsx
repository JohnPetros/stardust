import { Header } from './Header'
import { AbountSection } from './AboutSection'
import { CodeSection } from './CodeSection'
import { CallToActionSection } from './CallToActionSection'
import { StreakSection } from './StreakSection'
import { AchievementsSection } from './AchievementsSection'
import { HeroSection } from './HeroSection'
import { ShopSection } from './ShopSection'
import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <div className='space-y-40 py-24'>
        <AbountSection />
        <CodeSection />
        <StreakSection />
        <RankingSection />
        <ShopSection />
        <AchievementsSection />
        <CallToActionSection />
      </div>
    </div>
  )
}
