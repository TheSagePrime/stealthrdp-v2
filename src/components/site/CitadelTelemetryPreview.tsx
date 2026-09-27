'use client';

import {
  Database,
  Fingerprint,
  Gauge,
  Pulse,
  ShieldCheck,
  Target,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';

const requestMix = [
  { label: 'Allowed', value: 62 },
  { label: 'Suspicious', value: 21 },
  { label: 'Challenged', value: 12 },
  { label: 'Blocked', value: 5 },
];

function TrafficPanel() {
  return (
    <div className="srv-citadel-console-grid">
      <div className="srv-citadel-console-metrics">
        {[
          ['Requests inspected', '1.84M', <Pulse key="pulse" size={17} weight="fill" />],
          ['Peak rate', '18.4k r/s', <Gauge key="gauge" size={17} weight="fill" />],
          ['Sessions challenged', '73.2k', <Fingerprint key="fingerprint" size={17} weight="fill" />],
          ['Origin requests saved', '31%', <Database key="database" size={17} weight="fill" />],
        ].map(([label, value, icon]) => (
          <Card key={String(label)} className="srv-citadel-console-stat">
            <CardHeader>
              <span>{icon}</span>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent><strong>{value}</strong></CardContent>
          </Card>
        ))}
      </div>

      <Card className="srv-citadel-console-panel">
        <CardHeader>
          <CardTitle>Request mix</CardTitle>
          <span>Illustrative sample · API slot ready</span>
        </CardHeader>
        <CardContent className="srv-citadel-console-bars">
          {requestMix.map(item => (
            <div key={item.label}>
              <div><span>{item.label}</span><strong>{item.value}%</strong></div>
              <Progress value={item.value} max={100} label={item.label + ' sample share'} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DecisionsPanel() {
  return (
    <div className="srv-citadel-console-grid">
      <Card className="srv-citadel-console-panel">
        <CardHeader>
          <CardTitle>Decision pipeline</CardTitle>
          <span>Signals become actions, not opaque blocks.</span>
        </CardHeader>
        <CardContent className="srv-citadel-decision-list">
          {[
            ['01', 'Observe', 'Rate, path, session, reputation and behavior signals'],
            ['02', 'Score', 'Balanced or Strict profile applies the domain posture'],
            ['03', 'Challenge', 'Cookie, JS or Interaction check when confidence drops'],
            ['04', 'Escalate', 'Strike, temporary ban or Lockdown when abuse persists'],
          ].map(([step, title, text]) => (
            <div key={step}>
              <span>{step}</span>
              <div><strong>{title}</strong><small>{text}</small></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="srv-citadel-console-panel">
        <CardHeader>
          <CardTitle>Example path policy</CardTitle>
          <span>Protection can be different per route.</span>
        </CardHeader>
        <CardContent className="srv-citadel-path-list">
          {[
            ['/login', 'Strict', 'Interaction'],
            ['/api/*', 'Balanced', 'Rate + strikes'],
            ['/checkout', 'Strict', 'JS'],
            ['/health', 'Allow', 'No challenge'],
          ].map(([path, profile, action]) => (
            <div key={path}>
              <code>{path}</code>
              <Badge variant="outline">{profile}</Badge>
              <span>{action}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function OriginPanel() {
  return (
    <div className="srv-citadel-console-grid">
      <Card className="srv-citadel-console-panel">
        <CardHeader>
          <CardTitle>Origin health</CardTitle>
          <span>What customers can see once live telemetry is connected.</span>
        </CardHeader>
        <CardContent className="srv-citadel-origin-health">
          {[
            ['Origin reachability', 'Healthy', 100],
            ['Clean traffic ratio', '94%', 94],
            ['Cache shield', '38%', 38],
            ['Bandwidth allowance', '64% remaining', 64],
          ].map(([label, value, progress]) => (
            <div key={String(label)}>
              <div><span>{label}</span><strong>{value}</strong></div>
              <Progress value={Number(progress)} max={100} label={String(label) + ' illustrative value'} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="srv-citadel-console-panel srv-citadel-console-events">
        <CardHeader>
          <CardTitle>Event stream</CardTitle>
          <span>Designed for the attack API you plan to add later.</span>
        </CardHeader>
        <CardContent>
          {[
            ['Challenge raised', '/login', 'Strict profile'],
            ['Rate threshold hit', '/api/auth', 'Temporary strike'],
            ['Origin recovered', 'example.com', 'Healthy'],
            ['Lockdown relaxed', 'shop.example.com', 'Auto recovery'],
          ].map(([event, target, note]) => (
            <div key={event + '-' + target}>
              <ShieldCheck size={15} weight="fill" aria-hidden="true" />
              <div><strong>{event}</strong><span>{target}</span></div>
              <small>{note}</small>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function CitadelTelemetryPreview() {
  return (
    <Card className="srv-citadel-console">
      <CardHeader className="srv-citadel-console-head">
        <div>
          <Badge variant="outline">
            <Target size={13} weight="fill" aria-hidden="true" />
            Interface preview
          </Badge>
          <CardTitle>Attack telemetry without the noise.</CardTitle>
          <p>
            This is illustrative data today. The layout is already shaped for live
            request, challenge, attack, bandwidth and origin-health APIs later.
          </p>
        </div>
        <span className="srv-citadel-console-live"><i /> sample telemetry</span>
      </CardHeader>
      <CardContent>
        <Tabs
          className="srv-citadel-console-tabs"
          items={[
            { id: 'traffic', label: 'Traffic', content: <TrafficPanel /> },
            { id: 'decisions', label: 'Decisions', content: <DecisionsPanel /> },
            { id: 'origin', label: 'Origin', content: <OriginPanel /> },
          ]}
        />
      </CardContent>
    </Card>
  );
}
