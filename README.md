# rooms.app-frontend

Rebuilt from scratch as a full Next.js app with a local SQLite database and a responsive dashboard UI using shadcn-style components.

## Features

- Local authentication (sign up, login, logout, password change)
- Room groups (create group, join by invitation code + PIN)
- Admin area in the dashboard for:
  - room management
  - user-group management
  - invitation management
  - member overview
- Schedule dashboard with booking filters and overlap validation
- Settings and info routes (`/kontakt`, `/nutzungsbedingungen`, `/server-error`)

## Local development

```bash
npm install
npm run dev
```

SQLite database file is created automatically at `data/rooms.sqlite`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
