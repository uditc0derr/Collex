# Collex

Unified virtual cloud storage for organizing multiple Google Drive accounts from one dashboard.

## Setup

1. Rotate the Google OAuth client secret that was shared outside the app.
2. Copy env examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Install and run:

```bash
npm run install:all
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000`

The included Postgres container maps to `localhost:55432` to avoid colliding with an existing local Postgres on `5432`. If you use your own local Postgres, set `backend/.env` to that server instead.

## Notes

- Google refresh tokens are encrypted with AES-256-GCM before storage.
- Large uploads stream through Busboy into Google Drive.
- Files and folders are virtual metadata records; moving a file updates `folderId`.
