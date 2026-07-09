// experience/ScrollExperience.jsx — the five-act pinned scroll narrative
// Spec: scroll-storyboard-build-spec.md. All motion scrubbed to scroll; reversible.
import React, { useEffect, useRef, useState } from 'react';
import { C, TOTAL_VH, clamp, lerp, seg, eseg, ramp, scrollToVh } from './helpers';
import logoWhite from '../assets/logo-white.png';
import {
  ArtifactSpreadsheet, ArtifactEmail, ArtifactTerminal, ArtifactNotebook, ArtifactChat,
  RagScene, FeatureScene, MlopsScene, DriftScene, Dashboard,
} from './scenes.jsx';

/* ── smoothed scroll progress (the entire engine) ─────────────────────────── */
function useSmoothedProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let target = 0, current = 0, raf;
    const measure = () => {
      const el = ref.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      target = clamp(-el.getBoundingClientRect().top / total, 0, 1);
    };
    const loop = () => {
      current += (target - current) * 0.09;                 // ≈ scrub:1 weight
      if (Math.abs(target - current) < 0.00005) current = target;
      setP((prev) => (Math.abs(prev - current) > 0.0004 ? current : prev));
      raf = requestAnimationFrame(loop);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [ref]);
  return p;
}

function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const h = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return m;
}

/* ── shared type styles ───────────────────────────────────────────────────── */
const XL = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(40px, 8.4vw, 92px)', letterSpacing: '-0.03em', lineHeight: 1.06 };
const L  = { fontFamily: C.fd, fontWeight: 700, fontSize: 'clamp(30px, 5.6vw, 62px)', letterSpacing: '-0.02em', lineHeight: 1.1 };
const M  = { fontFamily: C.fd, fontWeight: 600, fontSize: 'clamp(20px, 3.4vw, 38px)', letterSpacing: '-0.01em', lineHeight: 1.2 };
const SUB = { fontFamily: C.fb, fontSize: 'clamp(14px, 1.6vw, 18px)', color: C.t2, lineHeight: 1.6 };
const MONO = { fontFamily: C.fm, fontSize: 13, letterSpacing: '0.01em' };

/* ── typed line: words reveal on scrub, optional trailing cursor ──────────── */
function TypedLine({ text, t, color = C.t1, style, cursor = false }) {
  const words = text.split(' ');
  return (
    <span style={{ ...XL, display: 'block', color, ...style }}>
      {words.map((w, i) => {
        const wt = clamp(t * words.length - i);
        return (
          <span key={i} style={{ opacity: wt, display: 'inline-block', transform: `translateY(${(1 - wt) * 6}px)` }}>
            {w}{i < words.length - 1 ? '\u00a0' : ''}
          </span>
        );
      })}
      {cursor && t > 0 && t < 1.05 && <span className="ts-cursor" />}
    </span>
  );
}

/* ── readiness chip ───────────────────────────────────────────────────────── */
const CHIP_STOPS = [
  [215, 61], [226, 61], [231, 49], [244, 49], [249, 37], [264, 37], [269, 26],
  [283, 26], [288, 18], [304, 18], [309, 12], [460, 12], [800, 54], [850, 54],
  [1150, 88], [1240, 88], [1300, 100],
];
function chipValue(p) { return Math.round(ramp(p, CHIP_STOPS)); }
function chipColor(v) { return v < 30 ? C.redLt : v <= 70 ? C.yellow : C.green; }

function ChipRing({ value, size = 26 }) {
  const r = (size - 4) / 2, circ = 2 * Math.PI * r;
  const col = chipColor(value);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="3"
        strokeDasharray={`${(value / 100) * circ} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

/* ── the experience ───────────────────────────────────────────────────────── */
export default function ScrollExperience() {
  const containerRef = useRef(null);
  const p = useSmoothedProgress(containerRef);
  const mobile = useIsMobile();
  const vh = p * TOTAL_VH;

  /* P3: scroll cue — appears after 2s idle at the top, fades on scroll */
  const [cueArmed, setCueArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCueArmed(true), 2000);
    return () => clearTimeout(t);
  }, []);
  const cueOpacity = cueArmed ? 1 - seg(p, 3, 12) : 0;

  /* nav hide-on-scroll-down */
  const [navHidden, setNavHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const h = () => {
      const y = window.scrollY;
      setNavHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* ── glow phases ── */
  const alarmGlow = ramp(p, [[0, 0.3], [180, 1], [460, 1], [760, 0]]);
  const resolvedGlow = ramp(p, [[460, 0], [760, 1]]);

  /* ── ACT 1 values ── */
  const line1T = seg(p, 15, 45);
  const line2T = seg(p, 45, 75);
  const headFade = 1 - eseg(p, 170, 196);
  const headLift = eseg(p, 75, 170);

  const artifacts = [
    { id: 'A', el: <ArtifactSpreadsheet />, x: 10, y: 18, enter: [55, 80], float: 'ts-float-a',
      tag: '✗ CRITICAL  reporting_lag: 18_days', sev: C.redLt },
    { id: 'C', el: <ArtifactTerminal />, x: 60, y: 32, enter: [93, 118], float: 'ts-float-b',
      tag: '⚠ WARN  pipeline_monitoring: none', sev: C.yellow },
    { id: 'B', el: <ArtifactEmail />, x: 12, y: 48, enter: [75, 100], float: 'ts-float-c',
      tag: '✗ HIGH  single_source_of_truth: none', sev: C.redLt },
    { id: 'D', el: <ArtifactNotebook />, x: 58, y: 62, enter: [111, 136], float: 'ts-float-a',
      tag: '✗ HIGH  ml_feature_store: none · training: manual', sev: C.redLt },
    { id: 'E', el: <ArtifactChat />, x: 34, y: 78, enter: [129, 154], float: 'ts-float-b',
      tag: '⚠ WARN  analyst_hours_consumed: 40/month', sev: C.yellow },
  ].filter((a) => !mobile || ['A', 'C', 'D'].includes(a.id));

  /* ── ACT 2 values ── */
  const scanVisible = vh > 168 && vh < 338;
  const scanY = seg(p, 200, 330) * 100; // % of stage height
  const verdict1T = seg(p, 332, 356);
  const verdict2T = seg(p, 356, 380);
  const verdictOut = 1 - eseg(p, 416, 438);   // P2: cross-fade out before "Watch it get built"
  const ghostCtaT = eseg(p, 382, 408) * (1 - eseg(p, 425, 442));
  const convergeT = eseg(p, 418, 460);

  /* ── ACT 3 values ── */
  const buildHeadT = eseg(p, 425, 452) * (1 - eseg(p, 690, 706));
  const STAGES = [
    { name: 'Sources',   label: 'postgres · erp · saas · flat_files', copy: 'Every source, mapped.' },
    { name: 'Ingest',    label: 'aws_glue',                            copy: 'Extracted on schedule. Not by a person.' },
    { name: 'Lake',      label: 's3 · raw / silver / gold',            copy: 'Raw kept forever. Clean built from raw.' },
    { name: 'Transform', label: 'dbt · tested · documented',           copy: 'Every transformation tested and versioned.' },
    { name: 'Warehouse', label: 'redshift / athena',                   copy: 'Modelled for questions, not storage.' },
    { name: 'Serve',     label: 'quicksight',                          copy: 'Dashboards that refresh themselves.' },
  ];
  const stageT = (i) => eseg(p, 460 + i * 40, 500 + i * 40);
  const activeStage = clamp(Math.floor((vh - 460) / 40), 0, 5);
  const dbtTicksT = eseg(p, 592, 608);

  // pipeline group transform (becomes the floor from 3.7 onward)
  const shrinkT = eseg(p, 700, 760);
  const pipeFade = 1 - eseg(p, 1150, 1198);
  const pipeVisible = vh > 440 && pipeFade > 0.01;
  const pipeScale = lerp(1, mobile ? 0.55 : 0.45, shrinkT);
  const pipeYvh = lerp(0, mobile ? 30 : 33, shrinkT);

  // number moment
  const numWindow = vh > 693 && vh < 782;
  const numSwapT = eseg(p, 714, 752);
  const numFade = eseg(p, 695, 710) * (1 - eseg(p, 766, 780));
  const numSubT = eseg(p, 748, 762);

  // living diff
  const diffT = seg(p, 760, 796);
  const diffFade = eseg(p, 758, 768) * (1 - eseg(p, 796, 810));
  const DIFF = [
    ['- reporting: manual SQL → excel → email', '+ pipeline: glue → s3 → dbt → redshift → quicksight'],
    ['- reporting_cycle: 18 days',              '+ reporting_cycle: 14 minutes'],
    ['- analyst_hours: 40/month consumed',      '+ analyst_hours: 40/month returned'],
  ];

  /* ── ACT 4 values ── */
  const ai1T = eseg(p, 803, 826) * (1 - eseg(p, 880, 896));
  const ai2T = eseg(p, 824, 848) * (1 - eseg(p, 880, 896));
  const floorBright = ai2T;
  const platT = eseg(p, 850, 898);
  const platFade = 1 - eseg(p, 1150, 1195);
  const PLATFORM = ['feature_store', 'vector_store', 'model_registry', 'monitoring'];
  const MOMENTS = [
    { win: [900, 962],  node: 1, Scene: RagScene,
      head: 'Your documents, finally answerable.', ev: 'retrieval <500ms · cited · refreshed nightly' },
    { win: [962, 1024], node: 0, Scene: FeatureScene,
      head: 'One definition of the truth. Every model uses it.', ev: 'feature_store: point_in_time_correct' },
    { win: [1024, 1086], node: 2, Scene: MlopsScene,
      head: 'The notebook was the prototype. This is production.', ev: 'deploy: blue_green · rollback: tested' },
    { win: [1086, 1150], node: 3, Scene: DriftScene,
      head: 'It watches the data, so the model doesn\u2019t lie.', ev: 'mean_time_to_detect: 90s (was 47min)' },
  ];
  const activeMoment = MOMENTS.findIndex((m) => vh >= m.win[0] && vh < m.win[1]);

  /* ── ACT 5 values ── */
  const dashInT = eseg(p, 1152, 1186);
  const dashOutT = eseg(p, 1222, 1252);
  const dashVisible = vh > 1145 && dashOutT < 0.98;
  const dashHeadT = eseg(p, 1170, 1194) * (1 - eseg(p, 1220, 1236));
  const stripT = seg(p, 1226, 1272);
  const stripFade = eseg(p, 1222, 1236) * (1 - eseg(p, 1276, 1292));
  const METHOD = ['audit', 'validate', 'parallel-run', 'stabilise', 'hand over'];
  const moduleT = eseg(p, 1286, 1314);
  const chipDockT = eseg(p, 1295, 1322);
  const fixedChipVisible = vh > 217 && chipDockT < 0.5;
  const chipVal = chipValue(p);
  const dockedVal = Math.round(lerp(88, 100, chipDockT));

  /* ── layout helpers ── */
  const stage = { position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' };
  const centerCol = {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 6vw',
  };

  // pipeline node positions
  const nodePos = (i) => mobile
    ? { left: '16%', top: `${16 + i * 13.2}%` }
    : { left: `${8 + i * 16.8}%`, top: '50%' };

  return (
    <>
      {/* ── NAV ── */}
      <nav className={`ts-nav${navHidden ? ' hidden' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ ...MONO, fontWeight: 700, fontSize: 14 }}>
          <img src={logoWhite} alt="Troubleshooter" className="ts-logo" />
        </a>
        <div className="ts-nav-links">
          {[['Data', 430], ['AI', 805], ['Method', 1222]].map(([lbl, to]) => (
            <a key={lbl} href="#" onClick={(e) => { e.preventDefault(); scrollToVh(to); }}
              style={{ ...MONO, fontSize: 12.5, color: C.t2 }}>{lbl}</a>
          ))}
        </div>
        <a href="#/audit" className="ts-ghost-btn">$ request audit</a>
      </nav>

      {/* ── GLOW LAYER ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: alarmGlow, transition: 'opacity .2s linear',
          background: `radial-gradient(600px 500px at 78% 18%, ${C.red}0F, transparent 70%),
                       radial-gradient(500px 460px at 12% 76%, ${C.orange}0A, transparent 70%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: resolvedGlow, transition: 'opacity .2s linear',
          background: `radial-gradient(600px 500px at 76% 22%, ${C.blue}0F, transparent 70%),
                       radial-gradient(520px 460px at 14% 74%, ${C.green}0A, transparent 70%)`,
        }} />
      </div>

      {/* ── P3: SCROLL CUE ── */}
      {cueOpacity > 0.01 && (
        <div className="ts-scroll-cue" style={{ opacity: cueOpacity }}>
          <span>scroll</span>
          <span className="cue-line" />
        </div>
      )}

      {/* ── P1: crawler/screen-reader content — the full narrative as real text ── */}
      <div className="ts-visually-hidden">
        <h2>Data engineering, watched end to end</h2>
        <p>It's fixable. It has a sequence. Everything above has a known cause and a known fix. In order.</p>
        <p>Watch it get built.
          Sources: postgres, ERP, SaaS, flat files — every source, mapped.
          Ingest: AWS Glue — extracted on schedule, not by a person.
          Lake: S3 raw, silver, gold — raw kept forever, clean built from raw.
          Transform: dbt, tested and documented — every transformation tested and versioned.
          Warehouse: Redshift and Athena — modelled for questions, not storage.
          Serve: QuickSight — dashboards that refresh themselves.</p>
        <p>18 days to 14 minutes. The same report. The same data. The pipeline is the difference.</p>
        <h2>The AI layer</h2>
        <p>AI doesn't stand on models. It stands on this: feature store, vector store, model registry, monitoring.</p>
        <p>RAG infrastructure — your documents, finally answerable. Retrieval under 500ms, cited, refreshed nightly.</p>
        <p>Feature store — one definition of the truth, every model uses it. Point-in-time correct.</p>
        <p>MLOps — the notebook was the prototype, this is production. Blue-green deployment, tested rollback.</p>
        <p>ML observability — it watches the data, so the model doesn't lie. Mean time to detect: 90 seconds, was 47 minutes.</p>
        <h2>Data &amp; AI Readiness Audit</h2>
        <p>This is what done looks like. Live. Automated. Documented well enough that your team owns it.
          Nothing touches production until it's proven: audit, validate, parallel-run, stabilise, hand over.</p>
        <p>Data &amp; AI Readiness Audit — 4,500 USD, five days, a written report.
          We map exactly what's wrong in your data stack and sequence the fix.
          The report is yours, with or without us. What follows, if you choose: a scoped build, or ongoing ownership.</p>
        <p><a href="#/audit">Request the audit</a>. Troubleshooter — data and AI engineering,
          Sri Lanka based, serving clients globally. hello@troubleshooter.lk</p>
      </div>

      {/* ── FIXED READINESS CHIP ── */}
      {fixedChipVisible && (
        <button onClick={() => scrollToVh(1300)} style={{
          position: 'fixed', bottom: 16, left: 16, zIndex: 90,
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'rgba(15,26,43,0.9)', border: `1px solid ${C.border}`,
          borderRadius: 999, padding: '7px 14px 7px 8px', cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          opacity: chipDockT > 0 ? 1 - chipDockT * 2 : 1,
        }}>
          <ChipRing value={chipVal} />
          <span style={{ ...MONO, fontSize: 12, color: chipColor(chipVal) }}>
            readiness {chipVal}/100
          </span>
        </button>
      )}

      {/* ══ THE 1400vh CONTAINER + PINNED STAGE ══ */}
      <div id="ts-scroll-container" ref={containerRef}
        style={{ height: `${mobile ? 1100 : TOTAL_VH}vh`, position: 'relative', zIndex: 1 }}>
        <div style={stage}>

          {/* ─────────────── ACT 1+2: headline + chaos field + scan ────────── */}
          {vh < 470 && (
            <>
              {/* cursor before line 1 */}
              {vh < 16 && (
                <div style={centerCol}><span className="ts-cursor" style={{ width: 14, height: 30 }} /></div>
              )}

              {/* headlines */}
              <div style={{
                ...centerCol, opacity: headFade,
                transform: `translateY(${-headLift * 7}vh) scale(${1 - headLift * 0.08})`,
              }}>
                <h1 style={{ margin: 0, fontWeight: 'inherit' }}>
                  <TypedLine text="Your data knows the answer." t={line1T} cursor={line2T <= 0} />
                  <span style={{ display: 'block', height: '0.4em' }} />
                  <TypedLine text="You just can't ask it yet." t={line2T} color={C.blueLt} cursor={line2T > 0 && line2T < 1} />
                </h1>
              </div>

              {/* artifacts + tags */}
              {artifacts.map((a) => {
                const enterT = eseg(p, a.enter[0], a.enter[1]);
                const crossed = scanY >= a.y + 3 && vh > 200;
                const nearScan = scanVisible && Math.abs(scanY - (a.y + 3)) < 4;
                const baseOp = vh < 170 ? 0.72 : vh < 200 ? lerp(0.72, 0.45, seg(p, 170, 200))
                  : vh < 332 ? 0.78 : lerp(0.78, 0.25, eseg(p, 332, 360));
                const op = enterT * (nearScan ? 1 : baseOp) * (1 - convergeT);
                const cx = lerp(a.x, 16, convergeT);
                const cy = lerp(a.y, 46, convergeT);
                return (
                  <div key={a.id} style={{
                    position: 'absolute', left: `${cx}%`, top: `${cy}%`,
                    opacity: op,
                    transform: `translateY(${(1 - enterT) * 30}px) scale(${lerp(mobile ? 0.82 : 1, 0.2, convergeT)})`,
                    zIndex: 2,
                  }}>
                    <div className={a.float} style={{ animation: `${a.float} ${22 + a.y * 0.2}s ease-in-out infinite` }}>
                      {a.el}
                    </div>
                    {/* diagnostic tag */}
                    <div style={{
                      position: 'absolute', left: mobile ? 0 : '102%', top: mobile ? '104%' : 8,
                      whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                      opacity: crossed ? Math.max(0.9, op) * (1 - convergeT) : 0,
                      transform: `translateX(${crossed ? 0 : -8}px)`,
                      transition: 'opacity .25s, transform .25s',
                    }}>
                      {!mobile && <div style={{ width: 14, height: 1, background: a.sev, opacity: 0.6 }} />}
                      <span style={{
                        ...MONO, fontSize: mobile ? 10 : 11.5, color: a.sev,
                        background: `${a.sev}10`, border: `1px solid ${a.sev}44`,
                        borderRadius: 4, padding: '3px 8px',
                      }}>{a.tag}</span>
                    </div>
                  </div>
                );
              })}

              {/* scanline */}
              {scanVisible && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: `${scanY}%`, height: 1,
                  background: C.cyan, opacity: 0.55, zIndex: 3,
                  boxShadow: `0 0 12px ${C.cyan}, 0 0 40px ${C.cyan}66`,
                }} />
              )}

              {/* verdict */}
              {vh > 328 && vh < 440 && (
                <div style={{ ...centerCol, zIndex: 4, opacity: verdictOut }}>
                  <div style={{ ...L, color: C.t1, opacity: verdict1T, transform: `translateY(${(1 - verdict1T) * 14}px)` }}>
                    It's fixable.
                  </div>
                  <div style={{ ...L, color: C.t1, opacity: verdict2T, transform: `translateY(${(1 - verdict2T) * 14}px)`, marginTop: 6 }}>
                    It has a sequence.
                  </div>
                  <div style={{ ...SUB, marginTop: 18, opacity: verdict2T }}>
                    Everything above has a known cause and a known fix. In order.
                  </div>
                  <a href="#/audit" className="ts-ghost-btn"
                    style={{ marginTop: 28, opacity: ghostCtaT, pointerEvents: ghostCtaT > 0.5 ? 'auto' : 'none' }}>
                    $ request the audit →
                  </a>
                </div>
              )}
            </>
          )}

          {/* ─────────────── ACT 3: the build ───────────────────────────────── */}
          {vh > 418 && (
            <>
              {/* act opener */}
              {vh < 712 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: mobile ? '7%' : '12%',
                  textAlign: 'center', opacity: buildHeadT, padding: '0 6vw', zIndex: 4,
                }}>
                  <div style={{ ...L, color: C.t1 }}>Watch it get built.</div>
                </div>
              )}

              {/* pipeline group */}
              {pipeVisible && (
                <div style={{
                  position: 'absolute', inset: 0, opacity: pipeFade,
                  transform: `translateY(${pipeYvh}vh) scale(${pipeScale})`,
                  transformOrigin: '50% 60%', zIndex: 2,
                }}>
                  {/* spine */}
                  <div style={mobile ? {
                    position: 'absolute', left: '16%', top: '16%', width: 1.5, height: '66%',
                    background: C.border,
                  } : {
                    position: 'absolute', left: '8%', right: '8%', top: '50%', height: 1.5,
                    background: C.border,
                  }} />
                  {/* travelling pulse dots (Act 4 floor life) */}
                  {!mobile && vh > 800 && vh < 1160 && [0, 1, 2].map((i) => (
                    <div key={i} style={{
                      position: 'absolute', top: 'calc(50% - 2px)', width: 5, height: 5,
                      borderRadius: '50%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`,
                      animation: `ts-dot-travel ${5 + i * 1.7}s linear infinite`,
                      animationDelay: `${i * 1.4}s`, left: '8%',
                    }} />
                  ))}
                  {/* nodes + connectors */}
                  {STAGES.map((s, i) => {
                    const t = stageT(i);
                    const pos = nodePos(i);
                    return (
                      <React.Fragment key={s.name}>
                        {i > 0 && (
                          <div style={mobile ? {
                            position: 'absolute', left: '16%', top: `${16 + (i - 1) * 13.2 + 3}%`,
                            width: 1.5, height: '13.2%', background: C.blueLt,
                            transform: `scaleY(${t})`, transformOrigin: 'top',
                          } : {
                            position: 'absolute', top: '50%', left: `${8 + (i - 1) * 16.8}%`,
                            width: '16.8%', height: 1.5, background: C.blueLt,
                            transform: `scaleX(${t})`, transformOrigin: 'left', opacity: 0.7,
                          }} />
                        )}
                        <div style={{
                          position: 'absolute', ...pos,
                          transform: `translate(-50%,-50%) scale(${lerp(0.6, 1, t)})`,
                          opacity: t, textAlign: 'center', zIndex: 3,
                        }}>
                          <div style={{ ...MONO, fontSize: mobile ? 10 : 12, color: C.t1, marginBottom: 7, fontWeight: 700 }}>
                            {s.name}
                          </div>
                          <div style={{
                            width: mobile ? 40 : 52, height: mobile ? 40 : 52, margin: '0 auto',
                            borderRadius: 12, border: `1.5px solid ${t > 0.9 ? C.blueLt : C.border}`,
                            background: `${C.blueLt}${t > 0.9 ? '14' : '08'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: t > 0.9 ? `0 0 20px ${C.blueLt}22` : 'none',
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t > 0.9 ? C.green : C.t3 }} />
                          </div>
                          <div style={{ ...MONO, fontSize: mobile ? 8.5 : 10, color: C.t2, marginTop: 7, whiteSpace: 'nowrap' }}>
                            {s.label}
                          </div>
                          {/* dbt test ticks micro-detail */}
                          {i === 3 && dbtTicksT > 0 && (
                            <div style={{ ...MONO, fontSize: 9, color: C.green, marginTop: 4, opacity: dbtTicksT }}>
                              ✓ not_null · ✓ unique · ✓ accepted_values
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  {/* stage copy line (crossfades per active stage) */}
                  {vh > 460 && vh < 702 && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0,
                      top: mobile ? 'auto' : (activeStage % 2 === 0 ? '26%' : '68%'),
                      bottom: mobile ? '4%' : 'auto',
                      textAlign: 'center', padding: '0 8vw',
                    }}>
                      <div key={activeStage} style={{ ...M, color: C.t1, opacity: Math.min(1, stageT(activeStage) * 1.6) }}>
                        {STAGES[activeStage].copy}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3.7 — the number moment */}
              {numWindow && (
                <div style={{ ...centerCol, opacity: numFade, zIndex: 5 }}>
                  <div style={{ position: 'relative', height: '1.2em', ...XL }}>
                    <div style={{
                      color: C.redLt, opacity: 1 - numSwapT,
                      transform: `translateY(${-numSwapT * 36}px) scale(${lerp(1, 0.94, numSwapT)})`,
                    }}>18 days</div>
                    <div style={{
                      position: 'absolute', inset: 0, color: C.green, opacity: numSwapT,
                      transform: `translateY(${(1 - numSwapT) * 36}px) scale(${lerp(0.96, 1, numSwapT)})`,
                    }}>14 min</div>
                  </div>
                  <div style={{ ...SUB, marginTop: 22, opacity: numSubT }}>
                    The same report. The same data. The pipeline is the difference.
                  </div>
                </div>
              )}

              {/* 3.8 — the living diff */}
              {vh > 756 && vh < 812 && (
                <div style={{ ...centerCol, opacity: diffFade, zIndex: 5 }}>
                  <div style={{
                    background: C.cardDeep, border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: 'clamp(16px,3vw,28px) clamp(18px,3.4vw,34px)', textAlign: 'left',
                    maxWidth: '92vw',
                  }}>
                    {DIFF.map(([minus, plus], i) => {
                      const rowT = clamp(diffT * 3.4 - i);
                      const strike = clamp(rowT * 2);
                      const typeT = clamp(rowT * 2 - 0.7);
                      const chars = Math.round(plus.length * typeT);
                      return (
                        <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
                          <div style={{
                            ...MONO, fontSize: 'clamp(10px,1.5vw,13.5px)', color: C.orange,
                            opacity: 1 - strike * 0.85,
                            textDecoration: strike > 0.4 ? 'line-through' : 'none',
                            transform: `translateX(${-strike * 8}px)`,
                          }}>{minus}</div>
                          <div style={{ ...MONO, fontSize: 'clamp(10px,1.5vw,13.5px)', color: '#5BE5C0', minHeight: '1.4em' }}>
                            {plus.slice(0, chars)}{typeT > 0 && typeT < 1 && <span className="ts-cursor" style={{ width: 6, height: 12 }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─────────────── ACT 4: the AI layer ────────────────────────────── */}
          {vh > 798 && vh < 1200 && (
            <>
              {/* pull-back copy */}
              {vh < 900 && (
                <div style={{ ...centerCol, zIndex: 5, transform: 'translateY(-8vh)' }}>
                  <div style={{ ...L, color: C.t1, opacity: ai1T }}>AI doesn't stand on models.</div>
                  <div style={{ ...L, opacity: ai2T, marginTop: 6 }}>
                    <span style={{ color: C.t1 }}>It stands on </span>
                    <span style={{ color: C.cyan, textShadow: `0 0 ${floorBright * 30}px ${C.cyan}66` }}>this.</span>
                  </div>
                </div>
              )}

              {/* platform layer */}
              <div style={{
                position: 'absolute', left: 0, right: 0,
                top: mobile ? '58%' : '56%', opacity: platT * platFade, zIndex: 4,
                display: 'flex', justifyContent: 'center', gap: mobile ? 10 : 34,
                transform: `translateY(${(1 - platT) * 40}px)`,
                flexWrap: 'wrap', padding: '0 4vw',
              }}>
                {PLATFORM.map((n, i) => {
                  const glow = activeMoment >= 0 && MOMENTS[activeMoment].node === i;
                  return (
                    <div key={n} style={{
                      ...MONO, fontSize: mobile ? 9.5 : 12,
                      color: glow ? C.cyan : C.t2,
                      border: `1px solid ${glow ? C.cyan : C.border}`,
                      background: glow ? `${C.cyan}0E` : C.card,
                      borderRadius: 8, padding: mobile ? '7px 10px' : '10px 16px',
                      boxShadow: glow ? `0 0 24px ${C.cyan}33` : 'none',
                      transition: 'all .3s',
                    }}>{n}</div>
                  );
                })}
              </div>

              {/* micro-moments */}
              {MOMENTS.map((m, idx) => {
                const t = seg(p, m.win[0], m.win[1]);
                const io = eseg(p, m.win[0], m.win[0] + 12) * (1 - eseg(p, m.win[1] - 10, m.win[1]));
                if (io <= 0.01) return null;
                const flip = idx % 2 === 1;
                return (
                  <div key={idx} style={{
                    position: 'absolute', left: 0, right: 0, top: mobile ? '6%' : '10%',
                    display: 'flex', flexDirection: mobile ? 'column' : (flip ? 'row-reverse' : 'row'),
                    alignItems: 'center', justifyContent: 'center',
                    gap: mobile ? 14 : 56, opacity: io, padding: '0 5vw', zIndex: 5,
                  }}>
                    <div style={{ transform: mobile ? 'scale(0.78)' : 'none', transformOrigin: 'top center' }}>
                      <m.Scene t={t} />
                    </div>
                    <div style={{ maxWidth: 380, textAlign: mobile ? 'center' : 'left' }}>
                      <div style={{ ...M, color: C.t1 }}>{m.head}</div>
                      <div style={{ ...MONO, fontSize: mobile ? 10.5 : 12.5, color: C.green, marginTop: 12 }}>{m.ev}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ─────────────── ACT 5: proof, then the ask ─────────────────────── */}
          {vh > 1140 && (
            <>
              {/* dashboard */}
              {dashVisible && (
                <div style={{
                  ...centerCol, zIndex: 5,
                  opacity: dashInT * (1 - dashOutT),
                  transform: `translateY(${-dashOutT * 26}vh) scale(${lerp(lerp(0.92, 1, dashInT), 0.6, dashOutT)})`,
                }}>
                  <Dashboard visible={vh > 1148 && vh < 1260} />
                  <div style={{ ...L, color: C.t1, marginTop: 30, opacity: dashHeadT, fontSize: 'clamp(24px,4vw,44px)' }}>
                    This is what done looks like.
                  </div>
                  <div style={{ ...SUB, marginTop: 10, opacity: dashHeadT }}>
                    Live. Automated. Documented well enough that your team owns it.
                  </div>
                </div>
              )}

              {/* method strip */}
              {vh > 1218 && vh < 1296 && (
                <div style={{ ...centerCol, opacity: stripFade, zIndex: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 18, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {METHOD.map((s, i) => {
                      const done = stripT > (i + 0.7) / 5.4;
                      return (
                        <React.Fragment key={s}>
                          <div style={{
                            ...MONO, fontSize: mobile ? 10.5 : 13.5,
                            color: done ? C.green : C.t3,
                            display: 'flex', alignItems: 'center', gap: 7, transition: 'color .25s',
                          }}>
                            <span style={{
                              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                              border: `1.5px solid ${done ? C.green : C.border}`,
                              background: done ? C.green : 'transparent',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              color: C.navy, fontSize: 10, fontWeight: 700, transition: 'all .25s',
                            }}>{done ? '✓' : ''}</span>
                            {s}
                          </div>
                          {i < 4 && <span style={{ color: C.t3, fontSize: 13 }}>→</span>}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div style={{ ...M, color: C.t1, marginTop: 30, fontSize: 'clamp(18px,2.6vw,28px)' }}>
                    Nothing touches production until it's proven.
                  </div>
                  <a href="#/audit" style={{ ...MONO, fontSize: 12, color: C.blueLt, marginTop: 16 }}>
                    read the full method →
                  </a>
                </div>
              )}

              {/* product module */}
              {vh > 1282 && (
                <div style={{ ...centerCol, opacity: moduleT, transform: `translateY(${(1 - moduleT) * 24}px)`, zIndex: 6 }}>
                  <div style={{ ...MONO, fontSize: 12, color: C.blueLt, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    the entry point
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
                    <div style={{ ...L, color: C.t1 }}>Data & AI Readiness Audit</div>
                    {/* docked chip */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 7, opacity: chipDockT,
                      transform: `scale(${lerp(0.7, 1, chipDockT)})`,
                    }}>
                      <ChipRing value={dockedVal} size={30} />
                      <span style={{ ...MONO, fontSize: 13, color: C.green, fontWeight: 700 }}>
                        {chipDockT > 0.92 ? '✓' : dockedVal}
                      </span>
                    </div>
                  </div>
                  <div style={{ ...M, color: C.t1, marginTop: 14 }}>
                    <span style={{ color: C.green }}>4,500 USD</span>
                    <span style={{ color: C.t3 }}> · </span>five days
                    <span style={{ color: C.t3 }}> · </span>a written report
                  </div>
                  <div style={{ ...SUB, marginTop: 16, maxWidth: 520 }}>
                    We map exactly what's wrong in your data stack and sequence the fix.
                    The report is yours — with or without us.
                  </div>
                  <a href="#/audit" className="ts-fill-btn" style={{ marginTop: 30 }}>
                    $ request the audit
                  </a>
                  <div style={{ fontFamily: C.fb, fontSize: 14, color: C.t2, marginTop: 22 }}>
                    What follows, if you choose:{' '}
                    <a href="#/audit" style={{ color: C.blueLt }}>a scoped build</a>, or{' '}
                    <a href="#/audit" style={{ color: C.blueLt }}>ongoing ownership</a>.
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── FOOTER (normal flow, after the pinned container) ── */}
      <footer style={{
        position: 'relative', zIndex: 2, background: '#030810',
        borderTop: `1px solid ${C.border}`, padding: '36px 28px',
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
          {[['Data', () => scrollToVh(430)], ['AI', () => scrollToVh(805)], ['Method', () => scrollToVh(1222)]].map(([l, fn]) => (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); fn(); }}
              style={{ ...MONO, fontSize: 12, color: C.t3 }}>{l}</a>
          ))}
          <a href="#/audit" style={{ ...MONO, fontSize: 12, color: C.t3 }}>Audit</a>
          <a href="mailto:hello@troubleshooter.lk" style={{ ...MONO, fontSize: 12, color: C.t3 }}>hello@troubleshooter.lk</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green,
            boxShadow: `0 0 6px ${C.green}`, animation: 'ts-pulse 2.4s ease-in-out infinite' }} />
          <span style={{ ...MONO, fontSize: 11, color: C.t3 }}># all systems operational</span>
        </div>
      </footer>
    </>
  );
}
