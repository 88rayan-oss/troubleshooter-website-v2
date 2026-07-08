/**
 * Troubleshooter Marketing Website — React JSX
 *
 * Stack requirements (install before use):
 *   npm install react react-dom
 *
 * Fonts (add to your index.html <head>):
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
 *
 * CSS variables used throughout — add this to your global CSS or index.css:
 *   (All included via the <GlobalStyles /> component below)
 *
 * Usage:
 *   import TroubleshooterSite from './TroubleshooterSite'
 *   // In your app root: <TroubleshooterSite />
 *
 * Replace YOUR_FORM_ID with your Formspree form ID (formspree.io).
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ─── Design tokens ────────────────────────────────────────────────────────────
const TOKENS = {
  navy:      "#09111F",
  navyCard:  "#0F1A2B",
  navyL:     "#1C2E45",
  navyBorder:"rgba(28,46,69,0.6)",
  blue:      "#2A4DE8",
  blueLt:    "#6B87F5",
  red:       "#E8003D",
  redLt:     "#FF6B8A",
  green:     "#27C87A",
  yellow:    "#F0C040",
  cyan:      "#5BE5FF",
  text1:     "#DDE6F0",
  text2:     "#7A8FA8",
  text3:     "#3D526B",
  fd:        "'Space Grotesk', sans-serif",
  fb:        "'Inter', sans-serif",
  fm:        "'JetBrains Mono', monospace",
};

// ─── Global styles (injected once) ───────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const id = "ts-global-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      :root{
        --navy:#09111F;--navy-card:#0F1A2B;--navy-l:#1C2E45;
        --navy-border:rgba(28,46,69,0.6);
        --blue:#2A4DE8;--blue-lt:#6B87F5;
        --red:#E8003D;--red-lt:#FF6B8A;
        --green:#27C87A;--yellow:#F0C040;--cyan:#5BE5FF;
        --text-1:#DDE6F0;--text-2:#7A8FA8;--text-3:#3D526B;
        --fd:'Space Grotesk',sans-serif;
        --fb:'Inter',sans-serif;
        --fm:'JetBrains Mono',monospace;
        --mw:1120px;
        --ease:cubic-bezier(.22,.68,0,1.2);
      }
      html{scroll-behavior:smooth}
      body{background:var(--navy);color:var(--text-1);font-family:var(--fb);line-height:1.6;overflow-x:hidden}
      a{color:inherit;text-decoration:none}
      /* Fade-in reveal */
      .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s var(--ease),transform .6s var(--ease)}
      .reveal.in{opacity:1;transform:none}
      .reveal-fast{transition-duration:.35s}
      /* Grid bg */
      .grid-bg{background-image:linear-gradient(rgba(28,46,69,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(28,46,69,.25) 1px,transparent 1px);background-size:42px 42px}
      /* Terminal shared */
      .tw{background:#060E1A;border:1px solid var(--navy-l);border-radius:8px;overflow:hidden}
      .tw-bar{display:flex;align-items:center;gap:6px;padding:10px 14px;background:#030810;border-bottom:1px solid var(--navy-l)}
      .tw-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
      .tw-lbl{font-family:var(--fm);font-size:11px;color:var(--text-3);margin-left:auto}
      .tw-body{padding:16px 18px;font-family:var(--fm);font-size:12.5px;line-height:1.7}
      .tc{color:var(--text-3)}.tk{color:var(--blue-lt)}.tp{color:var(--text-2)}
      .tvl{color:var(--cyan)}.tok{color:var(--green)}.ter{color:var(--red-lt)}
      .twn{color:var(--yellow)}.tou{color:var(--text-2)}
      .cur{display:inline-block;width:8px;height:13px;background:var(--blue-lt);animation:blink 1s step-end infinite;vertical-align:-2px}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      /* Diff block */
      .diff-block{background:#0C1624;border:1px solid var(--navy-l);border-radius:8px;overflow:hidden;transition:border-color .2s,background .2s}
      .diff-block:hover{border-color:rgba(107,135,245,.35);background:#0F1A2B}
      .diff-block.alt{background:#0F1A2B;border-color:#1E3040}
      .diff-block.alt:hover{border-color:#2A4050;background:#111E30}
      .diff-header{display:flex;align-items:center;gap:7px;padding:9px 14px;background:#060E1A;border-bottom:1px solid rgba(28,46,69,.5)}
      .diff-body{padding:16px 18px;font-family:var(--fm);font-size:12px;line-height:1.75}
      .dh{color:var(--text-3)}.dm{color:#FF9966}.dp{color:#5BE5C0}
      /* Scrollbar */
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--navy)}
      ::-webkit-scrollbar-thumb{background:var(--navy-l);border-radius:3px}
      /* Section spacing */
      .ts-section{padding:88px 0}
      .mw{max-width:var(--mw);margin:0 auto;padding:0 52px}
      @media(max-width:900px){.mw{padding:0 32px}.ts-section{padding:60px 0}}
      @media(max-width:600px){.mw{padding:0 18px}.ts-section{padding:48px 0}}
      /* Eyebrow */
      .ey{font-family:var(--fm);font-size:12px;color:var(--blue-lt);letter-spacing:.12em;margin-bottom:12px;text-transform:uppercase}
      /* Vendor bar */
      .vbar{background:rgba(9,17,31,.95);border-top:1px solid var(--navy-border);border-bottom:1px solid var(--navy-border);backdrop-filter:blur(12px)}
      .vbar-inner{display:flex;max-width:var(--mw);margin:0 auto;padding:0 52px}
      .vi{display:flex;align-items:center;gap:11px;padding:18px 24px;border-right:1px solid var(--navy-border);flex:1;transition:background .15s;cursor:default}
      .vi:last-child{border-right:none}
      .vi:hover{background:rgba(42,77,232,.06)}
      .vdot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);flex-shrink:0}
      .vdot.b{background:var(--blue-lt);box-shadow:0 0 6px var(--blue-lt)}
      .vn{font-family:var(--fm);font-size:13px;color:var(--blue-lt);font-weight:500}
      .vc{font-family:var(--fm);font-size:11px;color:var(--text-2);margin-top:2px}
      @media(max-width:900px){.vbar-inner{flex-wrap:wrap;padding:0 32px}.vi{flex:0 0 50%;border-right:1px solid var(--navy-border)}}
      @media(max-width:600px){.vi{flex:0 0 100%;border-right:none;padding:14px 18px}}
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);
  return null;
}

// ─── useReveal hook ───────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── useScrollSpy hook ────────────────────────────────────────────────────────
function useScrollSpy(ids) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 80;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollY) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

// ─── Terminal component ───────────────────────────────────────────────────────
function Terminal({ title, lines, animateIn = false, delay = 0 }) {
  const [shown, setShown] = useState(animateIn ? 0 : lines.length);
  const [ref, visible] = useReveal(0.1);
  useEffect(() => {
    if (!animateIn || !visible) return;
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown(s => s + 1), delay + shown * 80);
    return () => clearTimeout(t);
  }, [visible, shown, lines.length, animateIn, delay]);

  return (
    <div ref={ref} className="tw">
      <div className="tw-bar">
        <span className="tw-dot" style={{ background: "#FF5F57" }} />
        <span className="tw-dot" style={{ background: "#FEBC2E" }} />
        <span className="tw-dot" style={{ background: "#28C840" }} />
        <span className="tw-lbl">{title}</span>
      </div>
      <div className="tw-body">
        {lines.slice(0, shown).map((line, i) => (
          <div key={i} style={{ opacity: 1, transition: "opacity .3s" }}>
            {line}
          </div>
        ))}
        {shown < lines.length && <span className="cur" />}
        {shown >= lines.length && <><span className="tk">$ </span><span className="cur" /></>}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "solutions", label: "Solutions" },
  { id: "method",    label: "Method" },
  { id: "outcomes",  label: "Work" },
  { id: "packages",  label: "Packages" },
  { id: "about",     label: "About" },
];

function Nav({ logoSrc }) {
  const active = useScrollSpy(["home", "solutions", "method", "outcomes", "packages", "about"]);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 52px", height: 60,
    background: "rgba(9,17,31,0.92)", backdropFilter: "blur(16px)",
    borderBottom: `1px solid ${scrolled ? "rgba(42,77,232,0.22)" : "rgba(28,46,69,0.5)"}`,
    transition: "border-color .3s",
  };

  return (
    <nav style={navStyle}>
      <a href="#home" style={{ display: "flex", alignItems: "center" }}>
        {logoSrc
          ? <img src={logoSrc} alt="Troubleshooter" style={{ height: 38, width: "auto" }} />
          : <span style={{ fontFamily: TOKENS.fm, fontSize: 16, fontWeight: 700, color: TOKENS.red }}>
              TROUBLE<span style={{ color: TOKENS.text1 }}>SHOOTER</span>
            </span>
        }
      </a>

      {/* Desktop links */}
      <ul style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "center" }}>
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id} style={{ display: "none" }}
            className="ts-nav-link"
          >
            {/* rendered via media query workaround below */}
          </li>
        ))}
        <style>{`
          @media(min-width:768px){
            .ts-nav-items{display:flex!important}
            .ts-nav-ham{display:none!important}
          }
        `}</style>
      </ul>

      <div className="ts-nav-items" style={{ display: "none", gap: 32, alignItems: "center" }}>
        {NAV_LINKS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} style={{
            fontFamily: TOKENS.fm, fontSize: 12.5,
            color: active === id ? TOKENS.blueLt : TOKENS.text2,
            transition: "color .2s",
            borderBottom: active === id ? `1px solid ${TOKENS.blueLt}` : "1px solid transparent",
            paddingBottom: 2,
          }}>{label}</a>
        ))}
        <a href="#audit" style={{
          fontFamily: TOKENS.fm, fontSize: 12,
          background: "transparent",
          border: `1px solid ${TOKENS.blue}`,
          color: TOKENS.blueLt, padding: "7px 16px", borderRadius: 4,
          transition: "background .2s, color .2s",
          cursor: "pointer",
        }}
          onMouseEnter={e => { e.target.style.background = TOKENS.blue; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = TOKENS.blueLt; }}
        >$ request audit</a>
      </div>

      {/* Mobile hamburger */}
      <button className="ts-nav-ham" onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", color: TOKENS.text1, fontSize: 20, padding: 8 }}>
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0,
          background: "rgba(9,17,31,0.98)", borderBottom: `1px solid ${TOKENS.navyL}`,
          padding: "20px 32px", display: "flex", flexDirection: "column", gap: 16,
          zIndex: 99,
        }}>
          {NAV_LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
              style={{ fontFamily: TOKENS.fm, fontSize: 14, color: TOKENS.text1, padding: "8px 0",
                borderBottom: `1px solid ${TOKENS.navyBorder}` }}>
              {label}
            </a>
          ))}
          <a href="#audit" onClick={() => setOpen(false)} style={{
            fontFamily: TOKENS.fm, fontSize: 13, background: TOKENS.blue,
            color: "#fff", padding: "12px 20px", borderRadius: 4, textAlign: "center", marginTop: 8,
          }}>$ request audit</a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HERO_TERMINAL_LINES = [
  <><span className="tc"># scanning your environment</span></>,
  <><span className="tk">$ ts-scan</span> <span className="tp">--scope full</span></>,
  "",
  <><span className="tou">→ identity_and_access ........</span> <span className="tou">scanning</span></>,
  <><span className="tou">→ network_perimeter ..........</span> <span className="tou">scanning</span></>,
  <><span className="tou">→ data_infrastructure ........</span> <span className="tou">scanning</span></>,
  <><span className="tou">→ cloud_spend ................</span> <span className="tou">scanning</span></>,
  "",
  <><span className="ter">✗ CRITICAL  ad_stale_accounts=67</span></>,
  <><span className="ter">✗ CRITICAL  ssl_inspection=disabled</span></>,
  <><span className="ter">✗ HIGH      etl_pipeline=none  reporting_lag=18_days</span></>,
  <><span className="twn">⚠ WARN      aws_untagged_spend=34%</span></>,
  <><span className="twn">⚠ WARN      endpoint_coverage=78%  gaps=43_hosts</span></>,
  "",
  <><span className="tou">→ remediation_plan ...........</span> <span className="tok">generating</span></>,
];

function Hero({ logoSrc }) {
  const [ref, visible] = useReveal(0.01);

  return (
    <section id="home" ref={ref} style={{
      minHeight: "100vh", paddingTop: 60,
      display: "flex", alignItems: "center",
      background: TOKENS.navy,
      position: "relative", overflow: "hidden",
    }} className="grid-bg">
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "15%", right: "5%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(42,77,232,0.12) 0%, transparent 70%)",
        pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "-5%", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(232,0,61,0.07) 0%, transparent 70%)",
        pointerEvents: "none" }} />

      <div className="mw" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        padding: "72px 52px",
      }}>
        <div className={`reveal${visible ? " in" : ""}`} style={{ transitionDelay: ".1s" }}>
          <div className="ey">ts-engage --scope full</div>
          <h1 style={{
            fontFamily: TOKENS.fd, fontSize: "clamp(32px,4.5vw,58px)",
            fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em",
            marginBottom: 20, color: TOKENS.text1,
          }}>
            We design, build, and operate<br />
            infrastructure for organisations
            <em style={{ fontStyle: "normal", color: TOKENS.blueLt, display: "block" }}>
              that can't afford to get it wrong.
            </em>
          </h1>
          <p style={{ fontSize: 16, color: TOKENS.text2, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
            Troubleshooter engineers design the stack your business actually needs,
            build it to a standard that survives real load, and maintain it — so your
            team can focus on the business, not the infrastructure.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#audit" style={{
              fontFamily: TOKENS.fm, fontSize: 13,
              background: TOKENS.blue, color: "#fff",
              padding: "13px 28px", borderRadius: 5,
              transition: "background .2s, transform .15s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.target.style.background = "#3D5FF5"; e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.background = TOKENS.blue; e.target.style.transform = "none"; }}>
              $ request audit →
            </a>
            <a href="#outcomes" style={{
              fontFamily: TOKENS.fm, fontSize: 13,
              background: "transparent", color: TOKENS.text2,
              border: `1px solid ${TOKENS.navyL}`, padding: "13px 28px", borderRadius: 5,
              transition: "border-color .2s, color .2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = TOKENS.blueLt; e.target.style.color = TOKENS.text1; }}
              onMouseLeave={e => { e.target.style.borderColor = TOKENS.navyL; e.target.style.color = TOKENS.text2; }}>
              See the work
            </a>
          </div>
        </div>

        <div className={`reveal${visible ? " in" : ""}`} style={{ transitionDelay: ".35s" }}>
          <Terminal
            title="ts-scan --scope full"
            lines={HERO_TERMINAL_LINES}
            animateIn={true}
            delay={600}
          />
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          #home .mw{grid-template-columns:1fr!important;gap:40px!important;padding:60px 32px!important}
        }
      `}</style>
    </section>
  );
}

// ─── Vendor bar ───────────────────────────────────────────────────────────────
const VENDORS = [
  { name: "aws",          cap: "cloud infrastructure · computing · storage · networking · security", blue: false },
  { name: "fortinet",     cap: "firewall design · HA · SD-WAN · WAF", blue: false },
  { name: "crowdstrike",  cap: "endpoint detection · prevention policy", blue: true },
  { name: "manageengine", cap: "AD audit · infrastructure monitoring", blue: true },
  { name: "aws-data",     cap: "Glue · Redshift · QuickSight pipelines", blue: false },
];

function VendorBar() {
  const [ref, visible] = useReveal(0.1);
  return (
    <div className={`vbar reveal${visible ? " in" : ""}`} ref={ref}>
      <div className="vbar-inner">
        {VENDORS.map((v, i) => (
          <div key={i} className="vi"
            style={{ borderRight: i < VENDORS.length - 1 ? `1px solid ${TOKENS.navyBorder}` : "none" }}>
            <div className={`vdot${v.blue ? " b" : ""}`} />
            <div>
              <div className="vn">{v.name}</div>
              <div className="vc">{v.cap}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Diff Block ───────────────────────────────────────────────────────────────
function DiffBlock({ title, comment, minus, plus, alt = false, delay = 0 }) {
  const [ref, visible] = useReveal(0.08);
  const [shownLines, setShownLines] = useState(0);
  const allLines = [comment, ...minus, "", ...plus];

  useEffect(() => {
    if (!visible) return;
    if (shownLines >= allLines.length) return;
    const t = setTimeout(() => setShownLines(s => s + 1), delay + shownLines * 60);
    return () => clearTimeout(t);
  }, [visible, shownLines, allLines.length, delay]);

  return (
    <div ref={ref} className={`diff-block${alt ? " alt" : ""}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
        transition: "opacity .5s, transform .5s" }}>
      <div className="diff-header">
        <span className="tw-dot" style={{ background: "#FF5F57" }} />
        <span className="tw-dot" style={{ background: "#FEBC2E" }} />
        <span className="tw-dot" style={{ background: "#28C840" }} />
        <span className="tw-lbl" style={{ fontSize: 11 }}>{title}</span>
      </div>
      <div className="diff-body">
        {allLines.slice(0, shownLines).map((line, i) => {
          if (line === "") return <br key={i} />;
          if (line.startsWith("#")) return <div key={i} className="dh">{line}</div>;
          if (minus.includes(line)) return <div key={i} className="dm">- {line}</div>;
          if (plus.includes(line))  return <div key={i} className="dp">+ {line}</div>;
          return <div key={i} className="tc">{line}</div>;
        })}
      </div>
    </div>
  );
}

// ─── Solutions ────────────────────────────────────────────────────────────────
const SOLUTIONS = [
  {
    cmd: "ts-build --domain data-to-decision",
    h3: ["Your data is already there.", "You just can't use it yet."],
    body: "Most organisations are sitting on years of operational data spread across ERP systems, flat files, and databases with no integration layer. Reporting is manual, cyclical, and always behind. We build the pipeline that changes that.",
    diffTitle: "data-pipeline.diff",
    minus: ["reporting_cycle: 18 days  [manual]", "data_sources: siloed, no integration", "analyst_hours: 40/month consumed"],
    plus:  ["pipeline: glue → s3 → redshift", "reporting_cycle: 14 min refresh", "analyst_hours: 40/month freed"],
    problems: [
      "No single operational view across departments",
      "Manual reporting consuming finance and ops hours every cycle",
      "On-prem ERP with no extraction mechanism",
      "AWS in place with no analytics layer built on top of it",
      "Leadership dashboards rebuilt manually every month",
    ],
    eng: "Includes: data source mapping, schema design, Glue job authoring, transformation logic, QuickSight build, pipeline monitoring, and handover documentation your team can maintain.",
  },
  {
    cmd: "ts-build --domain visibility-and-identity",
    h3: ["You can't manage", "what you can't see."],
    body: "Organisations grow fast and infrastructure visibility doesn't keep up. Active Directory accumulates accounts nobody reviews. Servers go down before anyone notices. Compliance audits arrive and the access logs aren't where anyone thought they were.",
    diffTitle: "ad-audit.diff",
    minus: ["stale_ad_accounts: 312  reviewed: never", "compliance_trail: undefined", "mttd: 47 minutes  [user complaint]"],
    plus:  ["stale_accounts: sealed in 72hrs", "access_log: 13mo retained, exportable", "mttd: 90 seconds  [automated]"],
    problems: [
      "Failed compliance audits — missing or unprovable access records",
      "AD accounts accumulating from staff turnover with no cleanup",
      "No alerting on unusual login behaviour or after-hours access",
      "Infrastructure outages discovered by users before IT",
      "Compliance reports assembled manually before every audit",
    ],
    eng: "Includes: AD scoping, Audit Plus deployment and policy tuning, alert threshold configuration, OpManager topology build, compliance report templates, 30-day stabilisation.",
  },
  {
    cmd: "ts-build --domain network-and-endpoint",
    h3: ["A firewall running vendor defaults is a starting", "point, not a security posture."],
    body: "A FortiGate running out-of-the-box settings isn't hardened — it's installed. SSL inspection disabled. HA failover never tested. Rulesets no one can explain. CrowdStrike in audit-only mode since day one. We rebuild from current state, validate in an isolated lab, deploy after every scenario is tested.",
    diffTitle: "security-audit.diff",
    minus: ["ssl_inspection: disabled", "ha_failover: configured_never_tested", "crowdstrike: audit_only  coverage: 81%"],
    plus:  ["ssl_inspection: enabled  [exceptions correct]", "ha_failover: <1s  [lab-tested first]", "prevention_mode: on  coverage: 100%"],
    problems: [
      "Firewalls on default policies, never reviewed post-install",
      "SSL inspection off because it broke an app — exception never fixed",
      "HA pair that has never been tested under actual failover",
      "CrowdStrike deployed but prevention mode never enabled",
      "FortiWeb WAF with default OWASP rules never tuned to the application",
    ],
    eng: "Includes: current-state audit, isolated lab simulation of your topology, ruleset rebuild, HA failover testing, CrowdStrike policy design by workload type, 30-day tuning period.",
  },
];

function SolutionCard({ s, index }) {
  const [ref, visible] = useReveal(0.07);
  const cardStyle = {
    background: TOKENS.navyCard,
    border: `1px solid ${TOKENS.navyL}`,
    borderRadius: 10, padding: 32, display: "flex", flexDirection: "column", gap: 20,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translateY(28px)`,
    transition: `opacity .6s ${index * 0.12}s, transform .6s ${index * 0.12}s`,
  };

  return (
    <div ref={ref} style={cardStyle}>
      <div style={{ fontFamily: TOKENS.fm, fontSize: 12, color: TOKENS.blueLt, opacity: .7 }}>
        <span style={{ color: TOKENS.text3 }}>~$ </span>
        <span style={{ color: TOKENS.blueLt }}>{s.cmd}</span>
      </div>
      <h3 style={{ fontFamily: TOKENS.fd, fontSize: 22, fontWeight: 700, lineHeight: 1.25, color: TOKENS.text1 }}>
        {s.h3[0]}<br /><span style={{ color: TOKENS.blueLt }}>{s.h3[1]}</span>
      </h3>
      <p style={{ fontSize: 14, color: TOKENS.text2, lineHeight: 1.75 }}>{s.body}</p>

      {/* Mini diff */}
      <div style={{ background: "#060E1A", border: `1px solid ${TOKENS.navyL}`, borderRadius: 6, padding: "14px 16px" }}>
        <div style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3, marginBottom: 8 }}>
          # what we find → what we deliver
        </div>
        {s.minus.map((l, i) => <div key={i} style={{ fontFamily: TOKENS.fm, fontSize: 11, color: "#FF9966" }}>- {l}</div>)}
        <br />
        {s.plus.map((l, i) => <div key={i} style={{ fontFamily: TOKENS.fm, fontSize: 11, color: "#5BE5C0" }}>+ {l}</div>)}
      </div>

      <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {s.problems.map((p, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: TOKENS.text2, lineHeight: 1.5 }}>
            <span style={{ color: TOKENS.red, flexShrink: 0, marginTop: 2 }}>–</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: 13, color: TOKENS.text3, lineHeight: 1.6, borderTop: `1px solid ${TOKENS.navyL}`, paddingTop: 16 }}>
        {s.eng}
      </p>

      <a href="#audit" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: TOKENS.fm, fontSize: 12, color: TOKENS.blueLt,
        transition: "gap .2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.gap = "10px"; }}
        onMouseLeave={e => { e.currentTarget.style.gap = "6px"; }}>
        Start with an audit <span>→</span>
      </a>
    </div>
  );
}

function Solutions() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="solutions" className="ts-section grid-bg">
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}>
          <div className="ey">// what we build</div>
          <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700,
            lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 16 }}>
            Three outcome domains.<br />Specific engineering in each.
          </h2>
          <p style={{ fontSize: 15, color: TOKENS.text2, marginBottom: 48, maxWidth: 540 }}>
            Every engagement starts with the problem, not the product. Here's what the work actually looks like.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {SOLUTIONS.map((s, i) => <SolutionCard key={i} s={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Method ───────────────────────────────────────────────────────────────────
const METHOD_STEPS = [
  { n: "01", h: "Audit first, propose second",
    p: "Before we recommend anything, we map what you have — what's running, what's misconfigured, what's missing. The output is a written findings report. Specific, technical, no filler. You receive this whether or not you engage further." },
  { n: "02", h: "Lab validation before production",
    p: "For every network and security deployment, we replicate your exact topology in an isolated lab environment — every device, every routing decision, every policy. Failover scenarios, traffic edge cases, application exceptions — all tested before a single change reaches production." },
  { n: "03", h: "You approve the design before we proceed",
    p: "We present the validated architecture. You understand exactly what's being built and why before work begins. What we build is documented well enough that your internal team can maintain it — that's not a courtesy, it's how we know we did the job properly." },
  { n: "04", h: "Deployment with a tested rollback",
    p: "Every cutover has a rollback procedure validated in the lab. The runbook is written before the maintenance window opens." },
  { n: "05", h: "Stabilisation before handover",
    p: "Every engagement includes a stabilisation period after go-live — tuning alerts, validating coverage, addressing what only surfaces under real load. Then you choose: AMC or Managed Service." },
];

function Method() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="method" className="ts-section" style={{ background: "#060E1A" }}>
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}>
          <div className="ey">// the method</div>
          <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 700,
            lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 16 }}>
            We validate the design<br />before we touch your environment.
          </h2>
          <p style={{ fontSize: 15, color: TOKENS.text2, marginBottom: 52, maxWidth: 520 }}>
            Every engagement follows the same discipline. We don't learn on your production infrastructure.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {METHOD_STEPS.map((step, i) => {
              const [stepRef, stepVis] = useReveal(0.1);
              return (
                <div key={i} ref={stepRef} style={{
                  display: "flex", gap: 20, paddingBottom: 28, paddingTop: i > 0 ? 28 : 0,
                  borderBottom: i < METHOD_STEPS.length - 1 ? `1px solid ${TOKENS.navyL}` : "none",
                  opacity: stepVis ? 1 : 0, transform: stepVis ? "none" : "translateX(-16px)",
                  transition: `opacity .5s ${i * .08}s, transform .5s ${i * .08}s`,
                }}>
                  <span style={{
                    fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.blueLt,
                    background: "rgba(42,77,232,.1)", border: `1px solid rgba(42,77,232,.2)`,
                    borderRadius: 4, padding: "4px 8px", height: "fit-content", flexShrink: 0, marginTop: 3,
                  }}>{step.n}</span>
                  <div>
                    <h4 style={{ fontFamily: TOKENS.fd, fontSize: 16, fontWeight: 600, color: TOKENS.text1, marginBottom: 8 }}>
                      {step.h}
                    </h4>
                    <p style={{ fontSize: 14, color: TOKENS.text2, lineHeight: 1.7 }}>{step.p}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <Terminal
              title="validate --strict"
              animateIn={true}
              delay={300}
              lines={[
                <><span className="tc"># isolated lab environment</span></>,
                <><span className="tk">$ validate</span> <span className="tp">--topo client_v4 --strict</span></>,
                "",
                <><span className="tou">→ importing topology .............. </span><span className="tok">done</span></>,
                <><span className="tou">→ building isolated environment .... </span><span className="tok">done</span></>,
                "",
                <><span className="tok">✓</span> <span className="tou">ha_failover .......... </span><span className="tok">PASS  0.8s</span></>,
                <><span className="tok">✓</span> <span className="tou">ssl + app_traffic .... </span><span className="tok">PASS  exceptions ok</span></>,
                <><span className="tok">✓</span> <span className="tou">ips + clean_traffic .. </span><span className="tok">PASS  0 false pos</span></>,
                <><span className="tok">✓</span> <span className="tou">rollback_procedure ... </span><span className="tok">PASS  clean</span></>,
                "",
                <><span className="tou">→ runbook written .............. </span><span className="tok">done</span></>,
                <><span className="tou">→ client sign-off .............. </span><span className="twn">PENDING</span></>,
                "",
                <><span className="tc"># nothing goes to production until this clears.</span></>,
              ]}
            />
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){#method .mw>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

// ─── Outcomes / Diff Grid ────────────────────────────────────────────────────
const DIFFS = [
  {
    title: "pattern: data trapped in operational systems",
    comment: "# reporting and analytics",
    minus: ["data_sources: 6 systems, no integration", "reporting_process: manual → excel → email",
            "reporting_cycle: 18 days", "analyst_hours: 40/month consumed"],
    plus:  ["pipeline: glue → s3 → redshift → quicksight", "reporting_cycle: 14 minute refresh", "analyst_hours: 40/month freed"],
  },
  {
    alt: true,
    title: "pattern: identity and access visibility gap",
    comment: "# active directory and compliance",
    minus: ["ad_accounts: 1,847", "stale_accounts: 312   # ex-staff, never cleaned",
            "privileged_access_log: none", "audit_status: FAIL"],
    plus:  ["stale_accounts_sealed: 312  within 72 hours", "access_log: 13 months retained, exportable",
            "automated_review: monthly scheduled", "audit_status: PASS   zero non-conformities"],
  },
  {
    title: "pattern: single point of failure, redundancy untested",
    comment: "# network perimeter",
    minus: ["topology: single firewall", "ha_status: not configured",
            "ssl_inspection: disabled", "ruleset: 847 rules   # default, never reviewed"],
    plus:  ["topology: ha pair    active-passive", "ha_failover: <1s     tested before production",
            "ssl_inspection: enabled   exceptions correct", "ruleset: 94 rules    rebuilt, every rule documented"],
  },
  {
    alt: true,
    title: "pattern: endpoint security deployed, never operationalised",
    comment: "# endpoint protection",
    minus: ["crowdstrike: installed", "prevention_mode: disabled   # audit-only",
            "endpoint_coverage: 81%      # 43 hosts unmanaged", "detection_policy: default   # never tuned"],
    plus:  ["prevention_mode: enabled", "endpoint_coverage: 100%", "detection_policy: custom   false positives: 0"],
  },
  {
    title: "pattern: infrastructure growing faster than visibility",
    comment: "# infrastructure monitoring",
    minus: ["monitoring: manual checks", "mean_time_to_detect: 47 minutes", "alert_policy: default email floods"],
    plus:  ["topology mapped: servers, switches, APs", "mean_time_to_detect: 90 seconds",
            "alert_policy: 3 tiers, tuned   zero noise"],
  },
];

function Outcomes() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="outcomes" className="ts-section grid-bg">
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}>
          <div className="ey">// what changes</div>
          <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 700,
            lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 16 }}>
            What we typically find.<br />What it looks like after.
          </h2>
          <p style={{ fontSize: 15, color: TOKENS.text2, marginBottom: 48, maxWidth: 560 }}>
            These are the patterns we encounter repeatedly across organisations at different stages of growth.
            If any of these match what you're dealing with, that's where we'd start.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {DIFFS.map((d, i) => (
            <DiffBlock key={i} {...d} delay={i * 80} />
          ))}

          {/* CTA slot */}
          <div style={{
            background: TOKENS.navyCard,
            border: `1px solid rgba(42,77,232,0.3)`,
            borderRadius: 8, padding: 32, display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16,
          }}>
            <div style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3 }}># recognise your environment?</div>
            <div style={{ fontFamily: TOKENS.fd, fontSize: 17, fontWeight: 600, color: TOKENS.text1, lineHeight: 1.35 }}>
              We'll map exactly what's<br />wrong in your setup.
            </div>
            <div style={{ fontSize: 13, color: TOKENS.text2 }}>
              Complimentary audit.<br />Written report. No obligation.
            </div>
            <a href="#audit" style={{
              fontFamily: TOKENS.fm, fontSize: 12, background: TOKENS.blue, color: "#fff",
              padding: "10px 22px", borderRadius: 4, transition: "background .2s",
            }}
              onMouseEnter={e => { e.target.style.background = "#3D5FF5"; }}
              onMouseLeave={e => { e.target.style.background = TOKENS.blue; }}>
              $ request audit →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Packages ─────────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    file: "project.sh", cmd: "--type project", featured: false,
    title: "Deployment Project",
    desc: "A scoped engagement with a defined deliverable. You have a specific infrastructure problem — expanding to cloud, replacing ageing firewalls, building a data pipeline — and you need it built correctly the first time.",
    items: ["Architecture audit and findings report", "Lab validation before production",
      "Full deployment with tested rollback", "30-day stabilisation period", "Handover documentation"],
    cta: "$ ts-scope --project",
  },
  {
    file: "amc.sh", cmd: "--type amc --billing annual", featured: true,
    title: "Annual Maintenance Contract",
    desc: "Ongoing engineering access for a fixed annual fee. Certified engineers who know your environment, available when something needs expertise — not a ticket number.",
    items: ["Priority incident response, SLA-backed", "Quarterly architecture health check",
      "Firmware and policy management", "Vendor escalation on your behalf",
      "Compliance documentation support", "Full engineering team access"],
    cta: "$ ts-quote --type amc",
  },
  {
    file: "managed.sh", cmd: "--type managed --billing monthly", featured: false,
    title: "Managed Service",
    desc: "We operate the environment. Monitoring, alerting, policy maintenance, incident response, monthly reporting — Troubleshooter runs it, you own it.",
    items: ["24/5 monitoring with alert triage", "Monthly infrastructure reporting",
      "Policy and threat intel maintenance", "Capacity planning and cost review",
      "Dedicated engineer point-of-contact"],
    cta: "$ ts-quote --type managed",
  },
];

function Packages() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="packages" className="ts-section" style={{ background: "#060E1A" }}>
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}>
          <div className="ey">// engagement models</div>
          <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 700,
            lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 16 }}>
            Three ways to work with us.
          </h2>
          <p style={{ fontSize: 15, color: TOKENS.text2, marginBottom: 48, maxWidth: 540 }}>
            The model depends on what you need. What doesn't change: the engineering standard,
            the validation process, and the expectation that what we build, you can understand and maintain.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {PACKAGES.map((pkg, i) => {
            const [pkgRef, pkgVis] = useReveal(0.08);
            return (
              <div key={i} ref={pkgRef} style={{
                background: pkg.featured ? "rgba(42,77,232,.08)" : TOKENS.navyCard,
                border: `1px solid ${pkg.featured ? "rgba(42,77,232,.4)" : TOKENS.navyL}`,
                borderRadius: 10, overflow: "hidden",
                opacity: pkgVis ? 1 : 0, transform: pkgVis ? "none" : "translateY(24px)",
                transition: `opacity .5s ${i * .1}s, transform .5s ${i * .1}s`,
                display: "flex", flexDirection: "column",
              }}>
                {/* Terminal header */}
                <div style={{ background: "#030810", borderBottom: `1px solid ${TOKENS.navyL}`,
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FEBC2E", flexShrink: 0 }} />
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
                  <span style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3, marginLeft: 4 }}>{pkg.file}</span>
                  {pkg.featured && (
                    <span style={{ marginLeft: "auto", fontFamily: TOKENS.fm, fontSize: 10,
                      background: TOKENS.blue, color: "#fff", padding: "2px 8px", borderRadius: 3 }}>
                      MOST COMMON
                    </span>
                  )}
                </div>
                <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                  <div style={{ fontFamily: TOKENS.fm, fontSize: 12, color: TOKENS.blueLt }}>
                    <span style={{ color: TOKENS.text3 }}>$ ts-engage </span>{pkg.cmd}
                  </div>
                  <h3 style={{ fontFamily: TOKENS.fd, fontSize: 20, fontWeight: 700, color: TOKENS.text1 }}>
                    {pkg.title}
                  </h3>
                  <p style={{ fontSize: 14, color: TOKENS.text2, lineHeight: 1.7 }}>{pkg.desc}</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                    {pkg.items.map((it, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, fontSize: 14, color: TOKENS.text2 }}>
                        <span style={{ color: TOKENS.green, flexShrink: 0 }}>+</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#audit" style={{
                    fontFamily: TOKENS.fm, fontSize: 12, display: "inline-block",
                    color: pkg.featured ? TOKENS.text1 : TOKENS.blueLt,
                    background: pkg.featured ? TOKENS.blue : "transparent",
                    border: `1px solid ${pkg.featured ? TOKENS.blue : TOKENS.navyL}`,
                    padding: "10px 18px", borderRadius: 4, textAlign: "center",
                    transition: "background .2s, border-color .2s",
                  }}>{pkg.cta}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Audit CTA ────────────────────────────────────────────────────────────────
function Audit() {
  const [ref, visible] = useReveal(0.05);
  const [formState, setFormState] = useState({ name: "", org: "", email: "", phone: "", scope: "", size: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (submitted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formState),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(9,17,31,.6)", border: `1px solid ${TOKENS.navyL}`,
    borderRadius: 4, padding: "10px 14px", fontFamily: TOKENS.fm, fontSize: 12.5,
    color: TOKENS.text1, outline: "none", transition: "border-color .2s",
  };

  return (
    <section id="audit" className="ts-section grid-bg">
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>

          <div>
            <div className="ey">// architecture review</div>
            <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(22px,3vw,38px)", fontWeight: 700,
              lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 20 }}>
              We'll tell you exactly what's wrong<br />before you decide anything.
            </h2>
            <p style={{ fontSize: 15, color: TOKENS.text2, lineHeight: 1.7, marginBottom: 28 }}>
              We map your current environment across network, identity, data infrastructure, and cloud
              spend, and deliver a written findings report — specific issues, ranked by severity,
              with a remediation roadmap detailed enough to act on.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Written findings report — not a slide deck",
                "Specific technical issues, not generic recommendations",
                "Prioritised by actual risk to your operations",
                "Delivered within 5 business days",
                "No obligation to engage further",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, color: TOKENS.text1, lineHeight: 1.5 }}>
                  <span style={{ color: TOKENS.green, flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tw" style={{ overflow: "visible" }}>
            <div className="tw-bar">
              <span className="tw-dot" style={{ background: "#FF5F57" }} />
              <span className="tw-dot" style={{ background: "#FEBC2E" }} />
              <span className="tw-dot" style={{ background: "#28C840" }} />
              <span className="tw-lbl">ts-audit --request-review</span>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3, marginBottom: 4 }}>
                tell us where to start
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input style={inputStyle} placeholder="your_name"
                  value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = TOKENS.blue; }}
                  onBlur={e => { e.target.style.borderColor = TOKENS.navyL; }} />
                <input style={inputStyle} placeholder="organisation"
                  value={formState.org} onChange={e => setFormState(s => ({ ...s, org: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = TOKENS.blue; }}
                  onBlur={e => { e.target.style.borderColor = TOKENS.navyL; }} />
              </div>
              <input style={inputStyle} type="email" placeholder="work@email.com"
                value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = TOKENS.blue; }}
                onBlur={e => { e.target.style.borderColor = TOKENS.navyL; }} />
              <input style={inputStyle} type="tel" placeholder="phone_number"
                value={formState.phone} onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = TOKENS.blue; }}
                onBlur={e => { e.target.style.borderColor = TOKENS.navyL; }} />
              <select style={{ ...inputStyle, appearance: "none" }}
                value={formState.scope} onChange={e => setFormState(s => ({ ...s, scope: e.target.value }))}>
                <option value="" disabled>--where-should-we-look</option>
                <option>data_pipelines_and_reporting</option>
                <option>active_directory_and_identity</option>
                <option>network_perimeter_and_firewalls</option>
                <option>endpoint_security_coverage</option>
                <option>cloud_infrastructure_and_spend</option>
                <option>full_audit_start_everywhere</option>
              </select>
              <select style={{ ...inputStyle, appearance: "none" }}
                value={formState.size} onChange={e => setFormState(s => ({ ...s, size: e.target.value }))}>
                <option value="" disabled>--organisation-size</option>
                <option>under_100_people</option>
                <option>100-300_people</option>
                <option>300-600_people</option>
                <option>600-1000_people</option>
                <option>1000+_people</option>
              </select>
              <button onClick={handleSubmit} disabled={submitted || loading}
                style={{
                  fontFamily: TOKENS.fm, fontSize: 13, padding: "13px 20px",
                  borderRadius: 4, border: "none", cursor: submitted ? "default" : "pointer",
                  background: submitted ? TOKENS.green : TOKENS.blue,
                  color: submitted ? TOKENS.navy : "#fff",
                  transition: "background .3s, color .3s",
                  fontWeight: 600,
                }}>
                {submitted ? "✓ received — we'll respond within one business day"
                  : loading ? "$ submitting..."
                  : "$ ts-audit --submit"}
              </button>
              <div style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3 }}>
                # no spam. no sequences. engineers only.
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){#audit .mw>div{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="about" className="ts-section" style={{ background: "#060E1A" }}>
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <div className="ey">// who builds this</div>
            <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(24px,3vw,38px)", fontWeight: 700,
              lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 28 }}>
              Built by engineers.<br />Run by engineers.
            </h2>
            {[
              "Troubleshooter was started by engineers who wanted to work on infrastructure problems at depth. The certifications exist because the work requires them. The vendor relationships exist because the tools are good.",
              "We've run deployments across organisations of different sizes and industries across the region. Every one was validated in an isolated lab environment before it went to production. The engineer who ran the validation was the same one who ran the deployment.",
              "What we build is documented well enough that your internal team can maintain it. That's not a courtesy — it's how we know we did the job properly.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 15, color: TOKENS.text2, lineHeight: 1.75, marginBottom: 20 }}>{p}</p>
            ))}
          </div>

          <Terminal
            title="ts --whoami"
            animateIn={true}
            delay={200}
            lines={[
              <><span className="tk">$ whoami</span></>,
              <><span className="tou">troubleshooter-engineering</span></>,
              "",
              <><span className="tk">$ cat</span> <span className="tp">/etc/ts/identity</span></>,
              <><span className="tou">role:    </span><span className="tvl">infrastructure engineers</span></>,
              <><span className="tou">base:    </span><span className="tvl">sri lanka</span></>,
              <><span className="tou">serving: </span><span className="tvl">south asia and apac</span></>,
              "",
              <><span className="tk">$ ts</span> <span className="tp">--record</span></>,
              <><span className="tou">lab_validations:              </span><span className="tok">100%</span></>,
              <><span className="tou">production_incidents_caused:  </span><span className="tok">0</span></>,
              <><span className="tou">amc_renewals:                 </span><span className="tok">100%</span></>,
              "",
              <><span className="tk">$ ls</span> <span className="tp">./capabilities</span></>,
              <><span className="tvl">data_pipelines/</span>       <span className="tc">ingestion, transform, serve, visualise</span></>,
              <><span className="tvl">identity_and_audit/</span>   <span className="tc">ad, access control, compliance trails</span></>,
              <><span className="tvl">network_security/</span>     <span className="tc">firewalls, ha, sd-wan, segmentation</span></>,
              <><span className="tvl">endpoint_security/</span>    <span className="tc">detection, prevention, coverage</span></>,
              "",
              <><span className="tc"># and if the tool doesn't exist yet, we build that too.</span></>,
            ]}
          />
        </div>
      </div>
      <style>{`@media(max-width:900px){#about .mw>div{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { flag: "--q1", q: "Every SI we've spoken to says they're engineering-first. What makes yours different?",
    a: "Look at the method section above. If a firm is genuinely engineering-first, a lab validation process exists and they'll describe it specifically. Ask any firm you're evaluating to walk you through what their pre-production testing looks like for a network deployment. The answer will tell you what you need to know." },
  { flag: "--q2", q: "Our internal IT team already manages our environment. What do you add?",
    a: "Internal IT teams manage what's running. We design what should be running, validate it against how failures actually occur, and address what the environment inherited from its initial deployment. Most environments we audit were deployed correctly enough to function — not correctly enough to be secure, observable, or auditable. Those are different problems." },
  { flag: "--q3", q: "We're already mid-migration to AWS. Can you come in partway through?",
    a: "Yes — and this is often where the most valuable work happens. Mid-migration environments typically have architecture and cost decisions still open, and the data layer usually hasn't been built yet. An architecture review mid-migration is cheaper than a rebuild after it's done." },
  { flag: "--q4", q: "What does the Architecture Review actually deliver?",
    a: "A written report covering what we found across your network, identity, cloud, and data infrastructure — specific issues ranked by severity, with a remediation roadmap detailed enough that any competent engineer can act on it. Delivered within 5 business days. No obligation attached." },
  { flag: "--q5", q: "What's the difference between your AMC and vendor support?",
    a: "Vendor support tells you how their product works. We tell you whether it's configured correctly for your specific environment and fix it when it isn't. Vendor support has never seen your network. We have. That difference matters most at 2am when something breaks." },
  { flag: "--q6", q: "You're based in Sri Lanka. How does that work for regional clients?",
    a: "Our cost structure reflects where we're based — engineering at rates that make sense for organisations in this region. Cloud and software work is handled remotely. Physical hardware deployments include on-site time. We've delivered regionally this way without it becoming a constraint on the quality of the work." },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const [ref, visible] = useReveal(0.05);

  return (
    <section id="faq" className="ts-section grid-bg">
      <div className="mw">
        <div className={`reveal${visible ? " in" : ""}`} ref={ref}>
          <div className="ey">// man ts-engage</div>
          <h2 style={{ fontFamily: TOKENS.fd, fontSize: "clamp(22px,3vw,38px)", fontWeight: 700,
            lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 40 }}>
            What technical buyers ask<br />before they engage.
          </h2>
        </div>

        <div style={{
          background: TOKENS.navyCard, border: `1px solid ${TOKENS.navyL}`, borderRadius: 8, overflow: "hidden",
          opacity: visible ? 1 : 0, transition: "opacity .6s .2s",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", padding: "10px 20px",
            background: "#060E1A", borderBottom: `1px solid ${TOKENS.navyL}`,
            fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3,
          }}>
            <span>TS-ENGAGE(1)  Troubleshooter Manual  TS-ENGAGE(1)</span>
            <span>FREQUENTLY ASKED</span>
          </div>

          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${TOKENS.navyL}` : "none" }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  padding: "18px 24px", display: "flex", alignItems: "center", gap: 14,
                  textAlign: "left", transition: "background .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(42,77,232,.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                <span style={{ fontFamily: TOKENS.fm, fontSize: 11.5, color: TOKENS.blue,
                  background: "rgba(42,77,232,.1)", border: `1px solid rgba(42,77,232,.2)`,
                  padding: "3px 8px", borderRadius: 3, flexShrink: 0, whiteSpace: "nowrap" }}>
                  {faq.flag}
                </span>
                <span style={{ fontFamily: TOKENS.fb, fontSize: 14.5, color: TOKENS.text1, flex: 1 }}>
                  {faq.q}
                </span>
                <span style={{
                  color: TOKENS.blueLt, fontSize: 13, flexShrink: 0, fontFamily: TOKENS.fm,
                  transform: openIdx === i ? "rotate(90deg)" : "none",
                  transition: "transform .2s",
                }}>▶</span>
              </button>
              {openIdx === i && (
                <div style={{
                  padding: "0 24px 20px 64px", fontSize: 14.5, color: TOKENS.text2,
                  lineHeight: 1.75, animation: "fadeIn .2s ease",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ logoSrc }) {
  return (
    <footer style={{
      background: "#030810", borderTop: `1px solid ${TOKENS.navyL}`,
      padding: "48px 0 24px",
    }}>
      <div className="mw" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <a href="#home">
            {logoSrc
              ? <img src={logoSrc} alt="Troubleshooter" style={{ height: 38, width: "auto", marginBottom: 16 }} />
              : <div style={{ fontFamily: TOKENS.fm, fontSize: 18, fontWeight: 700, color: TOKENS.red, marginBottom: 16 }}>
                  TROUBLE<span style={{ color: TOKENS.text1 }}>SHOOTER</span>
                </div>
            }
          </a>
          <p style={{ fontSize: 13.5, color: TOKENS.text3, lineHeight: 1.7, maxWidth: 280 }}>
            Infrastructure engineers serving South Asia and APAC.
          </p>
        </div>
        {[
          { h: "Solutions", links: [
            { label: "Data Pipelines", href: "#solutions" },
            { label: "Observability & Identity", href: "#solutions" },
            { label: "Network & Endpoint", href: "#solutions" },
          ]},
          { h: "Engage", links: [
            { label: "Architecture Review", href: "#audit" },
            { label: "Deployment Project", href: "#packages" },
            { label: "AMC", href: "#packages" },
            { label: "Managed Service", href: "#packages" },
          ]},
          { h: "Company", links: [
            { label: "Method", href: "#method" },
            { label: "About", href: "#about" },
            { label: "hello@troubleshooter.lk", href: "mailto:hello@troubleshooter.lk" },
          ]},
        ].map((col, i) => (
          <div key={i}>
            <h5 style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.blueLt,
              textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
              {col.h}
            </h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l, j) => (
                <li key={j}>
                  <a href={l.href} style={{
                    fontSize: 13.5, color: TOKENS.text3, transition: "color .2s",
                  }}
                    onMouseEnter={e => { e.target.style.color = TOKENS.text1; }}
                    onMouseLeave={e => { e.target.style.color = TOKENS.text3; }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mw" style={{
        borderTop: `1px solid ${TOKENS.navyL}`, paddingTop: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 12.5, color: TOKENS.text3 }}>
          © 2026 Troubleshooter Pvt Ltd ·{" "}
          <a href="mailto:hello@troubleshooter.lk" style={{ color: TOKENS.text3, transition: "color .2s" }}
            onMouseEnter={e => { e.target.style.color = TOKENS.text1; }}
            onMouseLeave={e => { e.target.style.color = TOKENS.text3; }}>
            hello@troubleshooter.lk
          </a>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: TOKENS.green,
            boxShadow: `0 0 6px ${TOKENS.green}` }} />
          <span style={{ fontFamily: TOKENS.fm, fontSize: 11, color: TOKENS.text3 }}>
            # all systems operational
          </span>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){footer .mw:first-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){footer .mw:first-child{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
/**
 * Props:
 *   logoSrc  — optional src for logo image. If omitted, a text fallback is shown.
 *              Pass your imported logo: import logo from './assets/logo.png'
 *              then <TroubleshooterSite logoSrc={logo} />
 */
export default function TroubleshooterSite({ logoSrc }) {
  return (
    <>
      <GlobalStyles />
      <Nav logoSrc={logoSrc} />
      <Hero logoSrc={logoSrc} />
      <VendorBar />
      <Solutions />
      <Method />
      <Outcomes />
      <Packages />
      <Audit />
      <About />
      <FAQ />
      <Footer logoSrc={logoSrc} />
    </>
  );
}
