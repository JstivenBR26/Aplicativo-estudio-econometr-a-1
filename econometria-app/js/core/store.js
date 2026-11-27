/* store.js — persistencia local del progreso (localStorage con respaldo en memoria).
   Estructura:
   { v:1, theme, attempts:[{id,date,mode,label,secs,items:[{q,s,t}]}], practice:{qid:{ok,no,last}},
     topics:{tid:{read:bool, checks:{idx:bool}}}, labs:{lid:ts}, flags:{qid:true} }          */
(function (root) {
  'use strict';
  const EL = root.EL;
  const KEY = 'econolab-v1';
  let mem = null, canLS = true;
  function blank() { return { v: 1, theme: null, attempts: [], practice: {}, topics: {}, labs: {}, flags: {} }; }
  function load() {
    if (mem) return mem;
    try { const raw = root.localStorage.getItem(KEY); mem = raw ? Object.assign(blank(), JSON.parse(raw)) : blank(); }
    catch (e) { canLS = false; mem = blank(); }
    return mem;
  }
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { canLS = false; } }

  const S = EL.store = {
    get: load,
    persistent: () => canLS,
    commit(fn) { const s = load(); fn(s); save(); document.dispatchEvent(new CustomEvent('el:store')); },
    /* Registra una respuesta de práctica (banco): s en [0,1] */
    recordPractice(qid, s) {
      S.commit(st => {
        const p = st.practice[qid] || { ok: 0, no: 0, last: null };
        if (s >= 0.999) p.ok++; else p.no++;
        p.last = s; p.ts = Date.now(); st.practice[qid] = p;
      });
    },
    addAttempt(a) { S.commit(st => { st.attempts.push(a); if (st.attempts.length > 200) st.attempts.shift(); }); },
    markTopicRead(tid, val) { S.commit(st => { (st.topics[tid] = st.topics[tid] || { checks: {} }).read = val; }); },
    setCheck(tid, i, val) { S.commit(st => { const t = st.topics[tid] = st.topics[tid] || { checks: {} }; t.checks = t.checks || {}; t.checks[i] = val; }); },
    visitLab(lid) { S.commit(st => { st.labs[lid] = Date.now(); }); },
    setTheme(t) { S.commit(st => { st.theme = t; }); },
    toggleFlag(qid) { S.commit(st => { if (st.flags[qid]) delete st.flags[qid]; else st.flags[qid] = true; }); },
    exportJSON() { return JSON.stringify(load(), null, 2); },
    importJSON(txt) {
      const o = JSON.parse(txt);
      if (!o || typeof o !== 'object' || !Array.isArray(o.attempts)) throw new Error('Archivo de progreso no válido');
      mem = Object.assign(blank(), o); save(); document.dispatchEvent(new CustomEvent('el:store'));
    },
    reset() { mem = blank(); save(); document.dispatchEvent(new CustomEvent('el:store')); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
