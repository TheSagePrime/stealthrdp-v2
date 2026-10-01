export type HealthResponse = {
  status: 'ok';
  service: 'stealthrdp-v2';
};

export function getHealthResponse(): HealthResponse {
  return {
    status: 'ok',
    service: 'stealthrdp-v2',
  };
}
