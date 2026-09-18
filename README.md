# Weather Intelligence App

A fast, responsive, and keyless single-page Weather Intelligence web application built with React, TypeScript, and Vite.

## Features

- **City Geocoding & Disambiguation**: Search cities worldwide using Open-Meteo's geocoding API. When a query returns multiple matching places, the app provides an interactive candidate disambiguation list displaying country and region (admin1) so you never silently get the wrong city.
- **Current Conditions**: Displays resolved place name, country/region, real-time temperature, "feels like" apparent temperature, relative humidity, wind speed, precipitation, and plain-English WMO weather code descriptions with matching icons.
- **7-Day Forecast Cards**: A responsive 7-day card row showing weekday, date, weather description, high and low temperatures, and precipitation probability. Cards wrap gracefully on mobile devices to eliminate horizontal scrolling.
- **7-Day Temperature Trend Chart**: High and low temperature dual-line chart built with Recharts, complete with labeled axes, responsive grid, dynamic domain buffering, legend, and interactive tooltips.
- **Data-Grounded Planning Recommendations**: Generates 3 to 5 actionable suggestions strictly derived from the 7-day forecast data (such as umbrella advice, outdoor activity suitability scores, wind warnings, or temperature alerts). Each recommendation explicitly identifies the day and exact numeric threshold that triggered it.
- **Measurement Units**: Toggle seamlessly between Metric (°C, km/h, mm) and Imperial (°F, mph, in) units.
- **Explicit Error & Edge Handling**:
  - Clear message when no city matches the search query.
  - Network and API failure handling with an instant retry action.
  - Disabled search submissions on empty or whitespace inputs.
  - Unobtrusive loading states during in-flight requests.
  - The search interface remains fully accessible across all error states without requiring page reloads.

---

## Open-Meteo Public API Endpoints Used

All API calls are executed directly from the user's browser without any backend server, proxy, authentication, or secret keys:

1. **Geocoding Endpoint**:
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={CITY}&count=5&language=en&format=json
   ```
   Returns candidate places with `name`, `country`, `admin1`, `latitude`, `longitude`, and `timezone`.

2. **Forecast Endpoint**:
   ```
   https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7
   ```
   Returns real-time current conditions and daily 7-day weather metrics.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ installed on your machine
- npm (bundled with Node.js)

### Installation
Clone or download the project files, navigate to the project root directory, and install dependencies:
```bash
npm install
```

### Development
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
Compile and bundle the production assets into the `dist/` folder:
```bash
npm run build
```

To preview the built production bundle locally:
```bash
npm run preview
```

---

## Deployment & Routing

The application includes a `public/_redirects` file with:
```
/* /index.html 200
```
This ensures seamless client-side single-page application routing without 404 errors when pages are refreshed on static hosting platforms like Cloudflare Pages.
