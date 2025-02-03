// import { AbountSection } from './AboutSection'
import { CodeSection } from './CodeSection'
import { CallToActionSection } from './CallToActionSection'
// import { StreakSection } from './StreakSection'
// import { AchievementsSection } from './AchievementsSection'
import { HeroSection } from './HeroSection'
import { ShopSection } from './ShopSection'
import { Header } from './Header'
// import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <div className='space-y-24 py-24'>
        <ShopSection />
        {/* <StreakSection /> */}
        {/* <CodeSection /> */}
        {/* <RankingSection /> */}
        {/* <AbountSection /> */}
        {/* <AchievementsSection /> */}
        <CallToActionSection />
      </div>
    </div>
  )
}
