// experience/helpers.js — shared tokens + scrub math
export const C = {
  navy: '#09111F', card: '#0F1A2B', cardDeep: '#060E1A', border: '#1C2E45',
  blue: '#2A4DE8', blueLt: '#6B87F5', red: '#E8003D', redLt: '#FF6B8A',
  green: '#27C87A', yellow: '#F0C040', cyan: '#5BE5FF', orange: '#FF9966',
  t1: '#DDE6F0', t2: '#7A8FA8', t3: '#3D526B',
  fm: "'JetBrains Mono', monospace",
  fd: "'Space Grotesk', sans-serif",
  fb: "'Inter', sans-serif",
};

export const TOTAL_VH = 1400; // total scroll length driving the stage

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
// one easing curve everywhere (approximates cubic-bezier(0.22,1,0.36,1))
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);

// seg: normalized 0..1 progress within a [startVh, endVh] window of the 1400vh timeline
export const seg = (p, a, b) => clamp((p * TOTAL_VH - a) / (b - a));

// eased segment — the default for most motion
export const eseg = (p, a, b) => easeOut(seg(p, a, b));

// piecewise value across [vh, value] stops (linear between stops)
export function ramp(p, stops) {
  const x = p * TOTAL_VH;
  if (x <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (x <= stops[i][0]) {
      const t = (x - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]);
      return lerp(stops[i - 1][1], stops[i][1], t);
    }
  }
  return stops[stops.length - 1][1];
}

export const scrollToVh = (vh) => {
  const el = document.getElementById('ts-scroll-container');
  if (!el) return;
  const total = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: el.offsetTop + (vh / TOTAL_VH) * total, behavior: 'smooth' });
};
