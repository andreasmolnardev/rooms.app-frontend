# rooms.app-frontend (Next.js)

This repository has been migrated to a Next.js frontend.

## Run locally

```bash
npm install
npm run dev
```

## Environment

The frontend talks to the backend using `NEXT_PUBLIC_API_ROOT`.
If omitted, it defaults to:

- `rooms-app-api.prairiedog-stargazer.ts.net`

You can still override the backend host in browser storage through `localStorage.apiRoot`.

## Routes

- `/` login
- `/sign-up` sign-up placeholder route
- `/app` app session initialization
- `/admin` admin session initialization
- `/kontakt`
- `/nutzungsbedingungen`
- `/change-password`
- `/server-error`
