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
