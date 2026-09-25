import { Check, GlobeHemisphereWest as Globe2, Key as KeyRound } from '@phosphor-icons/react/dist/ssr';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type Props = {
  kind: 'windows' | 'linux';
  title: string;
  items: string[];
  access: string;
};

/** Real operating-system marks, not stand-in icons. Provenance: public/brand/provenance.json */
const OS_MARK = {
  windows: '/brand/windows.svg',
  linux: '/brand/linux.svg',
} as const;

export function OSHeroVisual({ kind, title, items, access }: Props) {
  return (
    <Card
      className="srv3-os-visual gap-0 border-0 bg-transparent p-0 shadow-none"
      aria-label={title}
    >
      <div className="srv3-os-visual-head">
        <div className="srv3-os-visual-icon">
          {/* Decorative: the title text next to it already names the system. */}
          <img src={OS_MARK[kind]} alt="" width={26} height={26} />
        </div>
        <div>
          <Badge variant="outline">{kind === 'windows' ? 'Windows VPS' : 'Linux VPS'}</Badge>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="srv3-os-visual-list">
        {items.slice(0, 4).map(item => (
          <div key={item}>
            <Check className="srv3-os-check size-4 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="srv3-os-visual-meta">
        <span><KeyRound size={16} aria-hidden="true" /> {access}</span>
        <Badge variant="outline"><Globe2 size={16} aria-hidden="true" /> USA + EU</Badge>
      </div>
    </Card>
  );
}
