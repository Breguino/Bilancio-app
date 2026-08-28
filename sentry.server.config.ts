import * as Sentry from "@sentry/nextjs";

// Errori sul server: server action, route, rendering. Stessa regola del
// client — senza DSN non parte.
Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  sendDefaultPii: false,
  environment: process.env.VERCEL_ENV || "development",
});
