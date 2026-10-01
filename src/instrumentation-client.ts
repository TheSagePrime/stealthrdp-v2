type SentryModule = typeof import('@sentry/nextjs');

const replayEnabled = process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED === 'true';

/* Loaded only when client telemetry is opted in, so the SDK (about 170 KB
   gzip with Replay) is not shipped to every visitor while it is off. */
let sentry: SentryModule | undefined;

if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' && !process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  void import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        ...(replayEnabled
          ? [
              Sentry.replayIntegration({
                maskAllText: true,
                maskAllInputs: true,
                blockAllMedia: true,
              }),
            ]
          : []),
        ...(process.env.NODE_ENV === 'development'
          ? [Sentry.spotlightBrowserIntegration()]
          : []),
      ],
      sendDefaultPii: false,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: replayEnabled ? 0.01 : 0,
      replaysOnErrorSampleRate: replayEnabled ? 0.1 : 0,
      enableLogs: false,
      debug: false,
    });
    sentry = Sentry;
  });
}

export function onRouterTransitionStart(...args: Parameters<SentryModule['captureRouterTransitionStart']>) {
  sentry?.captureRouterTransitionStart(...args);
}
