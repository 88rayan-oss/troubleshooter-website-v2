// StaticExperience.jsx — prefers-reduced-motion fallback.
// Each act renders as a static section showing its END state. Same copy, no scrub.
import React from 'react';
import { C } from './experience/helpers';
import logoWhite from './assets/logo-white.png';
import {
  ArtifactSpreadsheet, ArtifactTerminal, ArtifactNotebook, Dashboard,
} from './experience/scenes.jsx';

const MONO = { fontFamily: C.fm };
const XL = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(36px,7vw,72px)', letterSpacing: '-0.03em', lineHeight: 1.08 };
const L  = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(26px,4.6vw,48px)', letterSpacing: '-0.02em' };
const SUB = { fontFamily: C.fb, fontSize: 16, color: C.t2, lineHeight: 1.65 };
const sec = { padding: '90px 24px', maxWidth: 1000, margin: '0 auto' };

const tag = (text, col) => (
  <span style={{
    ...MONO, fontSize: 11, color: col, background: `${col}10`,
    border: `1px solid ${col}44`, borderRadius: 4, padding: '3px 8px',
    display: 'inline-block', marginTop: 8,
  }}>{text}</span>
);

export default function StaticExperience() {
  return (
    <div style={{ background: C.navy, color: C.t1, fontFamily: C.fb }}>
      <nav className="ts-nav">
        <span style={{ ...MONO, fontWeight: 700, fontSize: 14 }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </span>
        <a href="#/audit" className="ts-ghost-btn">$ request audit</a>
      </nav>

      {/* Act 1+2 end state */}
      <section style={{ ...sec, paddingTop: 150, textAlign: 'center' }}>
        <h1 style={XL}>Your data knows the answer.</h1>
        <h1 style={{ ...XL, color: C.blueLt }}>You just can't ask it yet.</h1>
        <div style={{ display: 'flex', gap: 26, justifyContent: 'center', flexWrap: 'wrap', marginTop: 56 }}>
          <div><ArtifactSpreadsheet />{tag('✗ CRITICAL reporting_lag: 18_days', C.redLt)}</div>
          <div><ArtifactTerminal />{tag('⚠ WARN pipeline_monitoring: none', C.yellow)}</div>
          <div><ArtifactNotebook />{tag('✗ HIGH ml_feature_store: none', C.redLt)}</div>
        </div>
        <div style={{ ...MONO, fontSize: 14, color: C.redLt, marginTop: 36 }}>readiness_score: 12/100</div>
        <h2 style={{ ...L, marginTop: 40 }}>It's fixable. It has a sequence.</h2>
      </section>

      {/* Act 3 end state */}
      <section style={{ ...sec, textAlign: 'center' }}>
        <h2 style={L}>Watch it get built.</h2>
        <div style={{ ...MONO, fontSize: 'clamp(11px,2vw,15px)', color: C.blueLt, marginTop: 30, lineHeight: 2 }}>
          sources → aws_glue → s3 (raw/silver/gold) → dbt → redshift → quicksight
        </div>
        <div style={{ ...XL, marginTop: 44 }}>
          <span style={{ color: C.redLt, textDecoration: 'line-through', opacity: 0.5 }}>18 days</span>
          <span style={{ color: C.t3 }}> → </span>
          <span style={{ color: C.green }}>14 min</span>
        </div>
        <p style={{ ...SUB, marginTop: 14 }}>The same report. The same data. The pipeline is the difference.</p>
      </section>

      {/* Act 4 end state */}
      <section style={sec}>
        <h2 style={{ ...L, textAlign: 'center' }}>
          AI doesn't stand on models. It stands on <span style={{ color: C.cyan }}>this</span>.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 22, marginTop: 48 }}>
          {[
            ['Your documents, finally answerable.', 'retrieval <500ms · cited · refreshed nightly'],
            ['One definition of the truth. Every model uses it.', 'feature_store: point_in_time_correct'],
            ['The notebook was the prototype. This is production.', 'deploy: blue_green · rollback: tested'],
            ['It watches the data, so the model doesn\u2019t lie.', 'mean_time_to_detect: 90s (was 47min)'],
          ].map(([h, e]) => (
            <div key={h} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 22px' }}>
              <div style={{ fontFamily: C.fd, fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{h}</div>
              <div style={{ ...MONO, fontSize: 11.5, color: C.green, marginTop: 12 }}>{e}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Act 5 end state */}
      <section style={{ ...sec, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Dashboard visible={true} />
        <h2 style={{ ...L, marginTop: 32 }}>This is what done looks like.</h2>
        <div style={{ ...MONO, fontSize: 13, color: C.green, marginTop: 26 }}>
          audit ✓ → validate ✓ → parallel-run ✓ → stabilise ✓ → hand over ✓
        </div>
        <div style={{ marginTop: 60 }}>
          <div style={{ ...MONO, fontSize: 12, color: C.blueLt, letterSpacing: '.12em', textTransform: 'uppercase' }}>the entry point</div>
          <h2 style={{ ...L, marginTop: 14 }}>Data & AI Readiness Audit <span style={{ color: C.green }}>✓</span></h2>
          <div style={{ fontFamily: C.fd, fontSize: 22, fontWeight: 600, marginTop: 10 }}>
            <span style={{ color: C.green }}>4,500 USD</span><span style={{ color: C.t3 }}> · </span>
            five days<span style={{ color: C.t3 }}> · </span>a written report
          </div>
          <p style={{ ...SUB, marginTop: 14, maxWidth: 520 }}>
            We map exactly what's wrong in your data stack and sequence the fix.
            The report is yours — with or without us.
          </p>
          <a href="#/audit" className="ts-fill-btn" style={{ marginTop: 26 }}>$ request the audit</a>
        </div>
      </section>

      <footer style={{
        background: '#030810', borderTop: `1px solid ${C.border}`, padding: '32px 28px',
        textAlign: 'center', fontFamily: C.fb, fontSize: 12.5, color: C.t3,
      }}>
        Data & AI engineering — Sri Lanka based, serving clients globally ·{' '}
        <a href="mailto:hello@troubleshooter.lk" style={{ color: C.t2 }}>hello@troubleshooter.lk</a>
      </footer>
    </div>
  );
}
