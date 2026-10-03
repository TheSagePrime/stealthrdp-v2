'use client';

import type { JsonValue, ResourceView, SessionView } from './catalog';
import type { FieldSpec, FormSpec } from './forms';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import styles from './CitadelDashboard.module.css';
import { formSpecs, scheduleEditSpec } from './forms';

type Values = Record<string, JsonValue>;
function isRecord(value: JsonValue | undefined): value is Values {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function initialValues(fields: FieldSpec[], data: Values = {}): Values {
  return Object.fromEntries(fields.map((field) => {
    const value = data[field.key] ?? field.initial;
    if (field.kind === 'records') {
      return [field.key, Array.isArray(value) ? value.filter(isRecord).map(row => initialValues(field.fields || [], row)) : []];
    }
    if (field.kind === 'list' || field.kind === 'numbers') {
      return [field.key, Array.isArray(value) ? value.join('\n') : ''];
    }
    if (field.kind === 'boolean') {
      return [field.key, value === true];
    }
    return [field.key, value === undefined ? '' : String(value)];
  }));
}
function payload(fields: FieldSpec[], values: Values): Record<string, unknown> {
  return Object.fromEntries(fields.flatMap((field): [string, unknown][] => {
    const value = values[field.key];
    if (field.optional && value === '' && field.key !== 'match') {
      return [];
    }
    if (field.kind === 'number' || field.key === 'minutes') {
      return [[field.key, Number(value)]];
    }
    if (field.kind === 'list' || field.kind === 'numbers') {
      const items = String(value || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
      return [[field.key, field.kind === 'numbers' ? items.map(Number) : items]];
    }
    if (field.kind === 'records') {
      return [[field.key, Array.isArray(value) ? value.filter(isRecord).map(row => payload(field.fields || [], row)) : []]];
    }
    return [[field.key, value]];
  }));
}
function optionsFor(field: FieldSpec, data: Values): { value: string; label: string }[] {
  if (field.options) {
    return field.options.map(value => ({ value, label: value.replaceAll('_', ' ') }));
  }
  const options = data[field.optionsFrom || ''];
  if (!Array.isArray(options)) {
    return [];
  }
  return options.flatMap((item) => {
    if (typeof item === 'string') {
      return [{ value: item, label: item }];
    }
    if (isRecord(item)) {
      const value = String(item.id || item.hostname || '');
      return value ? [{ value, label: String(item.label || item.hostname || value) }] : [];
    }
    return [];
  });
}
function FormFields({ fields, values, setValues, data, prefix }: { fields: FieldSpec[]; values: Values; setValues: (values: Values) => void; data: Values; prefix: string }) {
  return fields.map((field) => {
    const id = `${prefix}-${field.key}`;
    const value = values[field.key];
    const options = optionsFor(field, data);
    const set = (next: JsonValue) => setValues({ ...values, [field.key]: next });
    if (field.kind === 'records') {
      const rows = Array.isArray(value) ? value.filter(isRecord) : [];
      return (
        <fieldset className={styles.formGroup} key={field.key}>
          <legend>{field.label}</legend>
          {rows.map((row, index) => (
            <div className={styles.record} key={`${id}-${index}`}>
              <FormFields fields={field.fields || []} values={row} data={data} prefix={`${id}-${index}`} setValues={next => set(rows.map((item, i) => i === index ? next : item))} />
              {field.key !== 'origins'
                ? (
                    <Button type="button" variant="outline" onClick={() => set(rows.filter((_, i) => i !== index))}>{`Remove ${field.label.toLowerCase()} row ${index + 1}`}</Button>
                  )
                : null}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => set([...rows, initialValues(field.fields || [])])}>{`Add ${field.label.toLowerCase()} row`}</Button>
        </fieldset>
      );
    }
    const text = typeof value === 'string' ? value : '';
    return (
      <div className={styles.formField} key={field.key}>
        <label htmlFor={id}>{field.label}</label>
        {field.kind === 'boolean'
          ? <Input id={id} className={styles.checkbox} type="checkbox" checked={value === true} onChange={event => set(event.target.checked)} />
          : field.kind === 'select'
            ? (
                <Select id={id} value={text} required={!field.optional} onChange={event => set(event.target.value)}>
                  <option value="">Choose…</option>
                  {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              )
            : ['list', 'numbers', 'textarea'].includes(field.kind || '')
                ? <Textarea id={id} rows={field.kind === 'textarea' ? 12 : 3} value={text} required={field.kind === 'textarea'} maxLength={field.kind === 'textarea' ? 40000 : 10000} aria-describedby={field.help ? `${id}-help` : undefined} onChange={event => set(event.target.value)} />
                : <Input id={id} type={field.kind === 'number' ? 'number' : 'text'} min={field.min} max={field.max} step={field.step || 1} maxLength={500} required={!field.optional && !['reason', 'id'].includes(field.key)} readOnly={field.key === 'id'} value={text} onChange={event => set(event.target.value)} />}
        {field.help ? <small id={`${id}-help`}>{field.help}</small> : null}
        {options.length && field.kind === 'list'
          ? (
              <small>
                Available:
                {options.map(option => `${option.label} (${option.value})`).join(', ')}
              </small>
            )
          : null}
      </div>
    );
  });
}
function EditForm({ spec, data, endpoint, session, onSaved, onExpired }: { spec: FormSpec; data: Values; endpoint: string; session: SessionView; onSaved: () => void; onExpired: () => void }) {
  const id = useId();
  const [values, setValues] = useState(() => initialValues(spec.fields, spec.fresh ? {} : data));
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ready = spec.fresh || spec.fields.every(field => field.optional || data[field.key] !== undefined || ['auto_baseline'].includes(field.key));
  async function submit() {
    setBusy(true);
    setError('');
    setConfirming(false);
    try {
      const body = payload(spec.fields, values);
      if (body.level !== 'auto') {
        delete body.auto_baseline;
      }
      if (body.level === 'js') {
        body.js_difficulty = 'normal';
      }
      const query = spec.query ? `?${new URLSearchParams({ [spec.query]: String(body[spec.query]) })}` : '';
      const hasBody = !spec.query && !(spec.method === 'DELETE' && !spec.fields.length);
      const response = await fetch(`/api/citadel/${endpoint}${query}`, {
        method: spec.method,
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        headers: { 'X-Citadel-CSRF': session.csrf, ...(hasBody ? { 'Content-Type': 'application/json' } : {}) },
        ...(hasBody ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json();
      if (response.status === 401) {
        onExpired();
      }
      if (!response.ok) {
        throw new Error(result.error || 'Unable to save. Please try again.');
      }
      onSaved();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Unable to save.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.editor}>
      <form onSubmit={(event) => {
        event.preventDefault();
        setConfirming(true);
      }}
      >
        <fieldset disabled={busy || session.role === 'member' || !ready} className={styles.formGroup}>
          <legend>{spec.title}</legend>
          {spec.note ? <p className={styles.muted}>{spec.note}</p> : null}
          <FormFields fields={spec.fields} values={values} setValues={setValues} data={data} prefix={id} />
          <Button type="submit" variant={spec.method === 'DELETE' ? 'destructive' : 'default'}>{busy ? 'Saving…' : spec.title}</Button>
        </fieldset>
      </form>
      {!ready ? <p className={styles.muted}>Refresh to load the current settings before editing.</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <Dialog title={`${spec.title}?`} open={confirming} onClose={() => setConfirming(false)}>
        <p>
          Apply this change to your organisation
          {endpoint.includes('/domains/') ? ' and the selected domain' : ''}
          ?
        </p>
        {spec.note ? <p>{spec.note}</p> : null}
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button>
          <Button disabled={busy} onClick={() => void submit()}>Confirm change</Button>
        </div>
      </Dialog>
    </div>
  );
}

export function SettingsEditor({ resource, result, endpoint, session, onSaved, onExpired }: { resource: string; result: ResourceView; endpoint: string; session: SessionView; onSaved: () => void; onExpired: () => void }) {
  const data = result.data || {};
  const [editSchedule, setEditSchedule] = useState<Values | null>(null);
  const forms = formSpecs[resource] || [];
  const removableItems = Array.isArray(data[resource === 'api-keys' ? 'keys' : 'webhooks']) ? (data[resource === 'api-keys' ? 'keys' : 'webhooks'] as JsonValue[]).filter(isRecord) : [];
  const schedules = Array.isArray(data.schedules) ? data.schedules.filter(isRecord) : [];
  return (
    <>
      {resource === 'branding' && isRecord(data.shells)
        ? Object.entries(data.shells).map(([type, html]) => (
            <details key={type} className={styles.record}>
              <summary>
                {type.replaceAll('_', ' ')}
                {' '}
                shell
              </summary>
              <pre className={styles.shellCode}>{String(html)}</pre>
            </details>
          ))
        : null}
      {removableItems.filter(item => !item.revoked_at).map(item => (
        <div className={styles.record} key={String(item.id)}>
          <strong>{String(item.name)}</strong>
          <EditForm spec={{ title: resource === 'api-keys' ? 'Revoke API key' : 'Remove webhook', method: 'DELETE', fresh: true, query: 'id', fields: [{ key: 'id', label: 'Item ID', initial: String(item.id) }], note: resource === 'api-keys' ? 'Scripts using this key will stop working.' : 'Security alerts will stop going to this destination.' }} data={data} endpoint={endpoint} session={session} onSaved={onSaved} onExpired={onExpired} />
        </div>
      ))}
      {schedules.map(schedule => (
        <div className={styles.record} key={String(schedule.id)}>
          <strong>{String(schedule.name)}</strong>
          <p className={styles.muted}>
            {String(schedule.profileId)}
            {' '}
            ·
            {' '}
            {String(schedule.hourStart)}
            :00–
            {String(schedule.hourEnd)}
            :00 ·
            {' '}
            {String(schedule.timezone)}
          </p>
          <Button disabled={session.role === 'member'} variant="outline" onClick={() => setEditSchedule(schedule)}>Edit schedule</Button>
          <EditForm spec={{ title: 'Remove schedule', method: 'DELETE', fresh: true, query: 'id', fields: [{ key: 'id', label: 'Schedule ID', initial: String(schedule.id) }] }} data={data} endpoint={endpoint} session={session} onSaved={onSaved} onExpired={onExpired} />
        </div>
      ))}
      {editSchedule
        ? (
            <EditForm
              key={String(editSchedule.id)}
              spec={scheduleEditSpec}
              data={editSchedule}
              endpoint={endpoint}
              session={session}
              onSaved={() => {
                setEditSchedule(null);
                onSaved();
              }}
              onExpired={onExpired}
            />
          )
        : null}
      {forms.map(spec => (
        <details className={styles.editDisclosure} key={spec.title} open={resource === 'domains'}>
          <summary>{spec.title}</summary>
          <EditForm spec={spec} data={data} endpoint={spec.action ? endpoint.replace(/\/[^/]+$/, `/${spec.action}`) : endpoint} session={session} onSaved={onSaved} onExpired={onExpired} />
        </details>
      ))}
    </>
  );
}
