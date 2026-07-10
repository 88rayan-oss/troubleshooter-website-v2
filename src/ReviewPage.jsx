// ReviewPage.jsx — the free Data Layer Review. #/review
// The middle rung of the ladder: score yourself (instant) -> written review (days) -> audit (paid).
// Global-market trust-builder: async, bounded, capacity-limited, no call required.
import React, { useState } from 'react';
import { C } from './experience/helpers';
import { captureUTM } from './utm';
import logoWhite from './assets/logo-white.png';

const MONO = { fontFamily: C.fm, letterSpacing: '0.01em' };
const H1 = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.1, color: C.t1, letterSpacing: '-0.02em' };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(15px,1.7vw,17.5px)', color: C.t2b, lineHeight: 1.65 };

const CAPACITY_TOTAL = 5;

export default function ReviewPage() {
  const [form, setForm] = useState({ name: '', org: '', email: '', stack: '', pain: '', link: '' });
  const [state, setState] = useState('idle');
  // Capacity is a stated weekly cap, not a live counter against a backend —
  // shown as a static, honest line rather than a fake ticking scarcity widget.
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if ((state !== 'idle' && state !== 'error') || !form.name || !form.email || !form.stack) return;
    setState('sending');
    try {
      const res = await fetch('https://formspree.io/f/mqevrppl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, ...captureUTM(), scope: 'free_data_layer_review', source: 'review_page' }),
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

      <div style={{ maxWidth: 980, margin: '0 auto', padding: 'clamp(48px,7vw,84px) 24px 80px' }}>

        <div style={{ ...MONO, fontSize: 11.5, color: C.cyan, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 }}>
          // free · async · no call required
        </div>
        <h1 style={H1}>A free, written review of your data stack.</h1>
        <p style={{ ...SUB, maxWidth: 640, marginTop: 18 }}>
          Tell us what you're running and where it hurts. Within five business days,
          an engineer sends back a one-page written review — what looks right, what's
          likely fragile, and the three things we'd look at first. No pitch, no call,
          no obligation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginTop: 32 }}>
          {[
            ['async', 'Sent at your end of day. Reviewed while you sleep — the timezone works for you, not against you.'],
            ['bounded', 'One page. One pass. No scope creep — that\u2019s what the audit is for.'],
            ['capacity-limited', `${CAPACITY_TOTAL} reviews per week, honestly. First come, first served.`],
          ].map(([t, d]) => (
            <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ ...MONO, fontSize: 11, color: C.cyan, marginBottom: 8 }}>// {t}</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 52, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(22px,3vw,28px)', color: C.t1, lineHeight: 1.25 }}>
              What you'll actually get back.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              {[
                ['What looks right', 'the parts of your stack that are genuinely well-built — said plainly, not as a set-up for a pitch'],
                ['What\u2019s likely fragile', 'the places most stacks like yours tend to break, based on what you\u2019ve described'],
                ['The first three things', 'if you fixed nothing else, these are where we\u2019d look — sequenced, specific'],
              ].map(([t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 10 }}>
                  <span style={{ ...MONO, color: C.green, fontSize: 13 }}>+</span>
                  <div><strong style={{ color: C.t1, fontSize: 14 }}>{t}</strong>
                    <div style={{ fontSize: 13, color: C.t2, marginTop: 2 }}>{d}</div></div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 26, padding: '16px 18px', background: 'rgba(240,192,64,.04)',
              border: '1px solid rgba(240,192,64,.22)', borderRadius: 6 }}>
              <div style={{ ...MONO, fontSize: 11, color: C.yellow, marginBottom: 8 }}># the honest boundary</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
                This is the view from outside — based on what you tell us, not an inspection
                of your actual environment. It's one page, once. If it turns into something
                deeper, that's what the <a href="#/audit" style={{ color: C.blueLt }}>Readiness Audit</a> is
                for — this review is designed to show you exactly what that audit would find,
                ten times deeper, from inside.
              </div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              background: C.cardDeep, borderBottom: `1px solid ${C.border}` }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ ...MONO, fontSize: 11, color: C.t3, marginLeft: 4 }}>review --request</span>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
              <input style={inputStyle} placeholder="your_name" value={form.name} onChange={set('name')} />
              <input style={inputStyle} placeholder="organisation" value={form.org} onChange={set('org')} />
              <input style={inputStyle} placeholder="work@email.com" type="email" value={form.email} onChange={set('email')} />
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
                placeholder="your stack — what you're running (e.g. Postgres, Fivetran, dbt, Looker)"
                value={form.stack} onChange={set('stack')} />
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
                placeholder="where it hurts — what prompted this"
                value={form.pain} onChange={set('pain')} />
              <input style={inputStyle} placeholder="link to a diagram/doc (optional)" value={form.link} onChange={set('link')} />
              <button onClick={submit} className="ts-fill-btn" style={{
                background: state === 'done' ? C.green : state === 'error' ? C.redLt : C.blue,
                color: state === 'done' ? C.navy : '#fff',
                cursor: (state === 'idle' || state === 'error') ? 'pointer' : 'default',
                fontFamily: C.fm, fontSize: 13, padding: '12px', border: 'none', borderRadius: 4,
              }}>
                {state === 'done' ? '✓ received — your written review arrives within 5 business days'
                  : state === 'sending' ? 'sending…'
                  : state === 'error' ? '⚠ something went wrong — click to try again'
                  : '$ request the free review'}
              </button>
              <div style={{ ...MONO, fontSize: 10.5, color: C.t3 }}>
                # no call required. no pitch attached.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ ...SUB, maxWidth: 640 }}>
            Data on fire right now, instead of a stack review? <a href="#/broken" style={{ color: C.redLt }}>The triage line →</a>
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
