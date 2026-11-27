/* util.js — utilidades generales, álgebra lineal mínima y renderizado de fórmulas.
   Todo cuelga del espacio de nombres global EL (EconoLab). Sin dependencias salvo KaTeX (local). */
(function (root) {
  'use strict';
  const EL = root.EL = root.EL || {};

  EL.$ = (s, r) => (r || document).querySelector(s);
  EL.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  EL.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  EL.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  EL.fmt = (x, d) => Number.isFinite(x) ? x.toFixed(d === undefined ? 3 : d).replace('-', '−') : '—';
  EL.pct = x => Number.isFinite(x) ? Math.round(x * 100) + ' %' : '—';
  EL.mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  EL.sum = a => a.reduce((s, v) => s + v, 0);
  EL.shuffle = (arr, rnd) => {
    const a = arr.slice(); const r = rnd || Math.random;
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* Generador pseudoaleatorio con semilla (mulberry32) y normal estándar (Box–Muller). */
  EL.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  EL.gauss = function (r) { let u = 0; while (!u) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* ---------- Álgebra matricial mínima (matrices = arreglos de filas) ---------- */
  const M = EL.mat = {};
  M.T = A => A[0].map((_, j) => A.map(r => r[j]));
  M.mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
  M.vec = (A, v) => A.map(r => r.reduce((s, x, k) => s + x * v[k], 0));
  M.eye = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
  M.inv = function (A) {            // Gauss–Jordan con pivoteo parcial; devuelve null si es singular
    const n = A.length;
    const a = A.map((r, i) => r.concat(M.eye(n)[i]));
    for (let i = 0; i < n; i++) {
      let p = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[p][i])) p = r;
      if (Math.abs(a[p][i]) < 1e-10) return null;
      [a[i], a[p]] = [a[p], a[i]];
      const d = a[i][i];
      for (let j = 0; j < 2 * n; j++) a[i][j] /= d;
      for (let r = 0; r < n; r++) if (r !== i) { const f = a[r][i]; if (f) for (let j = 0; j < 2 * n; j++) a[r][j] -= f * a[i][j]; }
    }
    return a.map(r => r.slice(n));
  };
  M.det2 = A => A[0][0] * A[1][1] - A[0][1] * A[1][0];

  /* MCO completo. X ya incluye la columna de unos si hay intercepto (k = nº de columnas = parámetros). */
  EL.ols = function (X, y, opts) {
    opts = opts || {};
    const n = y.length, k = X[0].length, Xt = M.T(X);
    const XtX = M.mul(Xt, X), inv = M.inv(XtX);
    if (!inv) return null;
    const Xty = M.vec(Xt, y);
    const beta = M.vec(inv, Xty);
    const yhat = M.vec(X, beta);
    const res = y.map((v, i) => v - yhat[i]);
    const scr = EL.sum(res.map(e => e * e));
    const ybar = EL.mean(y);
    const sct = EL.sum(y.map(v => (v - ybar) * (v - ybar)));
    const gl = n - k, s2 = gl > 0 ? scr / gl : NaN;
    const V = inv.map(r => r.map(v => v * s2));
    const se = V.map((r, i) => Math.sqrt(r[i]));
    const r2 = sct > 0 ? 1 - scr / sct : NaN;
    const r2a = gl > 0 && sct > 0 ? 1 - (1 - r2) * (n - 1) / gl : NaN;
    return { n, k, gl, beta, yhat, res, scr, sct, sce: sct - scr, s2, V, se, r2, r2a, XtX, XtXinv: inv, Xty };
  };
  EL.olsSimple = (x, y) => EL.ols(x.map(v => [1, v]), y);

  /* ---------- Distribuciones (para valores críticos y p-valores) ---------- */
  function lgamma(z) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let x = z, y = z, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  function betacf(a, b, x) {
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break;
    }
    return h;
  }
  function ibeta(x, a, b) {          // beta incompleta regularizada I_x(a,b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  const D = EL.dist = {};
  D.tCdf = (t, v) => { const x = v / (v + t * t), p = 0.5 * ibeta(x, v / 2, 0.5); return t > 0 ? 1 - p : p; };
  D.tPdf = (t, v) => Math.exp(lgamma((v + 1) / 2) - lgamma(v / 2)) / Math.sqrt(v * Math.PI) * Math.pow(1 + t * t / v, -(v + 1) / 2);
  D.tPvalue2 = (t, v) => 2 * (1 - D.tCdf(Math.abs(t), v));
  D.tCrit = function (alpha2, v) {   // cuantil superior de cola alpha2 por bisección
    let lo = 0, hi = 200;
    for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (1 - D.tCdf(m, v) > alpha2) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  D.fCdf = (f, d1, d2) => f <= 0 ? 0 : ibeta(d1 * f / (d1 * f + d2), d1 / 2, d2 / 2);
  D.fPdf = (f, d1, d2) => f <= 0 ? 0 : Math.exp(0.5 * (d1 * Math.log(d1 * f) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * f + d2)) - Math.log(f) - (lgamma(d1 / 2) + lgamma(d2 / 2) - lgamma((d1 + d2) / 2)));
  D.fCrit = function (alpha, d1, d2) {
    let lo = 0, hi = 1000;
    for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (1 - D.fCdf(m, d1, d2) > alpha) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  D.normPdf = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  D.normCdf = z => {                 // Abramowitz–Stegun 7.1.26 (error < 1.5e-7)
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  };
  D.chi1P = x => 2 * (1 - D.normCdf(Math.sqrt(Math.max(x, 0))));   // p-valor de chi-cuadrado con 1 gl

  /* ---------- Fórmulas: $...$ en línea y $$...$$ en bloque, dentro de texto HTML ya insertado ---------- */
  const TEX_RE = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  EL.renderMath = function (rootEl) {
    if (!root.katex || !rootEl) return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (n.nodeValue.indexOf('$') < 0) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (p && p.closest('script,style,textarea,input,.katex,.nomath')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue; TEX_RE.lastIndex = 0;
      let m, last = 0; const frag = document.createDocumentFragment(); let any = false;
      while ((m = TEX_RE.exec(text))) {
        any = true;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const span = document.createElement('span');
        const disp = m[1] !== undefined;
        try { root.katex.render((disp ? m[1] : m[2]).trim(), span, { displayMode: disp, throwOnError: false }); }
        catch (e) { span.textContent = m[0]; }
        if (disp) span.className = 'dmath';
        frag.appendChild(span); last = m.index + m[0].length;
      }
      if (!any) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
