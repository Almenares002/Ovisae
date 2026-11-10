/* Proyectos en la web (OVIS Sistema v62). Lee el feed público de OVIS Sistema (solo lo que el dueño publicó: título, ciudad, fotos).
   Si el feed no responde o está vacío, muestra «Pronto / Coming soon». */
(function () {
  var FEED = 'https://script.google.com/macros/s/AKfycbzHxsiLfVioVeDpYow75D11b4i9-aWWs5YVrgBjn7CchlNxnCm0R69sjI03_c2PuDIu/exec?feed=web';
  var sec = document.getElementById('proyectos-web'); if (!sec) return;
  var en = sec.getAttribute('data-lang') === 'en';
  var T = en ? { cur: 'Ongoing', done: 'Completed', all: 'All', res: 'Residential', com: 'Commercial', soonT: 'Coming soon', soon: 'Our ongoing and completed projects will appear here very soon.', none: 'No projects in this category yet.', photos: 'photos', plan: 'Drawing (partial view)', close: 'Close', prev: 'Previous', next: 'Next', loading: 'Loading projects…' }
              : { cur: 'En curso', done: 'Terminados', all: 'Todos', res: 'Residencial', com: 'Comercial', soonT: 'Pronto', soon: 'Muy pronto verá aquí nuestros proyectos en curso y terminados.', none: 'Todavía no hay proyectos en esta categoría.', photos: 'fotos', plan: 'Plano (vista parcial)', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente', loading: 'Cargando proyectos…' };
  var grid = sec.querySelector('.ow-grid'), bar = sec.querySelector('.ow-bar'), all = [], tab = 'en_curso', cat = '';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pick = function (o) { return o ? (en ? (o.en || o.es) : (o.es || o.en)) || '' : ''; };
  var safe = function (u) { return /^https:\/\/lh3\.googleusercontent\.com\//.test(String(u || '')) ? u : ''; };
  var pin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ABCA41" stroke-width="2.4" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  function empty(msg, title) { grid.innerHTML = '<div class="ow-empty" style="grid-column:1/-1">' + (title ? '<b>' + esc(title) + '</b>' : '') + esc(msg) + '</div>'; }
  function draw() {
    if (!all.length) { bar.style.display = 'none'; return empty(T.soon, T.soonT); }
    bar.style.display = '';
    var list = all.filter(function (p) { return p.section === tab && (!cat || p.category === cat); });
    if (!list.length) return empty(T.none, '');
    grid.innerHTML = list.map(function (p) {
      var i0 = (p.images || [])[0] || {}, n = (p.images || []).length, d = pick(p.description);
      return '<button type="button" class="ow-card" data-slug="' + esc(p.slug) + '"><div class="ow-img"><img src="' + esc(safe(i0.thumb)) + '" alt="' + esc(pick(p.title)) + '" loading="lazy" decoding="async">' +
        '<span class="ow-badge">' + (p.category === 'comercial' ? T.com : T.res) + '</span><span class="ow-badge st">' + (p.section === 'terminado' ? T.done : T.cur) + '</span>' +
        (n > 1 ? '<span class="ow-count">' + n + ' ' + T.photos + '</span>' : '') + '</div><div class="ow-body"><h3>' + esc(pick(p.title)) + '</h3>' +
        (p.city ? '<div class="ow-city">' + pin + esc(p.city) + ', FL</div>' : '') + (d ? '<p class="ow-desc">' + esc(d) + '</p>' : '') + '</div></button>';
    }).join('');
    grid.querySelectorAll('.ow-card').forEach(function (b) { b.onclick = function () { var p = all.filter(function (x) { return x.slug === b.getAttribute('data-slug'); })[0]; if (p) openLb(p, 0); }; });
  }
  bar.querySelectorAll('.ow-tab').forEach(function (b) { b.onclick = function () { tab = b.getAttribute('data-t'); bar.querySelectorAll('.ow-tab').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); draw(); }; });
  bar.querySelectorAll('.ow-f').forEach(function (b) { b.onclick = function () { cat = b.getAttribute('data-c'); bar.querySelectorAll('.ow-f').forEach(function (x) { x.classList.toggle('on', x === b); }); draw(); }; });
  /* lightbox */
  var lb = document.createElement('div'); lb.className = 'ow-lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button type="button" class="ow-x" aria-label="' + T.close + '">×</button><button type="button" class="ow-nav ow-prev" aria-label="' + T.prev + '">‹</button><img alt=""><button type="button" class="ow-nav ow-next" aria-label="' + T.next + '">›</button><div class="ow-cap"></div>';
  document.body.appendChild(lb);
  var LP = null, LI = 0, img = lb.querySelector('img');
  function show() { var im = LP.images[LI]; img.src = safe(im.url); img.alt = pick(LP.title); lb.querySelector('.ow-cap').innerHTML = '<b>' + esc(pick(LP.title)) + '</b>' + (LP.city ? ' · ' + esc(LP.city) : '') + ' · ' + (LI + 1) + '/' + LP.images.length + (im.kind === 'plan' ? ' · ' + T.plan : ''); var many = LP.images.length > 1; lb.querySelector('.ow-prev').style.display = many ? '' : 'none'; lb.querySelector('.ow-next').style.display = many ? '' : 'none'; }
  function openLb(p, i) { LP = p; LI = i; show(); lb.hidden = false; document.documentElement.style.overflow = 'hidden'; lb.querySelector('.ow-x').focus(); }
  function closeLb() { lb.hidden = true; img.src = ''; document.documentElement.style.overflow = ''; }
  function mv(k) { if (!LP) return; LI = (LI + k + LP.images.length) % LP.images.length; show(); }
  lb.querySelector('.ow-x').onclick = closeLb; lb.querySelector('.ow-prev').onclick = function () { mv(-1); }; lb.querySelector('.ow-next').onclick = function () { mv(1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') mv(-1); if (e.key === 'ArrowRight') mv(1); });
  var tx = null; lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) mv(dx < 0 ? 1 : -1); tx = null; });
  /* datos */
  grid.innerHTML = '<div class="ow-empty" style="grid-column:1/-1">' + T.loading + '</div>';
  var done = false, to = setTimeout(function () { if (!done) { done = true; all = []; draw(); } }, 15000);
  fetch(FEED, { credentials: 'omit' }).then(function (r) { return r.json(); }).then(function (j) {
    if (done) return; done = true; clearTimeout(to);
    all = (j && j.ok && j.projects ? j.projects : []).filter(function (p) { return p && p.slug && p.images && p.images.length && safe(p.images[0].thumb); });
    if (all.length && !all.some(function (p) { return p.section === 'en_curso'; })) { tab = 'terminado'; bar.querySelectorAll('.ow-tab').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-t') === tab); }); }
    draw();
  }).catch(function () { if (done) return; done = true; clearTimeout(to); all = []; draw(); });
})();
