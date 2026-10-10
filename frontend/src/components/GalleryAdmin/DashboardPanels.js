import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { fullUrl, teamUrl, thumbUrl } from '../../lib/imageUrl';
import { EMPTY_CONTENT, mergeContent } from '../../lib/siteContent';
import { moveItem, useDragSort } from './Sortable';

const CONTENT_URL = '/api/site-content/';
const HIGHLIGHTS_URL = '/api/site/highlights/';
const POSTER_URL = '/api/site/poster/';
const TEAM_URL = '/api/site/team/';

// How many highlights the home page actually shows.
const HOME_HIGHLIGHT_COUNT = 6;

function useContent() {
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [loadError, setLoadError] = useState('');

  const reload = useCallback(async () => {
    try {
      const data = await apiFetch(CONTENT_URL);
      setContent(mergeContent(data));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { content, setContent, reload, loadError };
}

function Results({ results }) {
  if (!results) return null;
  return (
    <div className="ga-results">
      {results.uploaded?.map((u) => (
        <p key={u.key} className="ga-ok">&#10003; {u.name}</p>
      ))}
      {results.errors?.map((er, i) => (
        <p key={i} className="ga-error">&#10007; {er.name}: {er.error}</p>
      ))}
    </div>
  );
}

/** Drag-or-click image upload zone. Calls onFiles(File[]) with images only. */
function DropZone({ label, hint, multiple = true, busy, onFiles }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  const pick = (list) => {
    const files = Array.from(list || []).filter((f) => f.type.startsWith('image/'));
    if (files.length && !busy) onFiles(files);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`ga-drop ${over ? 'is-over' : ''} ${busy ? 'is-busy' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer.files);
      }}
      onClick={() => !busy && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => pick(e.target.files)}
      />
      <p>{busy ? 'Uploading…' : label}</p>
      <span className="ga-muted">{hint}</span>
    </div>
  );
}

const IMAGE_HINT = 'JPG, PNG, WebP, GIF, AVIF · up to 15 MB each';

// ---------------------------------------------------------------------------
// Event Highlights (home page collage)
// ---------------------------------------------------------------------------

export function HighlightsPanel() {
  const { content, setContent, reload, loadError } = useContent();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const keys = content.highlights;

  const save = async (next) => {
    setContent({ ...content, highlights: next });
    try {
      await apiFetch(HIGHLIGHTS_URL, { method: 'PUT', body: JSON.stringify({ keys: next }) });
    } catch (err) {
      alert(`Could not save the new order: ${err.message}`);
      await reload();
    }
  };

  const sort = useDragSort((from, to) => save(moveItem(keys, from, to)));

  const upload = async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    setUploading(true);
    setResults(null);
    try {
      setResults(await apiFetch(HIGHLIGHTS_URL, { method: 'POST', body: fd }));
    } catch (err) {
      setResults({ uploaded: [], errors: [{ name: '—', error: err.message }] });
    } finally {
      setUploading(false);
      await reload();
    }
  };

  const remove = async (key) => {
    if (!window.confirm('Remove this image from the home page highlights?')) return;
    try {
      await apiFetch(HIGHLIGHTS_URL, { method: 'DELETE', body: JSON.stringify({ key }) });
      await reload();
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <>
      <h2 className="ga-subhead">Event Highlights</h2>
      <p className="ga-muted ga-panel-note">
        These appear in the “Event Highlights” collage on the home page. The first{' '}
        {HOME_HIGHLIGHT_COUNT} are shown — drag to reorder. Until you add some here, the
        home page keeps showing its original photos.
      </p>
      {loadError && <p className="ga-error">{loadError}</p>}

      <DropZone
        label="Drag images here, or click to choose — added to Event Highlights"
        hint={IMAGE_HINT}
        busy={uploading}
        onFiles={upload}
      />
      <Results results={results} />

      <div className="ga-grid">
        {keys.map((key, idx) => (
          <figure
            key={key}
            className={`ga-item is-draggable ${sort.over === idx ? 'is-drop-target' : ''}`}
            {...sort.props(idx)}
          >
            <img src={thumbUrl(key)} alt={key} loading="lazy" draggable={false} />
            <figcaption>
              <span title={key}>
                {idx < HOME_HIGHLIGHT_COUNT ? `#${idx + 1} · on home` : `#${idx + 1} · hidden`}
              </span>
              <span className="ga-move">
                <button type="button" aria-label="Move earlier" disabled={idx === 0}
                  onClick={() => save(moveItem(keys, idx, idx - 1))}>&larr;</button>
                <button type="button" aria-label="Move later" disabled={idx === keys.length - 1}
                  onClick={() => save(moveItem(keys, idx, idx + 1))}>&rarr;</button>
              </span>
              <button type="button" className="ga-del" onClick={() => remove(key)}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>
      {keys.length === 0 && <p className="ga-muted">No highlights uploaded yet.</p>}
    </>
  );
}

// ---------------------------------------------------------------------------
// VOKIM Experience poster + countdown switch
// ---------------------------------------------------------------------------

export function PosterPanel() {
  const { content, reload, loadError } = useContent();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { key } = content.poster;

  const upload = async ([file]) => {
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    setError('');
    try {
      await apiFetch(POSTER_URL, { method: 'POST', body: fd });
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Remove the poster from the home page?')) return;
    try {
      await apiFetch(POSTER_URL, { method: 'DELETE' });
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2 className="ga-subhead">VOKIM Experience poster</h2>
      <p className="ga-muted ga-panel-note">
        Shown inside the Upcoming Event section of the home page (turn that section on in
        the “Upcoming Event” tab). Uploading a new poster replaces the current one.
      </p>
      {(loadError || error) && <p className="ga-error">{loadError || error}</p>}

      {key && (
        <div className="ga-poster">
          <img src={fullUrl(key)} alt="Current poster" />
          <button type="button" className="ga-del" onClick={remove}>Remove poster</button>
        </div>
      )}

      <DropZone
        label={key ? 'Drag a new poster here to replace it, or click to choose' : 'Drag the poster here, or click to choose'}
        hint={IMAGE_HINT}
        multiple={false}
        busy={uploading}
        onFiles={upload}
      />
      {!key && <p className="ga-muted">No poster yet — the home page shows the event details without one.</p>}
    </>
  );
}

// ---------------------------------------------------------------------------
// Upcoming Event block on the home page
// ---------------------------------------------------------------------------

const EVENT_URL = '/api/site/event/';

export function EventPanel() {
  const { content, reload, loadError } = useContent();
  const [form, setForm] = useState(content.event);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const event = content.event;

  // refresh the form whenever fresh data arrives from the server
  useEffect(() => {
    setForm(content.event);
  }, [content.event]);

  const set = (field) => (e) => {
    setSaved(false);
    setForm({ ...form, [field]: e.target.value });
  };

  // Switches save immediately -- no separate Save click needed.
  const flip = async (url, field, value) => {
    setError('');
    try {
      await apiFetch(url, { method: 'PATCH', body: JSON.stringify({ [field]: value }) });
      await reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const TEXT_FIELDS = [
    'label', 'title', 'subtitle', 'date', 'time', 'time_notes', 'location',
    'admission', 'registration_url', 'registration_prompt', 'registration_label', 'countdown_date',
  ];

  const save = async (e) => {
    e.preventDefault();
    const body = {};
    TEXT_FIELDS.forEach((f) => { body[f] = form[f] ?? ''; });
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await apiFetch(EVENT_URL, { method: 'PATCH', body: JSON.stringify(body) });
      await reload();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="ga-subhead">Upcoming Event</h2>
      <p className="ga-muted ga-panel-note">
        Controls the “Upcoming Event” block on the home page. Empty detail fields are simply
        not shown. The “Watch the VOKIM Experience” link always stays on the page.
      </p>
      {(loadError || error) && <p className="ga-error">{loadError || error}</p>}

      <label className="ga-switch">
        <input type="checkbox" checked={event.enabled} onChange={(e) => flip(EVENT_URL, 'enabled', e.target.checked)} />
        <span><strong>Show the Upcoming Event section</strong> (heading, poster, details)</span>
      </label>
      <label className="ga-switch">
        <input type="checkbox" checked={event.registration_open} onChange={(e) => flip(EVENT_URL, 'registration_open', e.target.checked)} />
        <span><strong>Registration is open</strong> — shows the register button (needs a link below)</span>
      </label>
      <label className="ga-switch">
        <input type="checkbox" checked={content.poster.show_countdown} onChange={(e) => flip(POSTER_URL, 'show_countdown', e.target.checked)} />
        <span><strong>Show the countdown</strong> at the top of the home page (needs a countdown date below)</span>
      </label>

      <form className="ga-eventform" onSubmit={save}>
        <label>Small heading <input type="text" maxLength={60} value={form.label} onChange={set('label')} /></label>
        <label>Event title <input type="text" maxLength={120} value={form.title} onChange={set('title')} /></label>
        <label>Subtitle <input type="text" maxLength={160} value={form.subtitle} onChange={set('subtitle')} /></label>
        <label>Date <input type="text" maxLength={120} placeholder="e.g. Saturday, June 26th, 2027" value={form.date} onChange={set('date')} /></label>
        <label>Time <input type="text" maxLength={120} placeholder="e.g. 4:00 PM – 6:00 PM" value={form.time} onChange={set('time')} /></label>
        <label>Time notes (one per line)
          <textarea rows={3} maxLength={600} placeholder={'Doors open at 3:15 PM'} value={form.time_notes} onChange={set('time_notes')} />
        </label>
        <label>Location (one line per row)
          <textarea rows={2} maxLength={300} placeholder={'15830 118 Ave NW\nEdmonton, AB'} value={form.location} onChange={set('location')} />
        </label>
        <label>Admission <input type="text" maxLength={60} placeholder="FREE" value={form.admission} onChange={set('admission')} /></label>
        <label>Registration link <input type="url" maxLength={500} placeholder="https://…" value={form.registration_url} onChange={set('registration_url')} /></label>
        <label>Text above the register button <input type="text" maxLength={200} value={form.registration_prompt} onChange={set('registration_prompt')} /></label>
        <label>Register button text <input type="text" maxLength={60} value={form.registration_label} onChange={set('registration_label')} /></label>
        <label>Countdown date &amp; time
          <input type="datetime-local" value={form.countdown_date} onChange={set('countdown_date')} />
        </label>
        <div className="ga-eventform-actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save event details'}</button>
          {saved && <span className="ga-ok">Saved ✓</span>}
        </div>
      </form>
    </>
  );
}

// ---------------------------------------------------------------------------
// Team members (/team page)
// ---------------------------------------------------------------------------

function TeamCard({ member, index, count, sort, onMove, onChanged, onError }) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role || '');
  const [busy, setBusy] = useState(false);
  const photoRef = useRef(null);
  const dirty = name.trim() !== member.name || role.trim() !== (member.role || '');

  const patch = async (fields) => {
    const fd = new FormData();
    fd.append('id', member.id);
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    setBusy(true);
    try {
      await apiFetch(TEAM_URL, { method: 'PATCH', body: fd });
      await onChanged();
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
      if (photoRef.current) photoRef.current.value = '';
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${member.name} from the team page?`)) return;
    try {
      await apiFetch(TEAM_URL, { method: 'DELETE', body: JSON.stringify({ id: member.id }) });
      await onChanged();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <figure className={`ga-item ga-member is-draggable ${sort.over === index ? 'is-drop-target' : ''}`} {...sort.props(index)}>
      {member.photo ? (
        <img src={teamUrl(member.photo)} alt={member.name} loading="lazy" draggable={false} />
      ) : (
        <div className="ga-nophoto">No photo</div>
      )}
      <div className="ga-member-body">
        <input type="text" value={name} maxLength={120} placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="text" value={role} maxLength={120} placeholder="Role (e.g. Lead vocals)" onChange={(e) => setRole(e.target.value)} />
        <div className="ga-member-actions">
          <button type="button" disabled={!dirty || !name.trim() || busy}
            onClick={() => patch({ name: name.trim(), role: role.trim() })}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" disabled={busy} onClick={() => photoRef.current?.click()}>
            {member.photo ? 'Change photo' : 'Add photo'}
          </button>
          <input ref={photoRef} type="file" accept="image/*" hidden
            onChange={(e) => e.target.files[0] && patch({ photo: e.target.files[0] })} />
        </div>
      </div>
      <figcaption>
        <span className="ga-move">
          <button type="button" aria-label="Move earlier" disabled={index === 0} onClick={() => onMove(index, index - 1)}>&larr;</button>
          <button type="button" aria-label="Move later" disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>&rarr;</button>
        </span>
        <button type="button" className="ga-del" onClick={remove}>Delete</button>
      </figcaption>
    </figure>
  );
}

export function TeamPanel() {
  const { content, setContent, reload, loadError } = useContent();
  const [form, setForm] = useState({ name: '', role: '' });
  const [photo, setPhoto] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const photoRef = useRef(null);
  const team = content.team;

  const saveOrder = async (next) => {
    setContent({ ...content, team: next });
    try {
      await apiFetch(TEAM_URL, { method: 'PUT', body: JSON.stringify({ ids: next.map((m) => m.id) }) });
    } catch (err) {
      setError(`Could not save the new order: ${err.message}`);
      await reload();
    }
  };

  const move = (from, to) => saveOrder(moveItem(team, from, to));
  const sort = useDragSort(move);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('role', form.role.trim());
    if (photo) fd.append('photo', photo);
    setAdding(true);
    setError('');
    try {
      await apiFetch(TEAM_URL, { method: 'POST', body: fd });
      setForm({ name: '', role: '' });
      setPhoto(null);
      if (photoRef.current) photoRef.current.value = '';
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <h2 className="ga-subhead">Team members</h2>
      <p className="ga-muted ga-panel-note">
        Shown on the “Meet the Team” page, in the order below — drag to reorder.
      </p>
      {(loadError || error) && <p className="ga-error">{loadError || error}</p>}

      <form className="ga-newsection ga-newmember" onSubmit={add}>
        <input type="text" placeholder="Name" maxLength={120} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Role (optional)" maxLength={120} value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <input ref={photoRef} type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0] || null)} />
        <button type="submit" disabled={adding || !form.name.trim()}>{adding ? 'Adding…' : 'Add member'}</button>
      </form>

      <div className="ga-grid">
        {team.map((m, i) => (
          <TeamCard
            key={m.id}
            member={m}
            index={i}
            count={team.length}
            sort={sort}
            onMove={move}
            onChanged={reload}
            onError={setError}
          />
        ))}
      </div>
      {team.length === 0 && <p className="ga-muted">No team members yet.</p>}
    </>
  );
}
