import { useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { HeroSection } from './components/HeroSection'
import { OurStorySection } from './components/OurStorySection'
import { VenueSection } from './components/VenueSection'
import { ItinerarySection } from './components/ItinerarySection'
import { RSVPSection } from './components/RSVPSection'
import { ManagePage } from './manage/ManagePage'
import { useHashRoute } from './hooks/useHashRoute'
import { consumePostLoginRedirect } from './hooks/useAdminSession'

export default function App() {
  const route = useHashRoute()

  // If the OAuth provider dropped the #/manage fragment from the redirect,
  // land the admin on the manage page anyway.
  useEffect(() => {
    if (consumePostLoginRedirect() && !window.location.hash.startsWith('#/manage')) {
      window.location.hash = '#/manage'
    }
  }, [])

  if (route === 'manage') return <ManagePage />

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-36">
        <HeroSection />
        <OurStorySection />
        <ItinerarySection />
        <VenueSection />
        <RSVPSection />
      </main>
    </div>
  )
}
