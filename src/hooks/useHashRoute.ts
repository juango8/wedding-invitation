import { useEffect, useState } from 'react'

export type Route = 'invitation' | 'manage'

// '#/manage' → manage page; anything else (including '#rsvp'-style section anchors) → invitation.
function parse(): Route {
  return window.location.hash.startsWith('#/manage') ? 'manage' : 'invitation'
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
