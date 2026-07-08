// experience/scenes.jsx — artifact fragments (Acts 1–2) + micro-scenes (Act 4)
import React from 'react';
import { C, clamp, lerp, easeOut } from './helpers';

/* ───────────────────────── Artifacts (real UI fragments) ───────────────── */

const frag = {
  background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
  boxShadow: '0 12px 32px rgba(0,0,0,0.45)', overflow: 'hidden',
  fontFamily: C.fb, width: 240,
};
const fragBar = {
  padding: '6px 10px', background: C.cardDeep, borderBottom: `1px solid ${C.border}`,
  fontFamily: C.fm, fontSize: 10, color: C.t3,
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
};

export function ArtifactSpreadsheet() {
  const cell = { border: `1px solid ${C.border}`, padding: '3px 6px', fontSize: 9, color: C.t2, fontFamily: C.fm };
  return (
    <div style={frag}>
      <div style={fragBar}>Q3_numbers_FINAL_v7.xlsx</div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}><tbody>
        <tr>{['', 'A', 'B', 'C'].map((h, i) => <td key={i} style={{ ...cell, color: C.t3, background: C.cardDeep }}>{h}</td>)}</tr>
        {[['1', 'Region', 'Rev', 'QoQ'], ['2', 'APAC', '4.2M', '+8%'], ['3', 'EMEA', '#REF!', '—'], ['4', 'NA', '3.1M', '?']].map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} style={{ ...cell, color: c === '#REF!' ? C.redLt : cell.color }}>{c}</td>)}</tr>
        ))}
      </tbody></table>
    </div>
  );
}

export function ArtifactEmail() {
  return (
    <div style={{ ...frag, width: 270 }}>
      <div style={fragBar}>inbox — 47 messages in thread</div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 11.5, color: C.t1, fontWeight: 600, marginBottom: 4 }}>
          RE: RE: FW: revenue report — which version is right?
        </div>
        <div style={{ fontFamily: C.fm, fontSize: 9.5, color: C.t3 }}>finance-team · yesterday 6:12 PM</div>
      </div>
    </div>
  );
}

export function ArtifactTerminal() {
  return (
    <div style={{ ...frag, width: 280 }}>
      <div style={fragBar}>cron — /var/log/pipeline.log</div>
      <div style={{ padding: '9px 12px', fontFamily: C.fm, fontSize: 9.5, lineHeight: 1.8 }}>
        <div style={{ color: C.redLt }}>ERROR exit 1 — pipeline_nightly.sh</div>
        <div style={{ color: C.t3 }}>4th consecutive failure · no alert configured</div>
      </div>
    </div>
  );
}

export function ArtifactNotebook() {
  return (
    <div style={{ ...frag, width: 265 }}>
      <div style={fragBar}>model_training_v3 (2).ipynb</div>
      <div style={{ padding: '9px 12px', fontFamily: C.fm, fontSize: 9.5, lineHeight: 1.8 }}>
        <div><span style={{ color: C.cyan }}>In [*]:</span> <span style={{ color: C.t2 }}>model.fit(X_train, y_train)</span></div>
        <div style={{ color: C.yellow }}>⏳ running 3h 47m</div>
      </div>
    </div>
  );
}

export function ArtifactChat() {
  return (
    <div style={{ ...frag, width: 260 }}>
      <div style={fragBar}>#general — yesterday 11:52 PM</div>
      <div style={{ padding: '10px 12px', display: 'flex', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.blue, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>M</div>
        <div style={{ fontSize: 11, color: C.t2, lineHeight: 1.5 }}>
          can someone pull the numbers before the board call? 🙏
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Act 4 micro-scenes ───────────────────────────
   Each receives t in [0..1] (its local scrubbed progress). */

const sceneBox = { position: 'relative', width: 340, height: 240 };

// 4.2 — RAG: docs dissolve → dots cluster → question → cited answer
export function RagScene({ t }) {
  const dissolve = easeOut(clamp(t / 0.3));
  const cluster  = easeOut(clamp((t - 0.3) / 0.25));
  const ask      = easeOut(clamp((t - 0.55) / 0.2));
  const answer   = easeOut(clamp((t - 0.78) / 0.22));

  // 12 dots: from doc-stack positions → clustered ring
  const dots = Array.from({ length: 12 }, (_, i) => {
    const sx = 60 + (i % 3) * 10, sy = 40 + Math.floor(i / 3) * 22;      // stacked
    const a = (i / 12) * Math.PI * 2;
    const cx = 90 + Math.cos(a) * 34, cy = 96 + Math.sin(a) * 30;        // cluster
    return { x: lerp(sx, cx, cluster), y: lerp(sy, cy, cluster) };
  });

  return (
    <div style={sceneBox}>
      {/* document stack */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: 'absolute', left: 48 + i * 8, top: 30 + i * 10,
          width: 64, height: 80, background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 4, opacity: 1 - dissolve,
          transform: `scale(${1 - dissolve * 0.25})`,
        }}>
          {[0, 1, 2, 3].map((l) => (
            <div key={l} style={{ height: 3, background: C.t3, opacity: 0.5, margin: '9px 8px 0', borderRadius: 2 }} />
          ))}
        </div>
      ))}
      {/* embedding dots */}
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y, width: 6, height: 6, borderRadius: '50%',
          background: C.cyan, opacity: dissolve * (1 - answer * 0.4),
          boxShadow: `0 0 8px ${C.cyan}`,
        }} />
      ))}
      {/* question */}
      <div style={{
        position: 'absolute', left: 175, top: 44, width: 155,
        fontFamily: C.fm, fontSize: 11, color: C.t2, opacity: ask,
        transform: `translateY(${(1 - ask) * 10}px)`,
      }}>
        <span style={{ color: C.blueLt }}>?</span> what's our refund policy for enterprise?
      </div>
      {/* cited answer */}
      <div style={{
        position: 'absolute', left: 165, top: 96, width: 172,
        background: C.card, border: `1px solid ${C.green}44`, borderRadius: 6,
        padding: '10px 12px', opacity: answer,
        transform: `translateY(${(1 - answer) * 14}px)`,
      }}>
        <div style={{ fontSize: 10.5, color: C.t1, lineHeight: 1.55 }}>
          Enterprise plans: full refund within 30 days, pro-rated after.
        </div>
        <div style={{
          marginTop: 7, display: 'inline-block', fontFamily: C.fm, fontSize: 8.5,
          color: C.green, border: `1px solid ${C.green}44`, borderRadius: 3, padding: '2px 6px',
        }}>src: refund-policy-2026.pdf §4.2</div>
      </div>
    </div>
  );
}

// 4.3 — Feature store: three conflicting values collapse into one truth
export function FeatureScene({ t }) {
  const converge = easeOut(clamp(t / 0.55));
  const resolve  = easeOut(clamp((t - 0.6) / 0.3));
  const chips = [
    { v: 'customer_ltv: 4,210', x0: 10,  y0: 30 },
    { v: 'customer_ltv: 3,987', x0: 160, y0: 10 },
    { v: 'customer_ltv: 4,455', x0: 90,  y0: 150 },
  ];
  const cx = 88, cy = 92;
  return (
    <div style={sceneBox}>
      {chips.map((ch, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: lerp(ch.x0, cx, converge), top: lerp(ch.y0, cy, converge),
          fontFamily: C.fm, fontSize: 11.5, padding: '7px 12px',
          background: C.card, border: `1px solid ${i === 0 ? C.border : C.redLt + '55'}`,
          borderRadius: 5, color: i === 0 ? C.t2 : C.redLt,
          opacity: i === 0 ? 1 : 1 - resolve,
          whiteSpace: 'nowrap',
        }}>{ch.v}</div>
      ))}
      {/* resolved truth */}
      <div style={{
        position: 'absolute', left: cx, top: cy,
        fontFamily: C.fm, fontSize: 12.5, padding: '9px 14px',
        background: `${C.green}12`, border: `1px solid ${C.green}`,
        borderRadius: 6, color: C.green, opacity: resolve,
        boxShadow: `0 0 ${resolve * 24}px ${C.green}33`, whiteSpace: 'nowrap',
      }}>customer_ltv: 4,210 ✓</div>
    </div>
  );
}

// 4.4 — MLOps: notebook folds into a self-running pipeline; versions stack
export function MlopsScene({ t }) {
  const fold  = easeOut(clamp(t / 0.35));
  const run   = clamp((t - 0.4) / 0.4);
  const tags  = easeOut(clamp((t - 0.7) / 0.3));
  const nodes = [0, 1, 2, 3];
  return (
    <div style={{ ...sceneBox, perspective: 600 }}>
      {/* notebook folding away */}
      <div style={{
        position: 'absolute', left: 40, top: 30, width: 170, height: 120,
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        transform: `rotateY(${fold * 90}deg)`, transformOrigin: 'left center',
        opacity: 1 - fold, padding: '10px 12px',
        fontFamily: C.fm, fontSize: 9.5, color: C.t3, lineHeight: 1.8,
      }}>
        <div><span style={{ color: C.cyan }}>In [4]:</span> train.py — manual</div>
        <div><span style={{ color: C.cyan }}>In [5]:</span> deploy? # ask sam</div>
      </div>
      {/* pipeline graph */}
      <div style={{
        position: 'absolute', left: 30, top: 60, opacity: fold,
        transform: `rotateY(${(1 - fold) * -60}deg)`, transformOrigin: 'left center',
        display: 'flex', alignItems: 'center', gap: 0,
      }}>
        {nodes.map((i) => {
          const done = run * 4 > i + 0.8;
          return (
            <React.Fragment key={i}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                border: `1.5px solid ${done ? C.green : C.border}`,
                background: done ? `${C.green}14` : C.card,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: C.fm, fontSize: 12, color: done ? C.green : C.t3,
                transition: 'border-color .2s',
              }}>{done ? '✓' : '·'}</div>
              {i < 3 && <div style={{ width: 26, height: 1.5, background: run * 4 > i + 1 ? C.green : C.border }} />}
            </React.Fragment>
          );
        })}
      </div>
      {/* version tags */}
      <div style={{ position: 'absolute', left: 40, top: 130, display: 'flex', gap: 8, opacity: tags }}>
        {['v1.2', 'v1.3', 'v1.4'].map((v, i) => (
          <div key={v} style={{
            fontFamily: C.fm, fontSize: 10, color: i === 2 ? C.green : C.t3,
            border: `1px solid ${i === 2 ? C.green + '66' : C.border}`,
            borderRadius: 4, padding: '3px 8px',
            transform: `translateY(${(1 - tags) * (10 + i * 6)}px)`,
          }}>{v}{i === 2 ? ' · live' : ''}</div>
        ))}
      </div>
    </div>
  );
}

// 4.5 — Observability: healthy line → drift spike → tag pins in 90s → recovers
export function DriftScene({ t }) {
  const spike   = t < 0.5 ? easeOut(clamp((t - 0.15) / 0.2)) * (1 - easeOut(clamp((t - 0.55) / 0.3))) : (1 - easeOut(clamp((t - 0.55) / 0.3)));
  const pin     = easeOut(clamp((t - 0.35) / 0.15));
  const W = 320, H = 130, mid = 78;
  const pts = Array.from({ length: 13 }, (_, i) => {
    const x = (i / 12) * W;
    let y = mid + Math.sin(i * 1.7) * 7;
    if (i >= 5 && i <= 7) y -= spike * (i === 6 ? 52 : 30); // the spike
    return `${x},${y}`;
  }).join(' ');
  return (
    <div style={{ ...sceneBox, height: 200 }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <line x1="0" y1={mid} x2={W} y2={mid} stroke={C.border} strokeDasharray="3 5" />
        <polyline points={pts} fill="none" stroke={spike > 0.4 ? C.yellow : C.green}
          strokeWidth="2" strokeLinejoin="round" style={{ transition: 'stroke .25s' }} />
      </svg>
      <div style={{
        position: 'absolute', left: 150, top: -6,
        fontFamily: C.fm, fontSize: 10, color: C.yellow,
        border: `1px solid ${C.yellow}55`, background: `${C.yellow}0D`,
        borderRadius: 4, padding: '4px 9px', opacity: pin * (t < 0.85 ? 1 : (1 - (t - 0.85) / 0.15)),
        transform: `translateY(${(1 - pin) * 8}px)`, whiteSpace: 'nowrap',
      }}>⚠ schema_drift detected · 90s</div>
    </div>
  );
}

/* ───────────────────────── Act 5 dashboard ─────────────────────────────── */

export function Dashboard({ visible }) {
  const [sec, setSec] = React.useState(41);
  React.useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setSec((s) => (s >= 59 ? 4 : s + 1)), 1000);
    return () => clearInterval(id);
  }, [visible]);

  const bar = (h, col) => (
    <div style={{ width: 22, height: h, background: col, borderRadius: '3px 3px 0 0', opacity: 0.85 }} />
  );

  return (
    <div style={{
      width: 'min(680px, 90vw)', background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 18px', background: C.cardDeep, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: C.fm, fontSize: 11, color: C.t3 }}>revenue-operations · quicksight</span>
        <span style={{ fontFamily: C.fm, fontSize: 11, color: C.green }}>● last refresh: {sec}s ago</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: C.border }}>
        {[['Revenue MTD', '$4.82M', '+11.2%'], ['Pipeline latency', '14 min', 'target: 15'], ['Data quality', '47/47', 'checks passing']].map(([l, v, s]) => (
          <div key={l} style={{ background: C.card, padding: '16px 18px' }}>
            <div style={{ fontFamily: C.fm, fontSize: 10, color: C.t3, marginBottom: 6 }}>{l}</div>
            <div style={{ fontFamily: C.fd, fontSize: 24, fontWeight: 700, color: C.t1 }}>{v}</div>
            <div style={{ fontFamily: C.fm, fontSize: 10, color: C.green, marginTop: 3 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '20px 18px 16px', height: 120, borderTop: `1px solid ${C.border}` }}>
        {[38, 52, 44, 61, 56, 70, 64, 78, 72, 85].map((h, i) => (
          <React.Fragment key={i}>{bar(h * 0.9, i >= 8 ? C.green : C.blueLt)}</React.Fragment>
        ))}
        <div style={{ marginLeft: 'auto', fontFamily: C.fm, fontSize: 10, color: C.t3, alignSelf: 'flex-start' }}>
          revenue by week · auto
        </div>
      </div>
    </div>
  );
}
