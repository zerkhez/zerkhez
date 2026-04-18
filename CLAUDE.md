# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zerkhez is an AI-based mobile app helping Pakistani farmers optimize nitrogen fertilizer usage for rice, wheat, and maize. It estimates nitrogen levels from crop leaf images and provides personalized fertilizer recommendations. The app supports English and Urdu with offline-first design for rural areas.

## Repository Structure

The repo has two main parts:

- **`frontend/`** — React Native (Expo ~54, React 19) mobile app with file-based routing (Expo Router)
- **`backend/`** — Flask (Python) REST API for nitrogen calculations and image processing

Root `package.json` only holds shared i18n dependencies; the actual app code is in `frontend/`.

## Development Commands

### Frontend (run from `frontend/`)
```bash
npm install                  # Install dependencies
npx expo start               # Start Expo dev server
npx expo start --android     # Run on Android emulator
npx expo start --ios         # Run on iOS simulator
npx expo start --web         # Run in browser
npx expo start --tunnel      # Start with tunnel (for physical devices on different networks)
npx expo lint                # Run ESLint
```

### Backend (run from `backend/`)
```bash
pip install -r requirements.txt
python wsgi.py               # Start Flask dev server on port 5000
```

### Production Builds
```bash
eas build --platform android
eas build --platform ios
```

## Architecture

### Frontend

**Routing:** Expo Router (file-based) in `frontend/app/`. Stack navigation, no tabs. Entry point is `app/_layout.tsx`.

**User flow:** Splash → Language Select (first-time) → Home (with weather) → Crop Type → Growth Stage → Instructions → Image Analysis → Results → Fertilizer Recommendation

**Key directories:**
- `app/` — Screens (each file = a route). Crop-specific stage screens in `app/crop-stages/`
- `lib/` — Business logic: `imageProcessing.ts` (green pixel detection), `*RulesCalculator.ts` (nitrogen formulas per crop)
- `constants/` — Theme colors, fonts, crop-specific text content (Urdu), API URLs
- `styles/common.ts` — Responsive scaling system based on 375x812 guideline dimensions (`horizontalScale`, `verticalScale`, `moderateScale`)
- `locales/` — i18n JSON files (en.json, ur.json)
- `components/` — Reusable UI components

**State management:** React hooks + AsyncStorage for persistence (language, history). No Redux/Zustand. Data passes between screens via navigation params (`useLocalSearchParams`).

**i18n:** i18next with English and Urdu (default: Urdu). Language stored in AsyncStorage. Font switches between Montserrat (English) and NotoSansArabic (Urdu). Configuration in `lib/i18n.ts`.

**Image processing:** Platform-specific — Web uses Canvas API, Native uses `jpeg-js` for JPEG decoding. Detects green pixels (G > R && G > B) to calculate greenness ratio for nitrogen estimation.

**Styling:** Responsive scale-based system in `styles/common.ts`. Primary theme color: `#4F611C`. Font helpers: `getHeaderFont()`, `getRegularFont()`, etc.

**TypeScript:** Strict mode with path alias `@/*`. Typed routes enabled (`typedRoutes: true`).

### Backend

Flask app factory pattern in `wsgi.py`. Blueprints registered under `/api` prefix:
- `rice_routes`, `wheat_routes`, `maize_routes` — Crop-specific calculation endpoints
- `fertilizer_routes` — Fertilizer recommendation endpoint

Business logic layers:
- `app/rules/` — Nitrogen calculation rules per crop
- `app/services/` — Service layer (image processing, GI calculator, crop-specific services, fertilizer service)

Health check at `GET /health`.

### Nitrogen Calculation Logic

Each crop has distinct formulas:
- **Rice:** Greenness Index (GI) → NDVI → IEY → PYP → nitrogen rate. 6 rice varieties with different formulas.
- **Wheat:** Uses constants m=0.003, c=0.1087
- **Maize:** Uses SPAD and Stress Index (SI) calculations

All return fertilizer dosage in kg/acre for Urea, CAN, and Ammonium Sulfate.

## External APIs

- **OpenWeatherMap** — Weather data fetched on app launch (graceful fallback if offline)
- **Backend API** — Dev: `http://127.0.0.1:5000`, Prod: `https://zerkhez-backend.onrender.com`
