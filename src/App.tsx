import { Sidebar } from './components/Sidebar'
import { HeroSection } from './components/HeroSection'
import { OurStorySection } from './components/OurStorySection'
import { VenueSection } from './components/VenueSection'
import { ItinerarySection } from './components/ItinerarySection'
import { RSVPSection } from './components/RSVPSection'

export default function App() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-36">
        <HeroSection />
        <OurStorySection />
        <VenueSection />
        <ItinerarySection />
        <RSVPSection />
      </main>
    </div>
  )
}
