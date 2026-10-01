'use client';

import type { Plan } from '@/lib/stealth/content';
import { ArrowRight } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { checkoutUrl } from '@/lib/stealth/content';
import styles from './CatalogMap.module.css';

/*
 * Hero visual for /plans: every plan in the live catalogue as a node on a
 * price-against-memory curve, one curve per region. A highlight walks the
 * catalogue and the readout below shows that plan; hover, focus or click a
 * node to pick one. All numbers come from the plans passed in.
 */

type Region = 'USA' | 'EU';

const layouts = {
  wide: { width: 640, height: 360, left: 54, right: 22, top: 22, bottom: 40 },
  tall: { width: 360, height: 300, left: 42, right: 14, top: 18, bottom: 36 },
} as const;

type LayoutName = keyof typeof layouts;

const ram = (plan: Plan) => Number.parseFloat(plan.specs.ram);
const price = (plan: Plan) => plan.pricing.monthly.amount;

function scales(name: LayoutName, plans: Plan[]) {
  const box = layouts[name];
  const rams = plans.map(ram);
  const low = Math.log2(Math.min(...rams));
  const high = Math.log2(Math.max(...rams));
  const top = Math.ceil(Math.max(...plans.map(price)) / 20) * 20;
  const x = (value: number) => box.left + ((Math.log2(value) - low) / (high - low || 1)) * (box.width - box.left - box.right);
  const y = (value: number) => box.height - box.bottom - (value / top) * (box.height - box.top - box.bottom);
  const ramTicks = [...new Set(rams)].sort((a, b) => a - b);
  const priceTicks = Array.from({ length: top / 20 + 1 }, (_, index) => index * 20);
  return { x, y, ramTicks, priceTicks, box };
}

/* Indexes of ticks that keep at least `gap` units apart; the last one wins. */
function spaced(positions: number[], gap: number) {
  const kept: number[] = [];
  positions.forEach((position, index) => {
    while (kept.length && position - positions[kept.at(-1)!]! < gap) {
      kept.pop();
    }
    kept.push(index);
  });
  return kept;
}

/* A smooth curve through the points (monotone in x). */
function curve(points: Array<[number, number]>) {
  if (points.length < 2) {
    return '';
  }
  return points.reduce((path, [px, py], index) => {
    if (index === 0) {
      return `M${px} ${py}`;
    }
    const [qx, qy] = points[index - 1]!;
    const mid = (qx + px) / 2;
    return `${path} C${mid} ${qy} ${mid} ${py} ${px} ${py}`;
  }, '');
}

function Chart({ name, plans, active, onPick }: {
  name: LayoutName;
  plans: Plan[];
  active: number;
  onPick: (index: number) => void;
}) {
  const { x, y, ramTicks, priceTicks, box } = scales(name, plans);
  const series = (['USA', 'EU'] as Region[]).map((region) => {
    const points = plans
      .map((plan, index) => ({ plan, index }))
      .filter(item => item.plan.location === region)
      .sort((a, b) => ram(a.plan) - ram(b.plan) || price(a.plan) - price(b.plan));
    return { region, points, d: curve(points.map(({ plan }) => [x(ram(plan)), y(price(plan))])) };
  });
  const current = plans[active];
  const id = `catalog-${name}`;

  return (
    <svg viewBox={`0 0 ${box.width} ${box.height}`} className={styles.chart} data-layout={name} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-usa`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" className={styles.stopUsaSoft} />
          <stop offset="100%" className={styles.stopUsa} />
        </linearGradient>
        <linearGradient id={`${id}-eu`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" className={styles.stopEuSoft} />
          <stop offset="100%" className={styles.stopEu} />
        </linearGradient>
      </defs>

      {priceTicks.map(tick => (
        <g key={tick}>
          <line x1={box.left} x2={box.width - box.right} y1={y(tick)} y2={y(tick)} className={styles.grid} />
          <text x={box.left - 10} y={y(tick) + 4} textAnchor="end" className={styles.axis}>{`€${tick}`}</text>
        </g>
      ))}
      {spaced(ramTicks.map(x), name === 'wide' ? 44 : 40).map(index => (
        <text key={ramTicks[index]} x={x(ramTicks[index]!)} y={box.height - box.bottom + 22} textAnchor="middle" className={styles.axis}>
          {`${ramTicks[index]} GB`}
        </text>
      ))}
      <text x={box.width - box.right} y={box.height - 4} textAnchor="end" className={styles.axisTitle}>RAM →</text>

      {series.map(item => (
        <g key={item.region} data-region={item.region}>
          <path d={item.d} className={styles.beamGlow} stroke={`url(#${id}-${item.region.toLowerCase()})`} />
          <path d={item.d} className={styles.beam} stroke={`url(#${id}-${item.region.toLowerCase()})`} />
          <circle r="3.5" className={styles.spark} data-region={item.region}>
            <animateMotion path={item.d} dur={item.region === 'USA' ? '4.8s' : '4.2s'} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {current && (
        <g className={styles.focus} key={active}>
          <line x1={x(ram(current))} x2={x(ram(current))} y1={y(price(current))} y2={box.height - box.bottom} className={styles.drop} />
          <circle cx={x(ram(current))} cy={y(price(current))} r="11" className={styles.halo} data-region={current.location} />
        </g>
      )}

      {plans.map((plan, index) => (
        <circle
          key={plan.name}
          cx={x(ram(plan))}
          cy={y(price(plan))}
          r={index === active ? 7 : 5.5}
          className={styles.node}
          data-region={plan.location}
          data-sold={plan.source.availability === 'out-of-stock' || undefined}
          onMouseEnter={() => onPick(index)}
          onClick={() => onPick(index)}
        />
      ))}
    </svg>
  );
}

export function CatalogMap({ plans }: { plans: Plan[] }) {
  const root = useRef<HTMLDivElement>(null);
  const order = [...plans].sort((a, b) => ram(a) - ram(b) || a.location.localeCompare(b.location));
  const [active, setActive] = useState(() => Math.max(0, order.findIndex(plan => plan.popular)));
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    let visible = false;
    const apply = () => {
      window.clearInterval(timer);
      if (visible && !held && !motion.matches && document.visibilityState === 'visible') {
        timer = window.setInterval(() => setActive(value => (value + 1) % order.length), 2600);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      apply();
    });
    observer.observe(element);
    motion.addEventListener('change', apply);
    document.addEventListener('visibilitychange', apply);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener('change', apply);
      document.removeEventListener('visibilitychange', apply);
    };
  }, [held, order.length]);

  const pick = (index: number) => {
    setHeld(true);
    setActive(index);
  };
  const plan = order[active];
  const available = plan && plan.source.availability !== 'out-of-stock';

  return (
    <div ref={root} className={styles.map} onMouseLeave={() => setHeld(false)}>
      <div className={styles.head}>
        <span>{`${order.length} plans · live monthly prices`}</span>
        <span className={styles.legend}>
          <i data-region="USA" />
          USA
          <i data-region="EU" />
          EU
        </span>
      </div>

      <Chart name="wide" plans={order} active={active} onPick={pick} />
      <Chart name="tall" plans={order} active={active} onPick={pick} />

      {plan && (
        <div className={styles.readout} aria-live={held ? 'polite' : 'off'}>
          <div className={styles.readoutPlan}>
            <i data-region={plan.location} />
            <strong>{plan.name}</strong>
            <span>{`${plan.specs.cpu.replace(' Core', ' vCPU')} · ${plan.specs.ram} RAM · ${plan.specs.storage}`}</span>
          </div>
          <div className={styles.readoutPrice}>
            <strong>{`€${price(plan).toFixed(2)}`}</strong>
            <span>/mo</span>
          </div>
          <span className={styles.readoutStock} data-available={available}>
            {plan.source.stock !== undefined ? `${plan.source.stock} in stock` : available ? 'In stock' : 'Sold out'}
          </span>
          {available && (
            <a className={styles.readoutOrder} href={checkoutUrl(plan, 'monthly')}>
              Order
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      <ul className={styles.picker} aria-label="Plans on the map">
        {order.map((item, index) => (
          <li key={item.name}>
            <button type="button" aria-pressed={index === active} onClick={() => pick(index)} onFocus={() => pick(index)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
