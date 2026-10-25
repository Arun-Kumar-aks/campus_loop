# CampusLoop — BookLoop + FlatMate frontend

A React + Vite frontend starter with two independent student services:
- **BookLoop / BookBridge:** find, donate, and exchange academic books.
- **FlatMate:** browse rental listings and discover compatible flatmates.

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. Extract this project and open the folder in VS Code.
3. In the terminal:
   ```bash
   npm install
   npm run dev
   ```
4. Open the localhost URL Vite prints (usually http://localhost:5173).

## Build
```bash
npm run build
```

## Backend integration notes
All data is currently mock data in `src/data.js`. Replace it with API calls when the backend is ready. Suggested separation:
- Book team: `/api/books`, `/api/books/:id`, `/api/book-requests`
- FlatMate team: `/api/listings`, `/api/profiles`, `/api/matches`, `/api/interests`

These are suggested routes only, not implemented endpoints. The UI does not require a backend to run.
