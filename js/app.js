/* app.js — arranque: enrutador por hash, tema claro/oscuro, menú móvil y refresco del progreso. */
(function (root) {
  'use strict';
  const EL = root.EL, V = EL.views;

  function parse() {
    const raw = (location.hash || '#/inicio').replace(/^#\/?/, ''), [path, qs] = raw.split('?');
    const [name, id] = path.split('/');
    const params = {}; if (qs) qs.split('&').forEach(p => { const [k, v] = p.split('='); params[k] = decodeURIComponent(v || ''); });
    return { name: name || 'inicio', id, params };
  }
  function route() {
    const r = parse(), map = { inicio: V.inicio, contenidos: V.contenidos, tema: () => V.tema(r.id), lab: () => V.lab(r.id), banco: () => V.banco(r.params), simulador: V.simulador, progreso: V.progreso, fuentes: V.fuentes };
    try { (map[r.name] || V.inicio)(); }
    catch (e) { console.error(e); document.getElementById('view').innerHTML = `<div class="callout warn"><b>Error al mostrar esta sección.</b> ${EL.esc(e.message)}<br><a href="#/inicio">Volver al inicio</a></div>`; }
    V.side(r); V.topProgress(); closeMenu();
    document.getElementById('view').focus({ preventScroll: true });
  }
  function closeMenu() { document.body.classList.remove('menu-open'); document.getElementById('burger').setAttribute('aria-expanded', 'false'); }

  function setTheme(t) { document.documentElement.dataset.theme = t; }
  function initTheme() {
    const saved = EL.store.get().theme, prefers = root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefers ? 'dark' : 'light'));
    document.getElementById('btn-theme').addEventListener('click', () => { const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(n); EL.store.setTheme(n); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    document.getElementById('burger').addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); document.getElementById('burger').setAttribute('aria-expanded', String(o)); });
    document.getElementById('scrim').addEventListener('click', closeMenu);
    document.addEventListener('el:store', () => { V.side(parse()); V.topProgress(); });
    root.addEventListener('hashchange', route);
    route();
  });
})(window);
