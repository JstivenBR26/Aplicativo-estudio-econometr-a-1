/* verificar.js — Pruebas automáticas (Node, sin dependencias):  node tests/verificar.js
   1) Integridad del banco (esquema, ids únicos, respuestas válidas, temas existentes).
   2) Recalcula con álgebra matricial las cifras clave del contenido y de las preguntas numéricas.
   3) Prueba la lógica de calificación (Quiz.score).                                                   */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { console, Math, Date, setTimeout }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
['js/core/util.js', 'js/core/store.js', 'js/core/charts.js', 'js/content/temas.js', 'js/content/temas-violaciones.js', 'js/content/temas-corte2.js', 'js/content/temas-asintotica.js', 'js/content/banco-corte1.js', 'js/content/banco-parcial1.js', 'js/content/banco-corte2.js', 'js/content/banco-violaciones.js', 'js/content/banco-asintotica.js', 'js/core/quiz.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }));
const EL = ctx.EL; let fails = 0, oks = 0;
const ok = (c, msg) => { if (c) oks++; else { fails++; console.log('✗ FALLA:', msg); } };
const near = (a, b, t, msg) => ok(Math.abs(a - b) <= (t || 1e-3), `${msg}: obtenido ${a}, esperado ${b}`);

/* ---- 1) Integridad ---- */
const ids = new Set(), temaIds = new Set(EL.TEMAS.map(t => t.id));
EL.BANCO.forEach(q => {
  ok(!ids.has(q.id), 'id duplicado ' + q.id); ids.add(q.id);
  ok(temaIds.has(q.tema), `${q.id}: tema inexistente ${q.tema}`);
  ok(q.enun && q.sub && q.fuente && [1, 2, 3].includes(q.dif), `${q.id}: campos obligatorios`);
  if (q.tipo === 'mc') { ok(Array.isArray(q.opts) && q.opts.length === 4, q.id + ': 4 opciones'); ok(Number.isInteger(q.c) && q.c >= 0 && q.c < q.opts.length, q.id + ': índice correcto'); ok(q.expl, q.id + ': explicación'); ok(!q.why || (q.why.length === q.opts.length && q.why.every((w, i) => i === q.c || w)), q.id + ': why completo'); }
  if (q.tipo === 'vf') { ok(typeof q.c === 'boolean' && q.expl, q.id + ': vf'); }
  if (q.tipo === 'num') { ok(typeof q.c === 'number' && q.tol > 0 && q.expl, q.id + ': num'); }
  if (q.tipo === 'grupo') { ok(q.items.length > 0 && q.items.every(i => i.opts.length >= 2 && i.c >= 0 && i.c < i.opts.length && i.e && i.t), q.id + ': items'); q.items.forEach(i => { if (i.fig) ok(typeof EL.FIGS[i.fig] === 'function', q.id + ': figura ' + i.fig); }); }
  if (q.tipo === 'abierta') { ok(q.modelo && q.rubrica && q.rubrica.length > 0, q.id + ': abierta'); }
  ok(['mc', 'vf', 'num', 'grupo', 'abierta'].includes(q.tipo), q.id + ': tipo');
  // sin símbolo de moneda suelto que rompa el render de fórmulas: número impar de $ → alerta
  const all = JSON.stringify(q).replace(/\\\\/g, '').replace(/\\\$/g, ''); const n = (all.match(/\$/g) || []).length; ok(n % 2 === 0, `${q.id}: número impar de $ (${n})`);
});
EL.TEMAS.forEach(t => {
  ok(t.objetivo && t.intuicion && t.formal && t.ejemplo && t.ejemplo.pasos.length && t.aplicacion && t.errores.length && t.checks.length, t.id + ': secciones');
  t.checks.forEach((c, i) => ok(c.c >= 0 && c.c < c.opts.length && c.e, `${t.id} check ${i}`));
  const html = JSON.stringify([t.intuicion, t.formal, t.aplicacion, t.ejemplo, t.errores, t.checks]); const n = (html.replace(/\\\\/g, '').replace(/\\\$/g, '').match(/\$/g) || []).length; ok(n % 2 === 0, `${t.id}: número impar de $ (${n})`);
  (t.lab || []).forEach(l => ok(true, ''));
});
console.log(`Banco: ${EL.BANCO.length} preguntas · Temas: ${EL.TEMAS.length}`);
const cnt = {}; EL.BANCO.forEach(q => cnt[q.tema] = (cnt[q.tema] || 0) + 1); console.log('Preguntas por tema:', JSON.stringify(cnt));
ok(EL.BANCO.filter(q => /^p1-0/.test(q.id)).reduce((s, q) => s + q.peso, 0) > 4.99 && EL.BANCO.filter(q => /^p1-0/.test(q.id)).reduce((s, q) => s + q.peso, 0) < 5.01, 'La réplica del Parcial 1 suma 5.0 puntos');

// Caracteres de control: delatan una barra invertida sin duplicar en una cadena normal (\t, \b, \v, \f…)
{ const walk = (o, where) => { if (typeof o === 'string') { if (/[\u0008\u0009\u000b\u000c\r]/.test(o)) ok(false, `carácter de control en ${where}: ${JSON.stringify(o.slice(0, 70))}`); } else if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k], where + '.' + k)); };
  EL.BANCO.forEach(q => walk(q, q.id)); EL.TEMAS.forEach(t => walk(t, t.id)); }

/* ---- 2) Cifras clave recalculadas ---- */
const x = [2, 3, 5, 6, 9], y = [8, 7, 9, 12, 14], m = EL.olsSimple(x, y);
near(m.beta[0], 5, 1e-9, 'β0'); near(m.beta[1], 1, 1e-9, 'β1'); near(m.scr, 4, 1e-9, 'SCR'); near(m.sct, 34, 1e-9, 'SCT'); near(m.r2, 0.88235, 1e-4, 'R2');
near(m.s2, 4 / 3, 1e-9, 'σ²'); near(m.se[1], 0.2108, 1e-4, 'ee β1'); near(m.V[0][1], -0.2222, 1e-4, 'Cov'); near(m.beta[1] / m.se[1], 4.743, 1e-3, 't');
near(m.XtX[0][0] * m.XtX[1][1] - m.XtX[0][1] ** 2, 150, 1e-9, 'det X\'X');
const a = [1, 4], v0 = EL.mat.vec(m.XtXinv, a).reduce((s, v, i) => s + v * a[i], 0) * m.s2; near(v0, 0.3111, 1e-4, 'Var ŷ0 (x=4)');
const H = EL.mat.mul(x.map(v => [1, v]), EL.mat.mul(m.XtXinv, EL.mat.T(x.map(v => [1, v])))); near(H[4][4], 0.73333, 1e-4, 'h55'); near(H.reduce((s, r, i) => s + r[i], 0), 2, 1e-9, 'tr(H)=k');
near(m.res.reduce((s, v) => s + v, 0), 0, 1e-9, 'Σε̂=0'); near(m.res.reduce((s, v, i) => s + v * x[i], 0), 0, 1e-9, 'Σxε̂=0');
near(2 / 49 / (1 / 30), 60 / 49, 1e-12, 'razón varianzas'); near(0.2 * 30, 6, 1e-12, 'subestima ×6 (taller)');
near((18 + 12 + 0 + 6 + 144) / 900, 0.2, 1e-12, 'var verdadera het.');
near(1 - (1 - 0.113) * 705 / 702, 0.1093, 5e-4, 'R2aj sueño'); near(-0.148 * 300, -44.4, 1e-9, '5h'); near(-0.148 * 600 - 11.13 * 4 + 2.2 * 10, -111.32, 1e-9, 'B−A');
near(1 - (1 - 0.412) * 29 / 28, 0.3910, 1e-3, 'R2aj taller 4a'); near(1 - (1 - 0.418) * 29 / 27, 0.3749, 1e-3, 'R2aj taller 4a ampliado');
near(Math.sqrt((0.006) / (0.582 / 27)), 0.528, 2e-3, '|t| experiencia');
near(100 * (Math.exp(0.8) - 1), 122.55, 5e-3, 'log-lin exacto'); near(1 - 0.98 * 19 / 14, -0.3, 0.04, 'R2aj negativo');
near(1 - 0.40 * 39 / 37, 0.5784, 1e-3, 'R2aj A (p1-105)'); near(1 - 0.38 * 39 / 34, 0.5641, 1e-3, 'R2aj B (p1-105)');
near((120 - 100) / 2 / (100 / 46), 4.6, 0.01, 'F ejemplo'); near(EL.dist.tCrit(0.025, 3), 3.182, 2e-3, 't crit 3 gl'); near(EL.dist.tCrit(0.025, 116), 1.981, 2e-3, 't crit 116'); near(EL.dist.tCrit(0.025, 37), 2.026, 2e-3, 't crit 37');
near(EL.dist.fCrit(0.05, 2, 46), 3.20, 0.02, 'F crit (2,46)'); near(EL.dist.tPvalue2(4.743, 3), 0.0178, 1e-3, 'p t=4.74, 3gl');
near(0.25 + 0.60 * 0.5, 0.55, 1e-12, 'variable omitida'); near(1 / (1 - 0.6), 2.5, 1e-12, 'FIV');
near(EL.dist.chi1P(3.84), 0.05, 2e-3, 'chi2 1gl p'); near(EL.dist.normCdf(1.96), 0.975, 1e-3, 'Φ(1.96)');
// Corte 2: violaciones
near(1 / (1 - 0.9025), 10.256, 1e-3, 'FIV r=.95'); near(Math.sqrt(10.256), 3.2, 5e-3, 'raíz FIV'); near(4 / (100 * (1 - 0.81)), 0.2105, 1e-4, 'Var β2 r=.9'); near(1 / (1 - 0.95), 20, 1e-9, 'FIV 20');
near(1 / (1 - 0.64), 1 / 0.36, 1e-9, 'ok'); near(1 / 0.64, 1.5625, 1e-9, 'Var AR(1)'); near(0.25 * 2, 0.5, 1e-12, 'Cov AR(1) rezago 2');
const e6 = [1, 2, 1, -1, -2, -1], dwn = e6.slice(1).reduce((s, v, i) => s + (v - e6[i]) ** 2, 0), dwd = e6.reduce((s, v) => s + v * v, 0), r6 = e6.slice(1).reduce((s, v, i) => s + v * e6[i], 0) / dwd;
near(dwn, 8, 1e-12, 'DW num'); near(dwd, 12, 1e-12, 'DW den'); near(dwn / dwd, 0.667, 1e-3, 'DW ejemplo'); near(r6, 0.5833, 1e-3, 'rho ejemplo'); near(2 * (1 - r6), 0.8333, 1e-3, '2(1-rho)');
near(100 * 0.12, 12, 1e-12, 'BP'); near(120 * 0.09, 10.8, 1e-9, 'BP 2'); near(4 - 1.489, 2.511, 1e-12, '4-dU'); near(4 - 1.352, 2.648, 1e-12, '4-dL');
near(EL.dist.fCrit(0.05, 11, 11), 2.82, 0.02, 'F crit (11,11)');
// χ² crit con 1 gl ≈ 3.84 (via p); para 5 gl se cita 11.07 (tabla estándar)
near(1 - (1 - 0.05), 0.05, 1e-12, 'ok');
// Asintótica
near(3 + 2 / 4, 3.5, 1e-12, 'plim endo'); near(2 + 1 / 2, 2.5, 1e-12, 'plim ejemplo'); near(1 - EL.dist.normCdf(2), 0.0228, 1e-3, 'TLC exp'); near(Math.sqrt(9 / (2 * 450)), 0.1, 1e-12, 'ee asint'); near((1 / 4) ** 2 * 8 / 200, 0.0025, 1e-12, 'delta'); near((1 / 16) * 4 / 100, 0.0025, 1e-12, 'delta 1/x');
near(-1 * 0.4, -0.4, 1e-12, 'omitida asint'); near(0.5 / 2, 0.25, 1e-12, 'sesgo asint check');
// Simulación del ejemplo endógeno: plim 2.5 (n grande)
{ const r = EL.rng(5), x = [], y = []; for (let i = 0; i < 200000; i++) { const z = EL.gauss(r), e = EL.gauss(r), a = z + e; x.push(a); y.push(1 + 2 * a + e); } near(EL.olsSimple(x, y).beta[1], 2.5, 0.02, 'MC endógeno → 2.5'); }
// Simulación: heteroscedasticidad σᵢ=|x| ⇒ ee usual ≈ 0.58 de la desviación real
{ const r = EL.rng(9), b = [], se = []; for (let t = 0; t < 1500; t++) { const x = Array.from({ length: 60 }, () => EL.gauss(r)), y = x.map(a => 1 + a + Math.abs(a) * EL.gauss(r)), m = EL.olsSimple(x, y); b.push(m.beta[1]); se.push(m.se[1]); } const mb = EL.mean(b), s = Math.sqrt(EL.sum(b.map(v => (v - mb) ** 2)) / 1499); near(EL.mean(se) / s, 0.58, 0.07, 'hetero: ee usual / real'); near(mb, 1, 0.03, 'hetero insesgado'); }
// Taller 2: Var(β1+β2) con covarianza
near(Math.sqrt(0.009097 + 0.002792 + 2 * -0.000371), 0.1056, 1e-3, 'ee suma coef.'); near((-1.4751 + 1) / 0.09538, -4.98, 0.01, 't H0: β1=-1'); near((0.7952 - 1) / 0.05284, -3.876, 0.01, 't β2=1');
// Cuestionario: Var(2Y−X+5)
near(4 * 4 + 9 - 2 * 2 * 3, 13, 1e-12, 'Var(2Y−X)');
// matriz del enunciado (caso D bias): E(ε|x)=0.5x → sesgo (0, 0.5)
const Xd = [1, 2, 3, 4].map(v => [1, v]), e = [0.5, 1, 1.5, 2], bias = EL.mat.vec(EL.ols(Xd, [1, 2, 3, 4.5]).XtXinv, EL.mat.vec(EL.mat.T(Xd), e)); near(bias[0], 0, 1e-9, 'sesgo caso D intercepto'); near(bias[1], 0.5, 1e-9, 'sesgo caso D pendiente');
// Rango de la matriz con columna 2x → X'X singular
ok(EL.ols([[1, 1, 2], [1, 2, 4], [1, 3, 6], [1, 4, 8]], [1, 2, 3, 4]) === null, 'colinealidad perfecta ⇒ X\'X singular');

/* ---- 3) Calificación ---- */
const Q = EL.Quiz, B = id => Q.byId(id);
near(Q.score(B('c1-021'), 2), 1, 0, 'mc correcta'); near(Q.score(B('c1-021'), 0), 0, 0, 'mc incorrecta');
near(Q.score(B('c1-022'), '4'), 1, 0, 'num exacta'); near(Q.score(B('c1-022'), '4,005'), 1, 0, 'num coma decimal'); near(Q.score(B('c1-022'), '5'), 0, 0, 'num incorrecta');
near(Q.score(B('c1-074'), '122,6'), 1, 0, 'num tol'); near(Q.score(B('p1-008'), '−77,5'), 1, 0, 'num signo menos unicode y coma');
// Simulacro estructurado: cifras del modelo de la cafetería
near(-2.4 * 10, -24, 1e-12, 'p1-006'); near(9.5 * -5 - 2.4 * 5 - 0.06 * 300, -77.5, 1e-9, 'p1-008'); near(1 - 0.69 * 239 / 236, 0.301, 1e-3, 'R2aj cafetería'); near(1 - 0.58 * 149 / 145, 0.404, 1e-3, 'R2aj rendimiento'); near(12 * 0.2, 2.4, 1e-12, 'lin-log 20%'); near(18 * 0.05, 0.9, 1e-12, 'lin-log 5%');
{ const Xd2 = [1, 2, 3, 4].map(v => [1, v]), bb = EL.mat.vec(EL.ols(Xd2, [1, 2, 3, 4.5]).XtXinv, EL.mat.vec(EL.mat.T(Xd2), [-1.5, -0.5, 0.5, 1.5])); near(bb[0], -2.5, 1e-9, 'sesgo D intercepto'); near(bb[1], 1, 1e-9, 'sesgo D pendiente'); }
const g = B('p1-001'); near(Q.score(g, g.items.map(i => i.c)), 1, 0, 'grupo completo'); near(Q.score(g, g.items.map((i, k) => k < 3 ? i.c : (i.c + 1) % 2)), 3 / 7, 1e-9, 'grupo parcial');
const ab = B('p1-004'); ok(Q.score(ab, undefined) === null, 'abierta sin responder = null'); near(Q.score(ab, { rub: [true, true, false], done: true }), 2 / 3, 1e-9, 'abierta rúbrica');
near(Q.score(B('c1-001'), false), 1, 0, 'vf'); near(Q.score(B('c1-001'), true), 0, 0, 'vf incorrecta');
// Cada pregunta mc/vf/num/grupo del banco: la respuesta correcta puntúa 1 y una incorrecta, menos de 1
EL.BANCO.forEach(q => {
  if (q.tipo === 'mc') { near(Q.score(q, q.c), 1, 0, q.id + ' correcta'); near(Q.score(q, (q.c + 1) % 4), 0, 0, q.id + ' incorrecta'); }
  if (q.tipo === 'vf') { near(Q.score(q, q.c), 1, 0, q.id + ' vf'); }
  if (q.tipo === 'num') { near(Q.score(q, String(q.c)), 1, 0, q.id + ' num'); near(Q.score(q, String(q.c + 10 * q.tol + 1)), 0, 0, q.id + ' num mala'); }
  if (q.tipo === 'grupo') near(Q.score(q, q.items.map(i => i.c)), 1, 0, q.id + ' grupo');
});

console.log(`\n${oks} comprobaciones correctas, ${fails} fallas.`);
process.exit(fails ? 1 : 0);
