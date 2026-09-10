/* components/animated-diagram.js
   Стъпкова анимирана схема: текст от урока -> схема -> визуализация.
   Data shape: { type:"animated-diagram", id, heading, intro, autoplayMs,
     steps:[{ title, body, diagram:{ kind, nodes:[{label,sub,icon}], flow, note } }] }
   Управлението е: Назад / Напред + точки + бутон Преиграй.
*/
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function diagramHtml(d, idx) {
  if (!d) return '';
  var nodes = (d.nodes || []).map(function (n) {
    var iconHtml = '';
    if (n.image) {
      iconHtml = '<div class="adiagram-image"><img src="' + esc(n.image) + '" alt="' + esc(n.label) + '"></div>';
    } else if (n.icon) {
      iconHtml = '<div class="adiagram-icon">' + esc(n.icon) + '</div>';
    }
    return '<div class="adiagram-node step-pop" style="animation-delay:' + (idx * 120) + 'ms">'
      + iconHtml
      + '<div class="adiagram-label">' + esc(n.label) + '</div>'
      + (n.sub ? '<div class="adiagram-sub">' + esc(n.sub) + '</div>' : '')
      + '</div>';
  }).join('<div class="adiagram-link"></div>');
  return '<div class="adiagram-canvas">'
    + (d.flow ? '<div class="adiagram-flow">' + esc(d.flow) + '</div>' : '')
    + '<div class="adiagram-nodes">' + nodes + '</div>'
    + (d.note ? '<div class="adiagram-note">' + esc(d.note) + '</div>' : '')
    + '</div>';
}

export function render(comp) {
  var steps = comp.steps || [];
  var first = steps[0] || { title: '', body: '', diagram: null };
  var dots = steps.map(function (s, i) {
    return '<button type="button" class="adiagram-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '" aria-label="Стъпка ' + (i + 1) + '"></button>';
  }).join('');
  return ''
    + '<section class="component adiagram" id="' + esc(comp.id || '') + '">'
    + (comp.heading ? '<h2 class="component-heading">' + esc(comp.heading) + '</h2>' : '')
    + (comp.intro ? '<p class="adiagram-intro">' + comp.intro + '</p>' : '')
    + '<div class="adiagram-card">'
    + '<div class="adiagram-top"><span class="adiagram-counter"><b>1</b> / ' + steps.length + '</span></div>'
    + '<h3 class="adiagram-title">' + esc(first.title) + '</h3>'
    + '<div class="adiagram-body">' + (first.body || '') + '</div>'
    + '<div class="adiagram-stage">' + diagramHtml(first.diagram, 0) + '</div>'
    + '<div class="adiagram-nav">'
    + '<button type="button" class="btn-activity adiagram-prev">&larr; Назад</button>'
    + '<div class="adiagram-dots">' + dots + '</div>'
    + '<button type="button" class="btn-activity adiagram-next">Напред &rarr;</button>'
    + '</div></div></section>';
}

export function init(comp) {
  var root = document.getElementById(comp.id);
  if (!root) return;
  var steps = comp.steps || [];
  if (!steps.length) return;
  var idx = 0;
  var titleEl = root.querySelector('.adiagram-title');
  var bodyEl = root.querySelector('.adiagram-body');
  var stageEl = root.querySelector('.adiagram-stage');
  var counterEl = root.querySelector('.adiagram-counter b');
  var dots = Array.prototype.slice.call(root.querySelectorAll('.adiagram-dot'));
  var timer = null;

  function show(i, user) {
    idx = Math.max(0, Math.min(steps.length - 1, i));
    var s = steps[idx];
    titleEl.textContent = s.title || '';
    bodyEl.innerHTML = s.body || '';
    stageEl.innerHTML = diagramHtml(s.diagram, 0);
    counterEl.textContent = String(idx + 1);
    dots.forEach(function (d, di) { d.classList.toggle('active', di === idx); });
    root.querySelector('.adiagram-prev').disabled = idx === 0;
    root.querySelector('.adiagram-next').disabled = idx === steps.length - 1;
    if (user) restartAutoplay();
  }

  function restartAutoplay() {
    stopAutoplay();
    var ms = comp.autoplayMs || 0;
    if (ms > 0 && idx < steps.length - 1) {
      timer = setTimeout(function () { show(idx + 1, false); restartAutoplay(); }, ms);
    }
  }
  function stopAutoplay() { if (timer) { clearTimeout(timer); timer = null; } }

  root.querySelector('.adiagram-prev').addEventListener('click', function () { show(idx - 1, true); });
  root.querySelector('.adiagram-next').addEventListener('click', function () { show(idx + 1, true); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () { show(parseInt(d.dataset.dot, 10), true); });
  });
  show(0, false);
  restartAutoplay();
}
