import * as Sentry from "@sentry/nextjs";

// Errori nel browser. Senza NEXT_PUBLIC_SENTRY_DSN il client non parte e non
// manda niente da nessuna parte: in locale e nella CI resta inerte.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Solo le integrazioni che servono a raccogliere un errore. Le predefinite
  // includono tracing e replay, che qui non usiamo e che pesano.
  integrations: [
    Sentry.breadcrumbsIntegration(),
    Sentry.globalHandlersIntegration(),
    Sentry.linkedErrorsIntegration(),
    Sentry.dedupeIntegration(),
  ],
  // Solo errori. Niente Session Replay, che è la parte pesante del pacchetto
  // e che per un'app di bilancio registrerebbe importi e nomi di contatti.
  tracesSampleRate: 0,
  sendDefaultPii: false,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
});
