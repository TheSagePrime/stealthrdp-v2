export type HealthResponse = {
  status: 'ok';
  service: 'sage-prime-starter';
};

export function getHealthResponse(): HealthResponse {
  return {
    status: 'ok',
    service: 'sage-prime-starter',
  };
}
