# Complete the Word - Node + Express + Tailwind CSS

## What this is
A simple **Complete the Word** multiplayer game implemented with Node.js backend (for dictionary checks) and a single-page frontend using Tailwind CDN.

This project provides:
- `netlify-functions/` — Serverless functions for API endpoints (`/api/check` and `/api/health`)
- `public/index.html` — Frontend UI (console-free) that lets you set number of players, names, and play rounds with 10s timers.
- `data/words.txt` — A comprehensive word list with over 370,000 English words.

## How to run locally
1. Install dependencies:
```bash
npm install
```
2. Start the server:
```bash
npm start
```
3. Open `http://localhost:3000` in your browser.

## How to deploy to Netlify
1. Push this repository to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically detect the configuration and deploy your site
4. Your site will be available at your Netlify URL

## Development with Netlify CLI
You can also use the Netlify CLI for local development:
```bash
npm install -g netlify-cli
netlify dev
```

## Notes
- The word list has been upgraded to include over 370,000 English words for better gameplay
- Game rules have been modified to allow players to continue adding letters even after completing a word
- Players are only eliminated when they enter an invalid letter
- Winner is declared when only one player remains
- This setup uses Tailwind via CDN to avoid build tooling; it's ready-to-run
- The API endpoints are implemented as Netlify functions for easy deployment