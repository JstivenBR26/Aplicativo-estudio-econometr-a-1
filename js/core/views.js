/* views.js — Vistas de la plataforma: inicio, contenidos, laboratorio, banco, simulador, seguimiento y fuentes. */
(function (root) {
  'use strict';
  const EL = root.EL, Q = EL.Quiz, S = EL.store, esc = EL.esc, f = EL.fmt;
  const V = EL.views = {};
  const view = () => document.getElementById('view');
  const show = (html, title) => { const v = view(); v.innerHTML = html; EL.renderMath(v); document.title = (title ? title + ' · ' : '') + 'EconoLab · Econometría I'; v.scrollTop = 0; window.scrollTo(0, 0); return v; };
  const temaById = id => EL.TEMAS.find(t => t.id === id);
  const tLabel = t => `T${t.num}`;
  const CORTES = { 1: 'Corte 1 · Modelo clásico', 2: 'Corte 2 · Violaciones de supuestos y temas finales', 3: 'Teoría asintótica · grupo de la profesora Sofía' };
  const SOFIA = '🚩 Grupo profe Sofía';
  const sofiaChip = t => t && t.sofia ? `<span class="chip flag" title="Contenido para los estudiantes de la profesora Sofía">${SOFIA}</span>` : '';
  const prioChip = t => t && t.prioridad === 'nucleo' ? '<span class="chip core" title="Tema central del corte: dedícale más tiempo de práctica">★ Núcleo del corte</span>' : t && t.prioridad === 'complemento' ? '<span class="chip soft" title="Tema de apoyo">Complementario</span>' : '';
  const pctTxt = x => (x * 100).toFixed(0) + ' %';
  const nl2 = s => s;

  /* ------------------------------------------------------------------ desempeño agregado */
  EL.perf = function () {
    const st = S.get(), out = {};
    Object.entries(st.practice).forEach(([qid, p]) => { const q = Q.byId(qid); if (!q) return; const o = out[q.tema] = out[q.tema] || { n: 0, sum: 0 }; o.n += p.ok + p.no; o.sum += p.ok; });
    st.attempts.forEach(a => a.items.forEach(it => { if (it.s === null || it.s === undefined) return; const q = Q.byId(it.q); if (!q) return; const o = out[q.tema] = out[q.tema] || { n: 0, sum: 0 }; o.n++; o.sum += it.s; }));
    return out;
  };
  EL.lastStatus = function () {            // qid → {s, ts}  (último resultado conocido)
    const st = S.get(), m = {};
    Object.entries(st.practice).forEach(([qid, p]) => { m[qid] = { s: p.last, ts: p.ts || 0 }; });
    st.attempts.forEach(a => a.items.forEach(it => { if (it.s === null || it.s === undefined) return; if (!m[it.q] || (a.date || 0) >= m[it.q].ts) m[it.q] = { s: it.s, ts: a.date || 0 }; }));
    return m;
  };
  const barRow = (label, frac, n, href) => `<div class="brow">${href ? `<a href="${href}">${label}</a>` : `<span>${label}</span>`}<div class="btrack"><i class="${n === 0 ? 'none' : frac >= 0.8 ? 'good' : frac >= 0.6 ? 'mid' : 'bad'}" style="width:${n === 0 ? 0 : Math.max(3, frac * 100)}%"></i></div><em>${n === 0 ? 'sin datos' : pctTxt(frac) + ' · ' + n}</em></div>`;

  /* ------------------------------------------------------------------ barra lateral y progreso superior */
  V.side = function (route) {
    const st = S.get(), cur = route.name;
    const item = (href, ico, txt, active, sub) => `<a class="nav ${active ? 'on' : ''}" href="${href}"><span class="ico">${ico}</span><span>${txt}</span></a>${sub || ''}`;
    const temas = c => EL.TEMAS.filter(t => t.corte === c).map(t => { const r = st.topics[t.id] && st.topics[t.id].read; return `<a class="sub ${cur === 'tema' && route.id === t.id ? 'on' : ''}" href="#/tema/${t.id}"><span class="num">${t.num}</span><span>${esc(t.titulo.split(':')[0])}</span>${t.sofia ? '<span title="Grupo profe Sofía">🚩</span>' : ''}${r ? '<span class="ck">✓</span>' : ''}</a>`; }).join('');
    document.getElementById('side').innerHTML =
      `<a class="sideprog" id="side-prog" href="#/progreso"></a>` +
      item('#/inicio', '⌂', 'Inicio', cur === 'inicio') +
      `<div class="grp">Módulos</div>` +
      item('#/contenidos', '1', 'Contenidos', cur === 'contenidos' || cur === 'tema', (cur === 'contenidos' || cur === 'tema') ? `<div class="subs"><div class="subh">Corte 1</div>${temas(1)}<div class="subh">Corte 2</div>${temas(2)}<div class="subh">🚩 Grupo profe Sofía</div>${temas(3)}</div>` : '') +
      item('#/lab', '2', 'Laboratorio', cur === 'lab', cur === 'lab' ? `<div class="subs">${EL.LABS.map(l => `<a class="sub ${route.id === l.id ? 'on' : ''}" href="#/lab/${l.id}"><span>${esc(l.titulo.split(':')[0])}</span></a>`).join('')}</div>` : '') +
      item('#/banco', '3', 'Banco de preguntas', cur === 'banco') +
      item('#/simulador', '4', 'Simulador de parciales', cur === 'simulador') +
      item('#/progreso', '5', 'Seguimiento', cur === 'progreso') +
      `<div class="grp">Información</div>` + item('#/fuentes', 'i', 'Fuentes y alcance', cur === 'fuentes') +
      `<p class="sidefoot">${S.persistent() ? 'Tu progreso se guarda en este navegador.' : '⚠ Este navegador bloquea el almacenamiento local: el progreso se pierde al cerrar. Usa Seguimiento → Exportar.'}</p>`;
  };
  V.topProgress = function () {
    const st = S.get(), read = EL.TEMAS.filter(t => st.topics[t.id] && st.topics[t.id].read).length, perf = EL.perf();
    const n = Object.values(perf).reduce((a, o) => a + o.n, 0), sum = Object.values(perf).reduce((a, o) => a + o.sum, 0);
    const html = `<b>${read}/${EL.TEMAS.length}</b> temas · <b>${n ? pctTxt(sum / n) : '—'}</b> aciertos`;
    document.getElementById('top-progress').innerHTML = html;
    const sp = document.getElementById('side-prog'); if (sp) sp.innerHTML = 'Mi progreso: ' + html;
  };

  /* ================================================================== INICIO */
  V.inicio = function () {
    const st = S.get(), perf = EL.perf(), read = EL.TEMAS.filter(t => st.topics[t.id] && st.topics[t.id].read).length;
    const total = Object.values(perf).reduce((a, o) => a + o.n, 0), sum = Object.values(perf).reduce((a, o) => a + o.sum, 0);
    const next = EL.TEMAS.find(t => !(st.topics[t.id] && st.topics[t.id].read)) || EL.TEMAS[0];
    const nQ = EL.BANCO.length, nLab = EL.LABS.length;
    show(`<section class="hero"><div><p class="eyebrow">Econometría I · Universidad Nacional de Colombia</p><h1>Estudia, experimenta y practica antes del parcial</h1>
      <p class="lead">Una plataforma para entender el modelo clásico de regresión: de la intuición, a la formalización matemática, a la aplicación. Con laboratorios que se pueden manipular y simulacros con la estructura de un parcial.</p>
      <div class="row"><a class="btn pri" href="#/tema/${next.id}">${read ? 'Continuar: ' : 'Empezar: '}Tema ${next.num}</a><a class="btn" href="#/simulador">Hacer un simulacro</a></div></div>
      <div class="hero-stats"><div class="stat"><span>Temas estudiados</span><b>${read}/${EL.TEMAS.length}</b></div><div class="stat"><span>Preguntas respondidas</span><b>${total}</b></div><div class="stat"><span>Aciertos</span><b>${total ? pctTxt(sum / total) : '—'}</b></div></div></section>
      <h2>Los cinco módulos</h2>
      <div class="cards">
        <a class="card" href="#/contenidos"><span class="cn">1</span><h3>Contenidos</h3><p>${EL.TEMAS.length} temas organizados por corte. Cada uno: objetivo, intuición, formalización, ejemplo paso a paso, aplicaciones, errores frecuentes y verificación.</p></a>
        <a class="card" href="#/lab"><span class="cn">2</span><h3>Laboratorio</h3><p>${nLab} experimentos interactivos: mueve parámetros y observa SCR, sesgo, varianza, residuos y distribuciones.</p></a>
        <a class="card" href="#/banco"><span class="cn">3</span><h3>Banco de preguntas</h3><p>${nQ} preguntas con explicación y justificación de cada opción, filtrables por tema, tipo y dificultad.</p></a>
        <a class="card" href="#/simulador"><span class="cn">4</span><h3>Simulador de parciales</h3><p>Simulacro con la estructura del Parcial 1 (1 h 45 min, 5.0 puntos) o simulacros configurables con tiempo, tema y dificultad.</p></a>
        <a class="card" href="#/progreso"><span class="cn">5</span><h3>Seguimiento</h3><p>Desempeño por tema, evolución, preguntas falladas y recomendaciones de repaso.</p></a>
      </div>
      <h2>Ruta de estudio sugerida</h2>
      <ol class="route"><li><b>Lee</b> el tema (10–15 min) y haz sus verificaciones.</li><li><b>Experimenta</b> en el laboratorio asociado: predice qué pasará antes de mover el control.</li><li><b>Practica</b> 5–8 preguntas del tema en el banco y revisa por qué fallaste.</li><li><b>Simula</b> el parcial en condiciones reales (sin calculadora) y revisa el seguimiento.</li></ol>
      <div class="callout warn"><b>Qué respaldan y qué no los insumos.</b> De los parciales de referencia se tomó solo la <b>estructura</b> (formatos, tiempos, forma de evaluar): todas las preguntas de la plataforma son originales y ninguna reproduce un examen. Los temas se apoyan en las notas de clase, el plan, el programa, los materiales de monitoría y libros de texto; la teoría asintótica es contenido estándar sin material de clase del grupo. Las soluciones son propias, no una clave oficial. <a href="#/fuentes">Ver detalle</a>.</div>`, 'Inicio');
  };

  /* ================================================================== CONTENIDOS */
  V.contenidos = function () {
    const st = S.get(), perf = EL.perf();
    const card = t => { const r = st.topics[t.id] && st.topics[t.id].read, p = perf[t.id], nq = EL.BANCO.filter(q => q.tema === t.id).length;
      return `<a class="tcard" href="#/tema/${t.id}"><div class="th"><span class="tnum">${t.num}</span><div><h3>${esc(t.titulo)}</h3><span class="muted small">${t.semana} · ${esc(t.lecturas)}</span></div>${r ? '<span class="badge ok">Estudiado</span>' : ''}</div><p>${t.resumen}</p><div class="tags">${sofiaChip(t)}${prioChip(t)}${t.subtemas.map(s => `<span class="chip soft">${s}</span>`).join('')}</div><div class="tfoot"><span>${nq} preguntas</span><span>${t.lab && t.lab.length ? t.lab.length + ' lab.' : 'sin lab.'}</span><span>${p ? pctTxt(p.sum / p.n) + ' aciertos' : 'sin práctica'}</span></div></a>`; };
    show(`<h1>Contenidos de la asignatura</h1><p class="lead">Organizados según el plan de estudio y el programa oficial. Convención usada en todo el curso: $k$ = número de parámetros <b>incluido el intercepto</b>, $gl=n-k$, $H=X(X'X)^{-1}X'$, $M=I-H$.</p>
      ${[1, 2, 3].map(c => `<h2>${CORTES[c]}</h2>${c === 3 ? '<div class="callout flagbox">🚩 <b>Contenido para los estudiantes de la profesora Sofía.</b> Si no perteneces a ese grupo, puedes omitirlo.</div>' : ''}<div class="tgrid">${EL.TEMAS.filter(t => t.corte === c).map(card).join('')}</div>${c === 2 ? '<div class="callout warn">Para el Corte 2 no hay parcial de referencia en los insumos: son contenidos de estudio conceptual basados en el plan, el programa y los materiales de monitoría.</div>' : ''}`).join('')}`, 'Contenidos');
  };

  V.tema = function (id) {
    const t = temaById(id); if (!t) return V.contenidos();
    const st = S.get(), read = st.topics[id] && st.topics[id].read, i = EL.TEMAS.indexOf(t), prev = EL.TEMAS[i - 1], next = EL.TEMAS[i + 1];
    const nq = EL.BANCO.filter(q => q.tema === id).length;
    const exHtml = (ex, i) => `<div class="exbox" data-ex="${i}">${i ? `<h4>${esc(ex.titulo)}</h4>` : ''}<ol class="steps">${ex.pasos.map((p, k) => `<li class="step">${p}</li>`).join('')}</ol><div class="row"><button class="btn pri nxt">Mostrar siguiente paso</button><button class="btn all">Mostrar todo</button></div></div>`;
    const sec = (key, title, inner) => `<section id="s-${key}" class="tsec"><h2><span class="sh">${title[0]}</span>${title[1]}</h2>${inner}</section>`;
    const html = `<nav class="crumbs"><a href="#/contenidos">Contenidos</a> › ${CORTES[t.corte].split('·')[0]}</nav>
      <header class="thead"><span class="tnum big">${t.num}</span><div><h1>${esc(t.titulo)}</h1><p class="muted">${t.semana} · Lecturas: ${esc(t.lecturas)}</p>${sofiaChip(t)}${prioChip(t)}</div></header>
      <div class="obj"><b>Objetivo de aprendizaje.</b> ${t.objetivo}</div>
      <div class="secnav">${[['intuicion', 'Intuición'], ['formal', 'Formalización'], ['ejemplo', 'Ejemplo'], ['aplicacion', 'Aplicación']].concat(EL.CASOS && EL.CASOS[id] ? [['casos', 'Casos resueltos']] : []).concat([['errores', 'Errores frecuentes'], ['check', 'Compruébalo']]).map(([k, n]) => `<a href="#" data-go="s-${k}">${n}</a>`).join('')}</div>
      ${(t.videos || []).map(vd => { const m = String(vd.url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/), id = m && m[1]; return `<section class="vidbox"><h3>🎬 Video recomendado: ${esc(vd.titulo)}</h3>${vd.nota ? `<p class="small muted">${vd.nota}</p>` : ''}${vd.archivo ? `<video class="vfile" controls preload="metadata" src="${esc(vd.archivo)}">Tu navegador no reproduce este video. <a href="${esc(vd.archivo)}">Descárgalo</a>.</video>` : ''}${id ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(vd.titulo)}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>` : ''}${vd.url ? `<p class="small"><a href="${esc(vd.url)}" target="_blank" rel="noopener">Abrir el video en una pestaña nueva ↗</a>${vd.autor ? ' · ' + esc(vd.autor) : ''}</p>` : ''}</section>`; }).join('')}
      ${sec('intuicion', ['1', 'Intuición'], `<div class="prose">${t.intuicion}</div>`)}
      ${sec('formal', ['2', 'Formalización matemática'], `<div class="prose">${t.formal}</div>`)}
      ${sec('ejemplo', ['3', 'Ejemplo paso a paso: ' + t.ejemplo.titulo], [t.ejemplo].concat(t.ejemplo2 || []).map(exHtml).join(''))}
      ${sec('aplicacion', ['4', 'Aplicación práctica'], `<div class="prose">${t.aplicacion}</div>`)}
      ${(EL.CASOS && EL.CASOS[id] ? sec('casos', ['★', 'Casos resueltos: cómo se lee una salida de regresión'], `<p class="muted small">Datos simulados con semilla fija (los números siempre cuadran). Intenta responder cada pregunta antes de abrir la respuesta.</p>` + EL.CASOS[id].map(cs => { const c = cs.build(); return `<details class="caso"><summary>${esc(cs.titulo)}</summary><div class="caso-body">${c.intro}${c.partes.map(p => `<div class="case-part"><b>${p.t}</b>${p.h}</div>`).join('')}<h4>Preguntas guiadas</h4>${c.preguntas.map((p, i) => `<div class="gq"><p><b>${String.fromCharCode(97 + i)})</b> ${p.q}</p><details><summary>Ver respuesta</summary><div class="gqa">${p.a}</div></details></div>`).join('')}</div></details>`; }).join('')) : '')}
      ${sec('errores', ['5', 'Errores frecuentes y aclaraciones'], `<div class="errs">${t.errores.map(e => `<div class="err"><div class="bad"><b>✗ Error</b><p>${e.mal}</p></div><div class="good"><b>✓ Correcto</b><p>${e.bien}</p></div></div>`).join('')}</div>`)}
      ${sec('check', ['6', 'Compruébalo (retroalimentación inmediata)'], `<div id="checks"></div>`)}
      <div class="tactions"><div class="row">${t.lab && t.lab.length ? t.lab.map(l => { const L = EL.LABS.find(x => x.id === l); return `<a class="btn" href="#/lab/${l}">🔬 Laboratorio: ${esc(L.titulo.split(':')[0])}</a>`; }).join('') : ''}${nq ? `<a class="btn" href="#/banco?tema=${id}">📝 Practicar ${nq} preguntas del tema</a>` : ''}<button class="btn ${read ? '' : 'pri'}" id="markread">${read ? '✓ Estudiado (quitar marca)' : 'Marcar como estudiado'}</button></div></div>
      <p class="small muted src"><b>Fuentes:</b> ${t.fuente}</p>
      <div class="pn">${prev ? `<a href="#/tema/${prev.id}">← ${esc(prev.titulo.split(':')[0])}</a>` : '<span></span>'}${next ? `<a href="#/tema/${next.id}">${esc(next.titulo.split(':')[0])} →</a>` : ''}</div>`;
    const v = show(html, 'T' + t.num + ' ' + t.titulo.split(':')[0]);
    // pasos progresivos
    v.querySelectorAll('.exbox').forEach(bx => { const stepsEl = EL.$$('.step', bx); let shown = 1; const nb = bx.querySelector('.nxt'); const upd = () => { stepsEl.forEach((s, k) => s.classList.toggle('hid', k >= shown)); nb.disabled = shown >= stepsEl.length; }; upd(); nb.addEventListener('click', () => { shown++; upd(); }); bx.querySelector('.all').addEventListener('click', () => { shown = stepsEl.length; upd(); }); });



    v.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    v.querySelector('#markread').addEventListener('click', () => { S.markTopicRead(id, !read); V.tema(id); });
    // verificaciones
    const host = v.querySelector('#checks');
    t.checks.forEach((c, ci) => {
      const div = document.createElement('div'); div.className = 'qcard check';
      const done = st.topics[id] && st.topics[id].checks && st.topics[id].checks[ci];
      div.innerHTML = `<div class="qtext"><span class="qn">${ci + 1}.</span> ${c.q}</div><div class="opts">${c.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="ot"><span class="ol">${String.fromCharCode(97 + k)})</span> ${o}</span></button>`).join('')}</div><div class="fb"></div>`;
      host.appendChild(div); EL.renderMath(div);
      div.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        const k = +b.dataset.k, ok = k === c.c;
        div.querySelectorAll('.opt').forEach(x => { x.disabled = true; x.classList.toggle('right', +x.dataset.k === c.c); if (x === b && !ok) x.classList.add('wrong'); });
        const fb = div.querySelector('.fb'); fb.innerHTML = `<div class="read ${ok ? '' : 'warn'}"><h4>${ok ? '¡Correcto!' : 'No es esa'}</h4><p>${c.e}</p></div>`; EL.renderMath(fb);
        S.setCheck(id, ci, ok);
      }));
    });
  };

  /* ================================================================== LABORATORIO */
  V.lab = function (id) {
    const L = id && EL.LABS.find(l => l.id === id);
    if (!L) {
      show(`<h1>Laboratorio interactivo</h1><p class="lead">Cada laboratorio existe para comprender algo que el texto solo describe. Antes de mover un control, <b>predice</b> qué ocurrirá; después compara.</p>
        <div class="tgrid">${EL.LABS.map(l => { const t = temaById(l.tema), seen = S.get().labs[l.id]; return `<a class="tcard" href="#/lab/${l.id}"><div class="th"><span class="tnum">${t ? t.num : ''}</span><div><h3>${esc(l.titulo)}</h3><span class="muted small">Tema ${t ? t.num + ' · ' + esc(t.titulo.split(':')[0]) : ''}</span></div>${seen ? '<span class="badge ok">Visitado</span>' : ''}</div><p>${l.objetivo}</p></a>`; }).join('')}</div>`, 'Laboratorio');
      EL.renderMath(view()); return;
    }
    const t = temaById(L.tema);
    show(`<nav class="crumbs"><a href="#/lab">Laboratorio</a> › ${esc(L.titulo)}</nav><h1>${esc(L.titulo)}</h1><p class="lead">${L.objetivo}</p><div id="labhost"></div>
      <div class="row tactions">${t ? `<a class="btn" href="#/tema/${t.id}">📖 Teoría: ${esc(t.titulo.split(':')[0])}</a><a class="btn" href="#/banco?tema=${t.id}">📝 Preguntas del tema</a>` : ''}</div>`, L.titulo);
    L.mount(document.getElementById('labhost')); S.visitLab(L.id);
  };

  /* ================================================================== BANCO */
  const BF = { tema: '', tipo: '', dif: '', fuente: '', estado: '', page: 0 };
  V.banco = function (params) {
    if (params && params.tema !== undefined) { Object.assign(BF, { tema: params.tema || '', page: 0 }); }
    const last = EL.lastStatus(), st = S.get();
    const filt = EL.BANCO.filter(q => (!BF.tema || q.tema === BF.tema) && (!BF.tipo || q.tipo === BF.tipo) && (!BF.dif || q.dif === +BF.dif) && (!BF.fuente || (BF.fuente === 'sofia' ? !!(temaById(q.tema) && temaById(q.tema).sofia) : BF.fuente === 'parcial' ? /Parcial 1/.test(q.fuente) : BF.fuente === 'cuest' ? /Cuestionario|Taller|Guía MCRL/.test(q.fuente) : /Plan de estudio|monitoría/.test(q.fuente))) &&
      (!BF.estado || (BF.estado === 'nuevas' ? !last[q.id] : BF.estado === 'falladas' ? last[q.id] && last[q.id].s < 1 : BF.estado === 'ok' ? last[q.id] && last[q.id].s >= 1 : BF.estado === 'marcadas' ? st.flags[q.id] : true)));
    const PER = 6, pages = Math.max(1, Math.ceil(filt.length / PER)); BF.page = EL.clamp(BF.page, 0, pages - 1);
    const sel = (id, label, opts, val) => `<label class="ctl sm"><span>${label}</span><select data-f="${id}">${opts.map(([v, t]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
    const tipos = { mc: 'Selección múltiple', vf: 'Verdadero/Falso', num: 'Numérica', grupo: 'Grupo (estilo parcial)', abierta: 'Abierta (autoevaluada)' };
    const v = show(`<h1>Banco de preguntas</h1><p class="lead">${EL.BANCO.length} preguntas con explicación completa. En las de opción múltiple verás, además, <b>por qué cada alternativa incorrecta lo es</b>. Las de “Estilo Parcial 1” son originales y siguen los formatos observados en ese examen.</p>
      <div class="filters panel">${sel('tema', 'Tema', [['', 'Todos']].concat(EL.TEMAS.map(t => [t.id, `T${t.num} ${t.titulo.split(':')[0].slice(0, 38)}`])), BF.tema)}${sel('tipo', 'Tipo', [['', 'Todos']].concat(Object.entries(tipos)), BF.tipo)}${sel('dif', 'Dificultad', [['', 'Todas'], [1, 'Básica'], [2, 'Intermedia'], [3, 'Exigente']], BF.dif)}${sel('estado', 'Estado', [['', 'Todas'], ['nuevas', 'Sin responder'], ['falladas', 'Falladas'], ['ok', 'Acertadas'], ['marcadas', '★ Marcadas']], BF.estado)}${sel('fuente', 'Origen', [['', 'Todos'], ['parcial', 'Parcial 1 (real y estilo)'], ['cuest', 'Cuestionario / Taller / Guía'], ['c2', 'Corte 2 (plan y monitoría)'], ['sofia', '🚩 Grupo profe Sofía']], BF.fuente)}
      <div class="fres"><span><b>${filt.length}</b> preguntas con estos filtros</span> <button class="btn sm" id="rand">🎲 Una al azar</button></div></div>
      <div id="qlist"></div>
      <div class="pager"><button class="btn sm" id="pp" ${BF.page === 0 ? 'disabled' : ''}>← Anterior</button><span>Página ${BF.page + 1} de ${pages}</span><button class="btn sm" id="pn" ${BF.page >= pages - 1 ? 'disabled' : ''}>Siguiente →</button></div>`, 'Banco de preguntas');
    v.querySelectorAll('[data-f]').forEach(s => s.addEventListener('change', () => { BF[s.dataset.f] = s.value; BF.page = 0; V.banco(); }));
    v.querySelector('#pp').addEventListener('click', () => { BF.page--; V.banco(); });
    v.querySelector('#pn').addEventListener('click', () => { BF.page++; V.banco(); });
    const list = v.querySelector('#qlist');
    const renderQ = (q, idx) => {
      const host = document.createElement('div'); host.className = 'qwrap'; list.appendChild(host);
      const flag = () => `<button class="flag ${S.get().flags[q.id] ? 'on' : ''}" title="Marcar para repasar" aria-label="Marcar para repasar">${S.get().flags[q.id] ? '★' : '☆'}</button>`;
      const draw = (review, resp) => {
        Q.render(host, q, { resp, review, index: idx, onSubmit: r => { const s = Q.score(q, r); S.recordPractice(q.id, s === null ? 0 : s); V.topProgress(); draw(true, r); }, allowSelf: true });
        host.querySelector('.qcard').insertAdjacentHTML('afterbegin', flag());
        host.querySelector('.flag').addEventListener('click', () => { S.toggleFlag(q.id); host.querySelector('.flag').textContent = S.get().flags[q.id] ? '★' : '☆'; host.querySelector('.flag').classList.toggle('on', !!S.get().flags[q.id]); });
        if (review) { const s = Q.score(q, resp); host.querySelector('.qcard').insertAdjacentHTML('beforeend', `<div class="verdict ${s >= 1 ? 'ok' : s > 0 ? 'part' : 'no'}">${s >= 1 ? '✓ Correcta' : s > 0 ? `Parcial: ${Math.round(s * 100)} %` : '✗ Incorrecta'} — registrada en tu seguimiento. <button class="btn sm" data-retry>Intentar de nuevo</button></div>`); host.querySelector('[data-retry]').addEventListener('click', () => draw(false, undefined)); }
      };
      draw(false, undefined);
    };
    filt.slice(BF.page * PER, BF.page * PER + PER).forEach((q, i) => renderQ(q, BF.page * PER + i + 1));
    if (!filt.length) list.innerHTML = '<div class="callout">No hay preguntas con esos filtros.</div>';
    v.querySelector('#rand').addEventListener('click', () => { if (!filt.length) return; const q = filt[Math.floor(Math.random() * filt.length)]; list.innerHTML = ''; v.querySelector('.pager').style.display = 'none'; renderQ(q, 1); });
  };

  /* ================================================================== SIMULADOR */
  let SIM = null;      // sesión en curso (se conserva si el estudiante cambia de sección)
  const isReal = q => /^p1-0/.test(q.id);
  V.simulador = function () {
    if (SIM && SIM.running) return simRun();
    const nReal = EL.BANCO.filter(isReal).length;
    const topicBox = EL.TEMAS.map(t => `<label class="chk"><input type="checkbox" name="sim-t" value="${t.id}" ${t.corte === 1 ? 'checked' : ''}> T${t.num} ${esc(t.titulo.split(':')[0])}</label>`).join('');
    const v = show(`<h1>Simulador de parciales</h1><p class="lead">Practica en condiciones de examen: temporizador, sin retroalimentación hasta el final, calificación automática y diagnóstico por tema. El examen real se resuelve <b>sin ningún dispositivo electrónico</b>: haz el simulacro igual (papel y lápiz).</p>
      <div class="cards two">
        <div class="card"><span class="cn">A</span><h3>Simulacro con la estructura del Parcial 1</h3><p>${nReal} secciones originales con los mismos formatos del examen (V/F, completar, selección, interpretación de un modelo aplicado, identificación de supuestos y justificación), los mismos puntajes (total 5.0) y 1 h 45 min.</p><p class="small muted">Preguntas propias; solución propia, no oficial. Las abiertas se autoevalúan contra una rúbrica.</p><button class="btn pri" id="go-real">Iniciar simulacro de 5.0 puntos</button></div>
        <div class="card"><span class="cn">B</span><h3>Simulacro estilo parcial</h3><p>12 preguntas aleatorias de los temas 0–7, mezcla de formatos, 105 minutos.</p><button class="btn pri" id="go-style">Iniciar simulacro rápido</button></div>
        <div class="card"><span class="cn">C</span><h3>Simulacro del Corte 2</h3><p>Cinco puntos de igual valor, 1 hora: un caso con tablas y gráficos de heterocedasticidad, uno de multicolinealidad, uno de autocorrelación, definiciones breves y un quiz de verdadero/falso. Cada intento sortea casos distintos.</p><p class="small muted">Se permite calculadora; sin notas ni ecuaciones. Composición propia: no hay examen modelo de este corte entre los insumos.</p><button class="btn pri" id="go-c2">Iniciar simulacro del Corte 2</button></div>
        <div class="card"><span class="cn">D</span><h3>Teoría asintótica <span class="chip flag">🚩 Grupo profe Sofía</span></h3><p>Convergencia, consistencia, TLC, normalidad asintótica y método delta. 10 preguntas, 45 minutos.</p><button class="btn pri" id="go-asint">Iniciar simulacro de asintótica</button></div>
      </div>
      <h2>Simulacro personalizado</h2>
      <div class="panel cfg"><div class="cfgcol"><h4>Temas</h4>${topicBox}<div class="row"><button class="btn sm" id="t-all">Todos</button><button class="btn sm" id="t-c1">Solo Corte 1</button><button class="btn sm" id="t-none">Ninguno</button></div></div>
        <div class="cfgcol"><label class="ctl"><span>Cantidad de preguntas</span><output id="o-n">10</output><input type="range" id="cfg-n" min="3" max="30" step="1" value="10"></label>
        <label class="ctl"><span>Tiempo límite (min; 0 = sin límite)</span><output id="o-t">45</output><input type="range" id="cfg-t" min="0" max="120" step="5" value="45"></label>
        <label class="ctl sm"><span>Dificultad</span><select id="cfg-d"><option value="0">Todas</option><option value="1">Básica</option><option value="2">Intermedia</option><option value="3">Exigente</option></select></label>
        <h4>Formatos</h4>${[['mc', 'Selección múltiple'], ['vf', 'Verdadero/Falso'], ['num', 'Numéricas'], ['grupo', 'Grupos (estilo parcial)'], ['abierta', 'Abiertas (autoevaluadas)']].map(([k, n]) => `<label class="chk"><input type="checkbox" name="sim-k" value="${k}" ${k === 'abierta' ? '' : 'checked'}> ${n}</label>`).join('')}
        <label class="chk"><input type="checkbox" id="cfg-shuf" checked> Orden aleatorio</label><label class="chk"><input type="checkbox" id="cfg-real"> Incluir las preguntas del simulacro de 5.0 puntos</label>
        <button class="btn pri" id="go-cfg">Iniciar simulacro</button><p class="small muted" id="cfg-msg"></p></div></div>`, 'Simulador');
    const setAll = on => v.querySelectorAll('[name=sim-t]').forEach(c => c.checked = on);
    v.querySelector('#t-all').addEventListener('click', () => setAll(true)); v.querySelector('#t-none').addEventListener('click', () => setAll(false));
    v.querySelector('#t-c1').addEventListener('click', () => v.querySelectorAll('[name=sim-t]').forEach(c => c.checked = temaById(c.value).corte === 1));
    ['n', 't'].forEach(k => v.querySelector('#cfg-' + k).addEventListener('input', e => v.querySelector('#o-' + k).textContent = e.target.value));
    v.querySelector('#go-real').addEventListener('click', () => simStart({ mode: 'real', label: 'Simulacro con estructura del Parcial 1', qids: EL.BANCO.filter(isReal).map(q => q.id), minutes: 105 }));
    v.querySelector('#go-style').addEventListener('click', () => simStart(pick({ tems: EL.TEMAS.filter(t => t.corte === 1).map(t => t.id), n: 12, dif: 0, kinds: ['mc', 'vf', 'num', 'grupo', 'abierta'], real: false, minutes: 105, mode: 'estilo', label: 'Simulacro estilo parcial', shuffle: true }, true)));
        v.querySelector('#go-c2').addEventListener('click', () => simStart(pickCorte2()));
    v.querySelector('#go-asint').addEventListener('click', () => simStart(pick({ tems: ['t14'], n: 10, dif: 0, kinds: ['mc', 'vf', 'num', 'grupo', 'abierta'], real: false, minutes: 45, mode: 'asintotica', label: 'Simulacro de teoría asintótica (grupo profe Sofía)', shuffle: true }, true)));
    v.querySelector('#go-cfg').addEventListener('click', () => {
      const cfg = { tems: [...v.querySelectorAll('[name=sim-t]:checked')].map(c => c.value), n: +v.querySelector('#cfg-n').value, dif: +v.querySelector('#cfg-d').value, kinds: [...v.querySelectorAll('[name=sim-k]:checked')].map(c => c.value), real: v.querySelector('#cfg-real').checked, minutes: +v.querySelector('#cfg-t').value, shuffle: v.querySelector('#cfg-shuf').checked, mode: 'custom', label: 'Simulacro personalizado' };
      const r = pick(cfg); if (!r.qids.length) { v.querySelector('#cfg-msg').textContent = 'Ninguna pregunta cumple esa configuración: amplía temas, formatos o dificultad.'; return; }
      if (r.qids.length < cfg.n) v.querySelector('#cfg-msg').textContent = `Solo hay ${r.qids.length} preguntas con esa configuración; se usarán todas.`;
      simStart(r);
    });
  };
  function pick(cfg, forceMix) {
    let pool = EL.BANCO.filter(q => cfg.tems.includes(q.tema) && cfg.kinds.includes(q.tipo) && (!cfg.dif || q.dif === cfg.dif) && (cfg.real || !isReal(q)));
    if (cfg.shuffle !== false) pool = EL.shuffle(pool);
    let sel;
    if (forceMix) {          // intenta incluir al menos un grupo y una abierta, como en el parcial real
      const byK = k => pool.filter(q => q.tipo === k); sel = [];
      ['grupo', 'abierta'].forEach(k => { const c = byK(k)[0]; if (c) sel.push(c); });
      pool.forEach(q => { if (sel.length < cfg.n && !sel.includes(q)) sel.push(q); }); sel = EL.shuffle(sel);
    } else sel = pool.slice(0, cfg.n);
    return { mode: cfg.mode, label: cfg.label, qids: sel.map(q => q.id), minutes: cfg.minutes };
  }
  function pickCorte2() {
    const qids = ['espec', 'multi', 'auto', 'def', 'vf'].map(cat => EL.shuffle(EL.BANCO.filter(q => q.cat === cat))[0].id);
    return { mode: 'corte2', label: 'Simulacro del Corte 2 (1 hora, 5 puntos iguales)', qids, minutes: 60, note: 'Se permite calculadora; no se pueden usar notas, libros ni ecuaciones. Cada punto tiene igual valor.' };
  }
  function simStart(c) {
    SIM = { running: true, note: c.note || '', mode: c.mode, label: c.label, qids: c.qids, resp: {}, idx: 0, t0: Date.now(), limit: c.minutes ? c.minutes * 60 : 0, timer: null, secs: 0 };
    simRun();
  }
  function stopTimer() { if (SIM && SIM.timer) { clearInterval(SIM.timer); SIM.timer = null; } }
  function fmtT(s) { const a = Math.abs(s), h = Math.floor(a / 3600), m = Math.floor(a % 3600 / 60), ss = a % 60, p = n => String(n).padStart(2, '0'); return h ? `${h}:${p(m)}:${p(ss)}` : `${m}:${p(ss)}`; }
  function simRun() {
    stopTimer();
    const qs = SIM.qids.map(Q.byId), q = qs[SIM.idx];
    const answeredN = qs.filter(x => Q.answered(x, SIM.resp[x.id]) || (x.tipo === 'grupo' && SIM.resp[x.id] && SIM.resp[x.id].some(a => a !== null && a !== undefined))).length;
    const nav = qs.map((x, i) => `<button class="qn-btn ${i === SIM.idx ? 'cur' : ''} ${SIM.resp[x.id] !== undefined && (Q.answered(x, SIM.resp[x.id]) || x.tipo === 'grupo' || (x.tipo === 'abierta' && SIM.resp[x.id].text)) ? 'done' : ''}" data-i="${i}">${i + 1}</button>`).join('');
    const v = show(`<div class="simbar"><div><b>${esc(SIM.label)}</b> · pregunta ${SIM.idx + 1} de ${qs.length}</div><div class="timer" id="timer" aria-live="off">${SIM.limit ? fmtT(SIM.limit - Math.floor((Date.now() - SIM.t0) / 1000)) : fmtT(Math.floor((Date.now() - SIM.t0) / 1000))}</div></div>
      <div class="progress"><i style="width:${(answeredN / qs.length * 100).toFixed(0)}%"></i></div><p class="small muted">${answeredN} de ${qs.length} con respuesta. Sin retroalimentación hasta finalizar.${SIM.note ? ' ' + esc(SIM.note) : ''}</p>
      <div class="qnav">${nav}</div><div id="simq"></div>
      <div class="row simctl"><button class="btn" id="prevq" ${SIM.idx === 0 ? 'disabled' : ''}>← Anterior</button><button class="btn" id="nextq" ${SIM.idx === qs.length - 1 ? 'disabled' : ''}>Siguiente →</button><span class="spacer"></span><button class="btn" id="abandon">Abandonar</button><button class="btn pri" id="finish">Finalizar y calificar</button></div>`, 'Simulacro');
    Q.render(v.querySelector('#simq'), q, { resp: SIM.resp[q.id], index: SIM.idx + 1, onChange: r => { SIM.resp[q.id] = r; } });
    const go = i => { SIM.idx = EL.clamp(i, 0, qs.length - 1); simRun(); };
    v.querySelectorAll('.qn-btn').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
    v.querySelector('#prevq').addEventListener('click', () => go(SIM.idx - 1)); v.querySelector('#nextq').addEventListener('click', () => go(SIM.idx + 1));
    v.querySelector('#abandon').addEventListener('click', () => { if (confirm('¿Abandonar el simulacro? No se guardará.')) { stopTimer(); SIM = null; V.simulador(); } });
    v.querySelector('#finish').addEventListener('click', () => { const un = qs.length - answeredN; if (!un || confirm(`Hay ${un} pregunta(s) sin responder. ¿Finalizar de todos modos?`)) simFinish(); });
    SIM.timer = setInterval(() => {
      const el = document.getElementById('timer'); if (!el) { stopTimer(); return; }
      const e = Math.floor((Date.now() - SIM.t0) / 1000);
      if (SIM.limit) { const rem = SIM.limit - e; el.textContent = fmtT(rem); el.classList.toggle('low', rem < 300); if (rem <= 0) { stopTimer(); simFinish(true); } } else el.textContent = fmtT(e);
    }, 1000);
  }
  function simFinish(timeout) {
    stopTimer();
    const qs = SIM.qids.map(Q.byId), secs = Math.floor((Date.now() - SIM.t0) / 1000);
    const items = qs.map(q => { const r = SIM.resp[q.id]; return { q: q.id, s: q.tipo === 'abierta' ? (r && r.done ? Q.score(q, r) : null) : Q.scoreLoose(q, r) }; });
    const attempt = { id: 'a' + Date.now(), date: Date.now(), mode: SIM.mode, label: SIM.label, secs, items, weights: qs.map(Q.weight), timeout: !!timeout };
    const resp = SIM.resp; SIM.running = false;
    S.addAttempt(attempt); V.topProgress();
    simResults(attempt, resp);
    SIM = null;
  }
  function totals(a) {
    let W = 0, G = 0, pend = 0;
    a.items.forEach((it, i) => { const w = a.weights[i]; W += w; if (it.s === null) pend++; else G += w * it.s; });
    return { W, G, pend, frac: W ? G / W : 0 };
  }
  function simResults(a, resp) {
    const qs = a.items.map(it => Q.byId(it.q)), T = totals(a), hasPts = (qs.every(q => q.peso) && a.mode === 'real') || a.mode === 'corte2';
    const byT = Q.byTopic(a.items), weak = Object.entries(byT).filter(([, o]) => o.sum / o.n < 0.6).sort((x, y) => x[1].sum / x[1].n - y[1].sum / y[1].n);
    const headline = hasPts ? `${f(T.G, 2)} <small>/ ${f(T.W, 1)} puntos</small>` : `${pctTxt(T.frac)}`;
    const v = show(`<h1>Resultados</h1><p class="lead">${esc(a.label)} · ${fmtT(a.secs)} usados${a.timeout ? ' (se acabó el tiempo)' : ''}</p>
      <div class="stats big"><div class="stat"><span>${hasPts ? 'Puntaje' : 'Resultado'}</span><b id="rtot">${headline}</b>${!hasPts ? `<small>equivale a ${f(T.frac * 5, 1)} / 5.0</small>` : `<small>${pctTxt(T.frac)}</small>`}</div><div class="stat"><span>Preguntas</span><b>${qs.length}</b><small>${T.pend ? T.pend + ' abierta(s) por autoevaluar' : 'todas calificadas'}</small></div><div class="stat"><span>Tiempo</span><b>${fmtT(a.secs)}</b></div></div>
      ${T.pend ? `<div class="callout warn"><b>Pendiente:</b> ${T.pend} pregunta(s) abierta(s) se califican con tu autoevaluación. Despliega cada una abajo, compara con la respuesta modelo y marca la rúbrica: el puntaje se actualiza.</div>` : ''}
      <h2>Desempeño por tema</h2><div class="bars" id="rbars"></div>
      <div id="rweak"></div>
      <h2>Revisión detallada</h2><div id="rrev"></div>
      <div class="row tactions"><a class="btn pri" href="#/simulador">Hacer otro simulacro</a><a class="btn" href="#/progreso">Ver mi seguimiento</a></div>`, 'Resultados');
    const drawBars = () => {
      const bt = Q.byTopic(a.items), tot = totals(a);
      v.querySelector('#rbars').innerHTML = Object.keys(bt).sort().map(tid => { const o = bt[tid], t = temaById(tid); return barRow(`T${t.num} ${esc(t.titulo.split(':')[0])}`, o.sum / o.n, o.n, '#/tema/' + tid); }).join('') || '<p class="muted">Sin preguntas calificadas aún.</p>';
      const wk = Object.entries(bt).filter(([, o]) => o.sum / o.n < 0.6).sort((x, y) => x[1].sum / x[1].n - y[1].sum / y[1].n);
      v.querySelector('#rweak').innerHTML = wk.length ? `<h2>Temas con mayores dificultades</h2><div class="callout warn">${wk.map(([tid, o]) => { const t = temaById(tid); return `<p><b>T${t.num} · ${esc(t.titulo.split(':')[0])}</b> (${pctTxt(o.sum / o.n)}): relee la sección <i>Errores frecuentes</i>, ${t.lab && t.lab.length ? `prueba el <a href="#/lab/${t.lab[0]}">laboratorio</a>, ` : ''}y practica en el <a href="#/banco?tema=${tid}">banco</a>.</p>`; }).join('')}</div>` : '<div class="callout">Ningún tema por debajo del 60 % en este simulacro.</div>';
      const el = v.querySelector('#rtot'); el.innerHTML = hasPts ? `${f(tot.G, 2)} <small>/ ${f(tot.W, 1)} puntos</small>` : pctTxt(tot.frac);
    };
    drawBars();
    const rev = v.querySelector('#rrev');
    qs.forEach((q, i) => {
      const host = document.createElement('div'); host.className = 'qwrap'; rev.appendChild(host);
      const it = a.items[i], draw = () => {
        const r = resp[q.id], s = it.s;
        Q.render(host, q, { resp: r, review: true, index: i + 1, allowSelf: true, onChange: rr => { if (q.tipo !== 'abierta') return; resp[q.id] = rr; it.s = Q.score(q, rr); a.items[i].s = it.s; S.commit(st => { const at = st.attempts.find(x => x.id === a.id); if (at) { at.items[i].s = it.s; } }); drawBars(); V.topProgress(); const b = host.querySelector('.verdict'); if (b) b.outerHTML = verdict(it.s); } });
        host.querySelector('.qcard').insertAdjacentHTML('beforeend', verdict(s));
        if (r === undefined && q.tipo !== 'abierta') host.querySelector('.qcard').insertAdjacentHTML('afterbegin', '<div class="callout warn small">Sin respuesta.</div>');
      };
      draw();
    });
    function verdict(s) { return `<div class="verdict ${s === null ? 'pend' : s >= 1 ? 'ok' : s > 0 ? 'part' : 'no'}">${s === null ? 'Pendiente de autoevaluar' : s >= 1 ? '✓ Correcta' : s > 0 ? `Parcial: ${Math.round(s * 100)} %` : '✗ Incorrecta o sin responder'}</div>`; }
  }

  /* ================================================================== SEGUIMIENTO */
  V.progreso = function () {
    const st = S.get(), perf = EL.perf(), last = EL.lastStatus();
    const total = Object.values(perf).reduce((a, o) => a + o.n, 0), sum = Object.values(perf).reduce((a, o) => a + o.sum, 0);
    const read = EL.TEMAS.filter(t => st.topics[t.id] && st.topics[t.id].read).length;
    const wrong = Object.entries(last).filter(([id, o]) => o.s < 1 && Q.byId(id)).sort((a, b) => b[1].ts - a[1].ts);
    const nq = Object.keys(last).length;
    const att = st.attempts.slice().sort((a, b) => a.date - b.date);
    // evolución
    let evo = '<p class="muted">Aún no hay simulacros. Haz uno para ver tu evolución.</p>';
    if (att.length) {
      const ys = att.map(a => totals(a).frac * 100), xs = att.map((_, i) => i + 1);
      const c = EL.chart({ W: 560, H: 240, x: [0.5, Math.max(att.length, 2) + 0.5], y: [0, 100], xl: 'simulacro n.º', yl: '% de aciertos' }).axes({ xfmt: t => Number.isInteger(t) ? t : '' }).hline(60, 'ref').path(xs, ys, 'ln').points(xs, ys, 'pt', 4);
      evo = c.toString();
    }
    // recomendaciones
    const recs = [];
    EL.TEMAS.forEach(t => { const p = perf[t.id], r = st.topics[t.id] && st.topics[t.id].read;
      if (p && p.n >= 3 && p.sum / p.n < 0.6) recs.push({ pr: p.sum / p.n, h: `<b>Reforzar T${t.num} · ${esc(t.titulo.split(':')[0])}</b> (${pctTxt(p.sum / p.n)} en ${p.n} respuestas): relee <a href="#/tema/${t.id}">el tema</a>, ${t.lab && t.lab.length ? `experimenta en <a href="#/lab/${t.lab[0]}">el laboratorio</a>, ` : ''}y repite las falladas en el <a href="#/banco?tema=${t.id}">banco</a>.` });
      else if (!p && t.corte === 1) recs.push({ pr: 0.7, h: `<b>Aún sin práctica en T${t.num} · ${esc(t.titulo.split(':')[0])}</b>: ${r ? 'ya lo estudiaste; comprueba con unas preguntas' : 'empieza por <a href="#/tema/' + t.id + '">la teoría</a>'} y <a href="#/banco?tema=${t.id}">practica</a>.` });
      else if (p && p.n >= 3 && p.sum / p.n < 0.8) recs.push({ pr: 0.75 + p.sum / p.n / 10, h: `<b>Pulir T${t.num}</b> (${pctTxt(p.sum / p.n)}): ya vas bien; repasa los <a href="#/tema/${t.id}">errores frecuentes</a> para llegar al 80 %.` });
    });
    recs.sort((a, b) => a.pr - b.pr);
    const v = show(`<h1>Seguimiento del aprendizaje</h1>
      <div class="stats big"><div class="stat"><span>Temas estudiados</span><b>${read}/${EL.TEMAS.length}</b></div><div class="stat"><span>Respuestas registradas</span><b>${total}</b></div><div class="stat"><span>Aciertos globales</span><b>${total ? pctTxt(sum / total) : '—'}</b></div><div class="stat"><span>Simulacros</span><b>${att.length}</b></div><div class="stat"><span>Preguntas distintas vistas</span><b>${nq}/${EL.BANCO.length}</b></div></div>
      <h2>Desempeño por tema</h2><div class="bars">${EL.TEMAS.map(t => { const p = perf[t.id]; return barRow(`T${t.num} ${esc(t.titulo.split(':')[0])}`, p ? p.sum / p.n : 0, p ? p.n : 0, '#/tema/' + t.id); }).join('')}</div>
      <p class="small muted">Verde ≥ 80 % · ámbar 60–79 % · rojo &lt; 60 %. Cuenta respuestas de práctica y de simulacros (las abiertas, solo si las autoevaluaste).</p>
      <h2>Qué estudiar ahora</h2>${recs.length ? `<ol class="recs">${recs.slice(0, 6).map(r => `<li>${r.h}</li>`).join('')}</ol>` : '<div class="callout">Todavía no hay datos suficientes. Responde algunas preguntas del banco o haz un simulacro y aquí aparecerán recomendaciones personalizadas.</div>'}
      <h2>Evolución de los simulacros</h2><div class="chartbox">${evo}</div>
      ${att.length ? `<div class="scroll"><table class="tbl"><tr><th>#</th><th>Fecha</th><th>Tipo</th><th>Resultado</th><th>Tiempo</th></tr>${att.slice().reverse().map(a => { const T = totals(a); return `<tr><td>${att.indexOf(a) + 1}</td><td>${new Date(a.date).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</td><td>${esc(a.label)}</td><td>${pctTxt(T.frac)}${a.mode === 'real' ? ` (${f(T.G, 2)}/${f(T.W, 1)} pts)` : ''}${T.pend ? ' · ' + T.pend + ' pendiente(s)' : ''}</td><td>${fmtT(a.secs)}</td></tr>`; }).join('')}</table></div>` : ''}
      <h2>Preguntas para repasar</h2>
      ${wrong.length ? `<p class="muted">Último intento incorrecto o parcial (${wrong.length}). Se retiran de la lista cuando las aciertas.</p><div id="wlist"></div><div class="row"><button class="btn pri" id="rwrong">Practicar las falladas</button></div>` : '<p class="muted">No tienes preguntas falladas pendientes.</p>'}
      ${Object.keys(st.flags).length ? `<h2>★ Marcadas</h2><p class="muted">${Object.keys(st.flags).length} pregunta(s) marcadas. <a href="#/banco" id="gofl">Ver en el banco</a></p>` : ''}
      <h2>Tus datos</h2><div class="panel row"><button class="btn" id="exp">Exportar progreso (JSON)</button><label class="btn">Importar<input type="file" id="imp" accept=".json,application/json" hidden></label><button class="btn danger" id="rst">Borrar todo el progreso</button></div><p class="small muted">${S.persistent() ? 'El progreso se guarda en este navegador (localStorage). Exporta una copia si cambias de equipo o limpias los datos del navegador.' : 'El almacenamiento local no está disponible: exporta tu progreso antes de cerrar.'}</p>`, 'Seguimiento');
    const wl = v.querySelector('#wlist');
    if (wl) wl.innerHTML = wrong.slice(0, 12).map(([id, o]) => { const q = Q.byId(id), t = temaById(q.tema); return `<div class="wrow"><span class="chip">T${t.num}</span><span class="wt">${q.sub}</span><span class="small muted">${esc(q.fuente)}</span><span class="small">${Math.round(o.s * 100)} %</span></div>`; }).join('') + (wrong.length > 12 ? `<p class="small muted">… y ${wrong.length - 12} más.</p>` : '');
    const rw = v.querySelector('#rwrong'); if (rw) rw.addEventListener('click', () => { BF.tema = ''; BF.tipo = ''; BF.dif = ''; BF.fuente = ''; BF.estado = 'falladas'; BF.page = 0; location.hash = '#/banco'; V.banco(); });
    const gf = v.querySelector('#gofl'); if (gf) gf.addEventListener('click', () => { BF.estado = 'marcadas'; BF.page = 0; });
    v.querySelector('#exp').addEventListener('click', () => { const b = new Blob([S.exportJSON()], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'econolab-progreso.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
    v.querySelector('#imp').addEventListener('change', e => { const fl = e.target.files[0]; if (!fl) return; const rd = new FileReader(); rd.onload = () => { try { S.importJSON(rd.result); V.topProgress(); V.progreso(); } catch (er) { alert('No se pudo importar: ' + er.message); } }; rd.readAsText(fl); });
    v.querySelector('#rst').addEventListener('click', () => { if (confirm('¿Borrar todo tu progreso? Esta acción no se puede deshacer.')) { S.reset(); V.topProgress(); V.progreso(); } });
  };

  /* ================================================================== FUENTES Y ALCANCE */
  V.fuentes = function () {
    show(`<h1>Fuentes y alcance</h1><p class="lead">Qué material respalda cada parte de la plataforma y qué no puede afirmarse con los insumos disponibles.</p>
      <h2>Qué aportó cada insumo</h2><div class="scroll"><table class="tbl"><tr><th>Insumo</th><th>Uso en la plataforma</th></tr>
      <tr><td><b>Notas de clase</b> (guía de estudio) y materiales extra de la profesora (autocorrelación, prueba F, heterocedasticidad)</td><td>Vocabulario y enfoque (α, β, Sxx, Sxy, SCE; cinco supuestos sobre el error; lectura de salidas tipo Stata; verificar supuestos con residuos), orden de los temas y el modo de razonar sobre las salidas. Los ejemplos, datos y casos de la plataforma son propios y se calculan con datos simulados.</td></tr>
      <tr><td><b>Parcial 1</b> y <b>un parcial del Corte 2</b> (documentos de referencia)</td><td>Solo la <b>estructura</b> de evaluación: formatos (V/F, completar, selección, interpretación de un modelo aplicado, discusión de salidas con tablas y gráficos, definiciones breves, identificación de supuestos en matrices y gráficos), puntajes y tiempos de cada examen (por ejemplo, 1 h 45 min sin dispositivos electrónicos para el Parcial 1). Las preguntas de la plataforma son originales.</td></tr>
      <tr><td><b>Plan de estudio</b> (Markdown) y <b>programa 2026-II</b></td><td>Estructura de módulos, secuencia semanal, lecturas, ponderaciones y alcance de cada corte.</td></tr>
      <tr><td><b>Guía de consulta rápida MCRL</b>, <b>Cuestionario de Modelos Lineales (explicado)</b>, <b>Taller 2 resuelto</b></td><td>Fuente principal de definiciones, supuestos, resultados y de gran parte del banco (reescrito con la convención del curso).</td></tr>
      <tr><td><b>Guía y script de heterocedasticidad</b> (monitoría 6)</td><td>Tema 10 (heterocedasticidad) y su laboratorio. Las cifras de la simulación citadas vienen de la guía; el laboratorio genera sus propios datos.</td></tr>
      <tr><td><b>Mapa conceptual de monitoría</b> (qué le pasa a MCO cuando falla cada supuesto)</td><td>Insumo para el tema 8 (panorama) y su laboratorio: se reelaboró con otra presentación y se verificó cada celda con la teoría.</td></tr>
      <tr><td><b>Teoría asintótica</b> (grupo de la profesora Sofía)</td><td>Tema 14 con bandera 🚩. Desarrollo estándar (Wooldridge Cap. 5 y Apéndice C; Gujarati Apéndice A); no hay temario ni material de clase de ese grupo entre los insumos.</td></tr>
      <tr><td><b>Gujarati</b> y <b>Wooldridge</b> (PDF con texto)</td><td>Verificación cruzada de definiciones, procedimientos y capítulos.</td></tr>
      <tr><td><b>Maddala</b> (PDF escaneado)</td><td>No se pudo extraer su texto (es imagen). La asignación de capítulos viene del programa y del plan, <b>no se verificó contra el libro</b>.</td></tr>
      <tr><td>Referentes de diseño</td><td>Navegación lateral modular, tema claro/oscuro, ruta guiada, laboratorios y quices con retroalimentación inmediata y seguimiento.</td></tr></table></div>
      <h2>Límites y advertencias</h2><ul class="lim">
      <li><b>Parciales de referencia.</b> La estructura descrita sale únicamente de los documentos de referencia disponibles. No se atribuyen criterios de calificación ni se predice qué preguntas saldrán.</li>
      <li><b>No hay clave oficial.</b> Las soluciones de las preguntas son elaboración propia.</li>
      <li><b>Cortes y contenido.</b> La interpretación de logaritmos se usa desde el Corte 1 aunque el programa ubique las formas funcionales en la Semana 7. Los temas del Corte 2 y el de teoría asintótica no tienen examen modelo.</li>
      <li><b>Convención.</b> El plan y el parcial usan $k$ = parámetros con intercepto ($gl=n-k$); la Guía y el Cuestionario usan $k$ = regresores sin intercepto ($gl=n-k-1$). Aquí todo se expresa con la primera.</li>
      <li><b>Calculadora.</b> El cuestionario permitía calculadora; el examen real, no. Los simulacros recomiendan resolver sin ella.</li>
      <li><b>Cifras de la guía de monitoría.</b> Se citan tal como aparecen (la propia guía aclara que no se ejecutó R); el laboratorio de heterocedasticidad es cualitativo.</li></ul>`, 'Fuentes y alcance');
  };
})(typeof window !== 'undefined' ? window : globalThis);
