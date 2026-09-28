import type { PropsWithChildren } from 'react';
import styles from './SiteFeatureMark.module.css';

type SiteFeatureMarkProps = PropsWithChildren<{
  tone?: 'brand' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}>;

/** A flat, duotone brand mark for product features. Platform marks use vendor artwork. */
export function SiteFeatureMark({
  children,
  tone = 'brand',
  size = 'md',
  className = '',
}: SiteFeatureMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.root, styles[tone], styles[size], className].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  );
}
