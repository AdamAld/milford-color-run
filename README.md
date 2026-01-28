# Milford Color Run 5K

Landing page for the Milford Color Run 5K event, built with Next.js.

**Live site:** [milford-color-run.vercel.app](https://milford-color-run.vercel.app)

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion / GSAP (animations)
- Leaflet (maps)
- Google Sheets API (registration backend)

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

## Environment Variables

The registration form requires these environment variables (set in Vercel and `.env.local`):

| Variable | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key (PEM format) |
| `GOOGLE_SHEET_ID` | Target Google Sheet ID |

The Google Sheet must be shared with the service account email as an Editor.

## Deployment

Deployed on [Vercel](https://vercel.com). To deploy:

```bash
vercel --prod
```

Or push to the connected Git repository for automatic deployments.
