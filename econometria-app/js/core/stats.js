/* stats.js — Regresión con salida tipo Stata y pruebas de diagnóstico (White, Breusch–Pagan, RESET, Goldfeld–Quandt, Durbin–Watson,
   Cochrane–Orcutt, Newey–West, VIF). Se usa para generar casos resueltos y ejercicios con TABLAS CONSISTENTES: todas las cifras salen de
   simulaciones con semilla fija, no de números pegados a mano.                                                                         */
(function (root) {
  'use strict';
  const EL = root.EL, f = (x, d) => (Number.isFinite(x) ? x.toFixed(d === undefined ? 4 : d) : '—');
  const S = EL.stats = {};

  /* Regresión con intercepto: xs = [vector x1, x2, …] (columnas), y. Devuelve el objeto de EL.ols más ANOVA y p-valores. */
  S.reg = function (xs, y) {
    const n = y.length, X = y.map((_, i) => [1].concat(xs.map(c => c[i])));
    const m = EL.ols(X, y); if (!m) return null;
    const k = m.k, ess = m.sct - m.scr, msm = ess / (k - 1), mse = m.scr / (n - k);
    m.X = X; m.ess = ess; m.F = msm / mse; m.pF = 1 - EL.dist.fCdf(m.F, k - 1, n - k);
    m.t = m.beta.map((b, i) => b / m.se[i]); m.p = m.t.map(t => EL.dist.tPvalue2(t, n - k));
    const tc = EL.dist.tCrit(0.025, n - k); m.ci = m.beta.map((b, i) => [b - tc * m.se[i], b + tc * m.se[i]]);
    m.rmse = Math.sqrt(mse); m.tc = tc; m.n = n;
    return m;
  };
  const sci = x => { if (x === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(x))); return Math.abs(e) >= 5 ? (x / Math.pow(10, e)).toFixed(4) + 'e' + (e >= 0 ? '+' : '-') + String(Math.abs(e)).padStart(2, '0') : x.toFixed(Math.max(0, 4 - Math.max(0, e))); };
  const pad = (s, w) => String(s).padStart(w, ' ');
  S.sci = sci;

  /* Salida estilo Stata (texto monoespaciado). names = nombres de las regresoras (sin constante); decimales ajustables por d. */
  S.stata = function (m, yname, names, opts) {
    opts = opts || {}; const d = opts.d === undefined ? 4 : opts.d, n = m.n, k = m.k;
    const num = x => Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? sci(x) : x.toFixed(d);
    const p3 = p => p < 0.0005 ? '0.000' : p.toFixed(3);
    const lines = [];
    lines.push(`      Source |       SS         df       MS            Number of obs = ${pad(n, 6)}`);
    lines.push(`-------------+------------------------------            F(${k - 1}, ${n - k})${' '.repeat(Math.max(1, 8 - String(k - 1).length - String(n - k).length))}= ${pad(m.F.toFixed(2), 8)}`);
    lines.push(`       Model | ${pad(num(m.ess), 11)} ${pad(k - 1, 4)} ${pad(num(m.ess / (k - 1)), 11)}            Prob > F      = ${pad(m.pF < 0.00005 ? '0.0000' : m.pF.toFixed(4), 8)}`);
    lines.push(`    Residual | ${pad(num(m.scr), 11)} ${pad(n - k, 4)} ${pad(num(m.scr / (n - k)), 11)}            R-squared     = ${pad(m.r2.toFixed(4), 8)}`);
    lines.push(`-------------+------------------------------            Adj R-squared = ${pad(m.r2a.toFixed(4), 8)}`);
    lines.push(`       Total | ${pad(num(m.sct), 11)} ${pad(n - 1, 4)} ${pad(num(m.sct / (n - 1)), 11)}            Root MSE      = ${pad(num(m.rmse), 8)}`);
    lines.push('');
    lines.push(`${pad(yname, 12)} |      Coef.   Std. Err.      t    P>|t|     [95% Conf. Interval]`);
    lines.push('-------------+----------------------------------------------------------------');
    const nm = names.concat(['_cons']), order = names.map((_, i) => i + 1).concat([0]);
    order.forEach((j, r) => lines.push(`${pad(nm[r], 12)} | ${pad(num(m.beta[j]), 10)} ${pad(num(m.se[j]), 11)} ${pad(m.t[j].toFixed(2), 8)} ${pad(p3(m.p[j]), 7)}   ${pad(num(m.ci[j][0]), 10)} ${pad(num(m.ci[j][1]), 10)}`));
    return `<pre class="stata nomath">${lines.join('\n').replace(/</g, '&lt;')}</pre>`;
  };

  /* Prueba de White (versión del curso): e² sobre x y x² (una regresora) → n·R² ~ χ²(2); p = exp(−x/2). */
  S.white = function (x, e) {
    const aux = S.reg([x, x.map(v => v * v)], e.map(v => v * v)), st = aux.n * aux.r2;
    return { stat: st, df: 2, p: Math.exp(-st / 2), aux };
  };
  S.bp = function (x, e) { const aux = S.reg([x], e.map(v => v * v)), st = aux.n * aux.r2; return { stat: st, df: 1, p: EL.dist.chi1P(st), aux }; };
  /* RESET (ŷ²): añade ŷ² al modelo; devuelve t y p del coeficiente de ŷ². */
  S.reset = function (xs, y, m) { const y2 = m.yhat.map(v => v * v), r = S.reg(xs.concat([y2]), y), j = r.k - 1; return { t: r.t[j], p: r.p[j], F: r.t[j] ** 2, reg: r, df2: r.n - r.k }; };
  /* Goldfeld–Quandt: ordenar por x, omitir c observaciones centrales, F = RSS2/RSS1. */
  S.gq = function (x, y, c) {
    const idx = x.map((_, i) => i).sort((a, b) => x[a] - x[b]), n = x.length, g = (n - c) / 2;
    const lo = idx.slice(0, g), hi = idx.slice(n - g), r1 = S.reg([lo.map(i => x[i])], lo.map(i => y[i])), r2 = S.reg([hi.map(i => x[i])], hi.map(i => y[i]));
    const F = r2.scr / r1.scr, df = g - 2; return { rss1: r1.scr, rss2: r2.scr, F, df, p: 1 - EL.dist.fCdf(F, df, df), g };
  };
  S.dw = function (e) { return EL.sum(e.slice(1).map((v, i) => (v - e[i]) ** 2)) / EL.sum(e.map(v => v * v)); };
  S.rho = function (e) { return EL.sum(e.slice(1).map((v, i) => v * e[i])) / EL.sum(e.map(v => v * v)); };
  /* Cochrane–Orcutt iterativo (pierde la 1.ª observación). xs = regresoras. */
  S.cochrane = function (xs, y, iters) {
    let r = 0, m = null;
    for (let it = 0; it < (iters || 20); it++) {
      const ys = y.slice(1).map((v, i) => v - r * y[i]), xt = xs.map(c => c.slice(1).map((v, i) => v - r * c[i]));
      m = S.reg(xt, ys); const b0 = m.beta[0] / (1 - r), b = [b0].concat(m.beta.slice(1)), e = y.map((v, i) => v - b0 - xs.reduce((s, c, j) => s + c[i] * b[j + 1], 0)), rn = S.rho(e);
      if (Math.abs(rn - r) < 1e-6) { r = rn; break; } r = rn;
    }
    const ys = y.slice(1).map((v, i) => v - r * y[i]), xt = xs.map(c => c.slice(1).map((v, i) => v - r * c[i]));
    m = S.reg(xt, ys); m.rho = r; m.alpha = m.beta[0] / (1 - r); m.dw = S.dw(m.res);
    return m;
  };
  /* Errores Newey–West para el coeficiente j (j=1 primera regresora). */
  S.neweyWest = function (m, L) {
    const X = m.X, e = m.res, n = m.n, k = m.k; L = L === undefined ? Math.floor(4 * Math.pow(n / 100, 2 / 9)) : L;
    const Sg = Array.from({ length: k }, () => new Array(k).fill(0));
    for (let i = 0; i < n; i++) for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) Sg[a][b] += e[i] * e[i] * X[i][a] * X[i][b];
    for (let l = 1; l <= L; l++) { const w = 1 - l / (L + 1); for (let i = l; i < n; i++) for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) Sg[a][b] += w * e[i] * e[i - l] * (X[i][a] * X[i - l][b] + X[i - l][a] * X[i][b]); }
    const V = EL.mat.mul(EL.mat.mul(m.XtXinv, Sg), m.XtXinv); return V.map((r, i) => Math.sqrt(r[i]));
  };
  /* FIV de cada regresora (regresión auxiliar sobre las demás). */
  S.vif = function (xs) { return xs.map((c, j) => { const others = xs.filter((_, i) => i !== j), a = S.reg(others, c); return { r2: a.r2, vif: 1 / (1 - a.r2) }; }); };
  S.corr = (a, b) => { const ma = EL.mean(a), mb = EL.mean(b), sab = EL.sum(a.map((v, i) => (v - ma) * (b[i] - mb))), saa = EL.sum(a.map(v => (v - ma) ** 2)), sbb = EL.sum(b.map(v => (v - mb) ** 2)); return sab / Math.sqrt(saa * sbb); };
  S.fmt = f;
})(typeof window !== 'undefined' ? window : globalThis);
