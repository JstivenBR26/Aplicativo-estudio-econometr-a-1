/* labs2.js — Laboratorios del Corte 2: "Panorama de violaciones" y "Consistencia y TLC" (teoría asintótica). Usa EL.labKit de labs.js. */
(function (root) {
  'use strict';
  const EL = root.EL, K = EL.labKit, f = EL.fmt, mean = EL.mean, stat = K.stat, box = K.box, read = K.read, legend = K.legend;

  /* ======================================================================== PANORAMA */
  const sd = a => { const m = mean(a); return Math.sqrt(EL.sum(a.map(v => (v - m) ** 2)) / (a.length - 1)); };
  const AR = (r, n, rho) => { const o = []; let p = 0; for (let i = 0; i < n + 20; i++) { p = rho * p + Math.sqrt(1 - rho * rho) * EL.gauss(r); if (i >= 20) o.push(p); } return o; };
  const SC = {
    ctrl: { t: 'Sin problema (control)', th: ['Sí', 'Sí', 'Sí', 'Sí'], det: 'Nada que detectar: es el punto de comparación.', rem: '—', gen: (r, n) => { const x = Array.from({ length: n }, () => EL.gauss(r)); return { X: x.map(a => [1, a]), y: x.map(a => 1 + a + EL.gauss(r)) }; } },
    func: { t: 'Forma funcional mal especificada (falta x²)', th: ['No', 'No', 'No', 'No'], det: 'Gráfico de residuos (curva), RESET.', rem: 'Añadir el término omitido / transformar variables.', gen: (r, n) => { const x = Array.from({ length: n }, () => 1 + EL.gauss(r)); return { X: x.map(a => [1, a]), y: x.map(a => 1 + a + 0.8 * a * a + EL.gauss(r)) }; } },
    endo: { t: 'Endogeneidad (x correlacionada con el error)', th: ['No', 'No', 'No', 'No'], det: 'Razonamiento económico, prueba de Hausman, instrumentos.', rem: 'Variables instrumentales / MC2E.', gen: (r, n) => { const x = [], y = []; for (let i = 0; i < n; i++) { const z = EL.gauss(r), e = EL.gauss(r), a = z + 0.8 * e; x.push(a); y.push(1 + a + e); } return { X: x.map(a => [1, a]), y }; } },
    colin: { t: 'Multicolinealidad imperfecta (ρ = 0.97)', th: ['Sí', 'Sí', 'Sí (grandes)', 'Sí'], det: 'FIV, regresiones auxiliares, síntomas.', rem: 'Más datos, información a priori, combinar variables.', gen: (r, n) => { const a = [], b = [], y = []; for (let i = 0; i < n; i++) { const u = EL.gauss(r), w = 0.97 * u + Math.sqrt(1 - 0.9409) * EL.gauss(r); a.push(u); b.push(w); y.push(1 + u + w + EL.gauss(r)); } return { X: a.map((u, i) => [1, u, b[i]]), y }; } },
    hetero: { t: 'Heteroscedasticidad (σᵢ ∝ |x|)', th: ['Sí', 'No', 'No', 'No'], det: 'Gráfico en abanico, Breusch–Pagan, White.', rem: 'Errores de White; MCP/MCG; logaritmos.', gen: (r, n) => { const x = Array.from({ length: n }, () => EL.gauss(r)); return { X: x.map(a => [1, a]), y: x.map(a => 1 + a + Math.abs(a) * EL.gauss(r)) }; } },
    auto: { t: 'Autocorrelación positiva (ρ = 0.8, x persistente)', th: ['Sí', 'No', 'No', 'No'], det: 'Residuos en el tiempo, Durbin–Watson, Breusch–Godfrey.', rem: 'Revisar especificación; MCGF; errores Newey–West.', gen: (r, n) => { const x = AR(r, n, 0.8), e = AR(r, n, 0.8); return { X: x.map(a => [1, a]), y: x.map((a, i) => 1 + a + e[i]) }; } },
    nonn: { t: 'No normalidad (errores asimétricos, n pequeño)', th: ['Sí', 'Sí', 'Sí', 'Aprox.'], det: 'Jarque–Bera, gráfico Q–Q.', rem: 'Con n grande el TLC basta; con n pequeño, bootstrap.', gen: (r, n) => { const x = Array.from({ length: n }, () => EL.gauss(r)); return { X: x.map(a => [1, a]), y: x.map(a => 1 + a - Math.log(1 - r()) - 1) }; } }
  };
  K.reg('panorama', 'Panorama: simula cada violación y mira qué se rompe', 't13', 'Elegir un problema, simularlo 600 veces y comprobar empíricamente si $\\hat\\beta$ es insesgado, si los errores estándar son correctos y si la prueba $t$ rechaza con la frecuencia nominal.', el => {
    K.lab(el, {
      seed: 14,
      controls: [{ id: 's', type: 'select', label: 'Problema', val: 'hetero', options: Object.entries(SC).map(([k, v]) => [k, v.t]) }, { id: 'n', label: 'Tamaño de muestra n', min: 15, max: 200, step: 5, val: 50 }],
      buttons: [{ id: 'new', label: 'Repetir simulación', primary: true }],
      note: 'Modelo verdadero: y = 1 + 1·x + ε (en “colinealidad”: 1 + x₁ + x₂). Se contrasta H₀: β = 1, que es verdadera: si la prueba funciona bien, rechaza ≈ 5 %.',
      render(v, st) {
        const S = SC[v.s], R = 600, r = EL.rng(st.seed + v.s.length * 7919), b = [], se = []; let rej = 0;
        for (let t = 0; t < R; t++) {
          const d = S.gen(r, v.n), m = EL.ols(d.X, d.y); if (!m) continue;
          b.push(m.beta[1]); se.push(m.se[1]);
          if (Math.abs((m.beta[1] - 1) / m.se[1]) > EL.dist.tCrit(0.025, m.gl)) rej++;
        }
        const mb = mean(b), s = sd(b), mse = mean(se), mcerr = s / Math.sqrt(b.length), rr = 100 * rej / b.length;
        const unb = Math.abs(mb - 1) < 0.04 + 2 * mcerr, seok = mse / s > 0.85 && mse / s < 1.15, tok = rr > 3.3 && rr < 7;
        const mk = ok => ok ? '<b style="color:var(--good)">✓ sí</b>' : '<b style="color:var(--bad)">✗ no</b>';
        const lo = Math.min(...b) - 0.1, hi = Math.max(...b) + 0.1, h = EL.hist(b, lo, hi, 40);
        const c = EL.chart({ x: [lo, hi], y: [0, Math.max(...h.counts) * 1.15], xl: 'estimación de β (verdadero = 1)', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
        c.bars(h.edges, h.counts, 'bar').vline(1, 'ref').vline(mb, 'ref2');
        return box('Distribución de β̂ en 600 muestras — ' + S.t, c.toString()) +
          `<div class="stats">${stat('Media de β̂', f(mb, 3), 'verdadero 1 (línea punteada naranja = media)')}${stat('Desv. est. real de β̂', f(s, 3))}${stat('ee usual promedio', f(mse, 3), `ee usual / desv. real = ${f(mse / s, 2)}`)}${stat('Rechazos de H₀ verdadera', f(rr, 1) + ' %', 'nominal: 5 %')}</div>
          <div class="chartbox"><h4>Veredicto empírico vs. teoría</h4><table class="tbl"><tr><th>Pregunta</th><th>Simulación</th><th>Teoría</th></tr>
          <tr><td>¿Insesgado?</td><td>${mk(unb)}</td><td>${S.th[0]}</td></tr><tr><td>¿MELI?</td><td><i>no se mide aquí</i></td><td>${S.th[1]}</td></tr>
          <tr><td>¿Errores estándar usuales correctos? (ee/desv. real ≈ 1)</td><td>${mk(seok)}</td><td>${S.th[2]}</td></tr>
          <tr><td>¿$t$ válida? (rechaza ≈ 5 %)</td><td>${mk(tok)}</td><td>${S.th[3]}</td></tr></table></div>` +
          read(`<p><b>Detección:</b> ${S.det} <b>Remedio:</b> ${S.rem}</p><p>Prueba con la <b>colinealidad</b>: la campana es muy ancha (desviación grande) pero el $ee$ usual la describe bien y el insesgamiento se mantiene: <i>problema de precisión, no de validez</i>. Con <b>heteroscedasticidad</b> y <b>autocorrelación</b> la campana está centrada en 1 (insesgado) pero el $ee$ usual queda por debajo de la desviación real y la prueba rechaza mucho más del 5 %. Con <b>endogeneidad</b> y <b>forma funcional</b> la campana ni siquiera está centrada en 1.</p><p class="small muted">Nota: en endogeneidad el $ee$ puede describir bien la dispersión <i>alrededor del valor equivocado</i> (cociente ≈ 1); aun así la inferencia es inválida porque el $t$ se centra en el valor erróneo y rechaza casi siempre.</p>`);
      }
    });
  });

  /* ======================================================================== CONSISTENCIA Y TLC */
  const NS = [10, 25, 50, 100, 250, 500, 1000, 2500];
  K.reg('asint', 'Consistencia y TLC: qué pasa cuando n crece', 't14', 'Ver cómo la distribución de $\\hat\\beta$ se concentra (o no) y cómo su forma tiende a la normal aunque el error no lo sea.', el => {
    const draw = (r, kind) => kind === 'norm' ? EL.gauss(r) : kind === 'exp' ? -Math.log(1 - r()) - 1 : (r() - 0.5) * Math.sqrt(12);
    K.lab(el, {
      seed: 8,
      controls: [{ id: 'i', label: 'Tamaño de muestra n (índice)', min: 0, max: 7, step: 1, val: 2 }, { id: 'sc', type: 'select', label: 'Escenario', val: 'exo', options: [['exo', 'Exógeno: Cov(x,ε)=0 (consistente)'], ['endo', 'Endógeno: x = z + ε (inconsistente)']] }, { id: 'er', type: 'select', label: 'Distribución del error', val: 'exp', options: [['norm', 'Normal'], ['exp', 'Exponencial centrada (muy asimétrica)'], ['uni', 'Uniforme']] }],
      buttons: [{ id: 'new', label: 'Repetir simulación', primary: true }],
      note: 'Modelo: y = 1 + 2x + ε, β₁ = 2, con x asimétrica (exponencial centrada, varianza 1). En el caso endógeno plim β̂₁ = 2 + Cov(x,ε)/Var(x) = 2 + 1/2 = 2.5. n = 10, 25, 50, 100, 250, 500, 1000, 2500.',
      render(v, st) {
        const n = NS[v.i], R = 400, r = EL.rng(st.seed + n), b = [], tt = [], plim = v.sc === 'endo' ? 2.5 : 2;
        for (let t = 0; t < R; t++) {
          const x = [], y = [];
          for (let i = 0; i < n; i++) { const e = draw(r, v.er), z = draw(r, 'exp'), a = v.sc === 'endo' ? z + e : z; x.push(a); y.push(1 + 2 * a + e); }
          const m = EL.olsSimple(x, y); b.push(m.beta[1]); tt.push((m.beta[1] - plim) / m.se[1]);
        }
        const mb = mean(b), s = sd(b), h = EL.hist(b, 1, 3.5, 50), c1 = EL.chart({ x: [1, 3.5], y: [0, Math.max(...h.counts) * 1.1], xl: 'β̂₁ (eje fijo)', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(0) });
        c1.bars(h.edges, h.counts, 'bar').vline(2, 'ref').vline(plim, 'ref2');
        const ht = EL.hist(tt, -4, 4, 32), c2 = EL.chart({ x: [-4, 4], y: [0, 0.55], xl: 't = (β̂₁ − plim)/ee', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
        const xs = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);
        c2.bars(ht.edges, ht.counts, 'bar').path(xs, xs.map(EL.dist.normPdf), 'ln2');
        const skew = EL.sum(tt.map(a => ((a - mean(tt)) / sd(tt)) ** 3)) / tt.length;
        return `<div class="grid2">${box('1) ¿Se concentra β̂₁? (línea gris = 2 verdadero; naranja = plim)', c1.toString())}${box('2) Forma del estadístico t ' + legend([['k1', 'simulado'], ['k2', 'N(0,1)']]), c2.toString())}</div>
          <div class="stats">${stat('n', n)}${stat('Media de β̂₁', f(mb, 3), `plim = ${plim}`)}${stat('Desv. est. de β̂₁', f(s, 4))}${stat('√n · desv. est.', f(Math.sqrt(n) * s, 3), 'se estabiliza: tasa 1/√n')}${stat('Asimetría de t', f(skew, 2), 'tiende a 0 con n grande')}</div>` +
          read(v.sc === 'exo'
            ? `<p><b>Consistencia:</b> al subir $n$ la media se mantiene en 2 y la desviación cae (producto $\\sqrt n\\cdot$ desv. ≈ constante). <b>Normalidad asintótica:</b> con error exponencial (asimétrico) y $n=10$ el histograma de $t$ está sesgado; con $n\\ge500$ se parece a la $N(0,1)$ aunque el error no sea normal. Por eso $t$ y $F$ funcionan con muestras grandes sin S6.</p>`
            : `<p><b>Inconsistencia:</b> la campana se hace más angosta con $n$, pero se concentra en <b>2.5</b>, no en 2: más datos dan más confianza en un valor equivocado. El $\\operatorname{plim}\\hat\\beta_1=\\beta_1+\\operatorname{Cov}(x,\\varepsilon)/\\operatorname{Var}(x)=2.5$. (El $t$ de la derecha se centra en el plim, no en el verdadero.)</p>`);
      }
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
