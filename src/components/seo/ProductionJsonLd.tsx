import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';
import { serializeJsonLd } from '@/libs/seo/json-ld';

/** Structured data that exists only in production. The preview renders nothing. */
export function ProductionJsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  if (!isProductionDeployEnv(resolveDeployEnv())) {
    return null;
  }

  return (
    <>
      {(Array.isArray(data) ? data : [data]).map((block, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key -- static, ordered list
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
    </>
  );
}
