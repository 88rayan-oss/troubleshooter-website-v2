// HomePage.jsx — the default route.
// Thesis: plain language first, engineering evidence second.
// Visually rich (real rendered exhibits), motion calm (entrance fades only,
// one count moment, one draggable divider). Fully legible frozen.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { C } from './experience/helpers';
import {
  ArtifactSpreadsheet, ArtifactEmail, ArtifactNotebook, Dashboard,
} from './experience/scenes.jsx';
import logoWhite from './assets/logo-white.png';

/* ── type ─────────────────────────────────────────────────────────────────── */
const H1  = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(32px,5.6vw,58px)', letterSpacing: '-0.025em', lineHeight: 1.12, color: C.t1 };
const H2  = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(26px,3.8vw,40px)', letterSpacing: '-0.02em', lineHeight: 1.15, color: C.t1 };
const H3  = { fontFamily: C.fd, fontWeight: 600, fontSize: 'clamp(19px,2.4vw,24px)', letterSpacing: '-0.01em', color: C.t1 };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(15px,1.7vw,18px)', color: C.t2b, lineHeight: 1.65 };
const MONO = { fontFamily: C.fm, fontSize: 12.5, letterSpacing: '0.01em' };
const EYE = { ...MONO, fontSize: 11.5, color: C.blueLt, letterSpacing: '.14em', textTransform: 'uppercase' };

/* ── reveal-on-scroll (once, gentle) ─────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setIn(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}
function Reveal({ children, delay = 0, style, as: Tag = 'div' }) {
  const [ref, inView] = useReveal();
  return (
    <Tag ref={ref} className={`ts-reveal${inView ? ' in' : ''}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/* ── shared section shell ────────────────────────────────────────────────── */
function Section({ id, children, style }) {
  return (
    <section id={id} style={{ padding: 'clamp(64px,9vw,110px) 24px', ...style }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/* ══ 1. HERO ═══════════════════════════════════════════════════════════════ */
function Hero() {
  const [ref, inView] = useReveal(0.05);
  return (
    <section ref={ref} style={{ padding: 'clamp(120px,16vh,170px) 24px clamp(60px,8vw,90px)', position: 'relative', overflow: 'hidden' }}>
      {/* ambient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(700px 480px at 80% 10%, ${C.blue}12, transparent 70%),
                     radial-gradient(560px 420px at 8% 85%, ${C.green}0A, transparent 70%)`,
      }} />
      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
        <div className="ts-hero-grid">
          <div className={`ts-reveal${inView ? ' in' : ''}`}>
            <h1 style={{ ...H1 }}>
              Weeks-old reports. Stalled AI.
              <span style={{ color: C.blueLt }}> Both are the same problem — the data layer.</span>
            </h1>
            <p style={{ ...SUB, maxWidth: 560, marginTop: 22 }}>
              That's all we do. Data platforms on AWS, built by senior engineers —
              reports in minutes instead of weeks, AI that reaches production,
              documented so your team owns it.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
              <a href="#/audit" className="ts-amber-btn">
                Talk to an engineer
              </a>
              <button onClick={() => scrollToId('method')} className="ts-ghost-btn"
                style={{ fontFamily: C.fb, fontSize: 15 }}>
                See how we work
              </button>
            </div>
          </div>

          {/* the deliverable — overlapping from the right, bleeding off-viewport */}
          <div className={`ts-reveal${inView ? ' in' : ''} ts-hero-dashcol`}
            style={{ transitionDelay: '180ms', perspective: 1200 }}>
            <div className="ts-hero-dash">
              <Dashboard visible={true} />
            </div>
            <div style={{ ...MONO, fontSize: 11, color: C.t3, marginTop: 14 }}>
              a client operations dashboard — refreshing itself, as delivered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ 2. THE PROBLEM ════════════════════════════════════════════════════════ */
const PROBLEMS = [
  { caption: 'Your monthly report takes three weeks — and nobody fully trusts it.',
    exhibit: <ArtifactSpreadsheet />, tag: 'seen in most audits', tagCol: C.redLt },
  { caption: 'Six systems, six versions of the numbers — and a meeting every month about which one is right.',
    exhibit: <ArtifactEmail />, tag: '47-message threads about “which figure is right”', tagCol: C.yellow },
  { caption: 'You hired for AI — and the project stalled at the data.',
    exhibit: <ArtifactNotebook />, tag: 'the model is fine. the plumbing isn’t.', tagCol: C.redLt },
];

function Problems() {
  return (
    <Section id="problems" style={{ background: '#0B1526' }}>
      <Reveal>
        <div style={EYE}>the problems we get called for</div>
        <h2 style={{ ...H2, marginTop: 14, maxWidth: 640 }}>Sound familiar?</h2>
      </Reveal>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(22px,3vw,36px)', marginTop: 'clamp(36px,5vw,56px)',
      }}>
        {PROBLEMS.map((p, i) => (
          <Reveal key={i} delay={i * 110}>
            <div className="ts-exhibit" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(1.06)', transformOrigin: 'top center' }}>{p.exhibit}</div>
            </div>
            <div style={{ ...MONO, fontSize: 10.5, color: p.tagCol, marginTop: 18, opacity: 0.85 }}>
              {p.tag}
            </div>
            <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 18, color: C.t1, lineHeight: 1.4, marginTop: 8 }}>
              {p.caption}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={360}>
        <div style={{ ...MONO, fontSize: 12, color: C.redLt, opacity: 0.8, marginTop: 'clamp(32px,4vw,48px)' }}>
          Every month this runs, the same 40 hours burn.
        </div>
      </Reveal>
    </Section>
  );
}

/* ══ 3. THE TRANSFORMATION ═════════════════════════════════════════════════ */
function BeforeAfter() {
  const wrapRef = useRef(null);
  const [x, setX] = useState(50);            // divider %
  const [dragging, setDragging] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [ref, inView] = useReveal(0.3);

  // one gentle nudge when it first appears, so the affordance is obvious
  useEffect(() => {
    if (!inView || nudged) return;
    setNudged(true);
    let t1 = setTimeout(() => setX(42), 500);
    let t2 = setTimeout(() => setX(50), 1050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, nudged]);

  const move = useCallback((clientX) => {
    const r = wrapRef.current?.getBoundingClientRect(); if (!r) return;
    setX(Math.min(88, Math.max(12, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => move(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    window.addEventListener('pointermove', mm);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', mm); window.removeEventListener('pointerup', up); };
  }, [dragging, move]);

  const tAfter = Math.min(1, Math.max(0, (88 - x) / 76));
  const mins = Math.exp(Math.log(25920) + (Math.log(14) - Math.log(25920)) * tAfter);
  const cycle = mins >= 1440 ? `${(mins / 1440).toFixed(mins / 1440 >= 10 ? 0 : 1)} days`
    : mins >= 60 ? `${Math.round(mins / 60)} hrs` : `${Math.round(mins)} min`;
  const hours = Math.round(40 * (1 - tAfter));
  const trust = tAfter > 0.55 ? 'automatic' : tAfter < 0.45 ? 'contested' : '…';
  const liveCol = tAfter > 0.5 ? C.green : C.orange;
  const onKey = (e) => {
    const step = e.key === 'PageUp' || e.key === 'PageDown' ? 12 : 4;
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { setX(v => Math.max(12, v - step)); e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { setX(v => Math.min(88, v + step)); e.preventDefault(); }
  };
  return (
    <div>
    <div ref={(el) => { wrapRef.current = el; ref.current = el; }}
      onPointerDown={(e) => { setDragging(true); move(e.clientX); }}
      tabIndex={0} role="slider" aria-label="Drag to compare before and after"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(tAfter * 100)}
      aria-valuetext={`${Math.round(tAfter * 100)}% transformed`}
      onKeyDown={onKey}
      style={{
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${C.border}`, cursor: 'ew-resize',
        userSelect: 'none', touchAction: 'pan-y', background: C.cardDeep,
        transition: dragging ? 'none' : undefined,
      }}>
      {/* BEFORE layer */}
      <div style={{ padding: 'clamp(18px,4vw,44px)', minHeight: 'clamp(410px,32vw,470px)', position: 'relative',
        background: 'radial-gradient(560px 300px at 22% 30%, rgba(232,0,61,0.05), transparent 70%)' }}>
        <div style={{ ...MONO, fontSize: 11, color: C.redLt, marginBottom: 16 }}>BEFORE · monday morning</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ transform: 'rotate(-1.6deg)' }}><ArtifactEmail /></div>
          <div style={{ transform: 'rotate(1.2deg)' }}><ArtifactSpreadsheet /></div>
        </div>
      </div>

      {/* AFTER layer (clipped) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(560px 300px at 74% 60%, rgba(39,200,122,0.06), transparent 70%), #081220',
        clipPath: `inset(0 0 0 ${x}%)`,
        transition: dragging ? 'none' : 'clip-path .45s cubic-bezier(.22,1,.36,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(18px,4vw,44px)',
      }}>
        <div style={{ ...MONO, fontSize: 11, color: C.green, marginBottom: 16, alignSelf: 'flex-start' }}>AFTER · same monday</div>
        <Dashboard visible={inView} />
      </div>

      {/* divider handle */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${x}%`,
        width: 2, background: C.blueLt, boxShadow: `0 0 14px ${C.blueLt}88`,
        transition: dragging ? 'none' : 'left .45s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: C.navy, border: `2px solid ${C.blueLt}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: C.fm, fontSize: 12, color: C.blueLt,
        }}>⇄</div>
      </div>
    </div>

    {/* live readout — the numbers move with the divider */}
    <div style={{
      display: 'flex', gap: 'clamp(14px,3vw,34px)', flexWrap: 'wrap',
      justifyContent: 'center', marginTop: 18,
    }}>
      {[['reporting_cycle', cycle], ['analyst_hours', `${hours}/month`], ['trust', trust]].map(([k, v]) => (
        <div key={k} style={{ ...MONO, fontSize: 12.5, color: C.t3 }}>
          {k}: <span style={{ color: liveCol, fontWeight: 700, transition: 'color .3s' }}>{v}</span>
        </div>
      ))}
    </div>
    </div>
  );
}

function NumberMoment() {
  const [ref, inView] = useReveal(0.6);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setFlipped(true), 700);
    return () => clearTimeout(t);
  }, [inView]);
  return (
    <div ref={ref} style={{ textAlign: 'center', minHeight: '52vh', display: 'flex',
      flexDirection: 'column', justifyContent: 'center', margin: 'clamp(20px,3vw,36px) 0' }}>
      <div style={{ position: 'relative', height: '1.15em', fontFamily: C.fd, fontWeight: 700,
        fontSize: 'clamp(52px,9vw,96px)', letterSpacing: '-0.03em' }}>
        <div style={{
          color: C.redLt, opacity: flipped ? 0 : 1,
          transform: flipped ? 'translateY(-30px) scale(0.95)' : 'none',
          transition: 'all .7s cubic-bezier(.22,1,.36,1)',
        }}>18 days</div>
        <div style={{
          position: 'absolute', inset: 0, color: C.green, opacity: flipped ? 1 : 0,
          transform: flipped ? 'none' : 'translateY(30px) scale(0.97)',
          transition: 'all .7s cubic-bezier(.22,1,.36,1)',
        }}>14 min</div>
      </div>
      <div style={{ ...SUB, marginTop: 14 }}>
        The same report. The same data. The pipeline is the difference.
      </div>
    </div>
  );
}

function Transformation() {
  return (
    <Section id="transformation" style={{ background: '#070F1C' }}>
      <Reveal>
        <div style={EYE}>what changes</div>
        <h2 style={{ ...H2, marginTop: 14 }}>Monday morning, before and after.</h2>
        <p style={{ ...SUB, marginTop: 12, maxWidth: 560 }}>
          Drag the divider. The left side is how most of our clients arrive.
          The right side is what we hand back.
        </p>
      </Reveal>
      <NumberMoment />
      <Reveal delay={120}><BeforeAfter /></Reveal>
    </Section>
  );
}

/* ══ 4. WHAT WE BUILD ══════════════════════════════════════════════════════ */
function PipelineDiagram() {
  const NODES = [
    ['Sources', 'postgres · erp · saas'],
    ['Ingest', 'aws glue'],
    ['Lake', 's3'],
    ['Transform', 'dbt'],
    ['Warehouse', 'redshift'],
    ['Dashboards', 'quicksight'],
  ];
  return (
    <div className="hp-diagram">
      {NODES.map(([name, mono], i) => (
        <React.Fragment key={name}>
          {i > 0 && <span className="hp-arrow">→</span>}
          <div className="hp-node">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, margin: '0 auto 8px', boxShadow: `0 0 8px ${C.green}66` }} />
            <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 13, color: C.t1 }}>{name}</div>
            <div style={{ ...MONO, fontSize: 9.5, color: C.t2, marginTop: 4 }}>{mono}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function AiStackDiagram() {
  const NODES = [
    ['Feature store', 'one truth for every model'],
    ['Document AI', 'your knowledge, answerable'],
    ['Model pipeline', 'ships itself, safely'],
    ['Monitoring', 'catches drift in 90s'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10,
      }}>
        {NODES.map(([name, sub]) => (
          <div key={name} className="hp-node" style={{ padding: '12px 10px' }}>
            <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 12.5, color: C.cyan }}>{name}</div>
            <div style={{ ...MONO, fontSize: 9, color: C.t2, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>
          </div>
        ))}
      </div>
      {/* connectors */}
      <div style={{ display: 'flex', justifyContent: 'space-around', height: 18 }}>
        {NODES.map((_, i) => <div key={i} style={{ width: 1.5, background: C.border }} />)}
      </div>
      {/* the floor */}
      <div style={{
        border: `1.5px solid ${C.blueLt}55`, background: `${C.blueLt}0C`,
        borderRadius: 10, padding: '13px 16px', textAlign: 'center',
      }}>
        <span style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 13.5, color: C.blueLt }}>
          Your data platform
        </span>
        <span style={{ ...MONO, fontSize: 10, color: C.t2 }}> — the pipeline on the left. AI stands on it.</span>
      </div>
    </div>
  );
}

const OFFERINGS = [
  {
    eyebrow: 'foundational',
    title: 'Your data, ready for decisions.',
    body: 'Every source connected, one warehouse everyone trusts, dashboards that refresh themselves — not your analysts.',
    points: ['All your systems feeding one automated pipeline',
             'Numbers everyone trusts — tested, documented, reconciled',
             'Leadership dashboards that update in minutes, not weeks'],
    diagram: <PipelineDiagram />,
  },
  {
    eyebrow: 'ai infrastructure',
    title: 'Your data, ready for AI.',
    body: 'Most AI projects fail at the data layer — not at the model. We build the layer that doesn\u2019t fail.',
    points: ['One source of truth every model trains on',
             'Your documents, answerable by AI — with citations',
             'Models that ship safely and stay healthy in production'],
    diagram: <AiStackDiagram />,
  },
];

function Offerings() {
  return (
    <Section id="build" style={{ background: '#0B1526' }}>
      <Reveal>
        <div style={EYE}>what we build</div>
        <h2 style={{ ...H2, marginTop: 14 }}>One practice. Two things we're hired for.</h2>
        <p style={{ ...SUB, marginTop: 12, maxWidth: 620 }}>
          Pipelines that feed decisions — and the plumbing that makes AI work in production.
        </p>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,44px)', marginTop: 'clamp(36px,5vw,52px)' }}>
        {OFFERINGS.map((o, i) => (
          <Reveal key={i} delay={i * 100}>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: 'clamp(24px,4vw,40px)',
              display: 'grid', gap: 'clamp(24px,4vw,48px)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center',
            }}>
              <div>
                <div style={{ ...EYE, color: i === 0 ? C.green : C.cyan }}>{o.eyebrow}</div>
                <h3 style={{ ...H3, fontSize: 'clamp(22px,2.8vw,28px)', marginTop: 12 }}>{o.title}</h3>
                <p style={{ ...SUB, fontSize: 15, marginTop: 12 }}>{o.body}</p>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {o.points.map((pt) => (
                    <div key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: C.green, fontFamily: C.fm, fontSize: 13, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14.5, color: C.t1, lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>{o.diagram}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ══ 5. METHOD ═════════════════════════════════════════════════════════════ */
const ICONS = {
  audit: <path d="M10 3a7 7 0 105.2 11.7l4 4 1.4-1.4-4-4A7 7 0 0010 3zm0 2a5 5 0 110 10 5 5 0 010-10z" />,
  validate: <path d="M9 3h6v2h-1v4.6l4.7 7.5A2 2 0 0117 20H7a2 2 0 01-1.7-3l4.7-7.4V5H9V3zm3 2v5.2L8.5 16h7L12 10.2V5z" />,
  parallel: <path d="M7 4h3v16H7V4zm7 0h3v16h-3V4z" />,
  stabilise: <path d="M12 4a8 8 0 018 8h-2a6 6 0 10-6 6v2a8 8 0 110-16zm0 5l4 3-4 3V9z" />,
  handover: <path d="M4 6h9v2H6v9H4V6zm7 4h9v9h-9v-9zm2 2v5h5v-5h-5z" />,
};

const METHOD = [
  ['audit', 'Audit first', 'We map what\u2019s wrong before proposing anything.'],
  ['validate', 'Test before production', 'We break things in our environment, never in yours.'],
  ['parallel', 'Run old and new together', 'Until the numbers match, the old process stays.'],
  ['stabilise', 'Stay until it\u2019s boring', '30 days of tuning under real load, included.'],
  ['handover', 'Hand it over', 'Documented so your team owns it. No lock-in.'],
];

function Method() {
  return (
    <Section id="method">
      <Reveal>
        <div style={EYE}>how we work</div>
        <h2 style={{ ...H2, marginTop: 14 }}>Nothing touches production until it's proven.</h2>
      </Reveal>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14, marginTop: 'clamp(36px,5vw,52px)',
      }}>
        {METHOD.map(([icon, title, line], i) => (
          <Reveal key={title} delay={i * 90}>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: '22px 18px', height: '100%',
            }}>
              <div style={{ ...MONO, fontSize: 10, color: C.t3 }}>0{i + 1}</div>
              <svg viewBox="0 0 24 24" width="26" height="26" fill={C.blueLt} style={{ margin: '12px 0 10px' }}>
                {ICONS[icon]}
              </svg>
              <div style={{ fontFamily: C.fd, fontWeight: 600, fontSize: 15.5, color: C.t1 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.55, marginTop: 7 }}>{line}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <a href="#/audit" style={{ ...MONO, fontSize: 12.5, color: C.blueLt }}>read the full method →</a>
        </div>
      </Reveal>
    </Section>
  );
}

/* ══ 6. ABOUT STRIP ════════════════════════════════════════════════════════ */
function About() {
  return (
    <Section id="about" style={{ paddingTop: 0 }}>
      <Reveal>
        <div style={{
          borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
          padding: 'clamp(30px,4vw,44px) 0', display: 'flex', flexWrap: 'wrap',
          gap: 'clamp(20px,4vw,60px)', alignItems: 'baseline',
        }}>
          <div style={{ fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(20px,2.6vw,26px)', color: C.t1, flex: '0 0 auto' }}>
            A senior-only practice.
          </div>
          <p style={{ ...SUB, fontSize: 15, flex: '1 1 380px', margin: 0 }}>
            Every engagement here is delivered by engineers who've built these systems before —
            no juniors learning on your project, no bench, no handoffs. I keep this practice
            deliberately small and senior-only: fewer projects, done properly.
            Sri Lanka based, remote-first — and the timezone is a feature: you push context
            at your end of day and wake up to finished work.
            <span style={{ display: 'block', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`,
              fontFamily: C.fm, fontSize: 12, color: C.t2, maxWidth: 280 }}>
              — Ryan · Founder, Troubleshooter
            </span>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ══ 7. THE CLOSE ══════════════════════════════════════════════════════════ */
function ReportObject() {
  return (
    <div style={{ position: 'relative', width: 250, height: 320, margin: '0 auto' }}>
      {/* fanned pages behind */}
      {[10, 5].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, background: '#0B1626',
          border: `1px solid ${C.border}`, borderRadius: 8,
          transform: `rotate(${i === 0 ? 4 : 2}deg) translateX(${i === 0 ? 10 : 5}px)`,
        }} />
      ))}
      {/* cover */}
      <div style={{
        position: 'absolute', inset: 0, background: C.card,
        border: `1px solid ${C.border}`, borderRadius: 8, padding: '26px 22px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ ...MONO, fontSize: 9, color: C.t3, letterSpacing: '.14em' }}>TROUBLESHOOTER</div>
        <div style={{ fontFamily: C.fd, fontWeight: 700, fontSize: 21, color: C.t1, lineHeight: 1.25, marginTop: 20 }}>
          Data & AI<br />Readiness Report
        </div>
        <div style={{ ...MONO, fontSize: 9.5, color: C.t2, marginTop: 10 }}>prepared for your team</div>
        <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          {[['findings', '23', C.redLt], ['critical', '4', C.redLt], ['sequenced fixes', '23', C.green]].map(([l, v, col]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ ...MONO, fontSize: 10, color: C.t3 }}>{l}</span>
              <span style={{ ...MONO, fontSize: 10, color: col, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Close() {
  return (
    <Section id="start" style={{ background: 'radial-gradient(640px 420px at 78% 45%, rgba(39,200,122,0.05), transparent 70%), #0B1526' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(36px,6vw,72px)', alignItems: 'center',
      }}>
        <Reveal>
          <div style={EYE}>where every engagement starts</div>
          <h2 style={{ ...H2, marginTop: 14 }}>Start with knowing exactly what's wrong.</h2>
          <p style={{ ...SUB, marginTop: 16, maxWidth: 480 }}>
            Every engagement begins the same way: we map your data environment and hand you
            a written report — what's broken, why, and the sequence to fix it.
            The report is yours either way.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <a href="#/audit" className="ts-amber-btn">
              Start with the audit
            </a>
            <a href="#/audit" className="ts-ghost-btn" style={{ fontFamily: C.fb, fontSize: 15 }}>
              How the audit works →
            </a>
          </div>
        </Reveal>
        <Reveal delay={140}><ReportObject /></Reveal>
      </div>
    </Section>
  );
}

/* ══ NAV + FOOTER ══════════════════════════════════════════════════════════ */
function Nav() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const h = () => { const y = window.scrollY; setHidden(y > last && y > 120); last = y; };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`ts-nav${hidden ? ' hidden' : ''}`}>
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        style={{ ...MONO, fontWeight: 700, fontSize: 14 }}>
        <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
      </a>
      <div className="ts-nav-links">
        {[['What we build', 'build'], ['Method', 'method'], ['Start', 'start']].map(([l, id]) => (
          <button key={id} onClick={() => scrollToId(id)}
            style={{ ...MONO, fontSize: 12.5, color: C.t2, background: 'none', border: 'none', cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>
      <a href="#/audit" className="ts-amber-ghost">Talk to an engineer</a>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      background: '#030810', borderTop: `1px solid ${C.border}`, padding: '36px 28px',
      display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <span style={{ ...MONO, fontWeight: 700, fontSize: 13 }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </span>
        <div style={{ fontFamily: C.fb, fontSize: 12.5, color: C.t3, marginTop: 6 }}>
          Data & AI engineering — Sri Lanka based, serving clients globally
        </div>
      </div>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        <a href="#/audit" style={{ ...MONO, fontSize: 12, color: C.t3 }}>Audit</a>
        <a href="#/experience" style={{ ...MONO, fontSize: 12, color: C.t3 }}>watch how it works →</a>
        <a href="mailto:hello@troubleshooter.lk" style={{ ...MONO, fontSize: 12, color: C.t3 }}>hello@troubleshooter.lk</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green,
          boxShadow: `0 0 6px ${C.green}`, animation: 'ts-pulse 2.4s ease-in-out infinite' }} />
        <span style={{ ...MONO, fontSize: 11, color: C.t3 }}># all systems operational</span>
      </div>
    </footer>
  );
}


/* ══ FILM STRIP — the ninety-second version ═══════════════════════════════ */
function FilmStrip() {
  return (
    <section className="ts-film-band" style={{ padding: 'clamp(64px,8vw,96px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Reveal>
          <div style={{ ...EYE, color: C.cyan }}>the ninety-second version</div>
          <h2 style={{ ...H2, marginTop: 14 }}>Watch the whole thing happen.</h2>
          <p style={{ ...SUB, marginTop: 14, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            The problems, the audit, the build, the AI layer — told as a scroll film.
            Ninety seconds, start to finish.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <a href="#/experience" className="ts-film-btn" style={{ marginTop: 34, textDecoration: 'none' }}>
            <span className="ts-film-play">▶</span>
            <span style={{ fontFamily: C.fb, fontWeight: 600, fontSize: 16, color: C.t1 }}>
              Watch how it works
            </span>
            <span style={{ ...MONO, fontSize: 11, color: C.t3, border: `1px solid ${C.border}`,
              borderRadius: 999, padding: '3px 10px' }}>90 seconds</span>
          </a>
        </Reveal>
        <Reveal delay={240}>
          <div className="ts-film-acts" style={{ marginTop: 26 }}>
            <span>recognition</span><span>→</span><span>the scan</span><span>→</span>
            <span>the build</span><span>→</span><span>the AI layer</span><span>→</span><span>proof</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══ PAGE ══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div style={{ background: C.navy, color: C.t1, fontFamily: C.fb }}>
      <Nav />
      <Hero />
      <Problems />
      <Transformation />
      <Offerings />
      <Method />
      <About />
      <Close />
      <FilmStrip />
      <Footer />
    </div>
  );
}
