import 'server-only';
import type { AsyncSink, LogRecord } from '@logtape/logtape';
import { configure, fromAsyncSink, getConsoleSink, getJsonLinesFormatter, getLogger } from '@logtape/logtape';
import { Env } from './Env';

const sensitiveKey = /authorization|cookie|token|secret|password|email|ip|address/i;

function redact(value: unknown, key = ''): unknown {
  if (sensitiveKey.test(key)) {
    return '[REDACTED]';
  }

  if (Array.isArray(value)) {
    return value.map(item => redact(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [entryKey, redact(entryValue, entryKey)]),
    );
  }

  return value;
}

function sanitizeRecord(record: LogRecord): LogRecord {
  return redact(record) as LogRecord;
}

const betterStackSink: AsyncSink = async (record) => {
  if (!Env.BETTER_STACK_INGESTING_URL || !Env.BETTER_STACK_SOURCE_TOKEN) {
    return;
  }

  await fetch(Env.BETTER_STACK_INGESTING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Env.BETTER_STACK_SOURCE_TOKEN}`,
    },
    body: JSON.stringify(sanitizeRecord(record)),
    signal: AbortSignal.timeout(5_000),
  });
};

const canForwardToBetterStack = Boolean(Env.BETTER_STACK_SOURCE_TOKEN)
  && Boolean(Env.BETTER_STACK_INGESTING_URL);

await configure({
  sinks: {
    console: getConsoleSink({ formatter: getJsonLinesFormatter() }),
    betterStack: fromAsyncSink(betterStackSink),
  },
  loggers: [
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' },
    {
      category: ['app'],
      sinks: canForwardToBetterStack ? ['console', 'betterStack'] : ['console'],
      lowestLevel: Env.LOGGING_LEVEL,
    },
  ],
});

export const logger = getLogger(['app']);
