

import { useState } from 'react'
import './App.css'
import MapSection from './Mapsection.jsx'

function App() {
  const [report, setReport] = useState({
    date: '',
    location: '',
    species: '',
    latinName: ''
  })

  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const speciesNames = {
    'Marsh tick': 'Ixodes apronophorus',
    'Southern rodent tick': 'Ixodes acuminatus',
    'Passerine tick': 'Dermacentor frontalis',
    'Tree-hole tick': 'Ixodes arboricola',
    'Fox/badger tick': 'Ixodes canisuga'
  }

  async function handleReportSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Report submission failed')
      }

      setMessage('Thank you! Your tick sighting has been submitted successfully.')

      setReport({
        date: '',
        location: '',
        species: '',
        latinName: ''
      })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app">
      <header className="top-header">
        <a className="brand" href="#home">ELANCO</a>

        <nav className="top-nav">
          <a href="#map"><span>1</span> Interactive Map</a>
          <a href="#guide"><span>2</span> Species Guide</a>
          <a href="#contact"><span>3</span> Contact Us</a>
        </nav>

        <select className="language" aria-label="Language">
          <option>EN</option>
          <option>PT</option>
        </select>
      </header>

      <main id="home">
        <section className="welcome">
          <p className="eyebrow">UK TICK SURVEILLANCE PLATFORM</p>
          <h1>Welcome to your <span>Tick Monitor</span></h1>
          <p className="intro">
            Explore tick activity across the UK, discover species
            information and contribute to tick surveillance.
          </p>

          <a className="map-preview" href="#map">
            <div className="map-placeholder">
              <span className="map-pin">⌖</span>
              <h2>Explore the UK map</h2>
              <p>View tick sightings and activity across the UK</p>
              <span className="map-link">OPEN INTERACTIVE MAP →</span>
            </div>
          </a>
        </section>

        <section className="main-sections">
          <aside className="side-menu">
            <p className="menu-title">EXPLORE</p>
            <a href="#map">01 — Interactive map</a>
            <a href="#guide">02 — Species guide</a>
            <a href="#contact">03 — Contact us</a>
            <a href="#report">04 — Report a sighting</a>
          </aside>

          <section id="map" className="content-panel map-panel">
            <div className="section-heading">
              <span>01</span>
              <h2>Interactive map</h2>
            </div>

            <MapSection />
          </section>

          <section id="guide" className="content-panel guide-panel">
            <div className="section-heading">
              <span>02</span>
              <h2>Species guide</h2>
            </div>

            <div className="guide-columns">
              <div>
                <h3>Identify a species</h3>
                <p>Explore tick species and learn their characteristics.</p>
                <ul>
                  <li>Common tick species</li>
                  <li>Appearance and identification</li>
                  <li>Habitat and activity</li>
                </ul>
              </div>

              <div>
                <h3>Prevention tips</h3>
                <p>Learn practical ways to reduce exposure to ticks.</p>
                <ul>
                  <li>Before going outdoors</li>
                  <li>After outdoor activities</li>
                  <li>Checking for ticks</li>
                </ul>
              </div>
            </div>

            <div className="seasonal">
              <h3>Seasonal activity</h3>
              <p>Seasonal tick activity charts will appear here.</p>
            </div>
          </section>

          <section id="contact" className="content-panel contact-panel">
            <div className="section-heading">
              <span>03</span>
              <h2>Contact & reporting</h2>
            </div>

            <div className="contact-content">
              <div>
                <h3>Contact information</h3>
                <p>Find out more about the Elanco Tick Monitor platform.</p>
              </div>

              <div id="report">
                <h3>Report a sighting</h3>
                <p>Help contribute to UK tick surveillance.</p>
                <a className="report-link" href="#report-form">
                  REPORT A TICK SIGHTING →
                </a>
              </div>
            </div>

            <form
              id="report-form"
              className="report-form"
              onSubmit={handleReportSubmit}
            >
              <label>
                Sighting date
                <input
                  type="date"
                  required
                  value={report.date}
                  onChange={(event) =>
                    setReport({ ...report, date: event.target.value })
                  }
                />
              </label>

              <label>
                Location
                <input
                  type="text"
                  placeholder="Enter town or city"
                  required
                  value={report.location}
                  onChange={(event) =>
                    setReport({ ...report, location: event.target.value })
                  }
                />
              </label>

              <label>
                Species
                <select
                  required
                  value={report.species}
                  onChange={(event) =>
                    setReport({
                      ...report,
                      species: event.target.value,
                      latinName: speciesNames[event.target.value] || ''
                    })
                  }
                >
                  <option value="">Select a species</option>
                  <option value="Marsh tick">Marsh tick</option>
                  <option value="Southern rodent tick">Southern rodent tick</option>
                  <option value="Passerine tick">Passerine tick</option>
                  <option value="Tree-hole tick">Tree-hole tick</option>
                  <option value="Fox/badger tick">Fox/badger tick</option>
                </select>
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit sighting'}
              </button>

              {message && <p role="status">{message}</p>}
            </form>
          </section>
        </section>
      </main>

      <footer>
        <strong>ELANCO TICK MONITOR</strong>
        <p>UK Tick Surveillance and Reporting Platform</p>
      </footer>
    </div>
  )
}

export default App
