export type ReadinessResponse = {
  status: 'ready' | 'not_ready';
  checks: {
    database: 'configured' | 'missing';
  };
};

export function getReadinessResponse(environment: Record<string, string | undefined> = process.env): ReadinessResponse {
  const databaseConfigured = Boolean(environment.DATABASE_URL?.trim());

  return {
    status: databaseConfigured ? 'ready' : 'not_ready',
    checks: {
      database: databaseConfigured ? 'configured' : 'missing',
    },
  };
}
