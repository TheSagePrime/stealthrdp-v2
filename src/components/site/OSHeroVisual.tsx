import { Boxes, Globe2, Monitor, Server } from 'lucide-react';

type Props = {
  kind: 'windows' | 'linux';
  title: string;
  items: string[];
  access: string;
};

export function OSHeroVisual({ kind, title, items, access }: Props) {
  const Icon = kind === 'windows' ? Monitor : Boxes;

  return (
    <div className="srv3-os-visual" aria-label={title}>
      <div className="srv3-os-visual-head">
        <div className="srv3-os-visual-icon"><Icon aria-hidden="true" /></div>
        <div>
          <span>{kind === 'windows' ? 'Windows VPS' : 'Linux VPS'}</span>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="srv3-os-visual-list">
        {items.slice(0, 4).map(item => (
          <div key={item}>
            <span className="srv3-os-check" aria-hidden="true">✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="srv3-os-visual-meta">
        <span><Server aria-hidden="true" /> {access}</span>
        <span><Globe2 aria-hidden="true" /> USA + EU</span>
      </div>
    </div>
  );
}
