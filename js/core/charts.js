/* charts.js — gráficos SVG ligeros (sin librerías). Los colores salen de variables CSS para respetar el tema. */
(function (root) {
  'use strict';
  const EL = root.EL;

  function niceTicks(a, b, n) {
    const span = b - a; if (!(span > 0)) return [a];
    const raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag, step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = []; for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(Math.abs(v) < 1e-12 ? 0 : +v.toFixed(10));
    return out;
  }
  EL.niceTicks = niceTicks;

  /* chart({W,H,x:[a,b],y:[a,b],xl,yl,m}) -> objeto con escalas y métodos de dibujo; toString() devuelve el <svg>. */
  EL.chart = function (o) {
    const W = o.W || 460, H = o.H || 310, m = Object.assign({ l: 46, r: 12, t: 10, b: 38 }, o.m || {});
    const [x0, x1] = o.x, [y0, y1] = o.y;
    const sx = v => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
    const sy = v => H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b);
    const p = [];
    const f = v => (+v).toFixed(1);
    const c = {
      sx, sy, W, H, m,
      raw(s) { p.push(s); return c; },
      axes(opt) {
        opt = opt || {};
        niceTicks(y0, y1, 5).forEach(t => { p.push(`<line class="gl" x1="${f(m.l)}" x2="${f(W - m.r)}" y1="${f(sy(t))}" y2="${f(sy(t))}"/><text class="tk" x="${f(m.l - 6)}" y="${f(sy(t) + 3.5)}" text-anchor="end">${opt.yfmt ? opt.yfmt(t) : t}</text>`); });
        niceTicks(x0, x1, 6).forEach(t => { p.push(`<line class="gl" y1="${f(m.t)}" y2="${f(H - m.b)}" x1="${f(sx(t))}" x2="${f(sx(t))}"/><text class="tk" x="${f(sx(t))}" y="${f(H - m.b + 15)}" text-anchor="middle">${opt.xfmt ? opt.xfmt(t) : t}</text>`); });
        p.push(`<line class="ax" x1="${f(m.l)}" x2="${f(W - m.r)}" y1="${f(H - m.b)}" y2="${f(H - m.b)}"/><line class="ax" x1="${f(m.l)}" x2="${f(m.l)}" y1="${f(m.t)}" y2="${f(H - m.b)}"/>`);
        if (o.xl) p.push(`<text class="lb" x="${f((m.l + W - m.r) / 2)}" y="${f(H - 6)}" text-anchor="middle">${o.xl}</text>`);
        if (o.yl) p.push(`<text class="lb" transform="rotate(-90)" x="${f(-(m.t + H - m.b) / 2)}" y="13" text-anchor="middle">${o.yl}</text>`);
        return c;
      },
      hline(y, cls) { p.push(`<line class="${cls || 'ref'}" x1="${f(m.l)}" x2="${f(W - m.r)}" y1="${f(sy(y))}" y2="${f(sy(y))}"/>`); return c; },
      vline(x, cls) { p.push(`<line class="${cls || 'ref'}" y1="${f(m.t)}" y2="${f(H - m.b)}" x1="${f(sx(x))}" x2="${f(sx(x))}"/>`); return c; },
      line(xa, ya, xb, yb, cls) { p.push(`<line class="${cls || 'ln'}" x1="${f(sx(xa))}" y1="${f(sy(ya))}" x2="${f(sx(xb))}" y2="${f(sy(yb))}"/>`); return c; },
      /* recta y = a + b x recortada al dominio visible */
      abline(a, b, cls) { return c.line(x0, a + b * x0, x1, a + b * x1, cls); },
      points(xs, ys, cls, r) { xs.forEach((x, i) => p.push(`<circle class="${cls || 'pt'}" cx="${f(sx(x))}" cy="${f(sy(ys[i]))}" r="${r || 3.4}"/>`)); return c; },
      path(xs, ys, cls) { p.push(`<polyline class="${cls || 'ln'}" fill="none" points="${xs.map((x, i) => f(sx(x)) + ',' + f(sy(ys[i]))).join(' ')}"/>`); return c; },
      area(xs, ys, cls) { const b = f(sy(Math.max(y0, 0))); p.push(`<polygon class="${cls || 'ar'}" points="${f(sx(xs[0]))},${b} ${xs.map((x, i) => f(sx(x)) + ',' + f(sy(ys[i]))).join(' ')} ${f(sx(xs[xs.length - 1]))},${b}"/>`); return c; },
      rect(xa, ya, xb, yb, cls) { const X = sx(Math.min(xa, xb)), Y = sy(Math.max(ya, yb)); p.push(`<rect class="${cls || 'sq'}" x="${f(X)}" y="${f(Y)}" width="${f(Math.abs(sx(xb) - sx(xa)))}" height="${f(Math.abs(sy(yb) - sy(ya)))}"/>`); return c; },
      text(x, y, s, cls, anchor) { p.push(`<text class="${cls || 'lb'}" x="${f(sx(x))}" y="${f(sy(y))}" text-anchor="${anchor || 'start'}">${s}</text>`); return c; },
      /* barras de histograma */
      bars(edges, counts, cls) { counts.forEach((v, i) => { const X = sx(edges[i]), X2 = sx(edges[i + 1]); p.push(`<rect class="${cls || 'bar'}" x="${f(X + 0.5)}" y="${f(sy(v))}" width="${f(Math.max(0.5, X2 - X - 1))}" height="${f(Math.max(0, sy(0) - sy(v)))}"/>`); }); return c; },
      toString() { return `<svg viewBox="0 0 ${W} ${H}" role="img" ${o.label ? `aria-label="${EL.esc(o.label)}"` : ''} preserveAspectRatio="xMidYMid meet">${p.join('')}</svg>`; }
    };
    return c;
  };

  /* Histograma: devuelve {edges, counts(densidad)} */
  EL.hist = function (vals, lo, hi, nb) {
    const edges = Array.from({ length: nb + 1 }, (_, i) => lo + (hi - lo) * i / nb), counts = new Array(nb).fill(0);
    vals.forEach(v => { const i = Math.floor((v - lo) / (hi - lo) * nb); if (i >= 0 && i < nb) counts[i]++; });
    const tot = vals.length * (hi - lo) / nb;
    return { edges, counts: counts.map(c => c / tot) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
