
# Elanco Tick Monitor – Full-Stack Project

**Name:** Lojaine Haytham Atwa Eltantawy
**Student Number:** 1138777  
**University:** Liverpool John Moores University  
**Course:** BSc Software Engineering


1) What we want to do 

To build and create MVP ( Mini viable product) of a web app that tracks tick sihghtings across the UK 
Ticks : are small parasites that can attack themselves to animals as they carry diseases including Lyme disease
Full stack : developing both front and backend pf an app or site and connecting them to a database to manage th data 

2) We want the website to 
- See where ticks have been reported across UK
- Identify areas with more reported sightings 
- Learn about different tick species
- Understand how to prevent tick bites
- Report a tick they have found
- Provides weekly and monthly sighting trends.


3) Features

### Interactive Map
- Displays tick sightings retrieved from the Elanco API.
- Shows sightings across 14 UK cities.
- Provides city and species filters.
- Displays sighting information through interactive map markers.
- Uses approximate city-centre locations because the API does not provide exact coordinates.

### Species Guide
- Introduces different tick species.
- Provides basic identification information.
- Includes prevention guidance.

### Reporting System
- Allows users to submit a tick sighting.
- Collects the sighting date, location and species.
- Automatically associates the selected species with its scientific name.
- Sends reports to the backend API.

### Backend and Data Processing
- Retrieves tick sightings from the Elanco API.
- Removes incomplete records and duplicate IDs.
- Supports filtering by city and date.
- Calculates sightings per city.
- Provides weekly and monthly sighting statistics.
- Accepts and retrieves submitted reports.

## Technologies Used

### Frontend
- React
- JavaScript
- Vite
- HTML
- CSS
- React Leaflet
- Leaflet

### Backend
- Node.js
- Express.js
- CORS
- JavaScript

5) External API
https://dev-task.elancoapps.com/data/tick-sightings

6) Project Structure

text
Elanco Tick Monitor/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── Mapsection.jsx
│   └── package.json
│
├── Backend/
│   ├── server.js
│   └── package.json
│
└── README.md


7) Installation and Setup

### Requirements
- Node.js
- npm               


8) Clone the repository

```bash
git clone https://github.com/lojainehaythm-debug/Elanco-Tick-Monitor.git
cd Elanco-Tick-Monitor
```

9) Install backend dependencies

```bash
cd Backend
npm install
```

10) Start the backend

```bash
node server.js
```

The backend runs at:

http://localhost:5000

11) Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

12) Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend status |
| GET | `/api/sightings` | Retrieves tick sightings |
| GET | `/api/sightings?city=Liverpool` | Filters sightings by city |
| GET | `/api/statistics/cities` | Returns sightings per city |
| GET | `/api/statistics/trends?period=weekly` | Returns weekly trends |
| GET | `/api/statistics/trends?period=monthly` | Returns monthly trends |
| POST | `/api/reports` | Submits a new sighting report |
| GET | `/api/reports` | Retrieves submitted reports |

13) Data Processing

The application retrieves tick sighting records from the external Elanco API. The backend checks the received data, removes incomplete records and removes duplicate records using their unique IDs.

The application supports filtering and statistical calculations to help users explore the available data.

14) Limitations

- Submitted reports are stored temporarily and are lost when the backend restarts.
- The map does not show the exact location of each sighting.
- An internet connection is needed to retrieve the tick data.

15) Future Improvements

- Add a database to save reports permanently.
- Add charts to show seasonal tick activity.
- Include more information about tick species.
- Improve the map with more features.

