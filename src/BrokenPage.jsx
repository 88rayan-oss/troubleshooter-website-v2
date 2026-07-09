// BrokenPage.jsx — the triage line. #/broken
// "Something's broken right now?" — free 30-min triage call, Rapid Diagnostic behind it.
// A lead-gen mechanism wearing a service offering's clothes: the triage call IS the conversation.
import React, { useState } from 'react';
import { C } from './experience/helpers';
import { captureUTM } from './utm';
import logoWhite from './assets/logo-white.png';

const MONO = { fontFamily: C.fm, letterSpacing: '0.01em' };
const H1 = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.1, color: C.t1, letterSpacing: '-0.02em' };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(15px,1.7vw,17.5px)', color: C.t2b, lineHeight: 1.65 };

const EMERGENCIES = [
  { id: 'pipeline_down', label: 'Pipeline down', line: 'The nightly job failed. Again. Nothing refreshed.' },
  { id: 'numbers_wrong', label: 'Numbers are wrong', line: 'The report is out, and someone senior just said "that can\u2019t be right."' },
  { id: 'dashboard_dead', label: 'Dashboard dead or stale', line: 'Last refresh: unknown. Nobody trusts what\u2019s on the screen.' },
  { id: 'ai_output_garbage', label: 'AI output gone bad', line: 'The model or assistant that worked last month is confidently wrong now.' },
];

export default function BrokenPage() {
  const [form, setForm] = useState({ name: '', org: '', email: '', broke: '', detail: '' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (state !== 'idle' || !form.name || !form.email) return;
    setState('sending');
    try {
      await fetch('https://formspree.io/f/YOUR_BROKEN_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, ...captureUTM(), scope: 'something_is_broken_right_now', source: 'triage_line' }),
      });
      setState('done');
    } catch { setState('done'); }
  };

  const inputStyle = {
    fontFamily: C.fm, fontSize: 13, background: '#060E1A',
    border: `1px solid ${C.border}`, borderRadius: 4, padding: '11px 13px',
    color: C.t1, outline: 'none', width: '100%',
  };

  return (
    <div style={{ background: C.navy, minHeight: '100vh', fontFamily: C.fb, color: C.t1 }}>
      {/* nav */}
      <nav className="ts-nav" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="#/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </a>
        <div style={{ marginLeft: 'auto' }}>
          <a href="#/audit" className="ts-amber-ghost" style={{ textDecoration: 'none' }}>the audit</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px,7vw,84px) 24px 80px' }}>

        {/* hero */}
        <div style={{ ...MONO, fontSize: 11.5, color: C.redLt, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 }}>
          // when it's already on fire
        </div>
        <h1 style={H1}>Something's broken right now?</h1>
        <p style={{ ...SUB, maxWidth: 620, marginTop: 18 }}>
          Broken data doesn't wait for a strategy engagement. If one of these is your
          morning, skip the brochure — book a triage call.
        </p>

        {/* emergencies */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 36 }}>
          {EMERGENCIES.map((e) => (
            <div key={e.id} style={{
              background: C.card, border: `1px solid rgba(232,0,61,.22)`, borderRadius: 8,
              padding: '16px 18px',
            }}>
              <div style={{ ...MONO, fontSize: 11, color: C.redLt, marginBottom: 8 }}>✗ {e.id}</div>
              <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 15.5, color: C.t1, marginBottom: 6 }}>{e.label}</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.55 }}>{e.line}</div>
            </div>
          ))}
        </div>

        {/* the offer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 56, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(24px,3vw,32px)', color: C.t1, lineHeight: 1.2 }}>
              A 30-minute triage call. Free, same business day.
            </h2>
            <p style={{ ...SUB, marginTop: 14 }}>
              An engineer — not a salesperson — hears what's happening and tells you what's
              likely wrong and what to do next. Whether or not you hire us. That's the
              whole offer.
            </p>
            <p style={{ ...SUB, marginTop: 14 }}>
              If it needs more than advice, the next step is a <strong style={{ color: C.t1 }}>Rapid
              Diagnostic</strong>: 48–72 hours, fixed fee agreed before we start, and a written
              findings-and-stabilisation plan. A diagnosis and a plan — not open-ended firefighting.
            </p>

            {/* boundaries — the honesty block */}
            <div style={{ marginTop: 22, padding: '16px 18px', background: 'rgba(240,192,64,.04)',
              border: '1px solid rgba(240,192,64,.22)', borderRadius: 6 }}>
              <div style={{ ...MONO, fontSize: 11, color: C.yellow, marginBottom: 8 }}># how this works — plainly</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
                Triage is a call, not remote hands in your systems. The diagnostic delivers a
                plan, not a rebuild. Anything that becomes engineering work gets scoped
                properly — tested outside production, like everything we build. We respond
                same business day; we don't claim 24/7, because we'd be lying.
              </div>
            </div>
          </div>

          {/* form */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              background: C.cardDeep, borderBottom: `1px solid ${C.border}` }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ ...MONO, fontSize: 11, color: C.t3, marginLeft: 4 }}>triage --request</span>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
              <input style={inputStyle} placeholder="your_name" value={form.name} onChange={set('name')} />
              <input style={inputStyle} placeholder="organisation" value={form.org} onChange={set('org')} />
              <input style={inputStyle} placeholder="work@email.com" type="email" value={form.email} onChange={set('email')} />
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.broke} onChange={set('broke')}>
                <option value="" disabled>--what-broke</option>
                {EMERGENCIES.map((e) => <option key={e.id}>{e.id}</option>)}
                <option>something_else</option>
              </select>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
                placeholder="what's happening — one or two lines is enough"
                value={form.detail} onChange={set('detail')} />
              <button onClick={submit} className="ts-fill-btn" style={{
                background: state === 'done' ? C.green : C.red,
                color: state === 'done' ? C.navy : '#fff',
                cursor: state === 'idle' ? 'pointer' : 'default',
                fontFamily: C.fm, fontSize: 13, padding: '12px', border: 'none', borderRadius: 4,
              }}>
                {state === 'done' ? '✓ received — an engineer will reach out today'
                  : state === 'sending' ? 'sending…' : '$ request triage call'}
              </button>
              <div style={{ ...MONO, fontSize: 10.5, color: C.t3 }}>
                # goes straight to the founder. same business day.
              </div>
            </div>
          </div>
        </div>

        {/* the exit line — quiet, true */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ ...SUB, maxWidth: 640 }}>
            Not on fire — just tired of the smoke? The full picture lives in the{' '}
            <a href="#/audit" style={{ color: C.blueLt }}>Data &amp; AI Readiness Audit</a> —
            we map everything waiting to break, before it does.
          </p>
        </div>
      </div>

      {/* footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, background: '#060E1A', padding: '22px 28px',
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        <span style={{ fontSize: 12.5, color: C.t2 }}>Data &amp; AI engineering</span>
        <span style={{ marginLeft: 'auto', ...MONO, fontSize: 11.5, color: C.t3 }}>hello@troubleshooter.lk</span>
      </footer>
    </div>
  );
}
