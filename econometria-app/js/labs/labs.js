/* labs.js — Laboratorio interactivo (Módulo 2). Cada laboratorio = {id, titulo, tema, objetivo, mount(el)}.
   Propósito pedagógico: hacer visible lo que el texto solo describe (SCR mínima, distribución muestral, sesgo, inflación de varianza…). */
(function (root) {
  'use strict';
  const EL = root.EL, f = EL.fmt, mean = EL.mean;
  EL.LABS = [];

  /* ---------- mini-framework: panel de controles a la izquierda, resultados a la derecha ---------- */
  function lab(el, o) {
    const st = { seed: o.seed || 7, n: 0 };
    el.innerHTML = `<div class="lab-grid"><div class="panel ctlpanel">
      ${(o.controls || []).map(c => c.type === 'select'
        ? `<label class="ctl"><span>${c.label}</span><select id="c-${c.id}">${c.options.map(([v, t]) => `<option value="${v}" ${v == c.val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`
        : c.type === 'check'
          ? `<label class="chk"><input type="checkbox" id="c-${c.id}" ${c.val ? 'checked' : ''}> ${c.label}</label>`
          : c.type === 'text'
            ? `<label class="ctl"><span>${c.label}</span><input type="text" id="c-${c.id}" value="${EL.esc(c.val)}" autocomplete="off"></label>`
            : `<label class="ctl"><span>${c.label}</span><output id="o-${c.id}">${c.val}</output><input type="range" id="c-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.val}"></label>`).join('')}
      <div class="row">${(o.buttons || []).map(b => `<button class="btn ${b.primary ? 'pri' : ''}" data-b="${b.id}">${b.label}</button>`).join('')}</div>
      ${o.note ? `<p class="small muted">${o.note}</p>` : ''}</div><div class="main" id="labout"></div></div>`;
    const out = el.querySelector('#labout');
    const vals = () => {
      const v = {};
      (o.controls || []).forEach(c => {
        const i = el.querySelector('#c-' + c.id);
        v[c.id] = c.type === 'check' ? i.checked : c.type === 'select' ? i.value : c.type === 'text' ? i.value : +i.value;
        const lbl = el.querySelector('#o-' + c.id); if (lbl) lbl.textContent = v[c.id];
      });
      return v;
    };
    let raf = 0;
    const draw = () => { out.innerHTML = o.render(vals(), st); EL.renderMath(out); };
    const sched = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
    el.querySelectorAll('input,select').forEach(i => i.addEventListener(i.type === 'text' ? 'change' : 'input', sched));
    el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => {
      const bb = (o.buttons || []).find(x => x.id === b.dataset.b);
      if (bb.fn) bb.fn(st, vals(), (id, val) => { const i = el.querySelector('#c-' + id); if (i) { i.value = val; } });
      else st.seed = (st.seed * 1664525 + 1013904223) >>> 0;
      draw();
    }));
    draw();
  }
  const stat = (l, v, s) => `<div class="stat"><span>${l}</span><b>${v}</b>${s ? `<small>${s}</small>` : ''}</div>`;
  const box = (title, svg) => `<div class="chartbox"><h4>${title}</h4>${svg}</div>`;
  const read = (h, warn) => `<div class="read ${warn ? 'warn' : ''}"><h4>Cómo leerlo</h4>${h}</div>`;
  const reg = (id, titulo, tema, objetivo, mount) => EL.LABS.push({ id, titulo, tema, objetivo, mount });
  const legend = items => `<span class="legend">${items.map(([c, t]) => `<span class="lg"><i class="${c}"></i>${t}</span>`).join('')}</span>`;
  EL.labKit = { lab, stat, box, read, reg, legend };   // para labs2.js

  /* ======================================================================== 1. MCO a mano vs óptimo */
  reg('mco', 'Mínimos cuadrados: tu recta vs. la óptima', 't2', 'Ver por qué MCO “gana”: ninguna otra recta tiene menor suma de cuadrados.', el => {
    const gen = seed => { const r = EL.rng(seed), x = [], y = []; for (let i = 0; i < 14; i++) { const xi = 1 + r() * 9; x.push(xi); y.push(3 + 0.9 * xi + EL.gauss(r) * 1.6); } return { x, y }; };
    lab(el, {
      seed: 7,
      controls: [
        { id: 'b0', label: 'Tu intercepto b₀', min: -2, max: 10, step: 0.05, val: 1 },
        { id: 'b1', label: 'Tu pendiente b₁', min: -1, max: 3, step: 0.01, val: 0.3 },
        { id: 'sq', label: 'Mostrar cuadrados de los residuos', type: 'check', val: true },
        { id: 'ols', label: 'Mostrar la recta MCO', type: 'check', val: false }],
      buttons: [{ id: 'new', label: 'Nueva muestra' }, { id: 'fit', label: 'Ir a la recta MCO', primary: true, fn: (st, v, set) => { const d = gen(st.seed), m = EL.olsSimple(d.x, d.y); set('b0', m.beta[0].toFixed(2)); set('b1', m.beta[1].toFixed(2)); } }],
      render(v, st) {
        const d = gen(st.seed), m = EL.olsSimple(d.x, d.y), scr = (a, b) => EL.sum(d.x.map((x, i) => (d.y[i] - a - b * x) ** 2));
        const mine = scr(v.b0, v.b1), c = EL.chart({ x: [0, 11], y: [0, 16], xl: 'x', yl: 'y', label: 'Diagrama de dispersión con tu recta' }).axes();
        if (v.sq) d.x.forEach((x, i) => { const e = d.y[i] - v.b0 - v.b1 * x, s = Math.abs(c.sy(0) - c.sy(e)); c.raw(`<rect class="sq" x="${c.sx(x).toFixed(1)}" y="${(e >= 0 ? c.sy(v.b0 + v.b1 * x) - s : c.sy(v.b0 + v.b1 * x)).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}"/>`); });
        c.abline(v.b0, v.b1, 'ln2'); if (v.ols) c.abline(m.beta[0], m.beta[1], 'ln'); c.points(d.x, d.y, 'pt');
        const ratio = mine / m.scr;
        return box('Datos, tu recta y la recta MCO ' + legend([['k2', 'tu recta'], ['k1', 'MCO']]), c.toString()) +
          `<div class="stats">${stat('SCR de tu recta', f(mine, 2))}${stat('SCR mínima (MCO)', f(m.scr, 2), `b₀=${f(m.beta[0], 2)}, b₁=${f(m.beta[1], 2)}`)}${stat('Tu SCR / SCR mínima', f(ratio, 2) + '×')}${stat('R² (MCO)', f(m.r2, 3))}</div>` +
          read(`<p>Cada cuadrado naranja tiene área = residuo². La suma de áreas es la <b>SCR</b>. Mueve los controles intentando bajarla: nunca podrás quedar por debajo de la SCR mínima (el cociente nunca baja de 1.00×). Esa recta es $\\hat\\beta=(X'X)^{-1}X'y$.</p><p>Comprueba también que con la recta MCO la suma de residuos es 0 y que pasa por $(\\bar x,\\bar y)=(${f(mean(d.x), 2)},\\,${f(mean(d.y), 2)})$.</p>`);
      }
    });
  });

  /* ======================================================================== 2. Calculadora matricial */
  reg('matriz', 'Calculadora matricial de MCO (para verificar a mano)', 't2', 'Comprobar cálculos de $X\'X$, $(X\'X)^{-1}$, $\\hat\\beta$, $H$, residuos y errores estándar con tus propios datos.', el => {
    const parse = s => s.split(/[,;\s]+/).filter(Boolean).map(Number);
    const mt = (A, d) => `<table class="mtx">${A.map(r => `<tr>${r.map(v => `<td>${f(v, d === undefined ? 3 : d)}</td>`).join('')}</tr>`).join('')}</table>`;
    lab(el, {
      controls: [
        { id: 'x', type: 'text', label: 'x (separados por coma)', val: '2,3,5,6,9' },
        { id: 'z', type: 'text', label: 'x₂ opcional (vacío = regresión simple)', val: '' },
        { id: 'y', type: 'text', label: 'y', val: '8,7,9,12,14' }],
      note: 'Se incluye siempre intercepto: X = [1, x] o [1, x, x₂]. Usa pocos datos para poder comparar con tu procedimiento manual.',
      render(v) {
        const x = parse(v.x), y = parse(v.y), z = v.z.trim() ? parse(v.z) : null;
        if (x.some(isNaN) || y.some(isNaN) || (z && z.some(isNaN))) return read('Revisa los datos: solo números separados por comas.', true);
        if (x.length !== y.length || (z && z.length !== x.length)) return read('Los vectores deben tener la misma longitud.', true);
        const n = x.length, X = x.map((xi, i) => z ? [1, xi, z[i]] : [1, xi]), k = X[0].length;
        if (n <= k) return read(`Necesitas más observaciones que parámetros ($n>k$): hay ${n} y $k=${k}$.`, true);
        const m = EL.ols(X, y);
        if (!m) return read('<b>$X\'X$ es singular</b> (rango < $k$): hay colinealidad perfecta o $x$ es constante. $\\hat\\beta$ no es único; $\\hat y$ sí.', true);
        const H = EL.mat.mul(X, EL.mat.mul(m.XtXinv, EL.mat.T(X))), hd = H.map((r, i) => r[i]);
        const Xe = EL.mat.vec(EL.mat.T(X), m.res), names = z ? ['β₀', 'β₁', 'β₂'] : ['β₀', 'β₁'];
        const rows = names.map((nm, i) => `<tr><td>${nm}</td><td>${f(m.beta[i], 4)}</td><td>${f(m.se[i], 4)}</td><td>${f(m.beta[i] / m.se[i], 3)}</td><td>${f(EL.dist.tPvalue2(m.beta[i] / m.se[i], m.gl), 4)}</td></tr>`).join('');
        return `<div class="grid2"><div class="chartbox"><h4>$X'X$</h4>${mt(m.XtX, 2)}</div><div class="chartbox"><h4>$(X'X)^{-1}$</h4>${mt(m.XtXinv, 4)}</div><div class="chartbox"><h4>$X'y$</h4>${mt(m.Xty.map(a => [a]), 2)}</div><div class="chartbox"><h4>Var estimada $\\hat\\sigma^2(X'X)^{-1}$</h4>${mt(m.V, 4)}</div></div>
          <div class="chartbox"><h4>Coeficientes</h4><table class="tbl"><tr><th></th><th>Estimación</th><th>Error est.</th><th>t</th><th>p (gl=${m.gl})</th></tr>${rows}</table></div>
          <div class="stats">${stat('SCR', f(m.scr, 4))}${stat('σ̂² = SCR/(n−k)', f(m.s2, 4), `gl = ${m.gl}`)}${stat('SCT', f(m.sct, 4))}${stat('R²', f(m.r2, 4))}${stat('R² ajustado', f(m.r2a, 4))}${stat('tr(H)', f(EL.sum(hd), 3), `= k = ${k}`)}</div>
          <div class="chartbox"><h4>Ajustados, residuos y apalancamiento</h4><div class="scroll"><table class="tbl"><tr><th>i</th><th>x</th>${z ? '<th>x₂</th>' : ''}<th>y</th><th>ŷ = Hy</th><th>ε̂ = My</th><th>h<sub>ii</sub></th></tr>${x.map((xi, i) => `<tr><td>${i + 1}</td><td>${xi}</td>${z ? `<td>${z[i]}</td>` : ''}<td>${y[i]}</td><td>${f(m.yhat[i], 3)}</td><td>${f(m.res[i], 3)}</td><td>${f(hd[i], 3)}</td></tr>`).join('')}</table></div></div>
          ${read(`<p><b>Ortogonalidad:</b> $X'\\hat\\varepsilon=(${Xe.map(a => f(Math.abs(a) < 1e-9 ? 0 : a, 6)).join(',\\,')})'\\approx0$ siempre, por construcción. Verifica que $\\sum h_{ii}=k$ y que $\\det(X'X)=${f(EL.mat.det2 && k === 2 ? EL.mat.det2(m.XtX) : NaN, 2)}$ (solo para $k=2$).</p>`)}`;
      }
    });
  });

  /* ======================================================================== 3. Gauss–Markov por simulación */
  reg('gm', 'Gauss–Markov en acción: distribución muestral', 't3', 'Ver que MCO y otro estimador lineal e insesgado aciertan en promedio, pero MCO tiene menos varianza; y qué pasa con heterocedasticidad.', el => {
    const X = [2, 3, 5, 6, 9], xb = 5, sxx = 30;
    const mc = (reps, sigma, het, seed) => {
      const r = EL.rng(seed), a = [], b = [];
      for (let t = 0; t < reps; t++) {
        const y = X.map(x => 1 + 2 * x + EL.gauss(r) * sigma * (het ? Math.sqrt(x / 5) : 1));
        a.push(X.reduce((s, x, i) => s + (x - xb) * y[i], 0) / sxx);
        b.push((y[4] - y[0]) / 7);
      }
      return { a, b };
    };
    const vr = a => { const m = mean(a); return EL.sum(a.map(v => (v - m) ** 2)) / (a.length - 1); };
    lab(el, {
      seed: 3,
      controls: [
        { id: 'sig', label: 'Desviación del error σ', min: 0.5, max: 4, step: 0.1, val: 2 },
        { id: 'reps', label: 'Muestras simuladas', min: 200, max: 4000, step: 200, val: 2000 },
        { id: 'het', label: 'Heterocedasticidad: Var(ε) ∝ x', type: 'check', val: false }],
      buttons: [{ id: 'new', label: 'Repetir simulación', primary: true }],
      note: 'Modelo verdadero: y = 1 + 2x + ε con x = (2,3,5,6,9) (datos del Taller 2, café). β̃₁ = (y₅−y₁)/(x₅−x₁).',
      render(v, st) {
        const s = mc(v.reps, v.sig, v.het, st.seed), lo = 2 - 4 * v.sig / 3, hi = 2 + 4 * v.sig / 3;
        const ha = EL.hist(s.a, lo, hi, 36), hb = EL.hist(s.b, lo, hi, 36), top = Math.max(...ha.counts, ...hb.counts) * 1.1;
        const c = EL.chart({ x: [lo, hi], y: [0, top], xl: 'estimación de β₁ (verdadero = 2)', yl: 'densidad', label: 'Distribuciones muestrales' }).axes({ yfmt: t => t.toFixed(2) });
        c.bars(ha.edges, ha.counts, 'bar').bars(hb.edges, hb.counts, 'bar2').vline(2, 'ref');
        const va = vr(s.a), vb = vr(s.b), th = v.het ? null : 1 / 30 * v.sig ** 2;
        return box('Histogramas de β̂₁ (MCO) y β̃₁ ' + legend([['k1', 'MCO'], ['k2', 'β̃₁ (2 puntos)']]), c.toString()) +
          `<div class="stats">${stat('Media MCO', f(mean(s.a), 3), 'verdadero: 2')}${stat('Media β̃₁', f(mean(s.b), 3), 'verdadero: 2')}${stat('Var MCO', f(va, 3), th ? `teórica σ²/Sxx = ${f(th, 3)}` : 'con het.: ya no es σ²/Sxx')}${stat('Var β̃₁', f(vb, 3), v.het ? '' : `teórica 2σ²/49 = ${f(2 * v.sig ** 2 / 49, 3)}`)}${stat('Var β̃₁ / Var MCO', f(vb / va, 3), v.het ? 'bajo het. ya no está garantizado >1' : 'teórico 60/49 = 1.224')}</div>` +
          read(v.het
            ? `<p>Con <b>heterocedasticidad</b> ($\\operatorname{Var}\\varepsilon_i\\propto x_i$) ambos siguen insesgados (las medias están en 2), pero <b>MCO deja de ser el MELI</b>: Gauss–Markov ya no aplica. En el Taller 2 se calculó que con esta forma de varianza MCO sigue ganando por poco (0.2σ² vs 0.2245σ²), pero eso ya no lo garantiza el teorema.</p>`
            : `<p>Ambos estimadores acertan en promedio (<b>insesgados</b>), pero β̃₁ está más disperso: ignora tres de las cinco fincas. La razón empírica de varianzas se acerca a $60/49=1.224$. Eso es Gauss–Markov: no hay estimador <i>lineal e insesgado</i> con menor varianza que MCO.</p>`);
      }
    });
  });

  /* ======================================================================== 4. Variable omitida */
  reg('omit', 'Sesgo por variable omitida', 't6', 'Controlar el signo y tamaño del sesgo $\\beta_2\\delta_1$ y ver que no desaparece con más datos.', el => {
    const sim = (n, b2, rho, reps, seed) => {
      const r = EL.rng(seed), S = [], L = [];
      for (let t = 0; t < reps; t++) {
        const x1 = [], x2 = [], y = [];
        for (let i = 0; i < n; i++) { const a = EL.gauss(r), b = EL.gauss(r), u = a, w = rho * a + Math.sqrt(1 - rho * rho) * b; x1.push(u); x2.push(w); y.push(1 + 1 * u + b2 * w + EL.gauss(r)); }
        S.push(EL.olsSimple(x1, y).beta[1]);
        L.push(EL.ols(x1.map((u, i) => [1, u, x2[i]]), y).beta[1]);
      }
      return { S, L };
    };
    lab(el, {
      seed: 5,
      controls: [
        { id: 'b2', label: 'Efecto de la omitida β₂', min: -2, max: 2, step: 0.1, val: 1 },
        { id: 'rho', label: 'Correlación entre x₁ y x₂', min: -0.9, max: 0.9, step: 0.05, val: 0.5 },
        { id: 'n', label: 'Tamaño de muestra n', min: 20, max: 500, step: 10, val: 100 }],
      buttons: [{ id: 'new', label: 'Repetir simulación', primary: true }],
      note: 'Modelo verdadero: y = 1 + 1·x₁ + β₂·x₂ + ε, con x₁ y x₂ de varianza 1 (entonces δ₁ = ρ). β₁ verdadero = 1.',
      render(v, st) {
        const s = sim(v.n, v.b2, v.rho, 400, st.seed), bias = v.b2 * v.rho;
        const lo = Math.min(...s.S, ...s.L) - 0.05, hi = Math.max(...s.S, ...s.L) + 0.05, hs = EL.hist(s.S, lo, hi, 40), hl = EL.hist(s.L, lo, hi, 40), top = Math.max(...hs.counts, ...hl.counts) * 1.1;
        const c = EL.chart({ x: [lo, hi], y: [0, top], xl: 'estimación de β₁ (verdadero = 1)', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
        c.bars(hs.edges, hs.counts, 'bar2').bars(hl.edges, hl.counts, 'bar').vline(1, 'ref').vline(1 + bias, 'ref2');
        return box('Regresión corta vs. larga (400 muestras) ' + legend([['k2', 'corta (omite x₂)'], ['k1', 'larga (incluye x₂)']]), c.toString()) +
          `<div class="stats">${stat('Media corta', f(mean(s.S), 3), `predicho 1+β₂ρ = ${f(1 + bias, 3)}`)}${stat('Media larga', f(mean(s.L), 3), 'verdadero: 1')}${stat('Sesgo β₂·δ₁', f(bias, 3), bias > 0.01 ? 'positivo' : bias < -0.01 ? 'negativo' : 'cero')}${stat('Desv. est. corta / larga', `${f(Math.sqrt(EL.sum(s.S.map(a => (a - mean(s.S)) ** 2)) / 399), 3)} / ${f(Math.sqrt(EL.sum(s.L.map(a => (a - mean(s.L)) ** 2)) / 399), 3)}`)}</div>` +
          read(`<p>La línea punteada marca el valor que predice $E(\\tilde\\beta_1)=\\beta_1+\\beta_2\\delta_1$. Prueba: (i) $\\beta_2=0$ o $\\rho=0$ ⇒ sesgo cero; (ii) signos iguales ⇒ sesgo positivo; opuestos ⇒ negativo; (iii) sube $n$ a 500: la nube se angosta pero <b>no se mueve hacia 1</b> (el sesgo no se corrige con más datos).</p>`);
      }
    });
  });

  /* ======================================================================== 5. Multicolinealidad */
  reg('colin', 'Multicolinealidad: la varianza se infla', 't8', 'Ver cómo la correlación entre regresores agranda la dispersión de $\\hat\\beta_1$ sin sesgarlo.', el => {
    const sim = (n, rho, reps, seed) => {
      const r = EL.rng(seed), est = [];
      for (let t = 0; t < reps; t++) {
        const x1 = [], x2 = [], y = [];
        for (let i = 0; i < n; i++) { const a = EL.gauss(r), b = EL.gauss(r), w = rho * a + Math.sqrt(1 - rho * rho) * b; x1.push(a); x2.push(w); y.push(1 + a + w + EL.gauss(r)); }
        est.push(EL.ols(x1.map((u, i) => [1, u, x2[i]]), y).beta[1]);
      }
      return est;
    };
    lab(el, {
      seed: 9,
      controls: [{ id: 'rho', label: 'Correlación ρ(x₁, x₂)', min: 0, max: 0.99, step: 0.01, val: 0.5 }, { id: 'n', label: 'Tamaño de muestra n', min: 30, max: 400, step: 10, val: 60 }],
      buttons: [{ id: 'new', label: 'Repetir simulación', primary: true }],
      note: 'Modelo: y = 1 + 1·x₁ + 1·x₂ + ε, ε ~ N(0,1). Se estiman 400 muestras con las dos variables incluidas.',
      render(v, st) {
        const e = sim(v.n, v.rho, 400, st.seed), m = mean(e), sd = Math.sqrt(EL.sum(e.map(a => (a - m) ** 2)) / 399), fiv = 1 / (1 - v.rho ** 2), sd0 = Math.sqrt(1 / (v.n - 3));
        const lo = 1 - 1.2, hi = 1 + 1.2, h = EL.hist(e, lo, hi, 40), c = EL.chart({ x: [lo, hi], y: [0, Math.max(...h.counts) * 1.15], xl: 'estimación de β₁ (verdadero = 1)', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
        c.bars(h.edges, h.counts, 'bar').vline(1, 'ref');
        return box('Distribución de β̂₁ (400 muestras)', c.toString()) +
          `<div class="stats">${stat('Media de β̂₁', f(m, 3), 'verdadero: 1 → insesgado')}${stat('Desv. est. de β̂₁', f(sd, 3))}${stat('FIV = 1/(1−ρ²)', f(fiv, 2))}${stat('Inflación del ee', '×' + f(Math.sqrt(fiv), 2), `√FIV; (ee sin colinealidad ≈ ${f(sd0, 3)})`)}</div>` +
          read(`<p>Con $\\rho$ cerca de 1 la media sigue en 1 (<b>no hay sesgo</b>) pero la campana se ensancha: la desviación crece con $\\sqrt{FIV}$. Con $\\rho=0.9$, $FIV\\approx5.3$ y el error estándar casi se duplica. Aumentar $n$ lo reduce, que es uno de los remedios del tema 9.</p>`);
      }
    });
  });

  /* ======================================================================== 6. Heterocedasticidad */
  reg('hetero', 'Heterocedasticidad: ver, detectar y corregir', 't9', 'Reproducir el flujo de la monitoría: embudo de residuos, Breusch–Pagan y errores estándar de White.', el => {
    const gen = (n, g, seed) => { const r = EL.rng(seed), x = [], y = []; for (let i = 0; i < n; i++) { const xi = Math.exp(Math.log(2.5) + 0.5 * EL.gauss(r)); x.push(xi); y.push(2 + 0.6 * xi + (1 + g * xi) * EL.gauss(r)); } return { x, y }; };
    const robust = (x, y) => {                       // MCO simple con ee usual y ee de White (HC1)
      const n = x.length, m = EL.olsSimple(x, y), xb = mean(x), sxx = EL.sum(x.map(a => (a - xb) ** 2));
      const v1 = EL.sum(x.map((a, i) => (a - xb) ** 2 * m.res[i] ** 2)) / sxx ** 2 * n / (n - 2);
      return { b: m.beta[1], se: Math.sqrt(m.s2 / sxx), seW: Math.sqrt(v1), m };
    };
    lab(el, {
      seed: 21,
      controls: [{ id: 'g', label: 'Intensidad de la heterocedasticidad γ', min: 0, max: 1, step: 0.05, val: 0.45 }, { id: 'n', label: 'n (hogares)', min: 50, max: 400, step: 10, val: 200 }],
      buttons: [{ id: 'new', label: 'Nueva muestra', primary: true }],
      note: 'Modelo: gasto = 2 + 0.6·ingreso + (1+γ·ingreso)·z. Con γ = 0 los errores son homocedásticos. Verdadero β₁ = 0.6.',
      render(v, st) {
        const d = gen(v.n, v.g, st.seed), a = robust(d.x, d.y), m = a.m;
        const lo = Math.min(...d.x), hi = Math.max(...d.x);
        const c1 = EL.chart({ x: [0, hi * 1.05], y: [Math.min(...d.y) - 1, Math.max(...d.y) + 1], xl: 'ingreso', yl: 'gasto' }).axes().abline(m.beta[0], m.beta[1], 'ln').points(d.x, d.y, 'pt', 2.6);
        const e = m.res, c2 = EL.chart({ x: [Math.min(...m.yhat), Math.max(...m.yhat)], y: [Math.min(...e) - 1, Math.max(...e) + 1], xl: 'valor ajustado ŷ', yl: 'residuo ε̂' }).axes().hline(0, 'ref').points(m.yhat, e, 'pt', 2.6);
        const e2 = e.map(q => q * q), bp = EL.olsSimple(d.x, e2), stBP = v.n * bp.r2, pBP = EL.dist.chi1P(stBP);
        // rechazo bajo H0 verdadera (β1 = 0.6): 400 réplicas
        let rejN = 0, rejW = 0, R = 400; const r2 = EL.rng(st.seed + 99);
        for (let t = 0; t < R; t++) { const dd = gen(Math.min(v.n, 120), v.g, Math.floor(r2() * 1e9)), q = robust(dd.x, dd.y); if (Math.abs((q.b - 0.6) / q.se) > 1.96) rejN++; if (Math.abs((q.b - 0.6) / q.seW) > 1.96) rejW++; }
        return `<div class="grid2">${box('1) Ver: datos y recta MCO', c1.toString())}${box('2) Ver: residuos vs. ajustados (¿embudo?)', c2.toString())}</div>
          <div class="stats">${stat('β̂₁ (MCO)', f(a.b, 3), 'verdadero 0.6')}${stat('ee usual', f(a.se, 3))}${stat('ee de White (HC1)', f(a.seW, 3), `${f(a.seW / a.se, 2)}× el usual`)}${stat('Breusch–Pagan: n·R²', f(stBP, 1), `p = ${pBP < 0.0001 ? '<0.0001' : f(pBP, 4)} → ${pBP < 0.05 ? 'rechaza H₀: heterosc.' : 'no rechaza H₀'}`)}${stat('Rechazos de H₀ verdadera (5 % nominal)', `${f(100 * rejN / R, 1)} % usual · ${f(100 * rejW / R, 1)} % White`, `${R} réplicas con n=${Math.min(v.n, 120)}`)}</div>` +
          read(`<p><b>Flujo:</b> ver (embudo) → detectar (BP, $H_0$: homocedasticidad) → corregir. Con $\\gamma$ alto, el error estándar usual subestima el de White y la prueba $t$ usual rechaza una $H_0$ verdadera <i>mucho más del 5 %</i>; White se acerca al 5 %. Los coeficientes son los mismos en ambos casos: White corrige la <b>inferencia</b>, no la heterocedasticidad.</p>`);
      }
    });
  });

  /* ======================================================================== 7. R2 y R2 ajustado */
  reg('r2', 'R² vs. R² ajustado: regresores basura', 't5', 'Comprobar que $R^2$ siempre sube al añadir variables irrelevantes y que $\\bar R^2$ las castiga.', el => {
    lab(el, {
      seed: 4,
      controls: [{ id: 'n', label: 'Tamaño de muestra n', min: 15, max: 150, step: 1, val: 30 }, { id: 'k', label: 'Regresores irrelevantes añadidos', min: 0, max: 12, step: 1, val: 6 }],
      buttons: [{ id: 'new', label: 'Nueva muestra', primary: true }],
      note: 'Verdad: y = 1 + 2·x₁ + ε. Se agregan variables aleatorias sin relación con y.',
      render(v, st) {
        const r = EL.rng(st.seed), n = v.n, x1 = Array.from({ length: n }, () => EL.gauss(r)), y = x1.map(a => 1 + 2 * a + EL.gauss(r) * 2.5);
        const noise = Array.from({ length: 12 }, () => Array.from({ length: n }, () => EL.gauss(r))), ks = [], R2 = [], R2a = [];
        for (let j = 0; j <= 12; j++) {
          if (n <= j + 2) break;
          const X = x1.map((a, i) => [1, a].concat(noise.slice(0, j).map(c => c[i]))), m = EL.ols(X, y); if (!m) break;
          ks.push(j); R2.push(m.r2); R2a.push(m.r2a);
        }
        const lo = Math.min(-0.1, ...R2a) - 0.05, c = EL.chart({ x: [0, 12], y: [lo, 1], xl: 'nº de regresores irrelevantes', yl: '' }).axes();
        c.hline(0, 'ref').path(ks, R2, 'ln').path(ks, R2a, 'ln2').points(ks, R2, 'pt', 3).points(ks, R2a, 'pt2', 3);
        const i = Math.min(v.k, ks.length - 1);
        return box('Ajuste al añadir variables basura ' + legend([['k1', 'R²'], ['k2', 'R² ajustado']]), c.toString()) +
          `<div class="stats">${stat('k (parámetros)', 2 + i)}${stat('R²', f(R2[i], 3), 'nunca baja al añadir')}${stat('R² ajustado', f(R2a[i], 3), R2a[i] < R2a[0] ? 'bajó respecto a k=2' : '')}${stat('(n−1)/(n−k)', f((n - 1) / (n - 2 - i), 3), 'factor de penalización')}</div>` +
          read(`<p>La curva de $R^2$ sólo sube (aunque las variables sean ruido puro); $\\bar R^2$ puede bajar e incluso hacerse negativo cuando $n$ es pequeño. Baja $n$ y sube los regresores para ver la brecha crecer: con $n=500$ y $k=4$ la brecha es mínima.</p>`);
      }
    });
  });

  /* ======================================================================== 8. Formas funcionales */
  reg('forma', 'Interpretador de formas funcionales', 't7', 'Practicar la lectura de un coeficiente según las unidades de $y$ y $x$.', el => {
    lab(el, {
      controls: [
        { id: 'm', type: 'select', label: 'Modelo', val: 'loglog', options: [['linlin', 'lin-lin  y = β₀ + β₁x'], ['loglin', 'log-lin  ln y = β₀ + β₁x'], ['linlog', 'lin-log  y = β₀ + β₁ ln x'], ['loglog', 'log-log  ln y = β₀ + β₁ ln x']] },
        { id: 'b', label: 'Coeficiente β₁', min: -3, max: 3, step: 0.05, val: -1.2 },
        { id: 'dx', label: 'Cambio en x (unidades en lin-/log-lin; % en lin-log/log-log)', min: 1, max: 100, step: 1, val: 10 }],
      render(v) {
        const b = v.b, dx = v.dx; let msg, grafico = '';
        const sg = (x, d) => (x >= 0 ? '+' : '−') + f(Math.abs(x), d === undefined ? 2 : d);
        if (v.m === 'linlin') msg = `Si $x$ sube ${dx} unidad(es), $y$ cambia en <b>${sg(b * dx)}</b> unidades de $y$.`;
        else if (v.m === 'loglin') msg = `Si $x$ sube ${dx} unidad(es), $y$ cambia ≈ <b>${sg(100 * b * dx)} %</b> (aprox. $100\\beta_1\\Delta x$). Exacto: <b>${sg(100 * (Math.exp(b * dx) - 1))} %</b>.`;
        else if (v.m === 'linlog') msg = `Si $x$ sube ${dx} %, $y$ cambia ≈ <b>${sg(b * dx / 100, 3)}</b> unidades de $y$ ($\\beta_1\\cdot\\%\\Delta x/100$).`;
        else msg = `Si $x$ sube ${dx} %, $y$ cambia ≈ <b>${sg(b * dx)} %</b> (elasticidad $\\beta_1=${f(b, 2)}$).` + (Math.abs(b) > 1 ? ` Como $|\\beta_1|>1$: demanda/respuesta elástica.` : '');
        if (v.m === 'loglin') {
          const xs = Array.from({ length: 50 }, (_, i) => i * 2), ap = xs.map(t => 100 * b * t), ex = xs.map(t => 100 * (Math.exp(b * t) - 1)), top = Math.max(...ap, ...ex, 1), bot = Math.min(...ap, ...ex, -1);
          const c = EL.chart({ x: [0, 100], y: [bot, top], xl: 'Δx (unidades)', yl: '% cambio en y' }).axes().path(xs, ap, 'ln2').path(xs, ex, 'ln').vline(dx, 'ref2');
          grafico = box('Aproximación vs. exacto ' + legend([['k2', '100β₁Δx'], ['k1', '100(e^{β₁Δx}−1)']]), c.toString());
        } else {
          const xs = Array.from({ length: 60 }, (_, i) => 0.5 + i * 0.25), ys = xs.map(t => v.m === 'linlin' ? 2 + b * t : v.m === 'linlog' ? 2 + b * Math.log(t) : v.m === 'loglin' ? Math.exp(0.5 + b * t * 0.1) : Math.exp(1 + b * Math.log(t)));
          const c = EL.chart({ x: [0, 15], y: [Math.min(...ys, 0), Math.min(Math.max(...ys), 40)], xl: 'x', yl: 'y' }).axes().path(xs, ys, 'ln');
          grafico = box('Forma de la relación E(y|x) con ese coeficiente', c.toString());
        }
        return `<div class="chartbox big"><h4>Lectura del coeficiente</h4><p class="bigtxt">${msg}</p></div>${grafico}` +
          read(`<p>La pregunta correcta es siempre: <b>¿en qué unidades está cada lado?</b> $y$ en niveles ⇒ el efecto es en unidades de $y$; $\\ln y$ ⇒ es un cambio porcentual. $x$ en niveles ⇒ “por unidad”; $\\ln x$ ⇒ “por 1 %”. Prueba: lin-log con $\\beta_1=18$ y 5 % ⇒ 0.9 unidades. En log-lin con $\\beta_1=0.08$ y $\\Delta x=10$ la aproximación (80 %) está lejos del exacto (122.55 %).</p>`);
      }
    });
  });

  /* ======================================================================== 9. Autocorrelación */
  reg('auto', 'Autocorrelación: serie de residuos y Durbin–Watson', 't10', 'Ver cómo $\\rho$ cambia el patrón de los residuos y el estadístico $d\\approx2(1-\\hat\\rho)$.', el => {
    lab(el, {
      seed: 12,
      controls: [{ id: 'rho', label: 'Autocorrelación verdadera ρ del error', min: -0.9, max: 0.95, step: 0.05, val: 0.7 }, { id: 'T', label: 'Periodos T', min: 30, max: 200, step: 5, val: 80 }],
      buttons: [{ id: 'new', label: 'Nueva serie', primary: true }],
      note: 'y_t = 1 + 0.5·t/10 + ε_t con ε_t = ρ·ε_{t−1} + ν_t. Se estima por MCO y se analizan los residuos.',
      render(v, st) {
        const r = EL.rng(st.seed), T = v.T, t = Array.from({ length: T }, (_, i) => i + 1), eps = []; let prev = 0;
        for (let i = 0; i < T; i++) { prev = v.rho * prev + EL.gauss(r); eps.push(prev); }
        const y = t.map((a, i) => 1 + 0.05 * a + eps[i]), m = EL.olsSimple(t, y), e = m.res;
        const dw = EL.sum(e.slice(1).map((a, i) => (a - e[i]) ** 2)) / EL.sum(e.map(a => a * a)), rh = EL.sum(e.slice(1).map((a, i) => a * e[i])) / EL.sum(e.map(a => a * a));
        const c1 = EL.chart({ x: [1, T], y: [Math.min(...e) - 0.5, Math.max(...e) + 0.5], xl: 'tiempo t', yl: 'residuo ε̂ₜ' }).axes().hline(0, 'ref').path(t, e, 'ln').points(t, e, 'pt', 2);
        const c2 = EL.chart({ x: [Math.min(...e) - 0.3, Math.max(...e) + 0.3], y: [Math.min(...e) - 0.3, Math.max(...e) + 0.3], xl: 'ε̂ₜ₋₁', yl: 'ε̂ₜ' }).axes().points(e.slice(0, -1), e.slice(1), 'pt', 2.6);
        // errores estándar: usual vs. Newey–West (HAC) para la pendiente
        const X = t.map(a => [1, a]), L = Math.floor(4 * Math.pow(T / 100, 2 / 9)), S = [[0, 0], [0, 0]];
        for (let i = 0; i < T; i++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) S[a][b] += e[i] ** 2 * X[i][a] * X[i][b];
        for (let l = 1; l <= L; l++) { const w = 1 - l / (L + 1); for (let i = l; i < T; i++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) S[a][b] += w * e[i] * e[i - l] * (X[i][a] * X[i - l][b] + X[i - l][a] * X[i][b]); }
        const Vnw = EL.mat.mul(EL.mat.mul(m.XtXinv, S), m.XtXinv), seNW = Math.sqrt(Vnw[1][1]), seU = m.se[1];
        return `<div class="grid2">${box('Residuos en el tiempo', c1.toString())}${box('Residuo vs. residuo rezagado', c2.toString())}</div>
          <div class="stats">${stat('ρ̂ (de los residuos)', f(rh, 3), `verdadero ρ = ${v.rho}`)}${stat('Durbin–Watson d', f(dw, 3))}${stat('2(1 − ρ̂)', f(2 * (1 - rh), 3), 'debe ser ≈ d')}${stat('Lectura', dw < 1.5 ? 'autocorr. positiva' : dw > 2.5 ? 'autocorr. negativa' : 'sin evidencia clara', 'comparar con d_L y d_U')}</div>
          <div class="stats">${stat('Pendiente β̂₁', f(m.beta[1], 4), 'verdadero 0.05 (no cambia con HAC)')}${stat('ee usual', f(seU, 4), `t = ${f(m.beta[1] / seU, 2)}`)}${stat(`ee Newey–West (L=${L})`, f(seNW, 4), `t = ${f(m.beta[1] / seNW, 2)} · ${f(seNW / seU, 2)}× el usual`)}</div>` +
          read(`<p>Con $\\rho>0$ los residuos se agrupan en rachas del mismo signo y la nube $\\hat\\varepsilon_t$ vs. $\\hat\\varepsilon_{t-1}$ se alinea con pendiente positiva; $d$ cae por debajo de 2. Con $\\rho<0$ los signos alternan y $d>2$. Con $\\rho=0$, $d\\approx2$. (Los valores críticos $d_L,d_U$ dependen de $T$ y $k$; aquí se da solo la lectura aproximada.)</p><p><b>Remedio:</b> con $\\rho$ alto el error estándar de Newey–West (HAC) suele ser <b>mayor</b> que el usual, y el $t$ baja; el coeficiente es el mismo. Así se evita declarar significativa una relación que el $ee$ usual infla.</p>`);
      }
    });
  });

  /* ======================================================================== 10. t y F */
  reg('tf', 'Distribuciones t y F: valores críticos y p-valores', 't4', 'Entender por qué con pocos grados de libertad el valor crítico es mayor que 1.96 y cómo se obtiene el $p$-valor.', el => {
    lab(el, {
      controls: [
        { id: 'dist', type: 'select', label: 'Distribución', val: 't', options: [['t', 't de Student'], ['F', 'F de Snedecor']] },
        { id: 'gl', label: 'Grados de libertad (t) / denominador (F)', min: 1, max: 120, step: 1, val: 3 },
        { id: 'q', label: 'Restricciones m (solo F)', min: 1, max: 6, step: 1, val: 2 },
        { id: 'a', label: 'Nivel de significancia α', min: 0.01, max: 0.2, step: 0.01, val: 0.05 },
        { id: 's', label: 'Estadístico calculado', min: 0, max: 8, step: 0.05, val: 2.5 }],
      render(v) {
        if (v.dist === 't') {
          const cr = EL.dist.tCrit(v.a / 2, v.gl), p = EL.dist.tPvalue2(v.s, v.gl), xs = Array.from({ length: 241 }, (_, i) => -6 + i * 0.05);
          const c = EL.chart({ x: [-6, 6], y: [0, 0.45], xl: 't', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
          const pos = xs.filter(x => x >= cr), neg = xs.filter(x => x <= -cr);
          if (pos.length) { c.raw(`<polygon class="tail" points="${[[pos[0], 0]].concat(pos.map(x => [x, EL.dist.tPdf(x, v.gl)])).concat([[pos[pos.length - 1], 0]]).map(([a, b]) => c.sx(a).toFixed(1) + ',' + c.sy(b).toFixed(1)).join(' ')}"/>`); }
          if (neg.length) { c.raw(`<polygon class="tail" points="${[[neg[0], 0]].concat(neg.map(x => [x, EL.dist.tPdf(x, v.gl)])).concat([[neg[neg.length - 1], 0]]).map(([a, b]) => c.sx(a).toFixed(1) + ',' + c.sy(b).toFixed(1)).join(' ')}"/>`); }
          c.path(xs, xs.map(x => EL.dist.normPdf(x)), 'ln2').path(xs, xs.map(x => EL.dist.tPdf(x, v.gl)), 'ln').vline(v.s, 'ref2').vline(-v.s, 'ref2');
          const z = EL.dist.tCrit(v.a / 2, 100000);
          return box(`t con ${v.gl} gl ` + legend([['k1', 't'], ['k2', 'normal']]), c.toString()) +
            `<div class="stats">${stat('Valor crítico bilateral', '±' + f(cr, 3), `normal: ±${f(z, 3)}`)}${stat('p-valor (bilateral)', f(p, 4))}${stat('Decisión', v.s > cr ? 'Rechaza H₀' : 'No rechaza H₀', `|t| ${v.s > cr ? '>' : '≤'} crítico`)}</div>` +
            read(`<p>Las colas sombreadas son el área $\\alpha$. Con 3 gl el crítico es 3.18 (no 1.96); con 120 gl casi coincide con la normal. <b>Regla:</b> rechazar si $|t|$ supera el crítico, o equivalentemente si $p<\\alpha$.</p>`);
        }
        const d1 = v.q, d2 = v.gl, cr = EL.dist.fCrit(v.a, d1, d2), p = 1 - EL.dist.fCdf(v.s, d1, d2), hi = Math.max(cr * 2, v.s + 1, 6), xs = Array.from({ length: 200 }, (_, i) => 0.02 + i * hi / 200), ys = xs.map(x => EL.dist.fPdf(x, d1, d2)), top = Math.min(Math.max(...ys) * 1.1, 2);
        const c = EL.chart({ x: [0, hi], y: [0, top], xl: 'F', yl: 'densidad' }).axes({ yfmt: t => t.toFixed(1) });
        const tail = xs.filter(x => x >= cr); if (tail.length) c.raw(`<polygon class="tail" points="${[[tail[0], 0]].concat(tail.map(x => [x, Math.min(EL.dist.fPdf(x, d1, d2), top)])).concat([[tail[tail.length - 1], 0]]).map(([a, b]) => c.sx(a).toFixed(1) + ',' + c.sy(b).toFixed(1)).join(' ')}"/>`);
        c.path(xs, ys.map(y => Math.min(y, top)), 'ln').vline(v.s, 'ref2');
        return box(`F(${d1}, ${d2})`, c.toString()) + `<div class="stats">${stat('Valor crítico', f(cr, 3))}${stat('p-valor (cola derecha)', f(p, 4))}${stat('Decisión', v.s > cr ? 'Rechaza H₀' : 'No rechaza H₀')}</div>` +
          read(`<p>La prueba $F$ es unilateral (solo la cola derecha): $F$ grande significa que las restricciones empeoran mucho el ajuste. Con $m=1$, $F=t^2$.</p>`);
      }
    });
  });

  /* ======================================================================== 11. Detective de supuestos */
  reg('diag', 'Detective de supuestos', 't1', 'Entrenar el ojo: dado un gráfico de errores, decidir qué supuesto se viola.', el => {
    const KINDS = [
      { k: 'ok', t: 'Se cumplen homocedasticidad, no autocorrelación y exogeneidad', why: 'Los errores oscilan alrededor de 0 con dispersión pareja y sin patrón en $x$ ni en el tiempo.' },
      { k: 'het', t: 'Heterocedasticidad (S4)', why: 'La dispersión crece con $x$ (abanico), pero el promedio sigue en 0.' },
      { k: 'exo', t: 'Exogeneidad $E(\\varepsilon|X)=0$ (S3)', why: 'El promedio de los errores cambia con $x$ (tendencia), aunque la dispersión alrededor sea pareja.' },
      { k: 'ac', t: 'Autocorrelación (S5)', why: 'Ordenados en el tiempo, los errores forman rachas del mismo signo: cada error se parece al anterior.' }];
    let cur = null, answered = null;
    function gen(seed) {
      const r = EL.rng(seed), kind = KINDS[Math.floor(r() * 4)], n = 50, xs = [], es = []; let prev = 0;
      for (let i = 0; i < n; i++) {
        const x = kind.k === 'ac' ? i + 1 : 0.5 + r() * 9.5; xs.push(x);
        if (kind.k === 'ok') es.push(EL.gauss(r) * 1.5); else if (kind.k === 'het') es.push(EL.gauss(r) * (0.2 + 0.5 * x)); else if (kind.k === 'exo') es.push(-3 + 0.65 * x + EL.gauss(r) * 0.8); else { prev = 0.85 * prev + EL.gauss(r) * 0.8; es.push(prev * 1.5); }
      }
      if (kind.k === 'ac') { xs.sort((a, b) => a - b); }
      return { kind, xs: kind.k === 'ac' ? xs : xs, es };
    }
    lab(el, {
      seed: 31,
      buttons: [{ id: 'new', label: 'Siguiente caso', primary: true, fn: st => { st.seed = (st.seed * 1103515245 + 12345) >>> 0; answered = null; } }],
      controls: [],
      render(v, st) {
        cur = gen(st.seed);
        const isT = cur.kind.k === 'ac', n = cur.xs.length, ys = cur.es;
        const c = EL.chart({ W: 560, H: 280, x: isT ? [0, 51] : [0, 10], y: [Math.min(-6, ...ys) - 0.5, Math.max(6, ...ys) + 0.5], xl: isT ? 'tiempo t' : 'x_i', yl: 'ε_i' }).axes().hline(0, 'ref');
        if (isT) c.path(cur.xs, ys, 'ln'); c.points(cur.xs, ys, 'pt', 3);
        const opts = KINDS.map((k, i) => `<button class="btn opt" data-k="${k.k}" ${answered ? 'disabled' : ''}>${k.t}</button>`).join('');
        return box('Errores' + (isT ? ' ordenados en el tiempo' : ' frente a x'), c.toString()) +
          `<div class="chartbox"><h4>¿Qué ocurre con los errores?</h4><div class="optgrid" id="dopts">${opts}</div><div id="dfb"></div></div>`;
      }
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || answered) return; answered = b.dataset.k;
      const ok = answered === cur.kind.k, fb = el.querySelector('#dfb');
      el.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.k === cur.kind.k) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
      fb.innerHTML = `<div class="read ${ok ? '' : 'warn'}"><h4>${ok ? '¡Correcto!' : 'No exactamente'}</h4><p>${cur.kind.t}. ${cur.kind.why}</p></div>`; EL.renderMath(fb);
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);

