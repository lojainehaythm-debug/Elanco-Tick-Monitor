
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Temporary storage for submitted reports
const reports = []

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Elanco Tick Monitor backend is running!' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is healthy' })
})

// Retrieve and clean data from Elanco API
async function getSightings() {
  const response = await fetch(
    'https://dev-task.elancoapps.com/data/tick-sightings'
  )

  if (!response.ok) {
    throw new Error(`Elanco API returned ${response.status}`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid data received from Elanco')
  }

  const uniqueSightings = Array.from(
    new Map(
      data
        .filter(item =>
          item &&
          item.id &&
          item.date &&
          item.location &&
          item.species &&
          item.latinName
        )
        .map(item => [item.id, item])
    ).values()
  )

  return uniqueSightings
}

// Get sightings with optional filters
app.get('/api/sightings', async (req, res) => {
  try {
    const sightings = await getSightings()
    const { city, startDate, endDate } = req.query

    const filtered = sightings.filter(item => {
      const matchesCity =
        !city || item.location.toLowerCase() === city.toLowerCase()

      const sightingDate = new Date(item.date)
      const matchesStart =
        !startDate || sightingDate >= new Date(startDate)

      const matchesEnd =
        !endDate || sightingDate <= new Date(`${endDate}T23:59:59`)

      return matchesCity && matchesStart && matchesEnd
    })

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'Unable to retrieve tick sightings' })
  }
})

// Sightings grouped by city
app.get('/api/statistics/cities', async (req, res) => {
  try {
    const sightings = await getSightings()
    const totals = {}

    sightings.forEach(item => {
      totals[item.location] = (totals[item.location] || 0) + 1
    })

    res.json(
      Object.entries(totals).map(([city, count]) => ({
        city,
        count
      }))
    )
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'Unable to calculate city statistics' })
  }
})

// Weekly and monthly trends
app.get('/api/statistics/trends', async (req, res) => {
  try {
    const sightings = await getSightings()
    const period = req.query.period || 'monthly'

    if (!['weekly', 'monthly'].includes(period)) {
      return res.status(400).json({
        error: 'Period must be weekly or monthly'
      })
    }

    const totals = {}

    sightings.forEach(item => {
      const date = new Date(item.date)

      if (Number.isNaN(date.getTime())) return

      let key

      if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`
      } else {
        const start = new Date(date)
        start.setDate(
          date.getDate() - ((date.getDay() + 6) % 7)
        )
        key = start.toISOString().slice(0, 10)
      }

      totals[key] = (totals[key] || 0) + 1
    })

    res.json(
      Object.entries(totals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([period, count]) => ({ period, count }))
    )
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'Unable to calculate sighting trends' })
  }
})

// Submit a new sighting report
app.post('/api/reports', (req, res) => {
  const { date, location, species, latinName, description } = req.body

  if (!date || !location || !species) {
    return res.status(400).json({
      error: 'Date, location and species are required'
    })
  }

  if (Number.isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: 'Please provide a valid date'
    })
  }

  const report = {
    id: `report-${Date.now()}`,
    date,
    location: location.trim(),
    species: species.trim(),
    latinName: latinName || 'Not provided',
    description: description || '',
    submittedAt: new Date().toISOString()
  }

  reports.push(report)

  res.status(201).json({
    message: 'Sighting report submitted successfully',
    report
  })
})

// View submitted reports
app.get('/api/reports', (req, res) => {
  res.json(reports)
})

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Elanco backend running at http://localhost:${PORT}`)
})