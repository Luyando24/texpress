# Thunder Express

Mobile-first Progressive Web App foundation for Thunder Express, a domestic
courier service in Zambia.

## Step 1 scope

- Next.js App Router with TypeScript
- Tailwind CSS design tokens and responsive app shell
- Brand foundation using the Thunder Express dark navy and amber palette
- Web app manifest, install icons, service worker and offline fallback
- Static presentation content only; no backend or third-party integrations

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production check

```bash
npm run build
npm start
```

The service worker registers only in production so it cannot interfere with
normal development refreshes.
