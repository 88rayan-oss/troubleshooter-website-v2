// AuditPage.jsx — the single conversion destination (#/audit)
import React, { useState } from 'react';
import { C } from './experience/helpers';
import logoWhite from './assets/logo-white.png';

const MONO = { fontFamily: C.fm };
const inputStyle = {
  width: '100%', background: 'rgba(9,17,31,.6)', border: `1px solid ${C.border}`,
  borderRadius: 4, padding: '11px 14px', fontFamily: C.fm, fontSize: 13,
  color: C.t1, outline: 'none',
};

const DELIVERABLES = [
  'Written findings report — 15–25 pages, not slides',
  'Current state map of every source, pipeline, and consumer',
  'Gap analysis against production-ready AWS data architecture',
  'AI readiness assessment included as standard',
  'Recommended target architecture with service selection rationale',
  'Phased roadmap with effort estimates — actionable by any competent engineer',
];

const FAQS = [
  ['Every data consultancy says they\u2019re engineers-first. What makes yours different?',
   'Ask any firm you\u2019re evaluating to walk you through how they validate a pipeline before cutover. If the answer doesn\u2019t include parallel-run reconciliation against the existing process and automated quality checks with defined thresholds, they\u2019re planning to test in your production environment. Specificity is the tell.'],
  ['We have an internal data team. What do you add?',
   'Internal teams manage what\u2019s running. We design and build what should be running — while your team keeps the lights on. We hand over everything we build, documented. We make your internal team stronger, not dependent.'],
  ['We\u2019re mid-migration to AWS or mid-way through an AI project. Can you come in partway?',
   'Yes — this is often where we add the most value. Mid-migration, the architecture and cost decisions are still open. Mid-AI-project, the stall is almost always at the data layer, and the fix is specific and buildable.'],
  ['Do you build the AI models themselves?',
   'No — deliberately. We build the data infrastructure models run on: pipelines, feature stores, RAG systems, deployment automation, observability. Most AI failures happen at the infrastructure layer, not the modelling layer.'],
  ['You\u2019re based in Sri Lanka. How does that work?',
   'Remote-first, and the timezone is a feature: you push context at your end of day and wake up to completed work. Senior AWS engineering at rates that make sense. Nothing about this model constrains quality.'],
  ['What happens after the build?',
   'A 30-day stabilisation period is included in every engagement. After that you choose: full handover — everything is documented for exactly this reason — or a retainer where we keep operating what we built.'],
];

export default function AuditPage() {
  const [form, setForm] = useState({ name: '', org: '', email: '', scope: '', size: '' });
  const [state, setState] = useState('idle'); // idle | loading | done
  const [openFaq, setOpenFaq] = useState(null);

  const submit = async () => {
    if (state !== 'idle') return;
    setState('loading');
    try {
      await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
    } catch { /* fall through to done */ }
    setState('done');
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ background: C.navy, minHeight: '100vh', fontFamily: C.fb, color: C.t1 }}>
      {/* nav */}
      <nav className="ts-nav">
        <a href="#" style={{ ...MONO, fontWeight: 700, fontSize: 14 }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </a>
        <a href="#" style={{ ...MONO, fontSize: 12.5, color: C.t2 }}>← back</a>
      </nav>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* header */}
        <div style={{ ...MONO, fontSize: 12, color: C.blueLt, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          the entry point
        </div>
        <h1 style={{
          fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(32px,5.4vw,56px)',
          letterSpacing: '-0.02em', marginTop: 14, lineHeight: 1.1,
        }}>
          Data & AI Readiness Audit
        </h1>
        <div style={{ fontFamily: C.fd, fontSize: 'clamp(18px,2.6vw,26px)', fontWeight: 600, marginTop: 12 }}>
          <span style={{ color: C.green }}>$4,500</span>
          <span style={{ color: C.t3 }}> · </span>five days
          <span style={{ color: C.t3 }}> · </span>a written report
        </div>
        <p style={{ fontSize: 16, color: C.t2, lineHeight: 1.7, marginTop: 16, maxWidth: 560 }}>
          We map exactly what's wrong in your data stack — today's reporting gaps and
          tomorrow's AI blockers — and sequence the fix. The report is yours, with or without us.
        </p>

        {/* two-column: deliverables + form */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40, marginTop: 56,
        }}>
          <div>
            <div style={{ ...MONO, fontSize: 12, color: C.blueLt, marginBottom: 18 }}>// what you receive</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DELIVERABLES.map((d) => (
                <div key={d} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ color: C.green, fontFamily: C.fm, fontSize: 13, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 14.5, color: C.t1, lineHeight: 1.55 }}>{d}</span>
                </div>
              ))}
            </div>

            <div id="after" style={{
              marginTop: 40, padding: '18px 20px', background: C.card,
              border: `1px solid ${C.border}`, borderRadius: 8,
            }}>
              <div style={{ ...MONO, fontSize: 11, color: C.blueLt, marginBottom: 10 }}># what follows, if you choose</div>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7 }}>
                <strong style={{ color: C.t1 }}>A scoped build</strong> — a data platform, RAG system,
                or MLOps pipeline, validated before production with a 30-day stabilisation period. Or{' '}
                <strong style={{ color: C.t1 }}>ongoing ownership</strong> — a retainer covering pipeline
                operations, monitoring, and a quarterly architecture review.
              </p>
            </div>
          </div>

          {/* form — terminal chrome */}
          <div style={{ background: C.cardDeep, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', alignSelf: 'start' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px',
              background: '#030810', borderBottom: `1px solid ${C.border}`,
            }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ ...MONO, fontSize: 11, color: C.t3, marginLeft: 4 }}>ts-audit --request</span>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
              <input style={inputStyle} placeholder="your_name" value={form.name} onChange={set('name')} />
              <input style={inputStyle} placeholder="organisation" value={form.org} onChange={set('org')} />
              <input style={inputStyle} placeholder="work@email.com" type="email" value={form.email} onChange={set('email')} />
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.scope} onChange={set('scope')}>
                <option value="" disabled>--where-should-we-look</option>
                <option>data_pipelines_and_reporting</option>
                <option>ai_readiness_and_ml_infrastructure</option>
                <option>rag_document_intelligence</option>
                <option>mlops_model_deployment</option>
                <option>full_audit_start_everywhere</option>
              </select>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.size} onChange={set('size')}>
                <option value="" disabled>--organisation-size</option>
                <option>under_100_people</option>
                <option>100-300_people</option>
                <option>300-600_people</option>
                <option>600+_people</option>
              </select>
              <button onClick={submit} className="ts-fill-btn" style={{
                background: state === 'done' ? C.green : C.blue,
                color: state === 'done' ? C.navy : '#fff',
                cursor: state === 'idle' ? 'pointer' : 'default',
              }}>
                {state === 'done' ? '✓ received — we respond within one business day'
                  : state === 'loading' ? '$ submitting...'
                  : '$ ts-audit --submit'}
              </button>
              <div style={{ ...MONO, fontSize: 11, color: C.t3 }}># no spam. no sequences. engineers only.</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 72 }}>
          <div style={{ ...MONO, fontSize: 12, color: C.blueLt, marginBottom: 20 }}>// what technical buyers ask</div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {FAQS.map(([q, a], i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '17px 20px', display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left',
                }}>
                  <span style={{
                    ...MONO, fontSize: 11, color: C.blue, flexShrink: 0,
                    border: `1px solid ${C.blue}33`, background: `${C.blue}0D`,
                    borderRadius: 3, padding: '2px 8px',
                  }}>--q{i + 1}</span>
                  <span style={{ fontSize: 14.5, color: C.t1, flex: 1 }}>{q}</span>
                  <span style={{
                    color: C.blueLt, fontSize: 12, fontFamily: C.fm,
                    transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s',
                  }}>▶</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px 74px', fontSize: 14, color: C.t2, lineHeight: 1.7 }}>{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
