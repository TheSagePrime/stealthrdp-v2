'use client';

import type { Icon } from '@phosphor-icons/react';
import type { DisplayField, DomainAction, DomainView, ResourceView, SessionView } from './catalog';
import {
  ArrowsClockwise,
  ChartLine,
  CheckCircle,
  Clock,
  Globe,
  Info,
  ShieldCheck,
  SignOut,
  SlidersHorizontal,
  SquaresFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pill } from '@/components/ui/pill';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { accountResources, domainResources } from './catalog';
import styles from './CitadelDashboard.module.css';
import { SettingsEditor } from './SettingsEditor';
import { TrafficPanel } from './TrafficPanel';

class DashboardError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/citadel/${path}`, {
    ...options,
    credentials: 'same-origin',
    cache: 'no-store',
    redirect: 'error',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new DashboardError(response.status, result.error || 'Please try again.');
  }
  return result as T;
}

function Fields({ fields }: { fields: DisplayField[] }) {
  return (
    <dl className={styles.fields}>
      {fields.map((field, index) => (
        <div className={styles.field} key={`${field.label}-${index}`}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ResourcePanel({ title, endpoint, resource, session, onExpired }: { title: string; endpoint: string; resource: string; session: SessionView; onExpired: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<ResourceView | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const paginated = ['logs', 'events'].includes(resource);
  const queryString = new URLSearchParams({ ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), ...(paginated ? { page: String(page), pageSize: '25' } : {}) }).toString();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api<ResourceView>(`${endpoint}${queryString ? `?${queryString}` : ''}`, { signal: controller.signal })
      .then(value => setResult(value))
      .catch((failure: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (failure instanceof DashboardError && failure.status === 401) {
          onExpired();
        }
        setError(failure instanceof Error ? failure.message : 'Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [endpoint, visible, revision, onExpired, queryString]);

  return (
    <Card className={styles.resource} ref={ref}>
      <CardHeader>
        <div className={styles.resourceTitle}>
          <CardTitle>{title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Refresh ${title.toLowerCase()}`}
            disabled={loading}
            onClick={() => setRevision(value => value + 1)}
          >
            <ArrowsClockwise size={20} aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent aria-busy={loading}>
        {resource === 'logs'
          ? (
              <form
                className={styles.formGroup}
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  setPage(1);
                  setFilters(Object.fromEntries([...data].map(([key, value]) => [key, String(value)])));
                }}
              >
                <label>
                  Log type
                  <Select name="type">
                    <option value="">All types</option>
                    {['access', 'security', 'error'].map(type => <option key={type} value={type}>{type}</option>)}
                  </Select>
                </label>
                <label>
                  HTTP method
                  <Input name="method" maxLength={10} />
                </label>
                <label>
                  Status code
                  <Input name="status" pattern="[1-5][0-9]{2}" />
                </label>
                <label>
                  Search logs
                  <Input name="search" maxLength={200} />
                </label>
                <label>
                  Log order
                  <Select name="sort">
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </Select>
                </label>
                <Button type="submit" variant="outline" disabled={loading}>Apply log filters</Button>
              </form>
            )
          : null}
        {error ? <p role="alert">{error}</p> : null}
        {loading && !result
          ? (
              <p role="status" className={styles.muted}>
                Loading…
              </p>
            )
          : null}
        {result
          ? (
              <>
                <Fields fields={result.fields} />
                {result.rows.map((row, index) => (
                  <div className={styles.record} key={index}>
                    <Fields fields={row} />
                  </div>
                ))}
                {paginated
                  ? (
                      <div className={styles.actions}>
                        <Button variant="outline" disabled={loading || page <= 1} onClick={() => setPage(value => value - 1)}>Previous page</Button>
                        <span>
                          Page
                          {page}
                          {' '}
                          of
                          {String(result.data?.totalPages || 1)}
                        </span>
                        <Button variant="outline" disabled={loading || page >= Number(result.data?.totalPages || 1)} onClick={() => setPage(value => value + 1)}>Next page</Button>
                      </div>
                    )
                  : null}
                <SettingsEditor
                  key={`${endpoint}-${revision}`}
                  resource={resource}
                  result={result}
                  endpoint={endpoint}
                  session={session}
                  onExpired={onExpired}
                  onSaved={() => {
                    setResult(null);
                    setRevision(value => value + 1);
                  }}
                />
                {!result.fields.length && !result.rows.length
                  ? (
                      <p className={styles.muted}>No details are available yet.</p>
                    )
                  : null}
              </>
            )
          : null}
      </CardContent>
    </Card>
  );
}

function DomainStatus({ status }: { status: string }) {
  const value = status.toLowerCase();
  const state
    = value === 'active'
      ? 'ok'
      : /pending|awaiting/.test(value)
        ? 'warn'
        : /error|failed/.test(value)
          ? 'bad'
          : 'unknown';
  const label = status.replaceAll('_', ' ');
  return <Pill state={state}>{label.charAt(0).toUpperCase() + label.slice(1)}</Pill>;
}

function DashboardHeader({ onLogout, busy }: { onLogout?: () => void; busy?: boolean }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <ShieldCheck size={32} weight="fill" aria-hidden="true" />
          <span>
            Citadel
            <small>by StealthRDP</small>
          </span>
        </Link>
        <div className={styles.headerActions}>
          <Button asChild variant="ghost">
            <Link href="/citadel/docs">Documentation</Link>
          </Button>
          {onLogout
            ? (
                <Button variant="outline" onClick={onLogout} disabled={busy}>
                  <SignOut size={20} aria-hidden="true" />
                  Sign out
                </Button>
              )
            : null}
        </div>
      </div>
    </header>
  );
}

function AccessGate({ expired = false }: { expired?: boolean }) {
  return (
    <div className={styles.shell}>
      <DashboardHeader />
      <main className={styles.gate}>
        <Badge variant="outline">Customer dashboard</Badge>
        <h1>Citadel dashboard</h1>
        <p>One place for your domains, protection settings and website traffic.</p>
        <Card className={styles.gateCard}>
          <CardHeader>
            <div className={styles.gateHeading}>
              <ShieldCheck size={32} weight="fill" aria-hidden="true" />
              <CardTitle>Your StealthRDP account. Your protection.</CardTitle>
            </div>
            <CardDescription>
              {expired
                ? 'Your session has ended. Customer sign-in will be available here once setup is complete.'
                : 'Customer access is being prepared. You’ll use your existing StealthRDP account to sign in here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Registration and account management stay in the StealthRDP Client Area.</p>
            <div className={styles.actions}>
              <Button disabled>StealthRDP sign-in coming soon</Button>
              <Button asChild variant="outline">
                <a href="https://dash.stealthrdp.com">Open Client Area</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

const navigation: { id: string; label: string; icon: Icon }[] = [
  { id: 'overview', label: 'Overview', icon: SquaresFour },
  { id: 'domains', label: 'Domains', icon: Globe },
  { id: 'traffic', label: 'Traffic', icon: ChartLine },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
];

export function CitadelDashboard() {
  const [session, setSession] = useState<SessionView | null>(null);
  const [domains, setDomains] = useState<DomainView[]>([]);
  const [view, setView] = useState('overview');
  const [selected, setSelected] = useState<DomainView | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [confirmation, setConfirmation] = useState<'remove' | 'restore-defaults' | null>(null);
  const [revision, setRevision] = useState(0);
  // Stable identity prevents panels from restarting their requests on every UI state change.
  const [onExpired] = useState(() => () => {
    setSession(null);
    setDomains([]);
    setSelected(null);
    setExpired(true);
  });

  useEffect(() => {
    const controller = new AbortController();
    api<SessionView>('session', { signal: controller.signal })
      .then((identity) => {
        return api<{ domains: DomainView[] }>(`organisations/${identity.organisation.id}/domains`, {
          signal: controller.signal,
        }).then((data) => {
          setSession(identity);
          setDomains(data.domains);
        });
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (failure instanceof DashboardError && failure.status === 401) {
          setSession(null);
        } else {
          setFailed(true);
          setMessage(failure instanceof Error ? failure.message : 'Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [onExpired]);

  useEffect(() => {
    if (!session) {
      return;
    }
    const remaining = session.expiresAt * 1000 - Date.now();
    if (remaining <= 0) {
      onExpired();
      return;
    }
    const timer = setTimeout(onExpired, remaining);
    return () => clearTimeout(timer);
  }, [session, onExpired]);

  const base = `organisations/${session?.organisation.id}`;

  async function refreshDomains() {
    const data = await api<{ domains: DomainView[] }>(`${base}/domains`);
    setDomains(data.domains);
    if (selected) {
      setSelected(data.domains.find(domain => domain.id === selected.id) || null);
    }
  }

  async function perform(action: DomainAction) {
    if (!session || !selected || busy) {
      return;
    }
    setBusy(true);
    setMessage('');
    setFailed(false);
    setConfirmation(null);
    try {
      const endpoint = `${base}/domains/${selected.id}${action === 'remove' ? '' : `/${action}`}`;
      const result = await api<ResourceView>(endpoint, {
        method: action === 'remove' ? 'DELETE' : 'POST',
        headers: { 'X-Citadel-CSRF': session.csrf },
      });
      const note = result.fields.map(field => `${field.label}: ${field.value}`).join(' · ');
      setMessage(action === 'remove' ? 'Domain removed.' : note || 'Action completed.');
      if (action === 'remove') {
        setSelected(null);
      }
      setRevision(value => value + 1);
      await refreshDomains();
    } catch (failure) {
      if (failure instanceof DashboardError && failure.status === 401) {
        onExpired();
      }
      setFailed(true);
      setMessage(failure instanceof Error ? failure.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!session) {
      return;
    }
    setBusy(true);
    try {
      await api('logout', { method: 'POST', headers: { 'X-Citadel-CSRF': session.csrf } });
      onExpired();
    } catch (failure) {
      if (failure instanceof DashboardError && failure.status === 401) {
        onExpired();
      } else {
        setFailed(true);
        setMessage('Sign-out could not complete. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.shell}>
        <DashboardHeader />
        <main className={styles.loading} aria-busy="true" role="status">
          Preparing your dashboard…
        </main>
      </div>
    );
  }
  if (!session) {
    return (
      <>
        <AccessGate expired={expired} />
        {failed
          ? (
              <p className={styles.message} role="alert">
                {message}
              </p>
            )
          : null}
      </>
    );
  }

  const canWrite = session.role !== 'member';
  const visibleDomains = domains.filter(domain => domain.name.toLowerCase().includes(query.toLowerCase()));
  const resourcePanels = (resources: readonly { path: string; title: string }[], prefix = base) => (
    <div className={styles.grid}>
      {resources.map(resource => (
        <ResourcePanel
          key={`${resource.path}-${revision}`}
          title={resource.title}
          resource={resource.path}
          session={session}
          endpoint={`${prefix}/${resource.path}`}
          onExpired={onExpired}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.shell}>
      <DashboardHeader onLogout={logout} busy={busy} />
      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <div className={styles.organisation}>
            <Badge variant="outline">{session.role}</Badge>
            <strong>{session.organisation.name}</strong>
            <small>{session.email}</small>
          </div>
          <nav aria-label="Citadel dashboard" className={styles.navigation}>
            {navigation.map(({ id, label, icon: Glyph }) => (
              <Button
                className={styles.navButton}
                key={id}
                variant={view === id ? 'secondary' : 'ghost'}
                aria-current={view === id ? 'page' : undefined}
                onClick={() => {
                  setView(id);
                  setSelected(null);
                  setMessage('');
                }}
              >
                <Glyph size={20} aria-hidden="true" />
                {label}
              </Button>
            ))}
          </nav>
          <p className={styles.footerNote}>Citadel protects your HTTP and HTTPS applications.</p>
        </aside>
        <main className={styles.main}>
          <div className={styles.intro}>
            <div>
              <Badge variant="outline">Layer 7 protection</Badge>
              <h1>{navigation.find(item => item.id === view)?.label}</h1>
              <p>
                {view === 'overview'
                  ? 'Your websites and protection at a glance.'
                  : view === 'domains'
                    ? 'Check connections and inspect protection for each website.'
                    : view === 'traffic'
                      ? 'Review traffic reaching your websites and origins.'
                      : 'Your service, team and notification preferences.'}
              </p>
            </div>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await refreshDomains();
                  setRevision(value => value + 1);
                } catch (failure) {
                  if (failure instanceof DashboardError && failure.status === 401) {
                    onExpired();
                  }
                  setFailed(true);
                  setMessage(failure instanceof Error ? failure.message : 'Please try again.');
                } finally {
                  setBusy(false);
                }
              }}
            >
              <ArrowsClockwise size={20} aria-hidden="true" />
              Refresh
            </Button>
          </div>
          {message
            ? (
                <div className={styles.message} data-error={failed} role={failed ? 'alert' : 'status'}>
                  {message}
                </div>
              )
            : null}
          {(view === 'overview' || view === 'domains') && !selected
            ? (
                <>
                  <div className={styles.stats}>
                    {[
                      { label: 'Domains', value: domains.length, icon: Globe },
                      {
                        label: 'Active',
                        value: domains.filter(domain => domain.status.toLowerCase() === 'active').length,
                        icon: CheckCircle,
                      },
                      {
                        label: 'Awaiting connection',
                        value: domains.filter(domain => /awaiting|pending/i.test(domain.status)).length,
                        icon: Clock,
                      },
                    ].map(({ label, value, icon: Glyph }) => (
                      <Card key={label}>
                        <CardContent>
                          <span className={styles.statLabel}>
                            <Glyph size={20} aria-hidden="true" />
                            {label}
                          </span>
                          <strong className={styles.statValue}>{value}</strong>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {view === 'domains'
                    ? (
                        <Card>
                          <CardHeader><CardTitle>Add a website</CardTitle></CardHeader>
                          <CardContent>
                            <SettingsEditor
                              resource="domains"
                              result={{ fields: [], rows: [] }}
                              endpoint={`${base}/domains`}
                              session={session}
                              onExpired={onExpired}
                              onSaved={() => {
                                setRevision(value => value + 1);
                                void refreshDomains().catch(() => setMessage('Refresh to load your new domain.'));
                              }}
                              key={`add-${revision}`}
                            />
                          </CardContent>
                        </Card>
                      )
                    : null}
                  <div className={styles.toolbar}>
                    <h2>Your domains</h2>
                    <Input
                      className={styles.search}
                      aria-label="Search domains"
                      placeholder="Search domains…"
                      value={query}
                      onChange={event => setQuery(event.target.value)}
                      type="search"
                    />
                  </div>
                  <Card className={styles.domainList}>
                    {visibleDomains.length
                      ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Protection</TableHead>
                                <TableHead>Cloudflare DNS</TableHead>
                                <TableHead>Manage</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {visibleDomains.map(domain => (
                                <TableRow key={domain.id}>
                                  <TableCell>
                                    <Button variant="link" className={styles.domainName} onClick={() => setSelected(domain)}>
                                      {domain.name}
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <DomainStatus status={domain.status} />
                                  </TableCell>
                                  <TableCell>{domain.dnsStatus ? <DomainStatus status={domain.dnsStatus} /> : 'Unknown'}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelected(domain)}
                                      aria-label={`Manage ${domain.name}`}
                                    >
                                      Manage
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )
                      : (
                          <div className={styles.empty}>
                            <Globe size={32} aria-hidden="true" />
                            <h2>{query ? 'No matching domains' : 'No domains yet'}</h2>
                            <p className={styles.muted}>
                              {query ? 'Try another domain name.' : 'Your domains will appear here once added to Citadel.'}
                            </p>
                          </div>
                        )}
                  </Card>
                  {view === 'overview'
                    ? resourcePanels(
                        accountResources.filter(resource => ['service', 'service/bandwidth'].includes(resource.path)),
                      )
                    : null}
                </>
              )
            : null}
          {selected
            ? (
                <>
                  <div className={styles.domainHeading}>
                    <Button variant="ghost" onClick={() => setSelected(null)}>
                      Back to domains
                    </Button>
                    <h2>{selected.name}</h2>
                    <DomainStatus status={selected.status} />
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline" disabled={!canWrite || busy} onClick={() => perform('refresh')}>
                      Check connection
                    </Button>
                    <Button variant="outline" disabled={!canWrite || busy} onClick={() => perform('protection')}>
                      Repair protection
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!canWrite || busy}
                      onClick={() => setConfirmation('restore-defaults')}
                    >
                      Restore defaults
                    </Button>
                    <Button variant="destructive" disabled={!canWrite || busy} onClick={() => setConfirmation('remove')}>
                      Remove domain
                    </Button>
                  </div>
                  <div className={styles.notice}>
                    <Info size={20} aria-hidden="true" />
                    <span>
                      {canWrite ? 'Review and confirm changes before applying them. Each tab contains the settings for this domain.' : 'Your organisation role limits you to viewing settings.'}
                    </span>
                  </div>
                  <Tabs
                    key={selected.id}
                    items={[
                      { id: 'security', label: 'Security' },
                      { id: 'origin', label: 'Origins' },
                      { id: 'delivery', label: 'Delivery' },
                      { id: 'activity', label: 'Activity' },
                    ].map(group => ({
                      ...group,
                      content: resourcePanels(
                        domainResources.filter(resource => resource.group === group.id),
                        `${base}/domains/${selected.id}`,
                      ),
                    }))}
                  />
                </>
              )
            : null}
          {view === 'traffic' ? <TrafficPanel base={base} domains={domains} onExpired={onExpired} /> : null}
          {view === 'settings'
            ? (
                <>
                  <div className={styles.notice}>
                    <Info size={20} aria-hidden="true" />
                    <span>
                      Account creation and billing are managed in the
                      <a href="https://dash.stealthrdp.com">StealthRDP Client Area</a>
                      . Identity and team access remain managed there. Organisation email alerts can be edited below.
                    </span>
                  </div>
                  {resourcePanels(
                    accountResources.filter(
                      resource => !resource.path.startsWith('analytics') && resource.path !== 'service/bandwidth',
                    ),
                  )}
                </>
              )
            : null}
        </main>
      </div>
      <Dialog
        open={confirmation !== null}
        onClose={() => setConfirmation(null)}
        title={confirmation === 'remove' ? 'Remove this domain?' : 'Restore protection defaults?'}
      >
        <p>
          {confirmation === 'remove'
            ? `Removing ${selected?.name} stops its Citadel protection. Update your Cloudflare DNS routing before removing it.`
            : `Restore the default protection settings for ${selected?.name}? This replaces its current protection configuration.`}
        </p>
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setConfirmation(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={() => {
              if (confirmation) {
                void perform(confirmation);
              }
            }}
          >
            {confirmation === 'remove' ? 'Remove domain' : 'Restore defaults'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
