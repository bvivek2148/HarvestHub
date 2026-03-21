import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '@/components/farm/Nav'
import { Hero } from '@/components/farm/Hero'
import { MarketGrid } from '@/components/farm/MarketGrid'
import { FarmerProfiles } from '@/components/farm/FarmerProfiles'
import { FarmerOnboarding } from '@/components/farm/FarmerOnboarding'
import { HowItWorks } from '@/components/farm/HowItWorks'
import { EscrowBanner } from '@/components/farm/EscrowBanner'
import { AIAssistant } from '@/components/farm/AIAssistant'
import { Footer } from '@/components/farm/Footer'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'var(--fd-bg)',
        color: 'var(--fd-text)',
      }}
    >
      <Nav />
      <Hero />
      <MarketGrid />
      <FarmerProfiles />
      <FarmerOnboarding />
      <HowItWorks />
      <EscrowBanner />
      <Footer />
      <AIAssistant />
    </div>
  )
}
