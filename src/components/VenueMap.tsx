import { useEffect, useRef } from 'react'

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#ecdcc3' }] },
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ gamma: 0.01 }, { lightness: 20 }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ saturation: -31 }, { lightness: -33 }, { weight: 2 }, { gamma: 0.8 }] },
  { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country', elementType: 'all', stylers: [{ visibility: 'simplified' }, { color: '#776340' }, { invert_lightness: true }] },
  { featureType: 'administrative.province', elementType: 'all', stylers: [{ visibility: 'simplified' }, { color: '#776340' }] },
  { featureType: 'administrative.province', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.neighborhood', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ lightness: 30 }, { saturation: 30 }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
  { featureType: 'landscape.natural', elementType: 'all', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'landscape.natural', elementType: 'labels', stylers: [{ visibility: 'on' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{ visibility: 'on' }, { color: '#e5d8c3' }, { lightness: -6 }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ saturation: 20 }] },
  { featureType: 'poi.park', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ lightness: 20 }, { saturation: -20 }] },
  { featureType: 'road', elementType: 'all', stylers: [{ weight: '1' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 10 }, { saturation: -30 }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#8f8470' }, { lightness: '0' }, { weight: '1' }, { invert_lightness: true }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ saturation: 25 }, { lightness: 25 }, { visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ weight: '2.00' }, { invert_lightness: true }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ weight: '2' }] },
  { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.local', elementType: 'all', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit.line', elementType: 'all', stylers: [{ visibility: 'on' }, { invert_lightness: true }, { lightness: '37' }] },
  { featureType: 'transit.station.airport', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station.bus', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station.rail', elementType: 'all', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit.station.rail', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#b0b0b0' }] },
  { featureType: 'transit.station.rail', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station.rail', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ lightness: -20 }, { visibility: 'simplified' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { lightness: '28' }] },
  { featureType: 'water', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]

// Khunan Pacha — Calle San Francisco 217, Arequipa
const VENUE = { lat: -16.3987, lng: -71.5368 }

declare global {
  interface Window {
    __initVenueMap?: () => void
  }
}

export function VenueMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

    if (!apiKey) {
      console.warn('VenueMap: add VITE_GOOGLE_MAPS_API_KEY to your .env file')
      return
    }

    const init = () => {
      if (!mapRef.current) return
      const map = new google.maps.Map(mapRef.current, {
        center: VENUE,
        zoom: 17,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
      })
      new google.maps.Marker({
        position: VENUE,
        map,
        title: 'Khunan Pacha',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#6c402a',
          fillOpacity: 1,
          strokeColor: '#f8efdf',
          strokeWeight: 2,
        },
      })
    }

    if (window.google?.maps) {
      init()
      return
    }

    window.__initVenueMap = init
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initVenueMap`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      delete window.__initVenueMap
    }
  }, [])

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-warm-light border border-rose-blush/40">
        <p className="font-sans text-[11px] uppercase tracking-widest text-warm-muted text-center px-4">
          Agrega <code className="normal-case bg-rose-blush/20 px-1">VITE_GOOGLE_MAPS_API_KEY</code> a tu archivo <code className="normal-case bg-rose-blush/20 px-1">.env</code>
        </p>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" />
}
