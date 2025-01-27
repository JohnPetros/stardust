import { AbountSection } from './AboutSection'
import { HeroSection } from './HeroSection'
import { RankingSection } from './RankingSection'

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <div className='max-w-6xl mx-auto space-y-24'>
        <AbountSection />
        <RankingSection />
      </div>
    </div>
  )
}
