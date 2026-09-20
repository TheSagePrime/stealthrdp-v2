export type HealthResponse = {
  status: 'ok';
  service: 'web-starter';
};

export function getHealthResponse(): HealthResponse {
  return {
    status: 'ok',
    service: 'web-starter',
  };
}
