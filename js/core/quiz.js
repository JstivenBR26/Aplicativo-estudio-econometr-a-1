/* quiz.js — Motor de preguntas: calificación pura (score) y renderizado (render) de todos los tipos.
   Respuestas (resp):  mc → índice | vf → true/false | num → texto | grupo → [índices|null,…] | abierta → {text, rub:[bool], done:bool}
   score(q, resp) devuelve un número en [0,1], o null si no es calificable aún (abierta sin autoevaluar).                                   */
(function (root) {
  'use strict';
  const EL = root.EL, esc = EL.esc;
  const Q = EL.Quiz = {};

  Q.weight = q => q.peso || 1;
  Q.tema = id => EL.TEMAS.find(t => t.id === id);
  Q.byId = id => EL.BANCO.find(q => q.id === id);
  Q.parseNum = s => { const x = parseFloat(String(s).replace(/−/g, '-').replace(',', '.').replace(/[^\d.\-eE+]/g, '')); return isNaN(x) ? NaN : x; };

  Q.answered = (q, r) => {
    if (r === undefined || r === null) return false;
    if (q.tipo === 'mc') return typeof r === 'number';
    if (q.tipo === 'vf') return typeof r === 'boolean';
    if (q.tipo === 'num') return !isNaN(Q.parseNum(r));
    if (q.tipo === 'grupo') return Array.isArray(r) && r.every(v => v !== null && v !== undefined);
    if (q.tipo === 'abierta') return !!(r && r.done);
    return false;
  };
  Q.score = (q, r) => {
    if (!Q.answered(q, r)) return q.tipo === 'abierta' ? (r && r.rub && r.done ? 0 : null) : 0;
    if (q.tipo === 'mc') return r === q.c ? 1 : 0;
    if (q.tipo === 'vf') return r === q.c ? 1 : 0;
    if (q.tipo === 'num') return Math.abs(Q.parseNum(r) - q.c) <= q.tol ? 1 : 0;
    if (q.tipo === 'grupo') return q.items.reduce((s, it, i) => s + (r[i] === it.c ? 1 : 0), 0) / q.items.length;
    if (q.tipo === 'abierta') return r.rub.filter(Boolean).length / q.rubrica.length;
    return 0;
  };
  /* Para el puntaje parcial de un grupo mientras no se ha respondido todo (modo examen): cuenta lo contestado. */
  Q.scoreLoose = (q, r) => {
    if (q.tipo === 'grupo' && Array.isArray(r)) return q.items.reduce((s, it, i) => s + (r[i] === it.c ? 1 : 0), 0) / q.items.length;
    if (q.tipo === 'abierta') return r && r.done ? Q.score(q, r) : null;
    return Q.answered(q, r) ? Q.score(q, r) : 0;
  };

  const dif = d => '●'.repeat(d) + '○'.repeat(3 - d);
  const difTxt = d => ['', 'Básica', 'Intermedia', 'Exigente'][d];

  /* Render: host = elemento contenedor; opts = {resp, review, onChange(resp), onSubmit(resp), submitLabel, hideMeta, index} */
  Q.render = function (host, q, opts) {
    opts = opts || {};
    const review = !!opts.review;
    let resp = opts.resp;
    const uid = 'q' + Math.random().toString(36).slice(2, 8);
    const tema = Q.tema(q.tema);
    const meta = opts.hideMeta ? '' : `<div class="qmeta"><span class="chip">${tema ? 'T' + tema.num + ' · ' + esc(tema.titulo.split(':')[0]) : ''}</span>${tema && tema.sofia ? '<span class="chip flag">🚩 Grupo profe Sofía</span>' : ''}<span class="chip soft">${q.sub}</span><span class="chip soft" title="${difTxt(q.dif)}">${dif(q.dif)}</span><span class="chip soft">${esc(q.fuente)}</span>${q.preg ? `<span class="chip">${q.preg}</span>` : ''}${q.peso ? `<span class="chip">${q.peso} pts</span>` : ''}</div>`;
    const idxTag = opts.index ? `<span class="qn">${opts.index}.</span> ` : '';
    let body = '';

    const optHTML = (labels, name, sel, correct, why, rv) => labels.map((l, i) => {
      const cls = rv ? (i === correct ? 'right' : (sel === i ? 'wrong' : '')) : '';
      const w = rv && why && why[i] && i !== correct ? `<span class="why"><b>Por qué no:</b> ${why[i]}</span>` : '';
      const tick = rv ? (i === correct ? '<span class="mk">✓</span>' : (sel === i ? '<span class="mk">✗</span>' : '')) : '';
      return `<label class="opt ${cls} ${sel === i ? 'sel' : ''}"><input type="radio" name="${name}" value="${i}" ${sel === i ? 'checked' : ''} ${rv ? 'disabled' : ''}><span class="ot"><span class="ol">${String.fromCharCode(97 + i)})</span> <span>${l}</span>${w}</span>${tick}</label>`;
    }).join('');

    if (q.tipo === 'mc') body = `<div class="opts">${optHTML(q.opts, uid, resp, q.c, q.why, review)}</div>`;
    else if (q.tipo === 'vf') body = `<div class="opts vf">${optHTML(['Verdadero', 'Falso'], uid, resp === true ? 0 : resp === false ? 1 : undefined, q.c ? 0 : 1, null, review)}</div>`;
    else if (q.tipo === 'num') {
      const ok = review && Math.abs(Q.parseNum(resp) - q.c) <= q.tol;
      body = `<div class="numrow"><input type="text" inputmode="decimal" class="numin ${review ? (ok ? 'right' : 'wrong') : ''}" id="${uid}" value="${esc(resp === undefined ? '' : resp)}" ${review ? 'disabled' : ''} placeholder="tu respuesta" autocomplete="off"> <span class="unit">${esc(q.unidad || '')}</span>${review ? `<span class="small"> Respuesta: <b>${EL.fmt(q.c, 4).replace(/\.?0+$/, '')}</b> (tolerancia ±${q.tol})</span>` : ''}</div>`;
    } else if (q.tipo === 'grupo') {
      body = `<div class="grupo">${q.items.map((it, i) => {
        const sel = resp ? resp[i] : undefined, fig = it.fig ? `<div class="qfig">${EL.FIGS[it.fig]()}</div>` : '';
        return `<div class="gitem ${review ? (sel === it.c ? 'right' : 'wrong') : ''}"><div class="gt">${it.t}</div>${fig}<div class="gopts">${it.opts.map((o, j) => `<label class="gopt ${review && j === it.c ? 'right' : ''} ${review && sel === j && j !== it.c ? 'wrong' : ''} ${sel === j ? 'sel' : ''}"><input type="radio" name="${uid}_${i}" value="${j}" ${sel === j ? 'checked' : ''} ${review ? 'disabled' : ''}><span>${o}</span></label>`).join('')}</div>${review ? `<div class="gexp">${sel === it.c ? '✓' : '✗'} ${it.e}</div>` : ''}</div>`;
      }).join('')}</div>`;
    } else if (q.tipo === 'abierta') {
      if (!resp) resp = { text: '', rub: q.rubrica.map(() => false), done: false };
      const r = resp;
      const showModel = review || r.reveal;
      body = `<textarea class="open" id="${uid}" rows="5" placeholder="Escribe tu respuesta (opcional: sirve para comparar con el modelo)" ${review && !opts.allowSelf ? 'readonly' : ''}>${esc(r.text || '')}</textarea>` +
        (showModel ? `<div class="modelo"><h4>Respuesta modelo <span class="small">(solución propia, no es la clave oficial)</span></h4>${q.modelo}<h4>Autoevaluación — marca lo que tu respuesta sí contenía</h4>${q.rubrica.map((t, i) => `<label class="rub"><input type="checkbox" data-r="${i}" ${r.rub[i] ? 'checked' : ''}> ${t}</label>`).join('')}</div>` :
          `<div class="row"><button class="btn" data-act="reveal">Ver respuesta modelo y autoevaluarme</button></div>`);
    }

    const extra = (review && q.expl) ? `<div class="expl"><h4>Explicación</h4>${q.expl}</div>` : '';
    const showSubmit = !review && opts.onSubmit;
    host.innerHTML = `<div class="qcard">${meta}<div class="qtext">${idxTag}${q.enun}</div>${body}${extra}${showSubmit ? `<div class="row"><button class="btn pri" data-act="submit" disabled>${opts.submitLabel || 'Comprobar respuesta'}</button></div>` : ''}</div>`;
    EL.renderMath(host);

    const submit = host.querySelector('[data-act="submit"]');
    const refresh = () => { if (submit && q.tipo !== 'abierta') submit.disabled = !Q.answered(q, resp); if (opts.onChange) opts.onChange(resp); };
    if (!review) {
      if (q.tipo === 'mc') host.querySelectorAll('input[type=radio]').forEach(i => i.addEventListener('change', () => { resp = +i.value; host.querySelectorAll('.opt').forEach(o => o.classList.remove('sel')); i.closest('.opt').classList.add('sel'); refresh(); }));
      if (q.tipo === 'vf') host.querySelectorAll('input[type=radio]').forEach(i => i.addEventListener('change', () => { resp = +i.value === 0; host.querySelectorAll('.opt').forEach(o => o.classList.remove('sel')); i.closest('.opt').classList.add('sel'); refresh(); }));
      if (q.tipo === 'num') host.querySelector('.numin').addEventListener('input', e => { resp = e.target.value; refresh(); });
      if (q.tipo === 'grupo') {
        resp = Array.isArray(resp) ? resp.slice() : q.items.map(() => null);
        q.items.forEach((it, i) => host.querySelectorAll(`input[name="${uid}_${i}"]`).forEach(inp => inp.addEventListener('change', () => { resp[i] = +inp.value; inp.closest('.gopts').querySelectorAll('.gopt').forEach(g => g.classList.remove('sel')); inp.closest('.gopt').classList.add('sel'); refresh(); })));
      }
      if (q.tipo === 'abierta') {
        resp = resp || { text: '', rub: q.rubrica.map(() => false), done: false };
        const ta = host.querySelector('textarea'); ta.addEventListener('input', () => { resp.text = ta.value; if (opts.onChange) opts.onChange(resp); });
        const rv = host.querySelector('[data-act="reveal"]');
        if (rv) rv.addEventListener('click', () => { resp.reveal = true; resp.text = ta.value; if (opts.onChange) opts.onChange(resp); Q.render(host, q, Object.assign({}, opts, { resp, review: false })); });
        host.querySelectorAll('input[data-r]').forEach(cb => cb.addEventListener('change', () => { resp.rub[+cb.dataset.r] = cb.checked; resp.done = true; if (submit) submit.disabled = false; if (opts.onChange) opts.onChange(resp); }));
        if (submit && resp.reveal) submit.disabled = false;
      }
    } else if (q.tipo === 'abierta' && opts.allowSelf) {
      host.querySelectorAll('input[data-r]').forEach(cb => cb.addEventListener('change', () => { resp.rub[+cb.dataset.r] = cb.checked; resp.done = true; if (opts.onChange) opts.onChange(resp); }));
    }
    if (submit) submit.addEventListener('click', () => { if (q.tipo === 'abierta') resp.done = true; opts.onSubmit(resp); });
    return { get resp() { return resp; } };
  };

  /* Resumen de un conjunto de resultados por tema: [{q, s}] → {tid:{n, sum}} (ignora s===null) */
  Q.byTopic = items => {
    const out = {};
    items.forEach(it => {
      if (it.s === null || it.s === undefined) return;
      const q = Q.byId(it.q); if (!q) return;
      const o = out[q.tema] = out[q.tema] || { n: 0, sum: 0 }; o.n++; o.sum += it.s;
    });
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
