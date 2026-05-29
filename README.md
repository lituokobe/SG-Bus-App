# BusTimeSG

**BusTimeSG** is a lightweight single-page web application for checking real-time bus arrival information in Singapore.

Designed primarily for mobile commuters, the app provides:
- nearby bus stop discovery
- manual bus stop lookup
- real-time arrival timings
- crowding indicators
- bus type visualization
- location-based regional backgrounds

The UI is optimized for quick scanning while commuting, showing up to three upcoming arrivals per service with clear visual indicators.

## Live Access

👉 https://www.lituokobe.com/app/BusTimeSG.html

---

# Features

## Real-time Bus Arrival Information

Retrieve live arrival timings for any valid Singapore bus stop code, including:
- next three bus arrivals
- estimated arrival time in minutes
- crowding level
- vehicle type
- wheelchair accessibility
- bus operator

Arrival timing automatically displays:
- `Arr` for imminent arrivals
- `No More for Today` during non-operating hours

---

## Nearby Bus Stop Discovery

Using the browser Geolocation API, the app automatically detects the user’s approximate location and displays nearby bus stops as quick-access options.

Nearby stops are calculated from locally stored coordinate data in `busStopInfo.json`.

---

## Regional Dynamic Backgrounds

The app determines the nearest MRT station from the user's location and dynamically changes the page background to match the surrounding region of Singapore.

The project includes themed area backgrounds for locations such as:
- Marina Bay
- City Hall
- Dhoby Ghaut
- Jurong East
- Tampines
- Woodlands
- and more

Central Singapore MRT stations are grouped into a shared “city centre” theme for a more cohesive experience.

---

## Visual Bus Indicators

### Crowding Indicators

| Color | Meaning |
|---|---|
| Green | Seats Available (`SEA`) |
| Orange | Standing Available (`SDA`) |
| Red | Limited Standing (`LSD`) |

### Vehicle Types

| Code | Meaning |
|---|---|
| `SD` | Single-deck |
| `DD` | Double-deck |
| `BD` | Bendy bus |

Wheelchair-accessible services are marked with the `WAB` accessibility indicator.

---

## Time-based Greetings

The landing page displays contextual greetings based on the current time of day to create a more personalized commuter experience.

---

## Static Information Pages

The application also includes:
- About page
- Usage information
- Acknowledgements and data credits

---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | AngularJS 1.6.8 |
| Angular Modules | `ngRoute`, `ngResource`, `ngSanitize`, `ngAnimate` |
| UI Framework | Bootstrap 3.3.7 |
| DOM Utilities | jQuery 3.3.1 |
| Icons | Font Awesome 5 |
| Data Source | Local JSON metadata + external arrival API |

The project intentionally uses a lightweight architecture with:
- no build system
- no package manager
- no bundler
- CDN-hosted dependencies

This allows the app to run as a purely static frontend project.

---

# Project Structure

```text
SG-Bus-App/
├── index.html                  # Application shell and route container
├── css/
│   └── style.css               # Global styles, themes, backgrounds
├── script/
│   ├── app.js                  # AngularJS app configuration and logic
│   ├── busStopInfo.json        # Bus stop metadata (~4,600 stops)
│   └── mrtStationInfo.json     # MRT station metadata for geolocation
├── page/
│   ├── home.html               # Home page and nearby stop selection
│   ├── result.html             # Real-time arrival results page
│   ├── about.html
│   ├── information.html
│   └── specialthanks.html
├── directive/
│   ├── greetingDirective.html
│   ├── busStopCandidateDirective.html
│   └── busResultDirective.html
├── image/                      # Background images and UI assets
└── font/                       # Custom web fonts