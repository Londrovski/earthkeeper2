# Earthkeeper 2.0

UK Energy Clearing Tracker built with Quasar Framework. Cross-platform app for tracking energy healing clearings at hospitals, schools, prisons, and other locations across the UK.

## Features

- 🗺️ **Interactive Map** - MapLibre-powered mapping with real-time location tracking
- 📱 **Cross-Platform** - Web, PWA, iOS/Android mobile apps, and desktop apps from one codebase  
- 🔄 **Real-time Sync** - Supabase backend with offline support
- 📍 **Smart Notifications** - Location-aware alerts for nearby uncleared sites
- 🛣️ **Route Optimization** - Plan efficient clearing routes
- 📊 **Progress Tracking** - Comprehensive statistics and reporting
- 🌙 **Dark Theme** - Forest green and gold Earthkeeper branding

## Tech Stack

- **Frontend**: Vue 3 + Quasar Framework + Pinia
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Maps**: MapLibre GL JS with CARTO dark tiles
- **Build**: Vite + TypeScript ready
- **Deploy**: Cloudflare Pages with auto-deployment

## Development

### Prerequisites
- Node.js 18+ and npm
- Quasar CLI: `npm install -g @quasar/cli`

### Setup
```bash
git clone https://github.com/Londrovski/earthkeeper2.git
cd earthkeeper2
npm install
```

### Development Server
```bash
# Web development
npm run dev

# Mobile development (requires Android Studio/Xcode)
npm run dev:android
npm run dev:ios

# Desktop development  
quasar dev -m electron
```

### Building

```bash
# Web build
npm run build

# PWA build
npm run build:pwa

# Mobile builds
npm run build:android

# Desktop build
npm run build:electron
```

## Architecture

### State Management (Pinia)
- **auth-store** - Authentication and user preferences
- **location-store** - Location data, filtering, and GitHub API sync
- **map-store** - MapLibre map state and interactions
- **stats-store** - Computed statistics and progress tracking

### Components
- **MainLayout** - Header, navigation, responsive tabs
- **LocationsTab** - Place filters, search, location listing
- **GroupsTab** - District-level bulk clearing
- **LogTab** - Activity history with date filtering

### Data Flow
1. Authentication via Supabase Auth
2. Location data fetched from Supabase
3. Real-time updates via WebSocket subscriptions
4. Offline support with local storage + sync on reconnect
5. Map updates reactively to state changes

## Deployment

### Cloudflare Pages
Connected to GitHub for automatic deployment on push to `main`:

1. Push to GitHub
2. Cloudflare builds with `npm run build`
3. Deploy to `earthkeeper2.pages.dev`
4. Custom domain: TBD

### Environment Variables
Configure in Cloudflare Pages settings:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Migration from v1

The original Earthkeeper was a 123KB single-file HTML app. This version provides:

- ✅ **Better maintainability** - Proper component architecture
- ✅ **Cross-platform** - Mobile apps, desktop apps, PWA
- ✅ **Real-time sync** - Multiple users, live updates
- ✅ **Better UX** - Native mobile patterns, offline support
- ✅ **Scalability** - Proper database, authentication, caching

Data migration tools will import from the existing GitHub JSON files.

## License

Private project for UK energy healing practitioners.