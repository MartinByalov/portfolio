// Calculators modal launcher

let overlayEl = null;
function onKeydown(e) { if (e.key === 'Escape') close(); }
function esc(v) {
  return String(v).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}
function ensureStyle() {
  if (document.getElementById('calculators-style')) return;
  var s = document.createElement('style');
  s.id = 'calculators-style';
  s.textContent = '.calc-overlay{position:fixed;inset:0;z-index:30000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .18s}'
    + '.calc-overlay.open{opacity:1}.calc-popup{width:min(560px,96vw);max-height:92vh;background:#fff;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.35);overflow:hidden}'
    + '.calc-popup-header{position:relative;display:flex;align-items:center;justify-content:center;min-height:52px;padding:12px 58px 12px 18px;background:#1d1b31;color:#fff}'
    + '.calc-popup-title{font-weight:600;text-align:center}.calc-close{position:absolute;top:50%;right:18px;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:26px;cursor:pointer}'
    + '.calc-close:hover{color:#f17a3e}.calc-tabs{display:flex;background:#f4f4f9;border-bottom:1px solid #eee}'
    + '.calc-tab{flex:1;padding:10px;border:none;background:none;cursor:pointer;font-weight:600;font-size:.85rem;color:#555;border-bottom:3px solid transparent}'
    + '.calc-tab.active{color:#f17a3e;border-bottom-color:#f17a3e;background:#fff}'
    + '.calc-body{padding:18px;overflow-y:auto}.calc-pane{display:none}.calc-pane.active{display:block}'
    + '.calc-display{width:100%;padding:12px;font-size:1.4rem;text-align:right;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:12px;background:#f8fafc;font-weight:600;box-sizing:border-box}'
    + '.calc-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}'
    + '.calc-keys button{padding:12px 0;font-size:1.05rem;font-weight:600;border:1px solid #e5e7eb;border-radius:10px;background:#fff;cursor:pointer}'
    + '.calc-keys button.op{background:#1d1b31;color:#fff;border-color:#1d1b31}'
    + '.calc-keys button.eq{background:#f17a3e;color:#fff;border-color:#f17a3e;grid-column:span 2}'
    + '.calc-row{display:flex;gap:8px;margin-bottom:10px}.calc-row input,.calc-row select{flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:.95rem;box-sizing:border-box}'
    + '.calc-btn{padding:10px 18px;border:none;border-radius:8px;cursor:pointer;background:#1d1b31;color:#fff;font-weight:600}'
    + '.calc-result{margin-top:10px;padding:12px;border-radius:8px;background:#f8fafc;border:1px solid #e5e7eb;font-size:.9rem;line-height:1.6;word-break:break-all}'
    + '.calc-result b{color:#f17a3e}';
  document.head.appendChild(s);
}
function ipToNum(ip) {
  var parts = String(ip).trim().split('.');
  if (parts.length !== 4) throw new Error('IP формат a.b.c.d');
  var nums = parts.map(function (p) {
    var n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255) throw new Error('Октет 0-255.');
    return n;
  });
  return (((nums[0] * 256 + nums[1]) * 256 + nums[2]) * 256 + nums[3]) >>> 0;
}
function numToIp(n) {
  n = n >>> 0;
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}
function maskFromCidr(c) {
  if (!Number.isInteger(c) || c < 0 || c > 32) throw new Error('CIDR 0-32.');
  return c === 0 ? 0 : (0xffffffff << (32 - c)) >>> 0;
}
export function open() {
  if (overlayEl) return;
  ensureStyle();
  overlayEl = document.createElement('div');
  overlayEl.className = 'calc-overlay';
  overlayEl.innerHTML = '<div class="calc-popup" role="dialog" aria-modal="true" aria-label="calc">'
    + '<div class="calc-popup-header"><span class="calc-popup-title">Калкулатори</span>'
    + '<button type="button" class="calc-close">&times;</button></div>'
    + '<div class="calc-tabs"><button type="button" class="calc-tab active" data-pane="std">Стандартен</button>'
    + '<button type="button" class="calc-tab" data-pane="base">Бройни системи</button>'
    + '<button type="button" class="calc-tab" data-pane="ip">IP &amp; CIDR</button></div>'
    + '<div class="calc-body"><div class="calc-pane active" id="calc-pane-std">'
    + '<input class="calc-display" id="calc-display" value="0" readonly>'
    + '<div class="calc-keys" id="calc-keys"><button data-k="C">C</button><button data-k="back">x</button>'
    + '<button data-k="%" class="op">%</button><button data-k="/" class="op">/</button>'
    + '<button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button data-k="*" class="op">x</button>'
    + '<button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button data-k="-" class="op">-</button>'
    + '<button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button data-k="+" class="op">+</button>'
    + '<button data-k="0">0</button><button data-k=".">.</button><button data-k="=" class="eq">=</button></div></div>'
    + '<div class="calc-pane" id="calc-pane-base"><div class="calc-row">'
    + '<input id="calc-base-value" placeholder="1010 / 255 / FF">'
    + '<select id="calc-base-from"><option value="2">BIN</option><option value="10" selected>DEC</option><option value="16">HEX</option></select></div>'
    + '<button type="button" class="calc-btn" id="calc-base-go">Преобразувай</button>'
    + '<div class="calc-result" id="calc-base-result">Въведете стойност</div></div>'
    + '<div class="calc-pane" id="calc-pane-ip"><div class="calc-row">'
    + '<input id="calc-ip" placeholder="192.168.1.10">'
    + '<input id="calc-cidr" type="number" min="0" max="32" value="24" style="max-width:90px"></div>'
    + '<button type="button" class="calc-btn" id="calc-ip-go">Изчисли</button>'
    + '<div class="calc-result" id="calc-ip-result">Въведете IP адрес</div></div>'
    + '</div></div>';
  document.body.appendChild(overlayEl);
  requestAnimationFrame(function () { overlayEl.classList.add('open'); });
  overlayEl.querySelector('.calc-close').addEventListener('click', close);
  overlayEl.addEventListener('click', function (e) { if (e.target === overlayEl) close(); });
  document.addEventListener('keydown', onKeydown);
  bindTabs();
  bindStd();
  bindBase();
  bindIp();
}
function bindTabs() {
  overlayEl.querySelectorAll('.calc-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      overlayEl.querySelectorAll('.calc-tab').forEach(function (t) { t.classList.remove('active'); });
      overlayEl.querySelectorAll('.calc-pane').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      overlayEl.querySelector('#calc-pane-' + tab.dataset.pane).classList.add('active');
    });
  });
}
function bindStd() {
  var expr = '';
  var display = overlayEl.querySelector('#calc-display');
  overlayEl.querySelector('#calc-keys').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var k = btn.dataset.k;
    if (k === 'C') { expr = ''; display.value = '0'; return; }
    if (k === 'back') { expr = expr.slice(0, -1); display.value = expr || '0'; return; }
    if (k === '=') {
      try {
        if (!expr || !/^[0-9+\-*/.%()\s]+$/.test(expr)) throw new Error('bad');
        var out = new Function('return (' + expr + ')')();
        if (typeof out !== 'number' || !isFinite(out)) throw new Error('bad');
        expr = String(Math.round(out * 1e10) / 1e10);
        display.value = expr;
      } catch (err) { display.value = 'Грешка'; expr = ''; }
      return;
    }
    expr += k;
    display.value = expr;
  });
}
function bindBase() {
  overlayEl.querySelector('#calc-base-go').addEventListener('click', function () {
    var out = overlayEl.querySelector('#calc-base-result');
    try {
      var raw = overlayEl.querySelector('#calc-base-value').value.trim().replace(/^0x/i, '');
      var base = parseInt(overlayEl.querySelector('#calc-base-from').value, 10);
      if (!raw) throw new Error('Въведи стойност.');
      var dec = parseInt(raw, base);
      if (isNaN(dec)) throw new Error('Невалидна стойност.');
      out.innerHTML = 'BIN: <b>' + esc(dec.toString(2)) + '</b><br>DEC: <b>' + esc(dec) + '</b><br>HEX: <b>' + esc(dec.toString(16).toUpperCase()) + '</b>';
    } catch (err) { out.textContent = err.message; }
  });
}
function bindIp() {
  overlayEl.querySelector('#calc-ip-go').addEventListener('click', function () {
    var out = overlayEl.querySelector('#calc-ip-result');
    try {
      var ip = ipToNum(overlayEl.querySelector('#calc-ip').value);
      var cidr = Number(overlayEl.querySelector('#calc-cidr').value);
      var mask = maskFromCidr(cidr);
      var net = (ip & mask) >>> 0;
      var bcast = (net | (~mask >>> 0)) >>> 0;
      var hosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;
      out.innerHTML = 'Мрежа: <b>' + esc(numToIp(net)) + '/' + cidr + '</b><br>Маска: <b>' + esc(numToIp(mask))
        + '</b><br>Broadcast: <b>' + esc(numToIp(bcast)) + '</b><br>Хостове: <b>' + hosts + '</b>';
    } catch (err) { out.textContent = err.message; }
  });
}
export function close() {
  document.removeEventListener('keydown', onKeydown);
  if (overlayEl) {
    var el = overlayEl;
    overlayEl = null;
    el.classList.remove('open');
    setTimeout(function () { el.remove(); }, 180);
  }
}

