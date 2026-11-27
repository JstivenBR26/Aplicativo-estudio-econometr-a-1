/* casos.js — Casos de lectura de salidas (tipo Stata), con datos SIMULADOS de semilla fija: las tablas, pruebas y conclusiones se calculan al abrir
   la página, así que son siempre coherentes. Un mismo "motor" por problema (heterocedasticidad, autocorrelación, prueba F, multicolinealidad)
   sirve para (a) casos resueltos dentro de los temas y (b) ejercicios del banco con otros contextos y semillas.
   Los contextos y datos son originales (no reproducen materiales de clase ni exámenes).                                                       */
(function (root) {
  'use strict';
  const EL = root.EL, S = EL.stats, f = (x, d) => EL.fmt(x, d === undefined ? 3 : d);
  const sig = (p, a) => p < (a || 0.05);
  const pv = p => p < 0.0001 ? '< 0.0001' : p.toFixed(4);
  const pvm = p => p < 0.0001 ? 'p<0.0001' : 'p=' + p.toFixed(4);   // para dentro de fórmulas
  const out = (m, y, names, d) => S.stata(m, y, names, { d: d || 3 });

  const svgScatter = (x, y, xl, yl, line, W, H) => { const c = EL.chart({ W: W || 400, H: H || 250, x: [Math.min(...x) - 0.02 * Math.abs(Math.max(...x)), Math.max(...x) * 1.03], y: [Math.min(...y, 0) * 1.05 - 0.01, Math.max(...y) * 1.05], xl, yl, m: { l: 52, r: 10, t: 8, b: 36 } }).axes({ yfmt: t => Math.abs(t) >= 1000 ? t.toExponential(0) : t, xfmt: t => Math.abs(t) >= 1000 ? t.toExponential(0) : t }); c.points(x, y, 'pt', 3); if (line) c.abline(line[0], line[1], 'ln'); return c.toString(); };
  const svgSeries = (e, yl) => { const t = e.map((_, i) => i + 1), c = EL.chart({ W: 400, H: 230, x: [1, e.length], y: [Math.min(...e) * 1.1, Math.max(...e) * 1.1], xl: 'periodo', yl, m: { l: 52, r: 10, t: 8, b: 36 } }).axes({ yfmt: v => Math.abs(v) >= 1000 ? v.toExponential(0) : +v.toFixed(2) }).hline(0, 'ref'); c.path(t, e, 'ln').points(t, e, 'pt', 2.2); return c.toString(); };
  const figs = (...s) => `<div class="figrow">${s.map(x => `<div class="fig">${x}</div>`).join('')}</div>`;

  /* =========================================================== HETEROCEDASTICIDAD */
  function heteroCase(c) {
    const r = EL.rng(c.seed), x = [], y = [];
    for (let i = 0; i < c.n; i++) { const xi = Math.exp(c.mu + c.sx * EL.gauss(r)); x.push(xi); y.push(c.A * Math.pow(xi, c.b) * Math.exp(c.se * EL.gauss(r))); }
    const m1 = S.reg([x], y), w1 = S.white(x, m1.res), g1 = S.gq(x, y, c.omit), rs = S.reset([x], y, m1);
    const lx = x.map(Math.log), ly = y.map(Math.log), m2 = S.reg([lx], ly), w2 = S.white(lx, m2.res), g2 = S.gq(lx, ly, c.omit);
    // sin las 3 observaciones de mayor x
    const idx = x.map((_, i) => i).sort((a, b) => x[b] - x[a]).slice(3), xs3 = idx.map(i => x[i]), ys3 = idx.map(i => y[i]), m3 = S.reg([xs3], ys3), w3 = S.white(xs3, m3.res);
    const intro = `<p>${c.intro}</p>`;
    const par = [
      { t: `Modelo (1), en niveles: ${c.yn} = α + β ${c.xn} + ε`, h: out(m1, c.yn, [c.xn], c.d) + figs(svgScatter(x, y, c.xn, c.yn, [m1.beta[0], m1.beta[1]]), svgScatter(m1.yhat, m1.res, 'valor ajustado', 'residuo')) },
      { t: 'Pruebas sobre el modelo (1)', h: `<pre class="stata nomath">White (e² sobre x y x²):  n·R² = ${f(w1.stat, 2)}   χ²(2)   p = ${pv(w1.p)}\nRamsey (RESET, ŷ² añadido):  t = ${f(rs.t, 2)}   F(1, ${rs.df2}) = ${f(rs.F, 2)}   p = ${pv(rs.p)}\nGoldfeld–Quandt (se omiten ${c.omit} centrales):  F(${g1.df}, ${g1.df}) = RSS2/RSS1 = ${S.sci(g1.rss2)}/${S.sci(g1.rss1)} = ${f(g1.F, 2)}   p = ${pv(g1.p)}</pre>` },
      { t: `Modelo (2), en logaritmos: ln ${c.yn} = α + β ln ${c.xn} + ε`, h: out(m2, 'ln_' + c.yn, ['ln_' + c.xn], 3) + `<pre class="stata nomath">White:  n·R² = ${f(w2.stat, 2)}   χ²(2)   p = ${pv(w2.p)}\nGoldfeld–Quandt:  F(${g2.df}, ${g2.df}) = ${f(g2.F, 2)}   p = ${pv(g2.p)}</pre>` + figs(svgScatter(lx, ly, 'ln ' + c.xn, 'ln ' + c.yn, [m2.beta[0], m2.beta[1]]), svgScatter(m2.yhat, m2.res, 'valor ajustado', 'residuo')) },
      { t: `Modelo (1) sin las 3 observaciones de mayor ${c.xn}`, h: out(m3, c.yn, [c.xn], c.d) + `<pre class="stata nomath">White:  n·R² = ${f(w3.stat, 2)}   χ²(2)   p = ${pv(w3.p)}</pre>` }
    ];
    const pr = [
      { q: `Mire el diagrama de dispersión y el gráfico de residuos del modelo (1). ¿Qué sugieren sobre la varianza del error?`, a: `La dispersión de los puntos alrededor de la recta aumenta con ${c.xn} (forma de trompeta), y los residuos se abren a medida que crece el valor ajustado. Es la señal visual de heterocedasticidad: se viola la homocedasticidad (supuesto 2).${sig(rs.p) ? ' Además la nube de residuos tiene forma de U: la relación es curva, no solo de varianza cambiante.' : ''}` },
      { q: 'Interprete la prueba de White del modelo (1).', a: `$H_0$: homocedasticidad. El estadístico $nR^2=${f(w1.stat, 2)}$ se compara con una $\\chi^2$ de 2 gl (crítico 5.99 al 5 %); $${pvm(w1.p)}$ ${sig(w1.p) ? '⇒ se <b>rechaza</b> $H_0$: la varianza del error depende de $x$ y de $x^2$.' : '⇒ no se rechaza $H_0$.'}${sig(w1.p) && sig(rs.p) ? ' Ojo: la prueba de White también puede rechazar cuando el modelo está mal especificado; por eso se mira junto con Ramsey.' : ''}` },
      { q: 'Interprete la prueba de Goldfeld–Quandt y la de Ramsey.', a: `Goldfeld–Quandt: $F=\\text{RSS}_2/\\text{RSS}_1=${f(g1.F, 2)}$ con $(${g1.df},${g1.df})$ gl, $${pvm(g1.p)}$ ${sig(g1.p) ? '⇒ la varianza de los errores en los valores altos de $x$ es mucho mayor: <b>hay heterocedasticidad</b>.' : '⇒ no hay evidencia.'} Ramsey: $${pvm(rs.p)}$ ${sig(rs.p) ? '⇒ el término $\\hat y^2$ es significativo: el modelo lineal también tiene un problema de <b>forma funcional</b> (la relación es curva).' : '⇒ no hay evidencia de mala forma funcional.'}` },
      { q: '¿Qué ocurre en el modelo (2), en logaritmos? ¿Es una especificación aceptable? Interprete β.', a: `En logaritmos White ($${pvm(w2.p)}$) y Goldfeld–Quandt ($${pvm(g2.p)}$) ${sig(w2.p) || sig(g2.p) ? 'siguen detectando algo' : '<b>no rechazan</b> la homocedasticidad'}, y los residuos forman una banda de ancho parejo. El logaritmo estabiliza la varianza y linealiza la relación. $\\hat\\beta=${f(m2.beta[1], 2)}$ es una <b>elasticidad</b>: 1 % más de ${c.xn} se asocia con ≈ ${f(m2.beta[1], 2)} % más de ${c.yn}.` },
      { q: `Se eliminan las 3 observaciones con mayor ${c.xn}. ¿Cambiaría el veredicto sobre heterocedasticidad?`, a: `Con las 3 más grandes fuera, White da $${pvm(w3.p)}$ ${sig(w3.p) ? '⇒ la heterocedasticidad persiste: no es solo efecto de unos pocos valores extremos' : '⇒ ya no rechaza: gran parte del problema venía de los valores extremos'}. Eliminar datos sin justificación es peligroso: conviene comparar y reportar ambos resultados.` },
      { q: 'Dé su veredicto y diga qué haría.', a: `El modelo en niveles tiene heterocedasticidad${sig(rs.p) ? ' y problemas de forma funcional' : ''}: $\\hat\\beta$ sigue insesgado pero los errores estándar, $t$ y $F$ no son confiables. El modelo en logaritmos es una especificación mucho mejor. Si se prefiere mantener los niveles, usar errores robustos de White o MCP.` }
    ];
    const nice = s => s.split(c.xn).join(c.xn.replace(/_/g, ' ')).split(c.yn).join(c.yn.replace(/_/g, ' '));   // nombres legibles en la prosa
    pr.forEach(p => { p.q = nice(p.q); p.a = nice(p.a); });
    return { intro, partes: par, preguntas: pr, stats: { m1, m2, m3, w1, w2, w3, g1, g2, rs } };
  }

  /* =========================================================== AUTOCORRELACIÓN */
  function autoCase(c) {
    const r = EL.rng(c.seed), T = c.T, x = [], y = [];
    if (c.kind === 'ar') {                       // autocorrelación genuina: errores AR(1)
      let u = 0, xv = 0;
      for (let t = 0; t < T; t++) { xv = 0.85 * xv + EL.gauss(r) * 2; const xt = 100 + 0.6 * t + xv; u = c.rho * u + EL.gauss(r) * c.s; x.push(xt); y.push(c.a + c.b * xt + u); }
    } else {                                     // curvatura: errores independientes en logaritmos
      for (let t = 0; t < T; t++) { const xt = 10 + (290 * t) / (T - 1) + 6 * EL.gauss(r); x.push(xt); y.push(c.A * Math.pow(xt, c.b) * Math.exp(c.s * EL.gauss(r))); }
    }
    const m1 = S.reg([x], y), d1 = S.dw(m1.res), rh1 = S.rho(m1.res), co1 = S.cochrane([x], y), nw1 = S.neweyWest(m1);
    let res;
    if (c.kind === 'ar') {
      const par = [
        { t: `Modelo (1): MCO, ${c.yn} = α + β ${c.xn} + ε`, h: out(m1, c.yn, [c.xn], c.d) + `<pre class="stata nomath">Durbin–Watson d = ${f(d1, 3)}     ρ̂ ≈ ${f(rh1, 3)}   (1 − d/2 = ${f(1 - d1 / 2, 3)})</pre>` + figs(svgSeries(m1.res, 'residuo')) },
        { t: 'Modelo (2): corrección AR(1) (Cochrane–Orcutt)', h: `<pre class="stata nomath">Cochrane–Orcutt AR(1):   ρ = ${f(co1.rho, 3)}\n  β (${c.xn}) = ${S.sci(co1.beta[1])}   (ee ${S.sci(co1.se[1])})    constante = ${S.sci(co1.alpha)}\n  R² = ${f(co1.r2, 4)}   RSS = ${S.sci(co1.scr)}   Durbin–Watson transformado d = ${f(co1.dw, 3)}</pre>` },
        { t: 'Modelo (3): MCO con errores Newey–West', h: `<pre class="stata nomath">β (${c.xn}) = ${S.sci(m1.beta[1])}\n  ee usual = ${S.sci(m1.se[1])}      ee Newey–West = ${S.sci(nw1[1])}   (${f(nw1[1] / m1.se[1], 2)} veces el usual)\n  t usual = ${f(m1.t[1], 2)}      t Newey–West = ${f(m1.beta[1] / nw1[1], 2)}</pre>` }
      ];
      const pr = [
        { q: 'Interprete el estadístico de Durbin–Watson y el gráfico de residuos del modelo (1).', a: `$d=${f(d1, 2)}$ está muy por debajo de 2 y $\\hat\\rho\\approx1-d/2=${f(1 - d1 / 2, 2)}$: autocorrelación positiva fuerte. El gráfico lo confirma: los residuos forman rachas largas del mismo signo (cada error se parece al anterior).` },
        { q: '¿Qué consecuencias tiene sobre los coeficientes y sus errores estándar?', a: `Los $\\hat\\beta$ siguen siendo insesgados (no hay rezagos de $y$ entre las regresoras), pero MCO ya no es MELI y el error estándar usual (${S.sci(m1.se[1])}) <b>subestima</b> la incertidumbre: con Newey–West es ${S.sci(nw1[1])}, ${f(nw1[1] / m1.se[1], 2)} veces mayor. Por eso el $t$ usual (${f(m1.t[1], 1)}) está inflado.` },
        { q: '¿Qué logra la corrección AR(1) del modelo (2)?', a: `Transforma $y_t-\\hat\\rho y_{t-1}$ y $x_t-\\hat\\rho x_{t-1}$ con $\\hat\\rho=${f(co1.rho, 2)}$; el Durbin–Watson transformado ($d=${f(co1.dw, 2)}$) vuelve cerca de 2: se eliminó la autocorrelación. El error estándar de $\\hat\\beta$ pasa a ${S.sci(co1.se[1])}, más grande y más honesto.` },
        { q: '¿Cuál especificación reportaría y por qué?', a: `La autocorrelación aquí es genuina (el gráfico no muestra curvatura y la relación es lineal), así que se justifica la corrección: modelo (2) o MCO con errores Newey–West (3). Lo importante es <b>no</b> reportar los $t$ usuales del modelo (1).` }
      ];
      res = { intro: `<p>${c.intro}</p>`, partes: par, preguntas: pr };
    } else {
      const lx = x.map(Math.log), ly = y.map(Math.log), m3 = S.reg([lx], ly), d3 = S.dw(m3.res), co3 = S.cochrane([lx], ly);
      const row = (n, a, b, c2, d) => `<tr><td>${n}</td>${[a, b, c2, d].map(v => `<td>${v}</td>`).join('')}</tr>`;
      const tab = `<table class="tbl cmp"><tr><th></th><th>(1) MCO<br>niveles</th><th>(2) AR(1)<br>niveles</th><th>(3) MCO<br>logaritmos</th><th>(4) AR(1)<br>logaritmos</th></tr>
        ${row(c.xn, f(m1.beta[1], 3), f(co1.beta[1], 3), f(m3.beta[1], 3), f(co3.beta[1], 3))}${row('(error est.)', '(' + f(m1.se[1], 3) + ')', '(' + f(co1.se[1], 3) + ')', '(' + f(m3.se[1], 3) + ')', '(' + f(co3.se[1], 3) + ')')}
        ${row('ρ', '–', f(co1.rho, 2), '–', f(co3.rho, 2))}${row('R²', f(m1.r2, 3), f(co1.r2, 3), f(m3.r2, 3), f(co3.r2, 3))}${row('RSS', S.sci(m1.scr), S.sci(co1.scr), f(m3.scr, 3), f(co3.scr, 3))}${row('d (Durbin–Watson)', f(d1, 2), f(co1.dw, 2), f(d3, 2), f(co3.dw, 2))}</table>`;
      const par = [{ t: 'Datos y modelos estimados', h: figs(svgScatter(x, y, c.xn, c.yn, [m1.beta[0], m1.beta[1]]), svgSeries(m1.res, 'residuo del modelo (1)')) + tab }];
      const pr = [
        { q: 'Mirando el diagrama de dispersión, ¿la relación es lineal? ¿Qué patrón tendrían los residuos de una recta?', a: `La relación es <b>curva</b> (cóncava): una recta deja residuos positivos en los valores bajos de ${c.xn}, negativos en los intermedios y positivos otra vez al final.` },
        { q: `Explique por qué $d=${f(d1, 2)}$ en el modelo (1).`, a: `Los residuos ordenados por ${c.xn} (o por tiempo) forman rachas largas del mismo signo <i>por la curvatura</i>, no porque los errores verdaderos estén correlacionados. Un $d$ bajo es síntoma, no necesariamente de autocorrelación genuina: también aparece con forma funcional mal especificada.` },
        { q: '¿Soluciona el problema la corrección AR(1) en niveles (modelo 2)?', a: `No. Aunque $d$ sube a $${f(co1.dw, 2)}$, el patrón de curvatura sigue ahí y el ajuste (RSS = ${S.sci(co1.scr)}) sigue siendo mucho peor que en logaritmos (${f(m3.scr, 3)}). Se corrigió un síntoma sin atacar la causa.` },
        { q: '¿Qué muestra el modelo (3)? ¿Y el (4)?', a: `En logaritmos $d=${f(d3, 2)}$ (≈ 2) y el $R^2$ sube a ${f(m3.r2, 3)}: <b>no hay problema de AR(1)</b>; era curvatura. En el modelo (4) el $\\hat\\rho=${f(co3.rho, 2)}$ es casi nulo y los errores estándar son iguales o algo mayores: se pierde eficiencia por estimar un parámetro innecesario.` },
        { q: '¿Cuál es la mejor especificación?', a: `El modelo (3): logaritmos con MCO. Es el más simple que resuelve el problema; $\\hat\\beta=${f(m3.beta[1], 3)}$ es una elasticidad.` }
      ];
      res = { intro: `<p>${c.intro}</p>`, partes: par, preguntas: pr };
    }
    res.stats = { m1, d1, rh1, co1, nw1 }; return res;
  }

  /* =========================================================== PRUEBA F */
  function fCase(c) {
    const r = EL.rng(c.seed), n = c.n, ed = [], ex = [], an = [], w = [];
    for (let i = 0; i < n; i++) { const e = Math.max(0, Math.min(20, 10 + 3 * EL.gauss(r))), xp = Math.max(0, 15 + 8 * EL.gauss(r)), a = Math.max(0, 0.45 * xp + 3 * EL.gauss(r)); ed.push(e); ex.push(xp); an.push(a); w.push(c.b0 + c.b1 * e + c.b2 * xp + c.b3 * a + c.s * EL.gauss(r)); }
    const R = S.reg([ed], w), U = S.reg([ed, ex, an], w), U2 = S.reg([ed, ex], w);
    const q = 2, F = ((R.scr - U.scr) / q) / (U.scr / (n - 4)), Fc = EL.dist.fCrit(0.05, q, n - 4), pF = 1 - EL.dist.fCdf(F, q, n - 4);
    const F2 = ((U2.scr - U.scr) / 1) / (U.scr / (n - 4)), p2 = 1 - EL.dist.fCdf(F2, 1, n - 4);
    const par = [
      { t: `Modelo restringido: ${c.yn} sobre ${c.n1}`, h: out(R, c.yn, [c.n1], 4) },
      { t: `Modelo completo: se añaden ${c.n2} y ${c.n3}`, h: out(U, c.yn, [c.n1, c.n2, c.n3], 4) }
    ];
    const pr = [
      { q: 'Anote la suma de cuadrados de los residuos (RSS) de cada modelo.', a: `$\\text{RSS}_R=${S.sci(R.scr)}$ (restringido, $n-k=${n - 2}$ gl) y $\\text{RSS}_{NR}=${S.sci(U.scr)}$ (completo, $n-k=${n - 4}$ gl).` },
      { q: `Pruebe si ${c.n2} y ${c.n3} son conjuntamente relevantes.`, a: `$H_0:\\beta_2=\\beta_3=0$. $F=\\dfrac{(\\text{RSS}_R-\\text{RSS}_{NR})/2}{\\text{RSS}_{NR}/(n-4)}=\\dfrac{(${S.sci(R.scr)}-${S.sci(U.scr)})/2}{${S.sci(U.scr)}/${n - 4}}=${f(F, 2)}$, con $(2,${n - 4})$ gl; el crítico al 5 % es $${f(Fc, 2)}$ y $${pvm(pF)}$ ⇒ ${sig(pF) ? '<b>se rechaza</b> $H_0$: en conjunto aportan poder explicativo.' : 'no se rechaza $H_0$.'}` },
      { q: 'Interprete la mejora y el costo de incluir las dos variables.', a: `La mejora es la reducción del RSS (${f(R.scr - U.scr, 1)}); el costo son 2 grados de libertad. La $F$ compara la mejora <i>por cada gl gastado</i> con lo que queda sin explicar por gl.` },
      { q: `¿Es relevante ${c.n3} por sí sola (una vez incluidas educación y ${c.n2})?`, a: `Se prueba con la $t$ del modelo completo: $t=${f(U.t[3], 2)}$, $${pvm(U.p[3])}$ ⇒ ${sig(U.p[3]) ? 'es significativa.' : '<b>no</b> es significativa individualmente.'} Equivale a una $F$ con 1 restricción: $F=${f(F2, 2)}=t^2$.` },
      { q: '¿Puede una variable ser no significativa sola y aun así ser útil la prueba conjunta?', a: `Sí. La prueba conjunta pregunta si <i>alguna</i> de las variables añadidas aporta; aquí lo hace ${c.n2}, no ${c.n3}. Además ${c.n2} y ${c.n3} están correlacionadas (la antigüedad crece con la experiencia), lo que infla sus errores estándar individuales.` }
    ];
    return { intro: `<p>${c.intro}</p>`, partes: par, preguntas: pr, stats: { R, U, F, Fc, pF, F2, p2, U2 } };
  }

  /* =========================================================== MULTICOLINEALIDAD */
  function multiCase(c) {
    const r = EL.rng(c.seed), n = c.n, a = [], b = [], y = [];
    for (let i = 0; i < n; i++) { const z1 = EL.gauss(r), z2 = c.rho * z1 + Math.sqrt(1 - c.rho * c.rho) * EL.gauss(r), x1 = c.m1 + c.s1 * z1, x2 = c.m2 + c.s2 * z2; a.push(x1); b.push(x2); y.push(c.a0 + c.b1 * x1 + c.b2 * x2 + c.s * EL.gauss(r)); }
    const ma = S.reg([a], y), mb = S.reg([b], y), mm = S.reg([a, b], y), aux = S.reg([a], b), vf = S.vif([a, b]), rr = S.corr(a, b);
    const par = [
      { t: `(1) ${c.yn} sobre ${c.n1}`, h: out(ma, c.yn, [c.n1], 3) },
      { t: `(2) ${c.yn} sobre ${c.n2}`, h: out(mb, c.yn, [c.n2], 3) },
      { t: `(3) ${c.yn} sobre ${c.n1} y ${c.n2}`, h: out(mm, c.yn, [c.n1, c.n2], 3) },
      { t: `(4) Regresión auxiliar: ${c.n2} sobre ${c.n1}`, h: `<pre class="stata nomath">${c.n2} = ${f(aux.beta[0], 2)} + ${f(aux.beta[1], 3)} ${c.n1}      R² = ${f(aux.r2, 4)}      corr(${c.n1}, ${c.n2}) = ${f(rr, 3)}\nFIV = 1/(1 − R²) = ${f(vf[0].vif, 1)}</pre>` }
    ];
    const pr = [
      { q: 'Compare las regresiones (1) y (2) con la (3). ¿Qué cambia?', a: `Solas, ambas variables son muy significativas ($t=${f(ma.t[1], 1)}$ y $t=${f(mb.t[1], 1)}$). Juntas, los errores estándar se disparan (${f(ma.se[1], 3)}→${f(mm.se[1], 3)} para ${c.n1}; ${f(mb.se[1], 3)}→${f(mm.se[2], 3)} para ${c.n2}) y los $t$ caen a ${f(mm.t[1], 2)} y ${f(mm.t[2], 2)}. El $R^2$ casi no cambia (${f(ma.r2, 3)}, ${f(mb.r2, 3)}, ${f(mm.r2, 3)}).` },
      { q: 'La $F$ global del modelo (3) es muy significativa pero los $t$ individuales no. ¿Qué indica?', a: `$F=${f(mm.F, 1)}$ ($${pvm(mm.pF)}$): las dos variables <i>juntas</i> explican mucho, pero los datos no pueden separar el efecto de cada una. Es el síntoma clásico de multicolinealidad alta.` },
      { q: 'Use la regresión auxiliar (4) para cuantificar el problema.', a: `$R^2_{aux}=${f(aux.r2, 3)}$ ⇒ $FIV=1/(1-${f(aux.r2, 3)})=${f(vf[0].vif, 1)}$ (por encima de 10 es severo): la varianza de cada coeficiente se multiplica por ${f(vf[0].vif, 1)} y el error estándar por ${f(Math.sqrt(vf[0].vif), 1)}.` },
      { q: '¿Hay sesgo? ¿Eliminaría una de las dos variables?', a: `No hay sesgo: MCO sigue siendo insesgado y MELI con errores estándar correctos (pero grandes). Eliminar una variable relevante, como en (1) o (2), <b>sí</b> introduce sesgo por omisión: el coeficiente de ${c.n1} sube de ${f(mm.beta[1], 3)} a ${f(ma.beta[1], 3)} porque recoge el efecto de ${c.n2}. Mejores opciones: más datos, información a priori, o combinar ambas variables.` }
    ];
    return { intro: `<p>${c.intro}</p>`, partes: par, preguntas: pr, stats: { ma, mb, mm, aux, vf, rr } };
  }

  EL.caseKit = { hetero: heteroCase, auto: autoCase, fstat: fCase, multi: multiCase };

  /* ---------- configuraciones (contextos y semillas) ---------- */
  EL.CASE_CFG = {
    h1: { seed: 11, n: 34, omit: 6, mu: 3.0, sx: 0.9, A: 2.2, b: 0.9, se: 0.45, d: 2, xn: 'poblacion', yn: 'salud', intro: 'Un analista estudia el presupuesto anual de salud (millones de pesos) de 34 municipios y su población (miles de habitantes). Ordena los municipios por población para aplicar las pruebas.' },
    h2: { seed: 23, n: 34, omit: 6, mu: 2.4, sx: 0.8, A: 5.0, b: 0.85, se: 0.4, d: 2, xn: 'area', yn: 'ventas', intro: 'Una cadena de tiendas analiza las ventas mensuales (millones de pesos) de 34 locales según su área de exhibición (cientos de m²).' },
    h3: { seed: 13, n: 34, omit: 6, mu: 3.2, sx: 0.7, A: 1.4, b: 1.0, se: 0.5, d: 2, xn: 'matricula', yn: 'gasto_edu', intro: 'Se relaciona el gasto en educación (millones de pesos) con la matrícula (miles de estudiantes) en 34 distritos escolares.' },
    h5: { seed: 19, n: 34, omit: 6, mu: 2.6, sx: 0.5, A: 0.8, b: 1.6, se: 0.25, d: 2, xn: 'produccion', yn: 'costo_total', intro: 'Una empresa relaciona el costo total mensual (millones de pesos) con el volumen producido (miles de unidades) en 34 plantas ordenadas por producción.' },
    a1: { kind: 'ar', seed: 5, T: 60, a: 20, b: 0.55, rho: 0.85, s: 4, d: 2, xn: 'actividad', yn: 'energia', intro: 'Se estudia el consumo mensual de energía (GWh) de una región frente a un índice de actividad industrial durante 60 meses. Los datos están ordenados en el tiempo.' },
    a2: { kind: 'curva', seed: 44, T: 60, A: 6, b: 0.5, s: 0.04, d: 2, xn: 'capital', yn: 'produccion', intro: 'Una serie anual (60 observaciones ordenadas por nivel de capital) relaciona la producción de una industria con su stock de capital. Se estiman cuatro especificaciones.' },
    a3: { kind: 'ar', seed: 17, T: 60, a: 15, b: 0.4, rho: 0.75, s: 3, d: 2, xn: 'turistas', yn: 'ocupacion', intro: 'Se relaciona la ocupación hotelera mensual con el número de turistas (miles) durante 60 meses.' },
    a4: { kind: 'curva', seed: 13, T: 60, A: 3, b: 0.55, s: 0.04, d: 2, xn: 'inversion', yn: 'ventas_pc', intro: 'Una serie de 60 observaciones relaciona las ventas per cápita con la inversión en publicidad; se comparan cuatro especificaciones.' },
    m4: { seed: 15, n: 40, rho: 0.94, m1: 30, s1: 6, m2: 25, s2: 5, a0: 3, b1: 0.5, b2: 0.4, s: 2.5, n1: 'prensa', n2: 'redes', yn: 'ventas_marca', intro: 'Una marca explica sus ventas mensuales (millones) con su inversión en prensa y en redes sociales (millones) en 40 ciudades.' },
    h4: { seed: 40, n: 34, omit: 6, mu: 2.8, sx: 0.8, A: 3, b: 0.8, se: 0.42, d: 2, xn: 'ingreso', yn: 'gasto_transp', intro: 'Se relaciona el gasto mensual de los hogares en transporte (miles de pesos) con su ingreso (millones de pesos) en una muestra de 34 hogares ordenados por ingreso.' },
    a5: { kind: 'ar', seed: 3, T: 60, a: 10, b: 0.5, rho: 0.6, s: 3, d: 2, xn: 'pasajeros', yn: 'ingresos_aero', intro: 'Se relacionan los ingresos mensuales de un aeropuerto (millones) con el número de pasajeros (miles) durante 60 meses.' },
    f1: { seed: 41, n: 300, b0: 2, b1: 0.6, b2: 0.12, b3: 0.0, s: 3, xn: 'educ', n1: 'educ', n2: 'exper', n3: 'antig', yn: 'salario', intro: 'Con 300 trabajadores se explica el salario por hora (miles de pesos) con los años de educación. Luego se añaden la experiencia y la antigüedad en la empresa (años).' },
    f2: { seed: 7, n: 250, b0: 20, b1: 0.5, b2: 0.1, b3: 0.0, s: 4, n1: 'horas', n2: 'asistencia', n3: 'tutorias', yn: 'nota', intro: 'Con 250 estudiantes se explica la nota final (sobre 100) con las horas de estudio semanales. Luego se añaden la asistencia a clase y las tutorías recibidas.' },
    m1: { seed: 7, n: 40, rho: 0.97, m1: 100, s1: 15, m2: 60, s2: 5, a0: 5, b1: 0.10, b2: 0.35, s: 3, n1: 'lluvia', n2: 'humedad', yn: 'rendimiento', intro: 'Se explica el rendimiento de un cultivo (toneladas por hectárea) con la lluvia (mm) y la humedad relativa (%) en 40 parcelas.' },
    m2: { seed: 15, n: 40, rho: 0.96, m1: 28, s1: 3, m2: 70, s2: 8, a0: 10, b1: 1.2, b2: 0.25, s: 4, n1: 'temperatura', n2: 'evaporacion', yn: 'consumo_agua', intro: 'Se explica el consumo de agua de riego (miles de litros) con la temperatura (°C) y la evaporación (mm) en 40 parcelas.' },
    m3: { seed: 7, n: 40, rho: 0.95, m1: 50, s1: 10, m2: 40, s2: 8, a0: 8, b1: 0.3, b2: 0.2, s: 3, n1: 'radio', n2: 'television', yn: 'ventas_camp', intro: 'Una empresa explica las ventas de una campaña (millones) con su gasto en radio y en televisión (millones) en 40 ciudades.' }
  };
  const C = EL.CASE_CFG;
  /* Casos resueltos que aparecen en los temas (se calculan al abrir) */
  EL.CASOS = {
    t9: [{ id: 'h1', titulo: 'Heterocedasticidad: ¿qué dicen los gráficos y las pruebas?', build: () => heteroCase(C.h1) }],
    t10: [{ id: 'a1', titulo: 'Autocorrelación genuina: leer d y corregir', build: () => autoCase(C.a1) }, { id: 'a2', titulo: 'Un d bajo que NO es autocorrelación: elegir la especificación', build: () => autoCase(C.a2) }],
    t11: [{ id: 'f1', titulo: 'Prueba F de relevancia conjunta con la tabla ANOVA', build: () => fCase(C.f1) }],
    t8: [{ id: 'm1', titulo: 'Multicolinealidad: cuando los t se caen y la F no', build: () => multiCase(C.m1) }]
  };

  /* Se arma el enunciado/ modelo de un caso para el banco de preguntas (open tipo "abierta") */
  EL.caseForBank = function (kind, cfgKey, extra) {
    const c = EL.caseKit[kind](C[cfgKey]);
    const enun = c.intro + c.partes.map(p => `<div class="case-part"><b>${p.t}</b>${p.h}</div>`).join('') + `<ol type="a" class="case-q">${c.preguntas.map(p => `<li>${p.q}</li>`).join('')}</ol>`;
    const modelo = `<ol type="a">${c.preguntas.map(p => `<li>${p.a}</li>`).join('')}</ol>`;
    return { enun: (extra || '') + enun, modelo, c };
  };
})(typeof window !== 'undefined' ? window : globalThis);
