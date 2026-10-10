import { useCallback, useEffect, useState } from 'react';

/**
 * Editable site content served by GET /api/site-content/ :
 *   { highlights: [key], poster: { key, show_countdown }, team: [{id,name,role,photo}] }
 *
 * `status` is "loading" until the first response settles; on failure `content`
 * stays at the empty defaults so pages can fall back gracefully.
 */
export const EMPTY_EVENT = {
  enabled: false,
  label: 'UPCOMING EVENT',
  title: 'VOKIM EXPERIENCE 2027',
  subtitle: 'A Night of African Praise',
  date: '',
  time: '',
  time_notes: '',
  location: '',
  admission: 'FREE',
  registration_open: false,
  registration_url: '',
  registration_prompt: 'Click the link below to register for free:',
  registration_label: 'REGISTER FOR FREE →',
  countdown_date: '',
};

export const EMPTY_CONTENT = {
  highlights: [],
  poster: { key: null, show_countdown: false },
  team: [],
  event: EMPTY_EVENT,
};

export const mergeContent = (data) => ({
  ...EMPTY_CONTENT,
  ...data,
  poster: { ...EMPTY_CONTENT.poster, ...(data?.poster || {}) },
  event: { ...EMPTY_EVENT, ...(data?.event || {}) },
});

export function useSiteContent() {
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/site-content/', { cache: 'no-cache', credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setContent(mergeContent(data));
      setStatus('ready');
    } catch (err) {
      console.error('Could not load site content:', err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { content, status, reload };
}
