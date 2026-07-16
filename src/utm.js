// utm.js — captures utm_source/utm_medium/utm_campaign/utm_content from the
// current URL so every form submission arrives labeled with exactly which
// email/link brought the visitor. This app uses hash routing (#/review?...),
// so the query string lives inside window.location.hash, not
// window.location.search — that's the part most trackers get wrong here.
// Falls back to "(direct)" when absent, and persists to sessionStorage so
// the tag survives if the visitor clicks through to another page
// (e.g. /review -> /audit) before submitting.
export function captureUTM() {
  const hash = window.location.hash || '';
  const qIndex = hash.indexOf('?');
  const queryString = qIndex >= 0 ? hash.slice(qIndex + 1) : '';
  const params = new URLSearchParams(queryString);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const fromUrl = {};
  let found = false;
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) { fromUrl[k] = v; found = true; }
  });
  if (found) {
    try { sessionStorage.setItem('ts_utm', JSON.stringify(fromUrl)); } catch {}
    return fromUrl;
  }
  try {
    const saved = sessionStorage.getItem('ts_utm');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { utm_source: '(direct)', utm_medium: '(none)', utm_campaign: '(none)' };
}

// ── Visit logging ───────────────────────────────────────────────────────────
// Logs "someone with this exact tag loaded the page" — separate from form
// submission, so we know who *looked* even if they never converted. Only
// fires for tagged (campaign) visits, not casual/direct browsing, and only
// once per browser session per page — a refresh or clicking between pages
// won't double-log the same visit. Uses its own dedicated Formspree form so
// visit-ping volume never competes with actual lead submissions for the
// same monthly cap.
const VISITS_ENDPOINT = 'https://formspree.io/f/mjgqnorg';
// Self-hosted tracker (VM). All events dual-write: Formspree keeps the email
// trail and survives VM downtime; the tracker DB makes everything queryable.
const TRACK_API = 'https://track.troubleshooterdata.com';

export function logVisit(pageName) {
  const utm = captureUTM();
  if (!utm.utm_source || utm.utm_source === '(direct)') return; // only tagged visits

  const dedupeKey = `ts_visit_logged_${pageName}_${utm.utm_content || utm.utm_campaign || 'unknown'}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) return; // already logged this visit this session
    sessionStorage.setItem(dedupeKey, '1');
  } catch {}

  // Fire-and-forget — a background log, not a user-facing action. No error
  // handling shown to the visitor; if it fails, it just fails quietly.
  const payload = {
    event: 'page_visit',
    page: pageName,
    ...utm,
    visited_at: new Date().toISOString(),
  };
  fetch(VISITS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
  fetch(`${TRACK_API}/api/track/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// Fire-and-forget lead mirror to the self-hosted tracker. Called by the form
// pages alongside (never instead of) their Formspree submission.
export function logLeadToTracker(payload) {
  try {
    fetch(`${TRACK_API}/api/track/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
}
