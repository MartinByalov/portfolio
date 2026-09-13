// Interactive school calendar modal

const MONTHS_NAMES_BG = [
  'януари', 'февруари', 'март', 'април', 'май', 'юни',
  'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
];

const WEEKDAY_NAMES_BG = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const CALENDAR_EVENTS = [
  { from: '2026-09-15', to: '2026-09-15', type: 'special',  bg: 'Откриване на учебната година' },
  { from: '2026-09-22', to: '2026-09-22', type: 'holiday',  bg: 'Ден на Независимостта на България' },
  { from: '2026-10-31', to: '2026-11-03', type: 'vacation', bg: 'Есенна ваканция' },
  { from: '2026-11-01', to: '2026-11-01', type: 'holiday',  bg: 'Ден на народните будители' },
  { from: '2026-12-24', to: '2027-01-03', type: 'vacation', bg: 'Коледна ваканция' },
  { from: '2027-02-04', to: '2027-02-04', type: 'special',  bg: 'Край на първи учебен срок' },
  { from: '2027-02-05', to: '2027-02-07', type: 'vacation', bg: 'Междусрочна ваканция' },
  { from: '2027-02-08', to: '2027-02-08', type: 'special',  bg: 'Начало на втори учебен срок' },
  { from: '2027-03-03', to: '2027-03-03', type: 'holiday',  bg: 'Освобождение на България' },
  { from: '2027-04-03', to: '2027-04-12', type: 'vacation', bg: 'Пролетна ваканция (I - XI клас)' },
  { from: '2027-04-08', to: '2027-04-12', type: 'vacation', bg: 'Пролетна ваканция (XII клас)' },
  { from: '2027-05-01', to: '2027-05-01', type: 'holiday',  bg: 'Ден на труда' },
  { from: '2027-05-06', to: '2027-05-06', type: 'holiday',  bg: 'Гергьовден, Ден на храбростта' },
  { dates: ['2027-05-20', '2027-05-22'],   type: 'exam',     bg: 'ДЗИ (Матури XII клас) — неучебни дни' },
  { from: '2027-05-24', to: '2027-05-24', type: 'holiday',  bg: 'Ден на светите братя Кирил и Методий' },
  { dates: ['2027-06-17', '2027-06-19'],   type: 'exam',     bg: 'НВО VII и X клас — неучебни дни' },
  { from: '2027-05-14', to: '2027-05-14', type: 'special',  bg: 'Край на втория срок за XII клас' },
  { from: '2027-05-31', to: '2027-05-31', type: 'special',  bg: 'Край на втория срок за I - III клас' },
  { from: '2027-06-15', to: '2027-06-15', type: 'special',  bg: 'Край на втория срок за IV - VI клас' },
  { from: '2027-06-30', to: '2027-06-30', type: 'special',  bg: 'Край на втория срок за VII - XI клас' }
];

// School year 2026/2027: 11 months from September 2026 to July 2027
const SCHOOL_YEAR_START = { year: 2026, month: 8 };
const SCHOOL_YEAR_MONTHS = 11;

const MONTHS = (() => {
  const list = [];
  for (let i = 0; i < SCHOOL_YEAR_MONTHS; i++) {
    const index = SCHOOL_YEAR_START.year * 12 + SCHOOL_YEAR_START.month + i;
    list.push({ year: Math.floor(index / 12), month: index % 12 });
  }
  return list;
})();

const EVENT_MAP = (() => {
  const map = new Map();
  const addDay = (key, event) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(event);
  };
  CALENDAR_EVENTS.forEach(event => {
    if (event.dates) {
      event.dates.forEach(d => addDay(d, event));
    } else if (event.from && event.to) {
      let d = new Date(event.from + 'T00:00:00Z');
      const end = new Date(event.to + 'T00:00:00Z');
      while (d <= end) {
        addDay(d.toISOString().slice(0, 10), event);
        d = new Date(d.getTime() + 86400000);
      }
    }
  });
  return map;
})();

const NOW = new Date();
const TODAY_KEY = NOW.getFullYear() + '-' +
  String(NOW.getMonth() + 1).padStart(2, '0') + '-' +
  String(NOW.getDate()).padStart(2, '0');

function escapeHtmlCal(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function formatKey(key) {
  const [y, m, d] = key.split('-');
  return `${Number(d)}.${Number(m)}.${y} г.`;
}

const CALENDAR_STYLE = `
  .cal-overlay {
    position: fixed; inset: 0; z-index: 30000;
    background: rgba(0, 0, 0, 0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    opacity: 0; transition: opacity 0.18s ease;
  }
  .cal-overlay.open { opacity: 1; }
  .cal-popup {
    width: min(880px, 96vw); max-height: 92vh;
    background: #fff; border-radius: 12px;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
    transform: scale(0.96); transition: transform 0.18s ease;
    overflow: hidden;
  }
  .cal-overlay.open .cal-popup { transform: scale(1); }
  .cal-popup-scroll { overflow-y: auto; }
  .cal-popup-header {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; background: #1d1b31; color: #fff;
  }
  .cal-popup-header > i { font-size: 1.1rem; }
  .cal-popup-title { font-weight: 600; flex: 1; }
  .cal-nav { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .cal-nav button {
    background: rgba(255, 255, 255, 0.1); border: none; color: #fff;
    width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
    font-size: 1rem; transition: background 0.2s;
  }
  .cal-nav button:hover:not(:disabled) { background: #f17a3e; }
  .cal-nav button:disabled { opacity: 0.35; cursor: default; }
  .cal-close {
    background: none; border: none; color: #fff;
    font-size: 26px; line-height: 1; cursor: pointer; padding: 0 4px;
    transition: color 0.2s;
  }
  .cal-close:hover { color: #f17a3e; }
  .cal-body { padding: 18px; }
  .cal-month-title { text-align: center; margin: 0 0 14px; font-size: 1.15rem; color: #1d1b31; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
  .cal-weekday { text-align: center; font-weight: 700; font-size: 0.8rem; color: #888; padding: 4px 0; }
  .cal-day {
    min-height: 52px; border-radius: 8px; border: 1px solid #eee;
    background: #fff; padding: 5px 7px; font-size: 0.85rem; color: #1d1b31;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .cal-day-num { font-weight: 600; }
  .cal-day-dot { width: 7px; height: 7px; border-radius: 50%; background: #f17a3e; }
  .cal-day.weekend { background: #f4f4f9; color: #8a8f98; }
  .cal-day.weekend .cal-day-dot { background: #8a8f98; }
  .cal-day.out { visibility: hidden; }
  .cal-day.today { outline: 2px solid #1d1b31; outline-offset: -2px; }
  .cal-day.vacation { background: #ffc59d; border: 2px solid #f17a3e; }
  .cal-day.vacation .cal-day-num { color: #7a3a12; }
  .cal-day.holiday { background: #ffe58f; border: 2px solid #e0a800; }
  .cal-day.holiday .cal-day-num { color: #7a5b00; }
  .cal-day.exam { background: #ffc2ba; border: 2px solid #dc3545; }
  .cal-day.exam .cal-day-dot { background: #dc3545; }
  .cal-day.exam .cal-day-num { color: #8a1a11; }
  .cal-day.special { background: #b9e8cb; border: 2px solid #2e9e5b; }
  .cal-day.special .cal-day-dot { background: #2e9e5b; }
  .cal-day.special .cal-day-num { color: #14602f; }
  .cal-legend { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0 4px; font-size: 0.8rem; color: #555; }
  .cal-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .cal-legend i { width: 12px; height: 12px; border-radius: 4px; display: inline-block; }
  .cal-events-title { font-size: 0.95rem; color: #1d1b31; margin: 14px 0 8px; }
  .cal-events-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 6px; }
  .cal-events-list li {
    display: flex; flex-direction: column; gap: 2px;
    padding: 7px 10px; border-radius: 8px; font-size: 0.82rem;
    border-left: 3px solid #ccc; background: #fafafa;
  }
  .cal-event-vacation { border-left-color: #f17a3e; }
  .cal-event-holiday { border-left-color: #e0a800; }
  .cal-event-exam { border-left-color: #dc3545; }
  .cal-event-special { border-left-color: #2e9e5b; }
  .cal-event-dates { color: #777; font-size: 0.78rem; }
  
  /* Dark mode overrides for calendar */
  [data-theme="dark"] .cal-popup,
  body.dark-mode .cal-popup {
    background: #171b2d;
    border: 1px solid #262e4a;
    color: #f1f5f9;
  }
  [data-theme="dark"] .cal-month-title,
  body.dark-mode .cal-month-title { color: #ffffff; }
  [data-theme="dark"] .cal-weekday,
  body.dark-mode .cal-weekday { color: #94a3b8; }
  [data-theme="dark"] .cal-day,
  body.dark-mode .cal-day {
    background: #1d2238;
    border-color: #262e4a;
    color: #f1f5f9;
  }
  [data-theme="dark"] .cal-day.weekend,
  body.dark-mode .cal-day.weekend { background: #121524; color: #64748b; }
  [data-theme="dark"] .cal-day.today,
  body.dark-mode .cal-day.today { outline-color: #f17a3e; }
  [data-theme="dark"] .cal-legend,
  body.dark-mode .cal-legend { color: #cbd5e1; }
  [data-theme="dark"] .cal-events-title,
  body.dark-mode .cal-events-title { color: #ffffff; }
  [data-theme="dark"] .cal-events-list li,
  body.dark-mode .cal-events-list li {
    background: #1d2238;
    color: #f1f5f9;
    border-color: #262e4a;
  }
  [data-theme="dark"] .cal-event-dates,
  body.dark-mode .cal-event-dates { color: #94a3b8; }
`;

function ensureStyle() {
  if (document.getElementById('school-calendar-style')) return;
  const style = document.createElement('style');
  style.id = 'school-calendar-style';
  style.textContent = CALENDAR_STYLE;
  document.head.appendChild(style);
}

let overlayEl = null;
let monthIndex = 0;

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

function dayType(events) {
  if (!events || !events.length) return '';
  if (events.some(e => e.type === 'exam')) return 'exam';
  if (events.some(e => e.type === 'vacation')) return 'vacation';
  if (events.some(e => e.type === 'holiday')) return 'holiday';
  return 'special';
}

function renderMonth() {
  const grid = document.getElementById('cal-grid');
  const title = document.getElementById('cal-month-title');
  if (!grid || !title) return;
  const { year, month } = MONTHS[monthIndex];
  const monthName = MONTHS_NAMES_BG[month];
  title.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1) + ` ${year} г.`;
  document.getElementById('cal-prev').disabled = monthIndex === 0;
  document.getElementById('cal-next').disabled = monthIndex === MONTHS.length - 1;

  const weekdays = WEEKDAY_NAMES_BG;
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = weekdays.map(w => `<div class="cal-weekday">${w}</div>`).join('');
  for (let i = 0; i < lead; i++) html += '<div class="cal-day out"></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const events = EVENT_MAP.get(key) || [];
    const type = dayType(events);
    const weekday = new Date(year, month, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const labels = events.map(e => e.bg).join(' | ');
    html += `<div class="cal-day ${type} ${isWeekend ? 'weekend' : ''} ${key === TODAY_KEY ? 'today' : ''}"${labels ? ` title="${escapeHtmlCal(labels)}"` : ''}>
      <span class="cal-day-num">${day}</span>
      ${type ? '<span class="cal-day-dot"></span>' : ''}
    </div>`;
  }
  grid.innerHTML = html;
}

function renderEventsList() {
  const list = document.getElementById('cal-events-list');
  if (!list) return;
  list.innerHTML = CALENDAR_EVENTS.map(event => {
    const range = event.dates
      ? event.dates.map(formatKey).join(', ')
      : `${formatKey(event.from)} – ${formatKey(event.to)}`;
    const label = event.bg;
    return `<li class="cal-event cal-event-${event.type}">
      <span class="cal-event-label">${escapeHtmlCal(label)}</span>
      <span class="cal-event-dates">${escapeHtmlCal(range)}</span>
    </li>`;
  }).join('');
}

export function open() {
  if (overlayEl) return;
  ensureStyle();
  overlayEl = document.createElement('div');
  overlayEl.className = 'cal-overlay';
  overlayEl.innerHTML = `
    <div class="cal-popup" role="dialog" aria-modal="true" aria-label="Учебен календар">
      <div class="cal-popup-header">
        <i class="fas fa-calendar-days"></i>
        <span class="cal-popup-title">Учебен календар 2026/2027 г.</span>
        <span class="cal-nav">
          <button type="button" id="cal-prev" title="Предходен месец">&lsaquo;</button>
          <button type="button" id="cal-next" title="Следващ месец">&rsaquo;</button>
        </span>
        <button type="button" class="cal-close" title="Затвори" aria-label="Затвори">&times;</button>
      </div>
      <div class="cal-popup-scroll">
        <div class="cal-body">
          <h3 class="cal-month-title" id="cal-month-title"></h3>
          <div class="cal-grid" id="cal-grid"></div>
          <div class="cal-legend">
            <span><i style="background:#b9e8cb; border:2px solid #2e9e5b;"></i> Начало / край на срок и занятия</span>
            <span><i style="background:#ffc59d; border:2px solid #f17a3e;"></i> Ваканция</span>
            <span><i style="background:#ffe58f; border:2px solid #e0a800;"></i> Неучебен ден (празник)</span>
            <span><i style="background:#ffc2ba; border:2px solid #dc3545;"></i> НВО / ДЗИ</span>
            <span><i style="background:#f4f4f9; border:1px solid #ddd;"></i> Уикенд</span>
          </div>
          <h4 class="cal-events-title">Важни дати</h4>
          <ul class="cal-events-list" id="cal-events-list"></ul>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlayEl);
  requestAnimationFrame(() => overlayEl.classList.add('open'));

  const nowIndex = (NOW.getFullYear() - SCHOOL_YEAR_START.year) * 12 + (NOW.getMonth() - SCHOOL_YEAR_START.month);
  monthIndex = Math.min(Math.max(nowIndex, 0), MONTHS.length - 1);

  renderEventsList();
  renderMonth();
  document.getElementById('cal-prev').addEventListener('click', () => {
    if (monthIndex > 0) { monthIndex--; renderMonth(); }
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    if (monthIndex < MONTHS.length - 1) { monthIndex++; renderMonth(); }
  });
  overlayEl.querySelector('.cal-close').addEventListener('click', close);
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) close(); });
  document.addEventListener('keydown', onKeydown);
}

export function close() {
  document.removeEventListener('keydown', onKeydown);
  if (overlayEl) {
    const el = overlayEl;
    overlayEl = null;
    el.classList.remove('open');
    setTimeout(() => el.remove(), 180);
  }
}