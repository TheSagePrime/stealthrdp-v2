import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import * as schema from '@/models/Schema';

function validateDatabaseTransport(connectionString: string): void {
  const url = new URL(connectionString);
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);

  if (Env.NODE_ENV === 'production' && !local) {
    const sslMode = url.searchParams.get('sslmode');
    if (!sslMode || !['require', 'verify-ca', 'verify-full'].includes(sslMode)) {
      throw new Error('Production DATABASE_URL must enforce TLS with sslmode=require or stronger');
    }
  }
}

// Canonical production provider: Neon PostgreSQL.
// Keep the standard pg + Drizzle boundary for Node.js/Coolify portability.
export const createDbConnection = () => {
  validateDatabaseTransport(Env.DATABASE_URL);

  const pool = new Pool({
    connectionString: Env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    query_timeout: 5_000,
  });

  pool.on('error', (error) => {
    logger.error(`Database pool error: ${error.message}`);
  });

  return drizzle({
    client: pool,
    schema,
  });
};
