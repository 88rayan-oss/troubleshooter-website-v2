// WebinarPage.jsx — the webinar registration page. #/webinar
// The softest ask in the funnel: no information disclosure, no 1:1 exposure,
// just showing up. Ties directly to the "It's the data layer" campaign and
// the four AI service pillars — each session is a live, deeper teardown.
import React, { useState, useEffect } from 'react';
import { C } from './experience/helpers';
import { captureUTM, logVisit, logLeadToTracker } from './utm';
import logoWhite from './assets/logo-white.png';

const MONO = { fontFamily: C.fm, letterSpacing: '0.01em' };
const H1 = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.1, color: C.t1, letterSpacing: '-0.02em' };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(15px,1.7vw,17.5px)', color: C.t2b, lineHeight: 1.65 };

// The series — each session maps to a service pillar, same rotation logic
// as the campaign's register system. Update dates as each is scheduled.
const SESSIONS = [
  {
    id: 'readiness',
    tag: 'session 01',
    color: C.cyan,
    title: 'The Data Layer Readiness Audit — live walkthrough',
    desc: 'What we actually look for when we audit a company\u2019s data environment — training-serving skew, feature inconsistency, the gaps that stall AI before it starts. Real findings, real severity ranking, no theory.',
    status: 'open',
  },
  {
    id: 'rag',
    tag: 'session 02',
    color: C.yellow,
    title: 'Why RAG breaks — chunking, retrieval, and what actually fixes it',
    desc: 'The specific, fixable reasons a RAG system returns confident wrong answers — and the hybrid search + re-ranking approach that closes the gap.',
    status: 'upcoming',
  },
  {
    id: 'mlops',
    tag: 'session 03',
    color: C.orange,
    title: 'From notebook to production — building a pipeline that survives contact',
    desc: 'The gap between a model that works in Jupyter and one that\u2019s reliably retrainable, versioned, and safe to roll back.',
    status: 'upcoming',
  },
  {
    id: 'observability',
    tag: 'session 04',
    color: C.redLt,
    title: 'The 47-minute problem — catching data drift before the model does',
    desc: 'Why most model degradation is a data problem wearing a model-shaped costume, and how to catch it in under two minutes instead of 47.',
    status: 'upcoming',
  },
];

export default function WebinarPage() {
  useEffect(() => { logVisit('webinar'); }, []);
  const [form, setForm] = useState({ name: '', org: '', email: '', session: 'readiness' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if ((state !== 'idle' && state !== 'error') || !form.name || !form.email) return;
    setState('sending');
    try {
      logLeadToTracker({ ...form, ...captureUTM(), scope: 'webinar_registration', source: 'webinar_page' });
      const res = await fetch('https://formspree.io/f/YOUR_WEBINAR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, ...captureUTM(), scope: 'webinar_registration', source: 'webinar_page' }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch { setState('error'); }
  };

  const inputStyle = {
    fontFamily: C.fm, fontSize: 13, background: '#060E1A',
    border: `1px solid ${C.border}`, borderRadius: 4, padding: '11px 13px',
    color: C.t1, outline: 'none', width: '100%',
  };

  return (
    <div style={{ background: C.navy, minHeight: '100vh', fontFamily: C.fb, color: C.t1 }}>
      <nav className="ts-nav" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="#/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <a href="#/audit" className="ts-amber-ghost" style={{ textDecoration: 'none' }}>the audit</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px,7vw,84px) 24px 80px' }}>

        <div style={{ ...MONO, fontSize: 11.5, color: C.cyan, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 }}>
          // free · live · no pitch, no recording required to attend
        </div>
        <h1 style={H1}>It's the data layer — the series.</h1>
        <p style={{ ...SUB, maxWidth: 640, marginTop: 18 }}>
          Four live sessions, one per service pillar. Real findings, real technical
          depth, run by the engineer who does the work — not a slide deck built by
          marketing. Thirty minutes, live Q&amp;A, no pitch at the end.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 40 }}>
          {SESSIONS.map((s) => (
            <div key={s.id} onClick={() => setForm((f) => ({ ...f, session: s.id }))} style={{
              cursor: 'pointer', padding: '18px 20px', borderRadius: 8,
              background: form.session === s.id ? `${s.color}0d` : C.card,
              border: `1px solid ${form.session === s.id ? s.color : C.border}`,
              transition: 'all .15s',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ ...MONO, fontSize: 10.5, color: s.color, background: `${s.color}18`,
                  border: `1px solid ${s.color}33`, borderRadius: 3, padding: '2px 9px' }}>{s.tag}</span>
                {s.status === 'open' && <span style={{ ...MONO, fontSize: 10.5, color: C.green }}>registration open</span>}
                {s.status === 'upcoming' && <span style={{ ...MONO, fontSize: 10.5, color: C.t3 }}>date to be announced</span>}
              </div>
              <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 16.5, color: C.t1, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: C.t2, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
            background: C.cardDeep, borderBottom: `1px solid ${C.border}` }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ ...MONO, fontSize: 11, color: C.t3, marginLeft: 4 }}>webinar --register</span>
          </div>
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 13, maxWidth: 440 }}>
            <input style={inputStyle} placeholder="your_name" value={form.name} onChange={set('name')} />
            <input style={inputStyle} placeholder="organisation" value={form.org} onChange={set('org')} />
            <input style={inputStyle} placeholder="work@email.com" type="email" value={form.email} onChange={set('email')} />
            <div style={{ ...MONO, fontSize: 10.5, color: C.t3 }}>registering for: {SESSIONS.find(s => s.id === form.session)?.tag}</div>
            <button onClick={submit} className="ts-fill-btn" style={{
              background: state === 'done' ? C.green : state === 'error' ? C.redLt : C.blue,
              color: state === 'done' ? C.navy : '#fff',
              cursor: (state === 'idle' || state === 'error') ? 'pointer' : 'default',
              fontFamily: C.fm, fontSize: 13, padding: '12px', border: 'none', borderRadius: 4,
            }}>
              {state === 'done' ? '✓ registered — the join link arrives by email'
                : state === 'sending' ? 'sending…'
                : state === 'error' ? '⚠ something went wrong — click to try again'
                : '$ register — free'}
            </button>
            <div style={{ ...MONO, fontSize: 10.5, color: C.t3 }}>
              # no pitch at the end. genuinely just the session.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ ...SUB, maxWidth: 640 }}>
            Prefer something written instead? <a href="#/review" style={{ color: C.blueLt }}>The free stack review →</a>{' '}
            or data on fire right now? <a href="#/broken" style={{ color: C.redLt }}>The triage line →</a>
          </p>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${C.border}`, background: '#060E1A', padding: '22px 28px',
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        <span style={{ fontSize: 12.5, color: C.t2 }}>Data &amp; AI engineering</span>
        <span style={{ marginLeft: 'auto', ...MONO, fontSize: 11.5, color: C.t3 }}>hello@troubleshooter.lk</span>
      </footer>
    </div>
  );
}
