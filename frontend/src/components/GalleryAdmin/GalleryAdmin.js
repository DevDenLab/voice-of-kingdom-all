import React, { useCallback, useEffect, useRef, useState } from 'react';
import './GalleryAdmin.css';
import { apiFetch } from '../../lib/api';
import { galleryUrl } from '../../lib/imageUrl';

const SESSION_URL = '/api/gallery/session/';
const LOGIN_URL = '/api/gallery/login/';
const LOGOUT_URL = '/api/gallery/logout/';
const MANAGE_URL = '/api/gallery/manage/';
const SECTIONS_URL = '/api/gallery/sections/';
const UPLOAD_URL = '/api/gallery/upload/';
const DELETE_URL = '/api/gallery/delete/';

const GalleryAdmin = () => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');

  // login form
  const [form, setForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // gallery state
  const [sections, setSections] = useState([]); // [{slug,title,count,editable}]
  const [images, setImages] = useState([]); // [{key,section,size,last_modified}]
  const [activeSlug, setActiveSlug] = useState(null);
  const [listError, setListError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null); // { uploaded: [], errors: [] }
  const [dragOver, setDragOver] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [sectionBusy, setSectionBusy] = useState(false);
  const [sectionError, setSectionError] = useState('');
  const fileInputRef = useRef(null);

  // ---- session ----
  useEffect(() => {
    apiFetch(SESSION_URL)
      .then((data) => {
        setAuthed(Boolean(data?.authenticated));
        setUsername(data?.username || '');
      })
      .catch(() => setAuthed(false))
      .finally(() => setCheckingSession(false));
  }, []);

  const loadData = useCallback(() => {
    setListError('');
    return apiFetch(MANAGE_URL)
      .then((data) => {
        const secs = data?.sections || [];
        setSections(secs);
        setImages(data?.images || []);
        setActiveSlug((cur) => {
          if (cur !== null && secs.some((s) => s.slug === cur)) return cur;
          return secs.length ? secs[0].slug : null;
        });
      })
      .catch((err) => setListError(err.message));
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ---- auth actions ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await apiFetch(SESSION_URL); // ensure CSRF cookie
      const data = await apiFetch(LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setAuthed(true);
      setUsername(data?.username || form.username);
      setForm({ username: '', password: '' });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch(LOGOUT_URL, { method: 'POST' });
    } catch (_) {
      /* ignore */
    }
    setAuthed(false);
    setUsername('');
    setSections([]);
    setImages([]);
    setActiveSlug(null);
    setResults(null);
  };

  // ---- sections ----
  const createSection = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setSectionBusy(true);
    setSectionError('');
    try {
      const created = await apiFetch(SECTIONS_URL, {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      setNewTitle('');
      await loadData();
      if (created?.slug) setActiveSlug(created.slug);
    } catch (err) {
      setSectionError(err.message);
    } finally {
      setSectionBusy(false);
    }
  };

  const deleteSection = async (section) => {
    const msg =
      section.count > 0
        ? `Delete the "${section.title}" section AND its ${section.count} image(s)? This cannot be undone.`
        : `Delete the empty "${section.title}" section?`;
    if (!window.confirm(msg)) return;
    try {
      await apiFetch(SECTIONS_URL, {
        method: 'DELETE',
        body: JSON.stringify({ slug: section.slug }),
      });
      setActiveSlug(null);
      await loadData();
    } catch (err) {
      alert(`Could not delete section: ${err.message}`);
    }
  };

  // ---- upload ----
  const uploadFiles = useCallback(
    async (fileList) => {
      if (!activeSlug) {
        setResults({ uploaded: [], errors: [{ name: '—', error: 'Pick a section first.' }] });
        return;
      }
      const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
      if (files.length === 0) {
        setResults({ uploaded: [], errors: [{ name: '—', error: 'No image files selected.' }] });
        return;
      }
      const fd = new FormData();
      fd.append('section', activeSlug);
      files.forEach((f) => fd.append('files', f));

      setUploading(true);
      setResults(null);
      try {
        const data = await apiFetch(UPLOAD_URL, { method: 'POST', body: fd });
        setResults(data);
        await loadData();
      } catch (err) {
        setResults({ uploaded: [], errors: [{ name: '—', error: err.message }] });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [activeSlug, loadData]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!uploading) uploadFiles(e.dataTransfer.files);
  };

  const handleDeleteImage = async (key) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await apiFetch(DELETE_URL, { method: 'DELETE', body: JSON.stringify({ key }) });
      await loadData();
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  // ---- render ----
  if (checkingSession) {
    return (
      <div className="ga-wrap">
        <p className="ga-muted">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="ga-wrap">
        <div className="ga-login">
          <h1>Gallery Admin</h1>
          <p className="ga-muted">Sign in with your VOKIM admin account.</p>
          <form onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
            {loginError && <p className="ga-error">{loginError}</p>}
            <button type="submit" disabled={loggingIn}>
              {loggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeSection = sections.find((s) => s.slug === activeSlug) || null;
  const activeImages = images.filter((img) => img.section === activeSlug);

  return (
    <div className="ga-wrap">
      <div className="ga-header">
        <div>
          <h1>Gallery Admin</h1>
          <a className="ga-link" href="/gallery">
            &larr; Back to gallery
          </a>
        </div>
        <div className="ga-user">
          <span className="ga-muted">Signed in as {username}</span>
          <button type="button" className="ga-link" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* --- sections --- */}
      <h2 className="ga-subhead">Sections</h2>
      {listError && <p className="ga-error">{listError}</p>}
      <div className="ga-sections">
        {sections.map((s) => (
          <button
            key={s.slug || 'root'}
            type="button"
            className={`ga-tab ${s.slug === activeSlug ? 'is-active' : ''}`}
            onClick={() => setActiveSlug(s.slug)}
          >
            {s.title} <span className="ga-count">{s.count}</span>
          </button>
        ))}
        {sections.length === 0 && (
          <span className="ga-muted">No sections yet — create one below.</span>
        )}
      </div>

      <form className="ga-newsection" onSubmit={createSection}>
        <input
          type="text"
          placeholder="New section name, e.g. Vokim 2024"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" disabled={sectionBusy || !newTitle.trim()}>
          {sectionBusy ? 'Creating…' : 'Create section'}
        </button>
      </form>
      {sectionError && <p className="ga-error">{sectionError}</p>}

      {/* --- upload into the active section --- */}
      {activeSection && (
        <>
          <h2 className="ga-subhead">
            {activeSection.title}
            {activeSection.editable && (
              <button
                type="button"
                className="ga-del ga-del-section"
                onClick={() => deleteSection(activeSection)}
              >
                Delete section
              </button>
            )}
          </h2>

          {activeSection.editable ? (
            <div
              className={`ga-drop ${dragOver ? 'is-over' : ''} ${uploading ? 'is-busy' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <p>
                {uploading
                  ? 'Uploading…'
                  : `Drag images here, or click to choose — added to "${activeSection.title}"`}
              </p>
              <span className="ga-muted">JPG, PNG, WebP, GIF, AVIF · up to 15 MB each</span>
            </div>
          ) : (
            <p className="ga-muted">
              These images were added before sections existed. Create a section and
              re-upload them there, or just delete the ones you don't want.
            </p>
          )}

          {results && (
            <div className="ga-results">
              {results.uploaded?.map((u) => (
                <p key={u.key} className="ga-ok">
                  &#10003; {u.name}
                </p>
              ))}
              {results.errors?.map((er, i) => (
                <p key={i} className="ga-error">
                  &#10007; {er.name}: {er.error}
                </p>
              ))}
            </div>
          )}

          <div className="ga-grid">
            {activeImages.map((img) => (
              <figure key={img.key} className="ga-item">
                <img src={galleryUrl(img.key)} alt={img.key} loading="lazy" />
                <figcaption>
                  <span title={img.key}>{img.key.split('/').pop()}</span>
                  <button
                    type="button"
                    className="ga-del"
                    onClick={() => handleDeleteImage(img.key)}
                  >
                    Delete
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
          {activeImages.length === 0 && activeSection.editable && (
            <p className="ga-muted">No images in this section yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryAdmin;
