// Interactive school calendar modal

const MONTHS_BG = ['януари', 'февруари', 'март', 'април', 'май', 'юни',
                   'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

// Учебна 2026/2027: от септември 2026, общо 11 месеца (до юли 2027).
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

// type: 'special' (начало/край), 'vacation', 'holiday' (неучебен ден), 'exam' (НВО/ДЗИ)
const EVENTS = [
  { type: 'special',  label: 'Първи учебен ден',                    dates: ['2026-09-15'] },
  { type: 'holiday',  label: 'Официален празник – Ден на независимостта',   dates: ['2026-09-22'] },
  { type: 'holiday',  label: 'Официален празник – Рождество Христово',      dates: ['2026-12-24', '2026-12-25', '2026-12-26'] },
  { type: 'holiday',  label: 'Официален празник – Нова година',             dates: ['2027-01-01'] },
  { type: 'vacation', label: 'Междусрочна ваканция',                        from: '2027-01-30', to: '2027-02-02' },
  { type: 'special',  label: 'Начало на втория учебен срок',                dates: ['2027-02-03'] },
  { type: 'holiday',  label: 'Официален празник – Ден на освобождението',   dates: ['2027-03-03'] },
  { type: 'vacation', label: 'Пролетна ваканция (I–XI клас)',               from: '2027-04-03', to: '2027-04-11' },
  { type: 'vacation', label: 'Пролетна ваканция (XII клас)',                from: '2027-04-08', to: '2027-04-11' },
  { type: 'holiday',  label: 'Официален празник – Празник на труда',        dates: ['2027-05-01'] },
  { type: 'holiday',  label: 'Неучебни дни (I–XI клас) – Великден и Ден на храбростта', dates: ['2027-05-05', '2027-05-06', '2027-05-07'] },
  { type: 'holiday',  label: 'Официален празник – Ден на българската просвета и култура', dates: ['2027-05-24'] },
  { type: 'special',  label: 'Край на учебните занятия – XII клас',         dates: ['2027-05-13'] },
  { type: 'exam',     label: 'ДЗИ – български език и литература (XII клас)', dates: ['2027-05-19'] },
  { type: 'exam',     label: 'Втори задължителен ДЗИ (XII клас)',           dates: ['2027-05-21'] },
  { type: 'special',  label: 'Край на учебните занятия – I–III клас',       dates: ['2027-06-02'] },
  { type: 'special',  label: 'Край на учебните занятия – IV–VI клас',       dates: ['2027-06-16'] },
  { type: 'exam',     label: 'НВО – български език и литература (VII и X клас)', dates: ['2027-06-18'] },
  { type: 'exam',     label: 'НВО – математика (VII и X клас)',             dates: ['2027-06-21'] },
  { type: 'special',  label: 'Край на учебните занятия – VII–XI клас',      dates: ['2027-07-02'] }
];

const EVENT_MAP = (() => {
  const map = new Map();
  const addDay = (key, event) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(event);
  };
  EVENTS.forEach(event => {
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
  const monthName = MONTHS_BG[month];
  title.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1) + ` ${year} г.`;
  document.getElementById('cal-prev').disabled = monthIndex === 0;
  document.getElementById('cal-next').disabled = monthIndex === MONTHS.length - 1;

  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = WEEKDAYS.map(w => `<div class="cal-weekday">${w}</div>`).join('');
  for (let i = 0; i < lead; i++) html += '<div class="cal-day out"></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const events = EVENT_MAP.get(key) || [];
    const type = dayType(events);
    const weekday = new Date(year, month, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const labels = events.map(e => e.label).join(' | ');
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
  list.innerHTML = EVENTS.map(event => {
    const range = event.dates
      ? event.dates.map(formatKey).join(', ')
      : `${formatKey(event.from)} – ${formatKey(event.to)}`;
    return `<li class="cal-event cal-event-${event.type}">
      <span class="cal-event-label">${escapeHtmlCal(event.label)}</span>
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
    <div class="cal-popup" role="dialog" aria-modal="true" aria-label="Учебен календар 2026/2027">
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