const params = new URLSearchParams(location.search);
let roomId = (params.get('room') || '').toUpperCase();
let teacherToken = params.get('teacherToken') || '';
const studentKeyStorage = 'classroom-drop-student-key';
let studentKey = localStorage.getItem(studentKeyStorage);
if (!studentKey) {
  studentKey = crypto.randomUUID();
  localStorage.setItem(studentKeyStorage, studentKey);
}
const startView = document.getElementById('start-view');
const roomView = document.getElementById('room-view');
const statusEl = document.getElementById('status');

function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatSize(bytes) { return `${Math.max(1, Math.round(bytes / 1024))} KB`; }
function formatDate(value) { return new Date(value).toLocaleString('bg-BG'); }
function setStatus(message, error = false) { statusEl.textContent = message; statusEl.style.color = error ? '#b91c1c' : ''; }
function fileList(files, canDownload = true) {
  if (!files?.length) return '<p class="muted">Все още няма файлове.</p>';
  return `<div class="file-list">${files.map(file => `<div class="file"><div class="file-info"><div class="file-name">${esc(file.studentName ? `${file.studentName} - ${file.name}` : file.name)}</div><div class="file-meta">${formatSize(file.size)} · ${formatDate(file.uploadedAt)}${file.status ? ` · ${esc(file.status)}` : ''}</div>${file.comment ? `<div class="file-meta">Коментар: ${esc(file.comment)}</div>` : ''}</div>${canDownload ? `<a class="button secondary" href="/api/classroom/files/${encodeURIComponent(file.id)}">Свали</a>` : ''}</div>`).join('')}</div>`;
}
function roomLink(id) { return `${location.origin}${location.pathname}?room=${encodeURIComponent(id)}`; }
function qrLink(id) { return `../qr_code/qr_code.html?text=${encodeURIComponent(roomLink(id))}`; }
function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const input = document.createElement('textarea'); input.value = value; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); return Promise.resolve();
}

async function api(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

function uploadControl(action, label, accept = '', adjacentAction = '') {
  return `<div class="upload-control" data-action="${action}"><label class="drop-zone">${label}<input type="file" name="file" ${accept ? `accept="${accept}"` : ''} hidden required></label><div class="upload-actions"><button class="primary" type="button">Качи файл</button>${adjacentAction}</div></div>`;
}

function renderRoom(room, isTeacher) {
  startView.classList.add('hidden'); roomView.classList.remove('hidden');
  roomView.innerHTML = `<div class="room-head"><div><p class="eyebrow">${isTeacher ? 'Учителска стая' : `Стая <span class="student-room-badge">${esc(room.id)}</span>`}</p><h2>${esc(room.title)}</h2><p class="muted">${esc(room.instructions || 'Няма допълнителни инструкции.')}</p></div>${isTeacher ? `<div class="room-code"><small>КОД НА СТАЯТА</small><strong>${esc(room.id)}</strong></div>` : ''}</div>
    ${isTeacher ? `<div class="share-box"><label>Ученически линк<div class="student-link-row"><input id="student-link" readonly value="${esc(roomLink(room.id))}"><button class="icon-button" id="copy-student-link" type="button" title="Копирай ученическия линк" aria-label="Копирай ученическия линк"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.75A2.75 2.75 0 0 1 10.75 6h6.5A2.75 2.75 0 0 1 20 8.75v8.5A2.75 2.75 0 0 1 17.25 20h-6.5A2.75 2.75 0 0 1 8 17.25z"/><path d="M16 6V4.75A2.75 2.75 0 0 0 13.25 2h-6.5A2.75 2.75 0 0 0 4 4.75v8.5A2.75 2.75 0 0 0 6.75 16H8"/></svg></button></div></label><div class="actions"><a class="button secondary" href="${qrLink(room.id)}" target="_blank" rel="noopener">Отвори QR генератора</a><a class="button secondary" href="${esc(roomLink(room.id))}" target="_blank" rel="noopener">Отвори ученическия изглед</a></div></div>` : ''}
    ${isTeacher ? uploadControl('materials', 'Избери или пусни ресурсен файл', '', `<a class="button success" href="/api/classroom/rooms/${encodeURIComponent(room.id)}/submissions.zip?teacherToken=${encodeURIComponent(teacherToken)}">Свали всички задания</a>`) : `<div id="submission-form"><label>Име и номер в класа<input id="student-name" maxlength="80" required placeholder="Напр. Иван Петров, 12"></label><label class="comment-field">Коментар към предаването<textarea id="submission-comment" maxlength="2000" rows="3" placeholder="Добави кратък коментар за работата"></textarea></label>${uploadControl('submission', 'Избери или пусни готовото задание')}</div>`}
    <div class="columns"><section class="subpanel"><h3>Материали за сваляне</h3><div id="materials">${fileList(room.materials)}</div></section>${isTeacher ? `<section class="subpanel"><h3>Предадени задания</h3><div id="submissions">${fileList(room.submissions)}</div></section>` : `<section class="subpanel"><h3>Моите предадени задания</h3><div id="submissions">${fileList(room.submissions || [])}</div></section>`}</div>`;
  roomView.querySelectorAll('.upload-control').forEach(control => bindUpload(control, room, isTeacher));
  const copyStudentLink = document.getElementById('copy-student-link');
  if (copyStudentLink) copyStudentLink.addEventListener('click', async () => { await copyText(roomLink(room.id)); setStatus('Ученическият линк е копиран.'); });
}

function bindUpload(form, room, isTeacher) {
  const zone = form.querySelector('.drop-zone'); const input = form.querySelector('input[type=file]'); const submit = form.querySelector('button');
  submit.addEventListener('click', () => {
    if (!input.files[0]) {
      input.click();
      return;
    }
    uploadFile();
  });
  input.addEventListener('change', () => {
    if (input.files[0]) {
      zone.childNodes[0].textContent = `Избран файл: ${input.files[0].name}`;
      submit.textContent = isTeacher ? 'Качи файла' : 'Предай';
    }
  });
  ['dragenter','dragover'].forEach(event => zone.addEventListener(event, e => { e.preventDefault(); zone.classList.add('is-over'); }));
  ['dragleave','drop'].forEach(event => zone.addEventListener(event, e => { e.preventDefault(); zone.classList.remove('is-over'); }));
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('drop', e => { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); });
  async function uploadFile() {
    const file = input.files[0];
    const body = new FormData(); body.append('file', file); if (isTeacher) body.append('teacherToken', teacherToken); else { body.append('studentName', document.getElementById('student-name').value); body.append('studentKey', studentKey); body.append('comment', document.getElementById('submission-comment').value); }
    try { setStatus('Качване...'); await api(`/api/classroom/rooms/${encodeURIComponent(room.id)}/${isTeacher ? 'materials' : 'submissions'}`, { method:'POST', body }); setStatus('Файлът е качен.'); await loadRoom(); } catch (error) { setStatus(error.message, true); }
  }
}

async function loadRoom() {
  try { const query = new URLSearchParams(); if (teacherToken) query.set('teacherToken', teacherToken); else query.set('studentKey', studentKey); const data = await api(`/api/classroom/rooms/${encodeURIComponent(roomId)}?${query}`); renderRoom(data, data.isTeacher); } catch (error) { startView.classList.add('hidden'); roomView.classList.remove('hidden'); roomView.innerHTML = `<h2>Стаята не е достъпна</h2><p class="notice">${esc(error.message)}</p>`; }
}

document.getElementById('create-form').addEventListener('submit', async event => { event.preventDefault(); try {
  setStatus('Създаване на стая...'); const data = await api('/api/classroom/rooms', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ title:document.getElementById('room-title').value, instructions:document.getElementById('room-instructions').value }) });
  roomId = data.id; teacherToken = data.teacherToken; history.replaceState({}, '', `${location.pathname}?room=${roomId}&teacherToken=${encodeURIComponent(teacherToken)}`); setStatus(''); renderRoom(data, true);
} catch (error) { setStatus(error.message, true); } });

if (roomId) loadRoom();