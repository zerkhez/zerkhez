# Notifications Page Design

## Overview

A notifications screen accessible from the home page bell icon, showing three categories of content: farming tips & reminders, analysis history, and app announcements. Uses a hybrid data approach — local storage for tips and history, backend API for announcements with offline fallback.

## Sections

### 1. Tips & Reminders

**Data source:** Hardcoded tip pool in `frontend/constants/farmingTips.ts`.

**Structure per tip:**
```ts
interface FarmingTip {
    id: string;
    crop: 'wheat' | 'rice' | 'maize';
    season: 'rabi' | 'kharif'; // rabi = Oct-Mar, kharif = Apr-Sep
    en: string;
    ur: string;
}
```

**Selection logic:**
1. Read analysis history from AsyncStorage (`analysis_history` key)
2. Extract which crops the user has analyzed
3. Filter tips to those crops
4. If no history exists, fall back to seasonal tips (rabi: wheat/maize, kharif: rice) based on current month
5. Rotate tips daily — use `new Date().toDateString()` as hash seed to pick 2-3 tips from the filtered pool

**Display:** Card with a lightbulb/leaf icon, tip text in current language (en/ur).

### 2. Analysis History

**Storage:** AsyncStorage key `analysis_history`, JSON array.

**Entry schema:**
```ts
interface AnalysisHistoryEntry {
    id: string;          // timestamp-based unique ID
    crop: string;        // 'rice' | 'wheat' | 'maize'
    variety: string;     // variety name
    date: string;        // ISO date string
    n_rate: number;      // nitrogen rate
    urea: number;        // kg/acre
    can: number;         // kg/acre
    ammonium_sulfate: number; // kg/acre
}
```

**Save point:** In `image-analysis.tsx`, save to AsyncStorage right before `router.push('/analysis-results')` — both in the local processing path and the server processing path.

**Limit:** Max 50 entries. On save, if length > 50, trim oldest entries.

**Display:** Cards sorted newest-first. Each card shows: crop icon, variety name, date (formatted for locale), and nitrogen rate. Tapping a card navigates to `/analysis-results` with the stored params.

### 3. Announcements

**Data source:** `GET {BACKEND_API_URL}/api/announcements` when online.

**Schema:**
```ts
interface Announcement {
    id: string;
    title_en: string;
    title_ur: string;
    body_en: string;
    body_ur: string;
    date: string;
}
```

**Behavior:**
- On mount, check network connectivity
- If online, fetch announcements and cache to AsyncStorage (`announcements_cache`)
- If offline, display cached announcements
- If no cache and offline, show "No announcements" placeholder
- Since the backend endpoint doesn't exist yet, handle 404/errors gracefully — show placeholder

**Display:** Card with megaphone icon, title, body text, date.

## UI Design

- **Header:** Reuse existing `Header` component with THEME_COLOR background and "Notifications" / title text
- **Body:** White background with rounded top corners (matching `image-analysis.tsx` pattern)
- **Sections:** Each section has a heading with icon, followed by cards
- **Cards:** Rounded corners (`borderRadius: 15`), light shadow, white background, consistent with app's card style
- **Animations:** FadeInUp staggered per section/card (matching other screens)
- **Empty states:** Friendly message per section when no data available
- **Bottom:** Microphone component (consistent with other screens)

## Files

| File | Action | Purpose |
|------|--------|---------|
| `frontend/app/notifications.tsx` | Create | Notifications screen |
| `frontend/constants/farmingTips.ts` | Create | Hardcoded bilingual tip pool |
| `frontend/app/_layout.tsx` | Modify | Register notifications route |
| `frontend/app/home.tsx` | Modify | Bell icon navigates to `/notifications` |
| `frontend/app/image-analysis.tsx` | Modify | Save analysis history to AsyncStorage |

## Localization

Add keys to `frontend/locales/en.json` and `frontend/locales/ur.json`:
- `notifications.title` — "Notifications" / screen header
- `notifications.tipsTitle` — "Tips & Reminders" section heading
- `notifications.historyTitle` — "Analysis History" section heading
- `notifications.announcementsTitle` — "Announcements" section heading
- `notifications.noHistory` — empty state for history
- `notifications.noAnnouncements` — empty state for announcements
- `notifications.noTips` — empty state for tips
