import * as Sentry from '@sentry/nextjs';

const replayEnabled = process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED === 'true';

if (process.env.SENTRY_ENABLED === 'true' && !process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
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
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
