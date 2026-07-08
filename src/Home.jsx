// Home.jsx — the visually-rich, motion-calm homepage.
// Thesis: plain language first, engineering evidence second.
// Rules: nothing pins, nothing scrubs. Sections fade up once. Every section reads frozen.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { C } from './experience/helpers';
import {
  ArtifactSpreadsheet, ArtifactEmail, ArtifactNotebook, ArtifactTerminal, Dashboard,
} from './experience/scenes.jsx';

/* ── type ── */
const H1 = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(30px,5.4vw,58px)', letterSpacing: '-0.025em', lineHeight: 1.12, color: C.t1 };
const H2 = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(24px,3.8vw,40px)', letterSpacing: '-0.02em', lineHeight: 1.16, color: C.t1 };
const H3 = { fontFamily: C.fd, fontWeight: 600, fontSize: 'clamp(18px,2.4vw,24px)', letterSpacing: '-0.01em', color: C.t1 };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(15px,1.8vw,18px)', color: C.t2, lineHeight: 1.65 };
const MONO = { fontFamily: C.fm, fontSize: 12, letterSpacing: '0.01em' };
const SECTION = { position: 'relative', padding: 'clamp(64px,9vw,110px) 24px', maxWidth: 1120, margin: '0 auto' };

/* ── reveal-once hook (respects reduced motion) ── */
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(REDUCED);
  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}
function Reveal({ children, delay = 0, style, threshold }) {
  const [ref, on] = useReveal(threshold);
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(10px)',
      transition: `opacity .55s ${delay}s cubic-bezier(.22,1,.36,1), transform .55s ${delay}s cubic-bezier(.22,1,.36,1)`,
      ...style,
    }}>{children}</div>
  );
}

const goAudit = () => { window.location.hash = '#/audit'; };
const scrollToId = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
};

/* ═══════════════════ NAV ═══════════════════ */
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
        <span style={{ color: C.red }}>TROUBLE</span><span style={{ color: C.t1 }}>SHOOTER</span>
      </a>
      <div className="ts-nav-links">
        <a href="#what" onClick={scrollToId('what')} style={{ ...MONO, fontSize: 12.5, color: C.t2 }}>What we build</a>
        <a href="#method" onClick={scrollToId('method')} style={{ ...MONO, fontSize: 12.5, color: C.t2 }}>How we work</a>
        <a href="#/audit" style={{ ...MONO, fontSize: 12.5, color: C.t2 }}>The audit</a>
      </div>
      <a href="#/audit" className="ts-ghost-btn">Talk to an engineer</a>
    </nav>
  );
}

/* ═══════════════════ 1 · HERO ═══════════════════ */
function Hero() {
  return (
    <section style={{ ...SECTION, paddingTop: 130, display: 'grid', gap: 48 }} className="ts-hero-grid">
      <Reveal>
        <h1 style={H1}>
          We build the data platforms your business runs on —{' '}
          <span style={{ color: C.blueLt }}>and the infrastructure your AI needs to work.</span>
        </h1>
        <p style={{ ...SUB, marginTop: 22, maxWidth: 560 }}>
          Reports in minutes instead of weeks. AI projects that reach production.
          Built on AWS by senior engineers — and documented so your team owns it.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
          <a href="#/audit" className="ts-fill-btn">Talk to an engineer</a>
          <a href="#method" onClick={scrollToId('method')} className="ts-ghost-btn"
            style={{ padding: '14px 26px', fontSize: 13 }}>See how we work</a>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="ts-hero-dash">
          <Dashboard visible={true} />
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════ 2 · THE PROBLEM ═══════════════════ */
const PROBLEMS = [
  { caption: 'Your monthly report takes three weeks — and nobody fully trusts it.', El: ArtifactSpreadsheet, glow: C.red },
  { caption: 'Six systems. No single view of the business.', El: ArtifactEmail, glow: C.orange },
  { caption: 'You invested in AI — and the project stalled at the data.', El: ArtifactNotebook, glow: C.red },
];
function Problems() {
  return (
    <section style={SECTION}>
      <Reveal>
        <div style={{ ...MONO, color: C.redLt, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
          the problems we see everywhere
        </div>
        <h2 style={{ ...H2, maxWidth: 640 }}>If any of this sounds familiar, the cause is the same: the pipeline doesn't exist yet.</h2>
      </Reveal>
      <div className="ts-problem-row">
        {PROBLEMS.map(({ caption, El, glow }, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <div className="ts-exhibit">
              <div className="ts-exhibit-stage" style={{ '--glow': glow }}>
                <El />
              </div>
              <p style={{ ...SUB, fontSize: 15.5, marginTop: 18, color: C.t1 }}>{caption}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════ 3 · THE TRANSFORMATION (split compare) ═══════════════════ */
function SplitCompare() {
  const wrapRef = useRef(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const move = useCallback((clientX) => {
    const r = wrapRef.current?.getBoundingClientRect(); if (!r) return;
    setPct(Math.min(88, Math.max(12, ((clientX - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const mm = (e) => dragging.current && move(e.clientX);
    const tm = (e) => dragging.current && move(e.touches[0].clientX);
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', mm);
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('touchend', up);
    };
  }, [move]);

  return (
    <div ref={wrapRef} className="ts-split" onPointerDown={(e) => { dragging.current = true; move(e.clientX); }}>
      {/* AFTER (base layer) */}
      <div className="ts-split-layer" style={{ background: `radial-gradient(500px 300px at 70% 30%, ${C.green}0C, transparent 70%)` }}>
        <div className="ts-split-inner"><Dashboard visible={true} /></div>
        <span className="ts-split-caption" style={{ right: 14, color: C.green }}>after — the same numbers, live</span>
      </div>
      {/* BEFORE (clipped on top) */}
      <div className="ts-split-layer" style={{
        clipPath: `inset(0 ${100 - pct}% 0 0)`,
        background: `#0A1220 radial-gradient(500px 300px at 30% 30%, ${C.red}0F, transparent 70%)`,
      }}>
        <div className="ts-split-inner ts-split-chaos">
          <div style={{ transform: 'rotate(-2deg)' }}><ArtifactSpreadsheet /></div>
          <div style={{ transform: 'rotate(1.5deg) translateY(-8px)' }}><ArtifactEmail /></div>
          <div style={{ transform: 'rotate(-1deg)' }}><ArtifactTerminal /></div>
        </div>
        <span className="ts-split-caption" style={{ left: 14, color: C.redLt }}>before — monday morning today</span>
      </div>
      {/* handle */}
      <div className="ts-split-handle" style={{ left: `${pct}%` }}>
        <div className="ts-split-grip">⇔</div>
      </div>
    </div>
  );
}

function Transformation() {
  const [ref, on] = useReveal(0.35);
  return (
    <section style={SECTION}>
      <Reveal>
        <h2 style={{ ...H2, maxWidth: 620 }}>What changes when the pipeline exists.</h2>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 40 }}>
        <SplitCompare />
      </Reveal>
      <div ref={ref} style={{ textAlign: 'center', marginTop: 46 }}>
        <div style={{
          fontFamily: C.fd, fontWeight: 700, letterSpacing: '-0.02em',
          fontSize: 'clamp(34px,6vw,64px)', lineHeight: 1.1,
          opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)',
        }}>
          <span style={{ color: C.redLt, textDecoration: 'line-through', textDecorationThickness: 3, opacity: 0.85 }}>18 days</span>
          <span style={{ color: C.t3, margin: '0 0.35em' }}>→</span>
          <span style={{ color: C.green }}>14 minutes</span>
        </div>
        <p style={{ ...SUB, marginTop: 14 }}>The same report. The same data. The pipeline is the difference.</p>
      </div>
    </section>
  );
}

/* ═══════════════════ 4 · WHAT WE BUILD ═══════════════════ */
function PipelineDiagram({ on }) {
  const NODES = [
    ['Your systems', 'postgres · erp · saas'],
    ['Collect', 'aws glue'],
    ['Store', 's3'],
    ['Clean', 'dbt · tested'],
    ['Warehouse', 'redshift'],
    ['Dashboards', 'quicksight'],
  ];
  return (
    <div className="ts-diagram-row">
      {NODES.map(([name, sub], i) => (
        <React.Fragment key={name}>
          {i > 0 && <div className="ts-diagram-arrow" style={{
            opacity: on ? 1 : 0, transition: `opacity .4s ${0.15 + i * 0.13}s`,
          }}>→</div>}
          <div className="ts-diagram-node" style={{
            opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)',
            transition: `opacity .45s ${i * 0.13}s cubic-bezier(.22,1,.36,1), transform .45s ${i * 0.13}s cubic-bezier(.22,1,.36,1), border-color .45s ${i * 0.13}s`,
            borderColor: on ? `${C.blueLt}66` : C.border,
          }}>
            <div style={{ fontFamily: C.fb, fontSize: 13.5, fontWeight: 600, color: C.t1 }}>{name}</div>
            <div style={{ ...MONO, fontSize: 9.5, color: C.t2, marginTop: 5 }}>{sub}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function AIStackDiagram({ on }) {
  const NODES = [
    ['Feature store', 'sagemaker'],
    ['Document search', 'bedrock · opensearch'],
    ['Model registry', 'sagemaker'],
    ['Monitoring', 'cloudwatch'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div className="ts-diagram-row" style={{ marginBottom: 0 }}>
        {NODES.map(([name, sub], i) => (
          <div key={name} className="ts-diagram-node" style={{
            opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(10px)',
            transition: `opacity .45s ${0.25 + i * 0.12}s cubic-bezier(.22,1,.36,1), transform .45s ${0.25 + i * 0.12}s cubic-bezier(.22,1,.36,1)`,
            borderColor: on ? `${C.cyan}55` : C.border,
          }}>
            <div style={{ fontFamily: C.fb, fontSize: 13.5, fontWeight: 600, color: C.t1 }}>{name}</div>
            <div style={{ ...MONO, fontSize: 9.5, color: C.t2, marginTop: 5 }}>{sub}</div>
          </div>
        ))}
      </div>
      {/* legs */}
      <div style={{ display: 'flex', gap: 90, height: 22 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: 1.5, background: C.border, height: '100%',
            opacity: on ? 0.8 : 0, transition: `opacity .4s ${0.6 + i * 0.05}s`,
          }} />
        ))}
      </div>
      {/* floor */}
      <div style={{
        width: '100%', maxWidth: 620, padding: '13px 18px', textAlign: 'center',
        border: `1.5px solid ${on ? `${C.blueLt}55` : C.border}`, borderRadius: 10,
        background: `${C.blueLt}08`,
        opacity: on ? 1 : 0, transition: 'opacity .5s .1s, border-color .5s .1s',
      }}>
        <span style={{ fontFamily: C.fb, fontSize: 13.5, fontWeight: 600, color: C.t1 }}>Your data platform</span>
        <span style={{ ...MONO, fontSize: 10, color: C.t2, marginLeft: 10 }}>the part above only works if this exists</span>
      </div>
    </div>
  );
}

function Offerings() {
  const [r1, on1] = useReveal(0.3);
  const [r2, on2] = useReveal(0.3);
  return (
    <section id="what" style={SECTION}>
      <Reveal>
        <div style={{ ...MONO, color: C.blueLt, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
          what we build
        </div>
        <h2 style={H2}>Two things. Done properly.</h2>
      </Reveal>

      {/* Offering A */}
      <Reveal delay={0.08} style={{ marginTop: 52 }}>
        <div className="ts-offer-card">
          <h3 style={H3}>Your data, ready for decisions.</h3>
          <p style={{ ...SUB, fontSize: 15.5, marginTop: 10, maxWidth: 640 }}>
            Every source connected, one warehouse, dashboards that update themselves —
            so the business runs on live numbers instead of last month's export.
          </p>
          <div ref={r1} style={{ margin: '34px 0 26px' }}><PipelineDiagram on={on1} /></div>
          <div className="ts-offer-points">
            {['One view of the whole business', 'Reports that refresh in minutes, not weeks', 'Your team trained and equipped to own it'].map((d) => (
              <span key={d}><span style={{ color: C.green, marginRight: 8 }}>✓</span>{d}</span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Offering B */}
      <Reveal delay={0.08} style={{ marginTop: 28 }}>
        <div className="ts-offer-card">
          <h3 style={H3}>Your data, ready for AI.</h3>
          <p style={{ ...SUB, fontSize: 15.5, marginTop: 10, maxWidth: 640 }}>
            The plumbing that makes AI work in production. Most AI projects fail here —
            at the data layer, not the model — and this is the layer we build.
          </p>
          <div ref={r2} style={{ margin: '34px 0 26px' }}><AIStackDiagram on={on2} /></div>
          <div className="ts-offer-points">
            {['Documents your AI can actually answer from', 'Models that ship to production and stay healthy', 'Monitoring that catches data problems in seconds'].map((d) => (
              <span key={d}><span style={{ color: C.green, marginRight: 8 }}>✓</span>{d}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════ 5 · METHOD ═══════════════════ */
const ICONS = {
  audit: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="M16 16l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  validate: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="4" y="4" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8"/><path d="M9 13.5l3 3 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  approve: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3.5l3 6 6.5.9-4.7 4.5 1.1 6.5L13 18.3l-5.9 3.1 1.1-6.5L3.5 10.4l6.5-.9 3-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  parallel: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M5 8h16M5 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M17 5l4 3-4 3M17 15l4 3-4 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  handover: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="6" y="3.5" width="14" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M10 9h6M10 13h6M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
};
const METHOD = [
  ['audit', 'Audit first', 'We map what\u2019s wrong before proposing anything.'],
  ['validate', 'Test in isolation', 'Never in your production environment.'],
  ['approve', 'You approve the design', 'Nothing is built that you haven\u2019t seen.'],
  ['parallel', 'Run old and new in parallel', 'Until the numbers match, the old process stays.'],
  ['handover', 'Document and hand over', 'Your team can run it without us.'],
];
function Method() {
  return (
    <section id="method" style={SECTION}>
      <Reveal>
        <div style={{ ...MONO, color: C.green, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
          how we work
        </div>
        <h2 style={{ ...H2, maxWidth: 620 }}>Nothing touches production until it's proven.</h2>
      </Reveal>
      <div className="ts-method-row">
        {METHOD.map(([icon, title, line], i) => (
          <Reveal key={title} delay={i * 0.1}>
            <div className="ts-method-card">
              <div className="ts-method-icon">{ICONS[icon]}</div>
              <div style={{ fontFamily: C.fb, fontWeight: 600, fontSize: 15, color: C.t1, marginTop: 14 }}>
                <span style={{ ...MONO, fontSize: 10.5, color: C.t3, marginRight: 8 }}>0{i + 1}</span>{title}
              </div>
              <p style={{ fontFamily: C.fb, fontSize: 13.5, color: C.t2, lineHeight: 1.55, marginTop: 7 }}>{line}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════ 6 · THE CLOSE ═══════════════════ */
function ReportObject() {
  return (
    <div className="ts-report" aria-hidden="true">
      <div className="ts-report-page ts-report-p2" />
      <div className="ts-report-page ts-report-p1" />
      <div className="ts-report-cover">
        <div style={{ ...MONO, fontSize: 9, color: C.cyan, letterSpacing: '.1em' }}>TROUBLESHOOTER</div>
        <div style={{ fontFamily: C.fd, fontWeight: 700, fontSize: 17, color: C.t1, lineHeight: 1.25, marginTop: 46 }}>
          Data & AI<br />Readiness Report
        </div>
        <div style={{ ...MONO, fontSize: 8.5, color: C.t3, marginTop: 10 }}>findings · severity · sequence</div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[['critical', C.redLt, 2], ['high', C.yellow, 3], ['resolved path', C.green, 5]].map(([l, col, n]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 26 + n * 9, height: 4, borderRadius: 2, background: col, opacity: 0.85 }} />
              <span style={{ ...MONO, fontSize: 7.5, color: C.t3 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Close() {
  return (
    <section style={{ ...SECTION, paddingBottom: 120 }}>
      <div className="ts-close-grid">
        <Reveal>
          <h2 style={H2}>Start with knowing exactly what's wrong.</h2>
          <p style={{ ...SUB, marginTop: 18, maxWidth: 520 }}>
            Every engagement begins the same way: we map your data environment and hand you
            a written report — what's broken, why, and the sequence to fix it.
            Yours to keep, whatever you decide next.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#/audit" className="ts-fill-btn">Talk to an engineer →</a>
            <a href="#/audit" style={{ ...MONO, fontSize: 12.5, color: C.blueLt }}>how the audit works</a>
          </div>
          <div style={{ ...MONO, fontSize: 11.5, color: C.t3, marginTop: 18 }}>
            hello@troubleshooter.lk · remote-first · senior engineers only
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ReportObject />
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */
function Footer() {
  return (
    <footer style={{
      background: '#030810', borderTop: `1px solid ${C.border}`, padding: '34px 28px',
      display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <span style={{ ...MONO, fontWeight: 700, fontSize: 13 }}>
          <span style={{ color: C.red }}>TROUBLE</span><span style={{ color: C.t1 }}>SHOOTER</span>
        </span>
        <div style={{ fontFamily: C.fb, fontSize: 12.5, color: C.t3, marginTop: 6 }}>
          Data & AI engineering — Sri Lanka based, serving clients globally
        </div>
      </div>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        <a href="#what" onClick={scrollToId('what')} style={{ ...MONO, fontSize: 12, color: C.t3 }}>What we build</a>
        <a href="#method" onClick={scrollToId('method')} style={{ ...MONO, fontSize: 12, color: C.t3 }}>Method</a>
        <a href="#/audit" style={{ ...MONO, fontSize: 12, color: C.t3 }}>Audit</a>
        <a href="#/experience" style={{ ...MONO, fontSize: 12, color: C.t3 }}>See it as a story →</a>
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

/* ═══════════════════ ROOT ═══════════════════ */
export default function Home() {
  return (
    <div style={{ background: C.navy, color: C.t1, fontFamily: C.fb, overflowX: 'hidden' }}>
      {/* quiet ambient glow, static */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(700px 500px at 82% 8%, ${C.blue}0C, transparent 70%),
                     radial-gradient(600px 480px at 8% 90%, ${C.green}07, transparent 70%)`,
      }} />
      <Nav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Problems />
        <Transformation />
        <Offerings />
        <Method />
        <Close />
      </main>
      <Footer />
    </div>
  );
}
