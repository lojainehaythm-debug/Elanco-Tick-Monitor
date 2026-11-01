

import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const API_URL = 'http://localhost:5000/api/sightings'

// Approximate city-centre coordinates.
// The API provides city names, not exact coordinates.
const cityCoordinates = {
  Birmingham: [52.4862, -1.8904],
  Bristol: [51.4545, -2.5879],
  Cardiff: [51.4816, -3.1791],
  Edinburgh: [55.9533, -3.1883],
  Glasgow: [55.8642, -4.2518],
  Leeds: [53.8008, -1.5491],
  Leicester: [52.6369, -1.1398],
  Liverpool: [53.4084, -2.9916],
  London: [51.5072, -0.1276],
  Manchester: [53.4808, -2.2426],
  Newcastle: [54.9783, -1.6178],
  Nottingham: [52.9548, -1.1581],
  Sheffield: [53.3811, -1.4701],
  Southampton: [50.9097, -1.4044]
}

function MapSection() {
  const [sightings, setSightings] = useState([])
  const [city, setCity] = useState('All cities')
  const [species, setSpecies] = useState('All species')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSightings() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response format')
        }

        // Remove incomplete records and duplicate IDs.
        const uniqueRecords = Array.from(
          new Map(
            data
              .filter(item =>
                item &&
                item.id &&
                item.date &&
                item.latinName &&
                item.location &&
                item.species
              )
              .map(item => [item.id, item])
          ).values()
        )

        setSightings(uniqueRecords)

      } catch (err) {
        setError(err.message || 'Could not load tick sightings.')
      } finally {
        setLoading(false)
      }
    }

    loadSightings()
  }, [])

  const filteredSightings = useMemo(() => {
    return sightings.filter(item =>
      (city === 'All cities' || item.location === city) &&
      (species === 'All species' || item.species === species)
    )
  }, [sightings, city, species])

  const cities = [
    ...new Set(sightings.map(item => item.location))
  ].sort()

  const speciesList = [
    ...new Set(sightings.map(item => item.species))
  ].sort()

  // Group sightings by city for the map.
  const cityGroups = Object.entries(
    filteredSightings.reduce((groups, item) => {
      if (!cityCoordinates[item.location]) return groups

      if (!groups[item.location]) {
        groups[item.location] = []
      }

      groups[item.location].push(item)
      return groups
    }, {})
  )

  return (
    <div className="tick-map-section">

      <div className="map-filter-bar">
        <label>
          City
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <option value="All cities">All cities</option>

            {cities.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Species
          <select
            value={species}
            onChange={e => setSpecies(e.target.value)}
          >
            <option value="All species">All species</option>

            {speciesList.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setCity('All cities')
            setSpecies('All species')
          }}
        >
          Reset filters
        </button>
      </div>

      {loading && (
        <p>Loading real Elanco tick sightings...</p>
      )}

      {error && (
        <p role="alert" style={{ color: '#c94b45' }}>
          Error loading sightings: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="map-count">
            Showing {filteredSightings.length} sightings
            {' '}across {cityGroups.length} cities
          </div>

          <MapContainer
            center={[54.5, -3]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: '450px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {cityGroups.map(([cityName, records]) => (
              <CircleMarker
                key={cityName}
                center={cityCoordinates[cityName]}
                radius={Math.min(8 + records.length / 8, 20)}
                pathOptions={{
                  color: '#365f40',
                  fillColor: '#4b8058',
                  fillOpacity: 0.75
                }}
              >
                <Popup>
                  <strong>{cityName}</strong>
                  <br />
                  Total sightings: {records.length}
                  <br />
                  <br />
                  <strong>Species recorded:</strong>

                  <ul>
                    {[
                      ...new Set(records.map(item => item.species))
                    ].map(name => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </>
      )}

      <p className="map-note">
        Map markers represent approximate city-centre locations,
        not the exact locations of individual sightings.
      </p>

    </div>
  )
}

export default MapSection
