import { Check, Globe2, KeyRound, Monitor, Terminal } from 'lucide-react';

type Props = {
  kind: 'windows' | 'linux';
  title: string;
  items: string[];
  access: string;
};

export function OSHeroVisual({ kind, title, items, access }: Props) {
  const Icon = kind === 'windows' ? Monitor : Terminal;

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
            <Check className="srv3-os-check size-3 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="srv3-os-visual-meta">
        <span><KeyRound aria-hidden="true" /> {access}</span>
        <span><Globe2 aria-hidden="true" /> USA + EU</span>
      </div>
    </div>
  );
}
