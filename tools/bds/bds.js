/* tools/bds/bds.js — инструментът "БДС Клавиатура".
   Тренировка за научаване на клавиатурната подредба БДС 5237:1978.
   Визуалът на клавиатурата (оцветяване по пръсти, анимации) е запазен
   от оригинала в morphemes-main (class=section2). */

/* ============================================================
   БДС 5237:1978 подредба (Bulgarian Typewriter).
   Всеки клавиш: код (event.code), символ без SHIFT, символ със SHIFT.
   ============================================================ */
const BDS_ROWS = [
    [ // ред с цифри
        { id: 'Digit1', base: '1', shift: '!' }, { id: 'Digit2', base: '2', shift: '?' },
        { id: 'Digit3', base: '3', shift: '+' }, { id: 'Digit4', base: '4', shift: '"' },
        { id: 'Digit5', base: '5', shift: '%' }, { id: 'Digit6', base: '6', shift: '=' },
        { id: 'Digit7', base: '7', shift: ':' }, { id: 'Digit8', base: '8', shift: '/' },
        { id: 'Digit9', base: '9', shift: '_' }, { id: 'Digit0', base: '0', shift: '№' },
        { id: 'Minus', base: '-', shift: 'І' }, { id: 'Equal', base: '.', shift: 'Ѵ' }
    ],
    [ // горен буквен ред
        { id: 'KeyQ', base: ',', shift: 'Ы' }, { id: 'KeyW', base: 'у', shift: 'У' },
        { id: 'KeyE', base: 'е', shift: 'Е' }, { id: 'KeyR', base: 'и', shift: 'И' },
        { id: 'KeyT', base: 'ш', shift: 'Ш' }, { id: 'KeyY', base: 'щ', shift: 'Щ' },
        { id: 'KeyU', base: 'к', shift: 'К' }, { id: 'KeyI', base: 'с', shift: 'С' },
        { id: 'KeyO', base: 'д', shift: 'Д' }, { id: 'KeyP', base: 'з', shift: 'З' },
        { id: 'BracketLeft', base: 'ц', shift: 'Ц' }, { id: 'BracketRight', base: ';', shift: '§' }
    ],
    [ // среден буквен ред
        { id: 'KeyA', base: 'ь', shift: 'Ь' }, { id: 'KeyS', base: 'я', shift: 'Я' },
        { id: 'KeyD', base: 'а', shift: 'А' }, { id: 'KeyF', base: 'о', shift: 'О' },
        { id: 'KeyG', base: 'ж', shift: 'Ж' }, { id: 'KeyH', base: 'г', shift: 'Г' },
        { id: 'KeyJ', base: 'т', shift: 'Т' }, { id: 'KeyK', base: 'н', shift: 'Н' },
        { id: 'KeyL', base: 'в', shift: 'В' }, { id: 'Semicolon', base: 'м', shift: 'М' },
        { id: 'Quote', base: 'ч', shift: 'Ч' }
    ],
    [ // долен буквен ред
        { id: 'KeyZ', base: 'ю', shift: 'Ю' }, { id: 'KeyX', base: 'й', shift: 'Й' },
        { id: 'KeyC', base: 'ъ', shift: 'Ъ' }, { id: 'KeyV', base: 'э', shift: 'Э' },
        { id: 'KeyB', base: 'ф', shift: 'Ф' }, { id: 'KeyN', base: 'х', shift: 'Х' },
        { id: 'KeyM', base: 'п', shift: 'П' }, { id: 'Comma', base: 'р', shift: 'Р' },
        { id: 'Period', base: 'л', shift: 'Л' }, { id: 'Slash', base: 'б', shift: 'Б' }
    ]
];

/* Оцветяване по пръсти (както в оригинала) — по колона на физическия клавиш. */
const FINGERS = {
    0: ['Digit1', 'KeyQ', 'KeyA', 'KeyZ'],
    1: ['Digit2', 'KeyW', 'KeyS', 'KeyX'],
    2: ['Digit3', 'KeyE', 'KeyD', 'KeyC'],
    3: ['Digit4', 'KeyR', 'KeyF', 'KeyV'],
    4: ['Digit5', 'Digit6', 'KeyT', 'KeyY', 'KeyG', 'KeyH', 'KeyB', 'KeyN'],
    5: ['Digit7', 'KeyU', 'KeyJ', 'KeyM'],
    6: ['Digit8', 'KeyI', 'KeyK', 'Comma'],
    7: ['Digit9', 'KeyO', 'KeyL', 'Period'],
    8: ['Digit0', 'Minus', 'Equal', 'KeyP', 'BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Slash']
};
const FINGER_CLASS = {
    0: 'pinky', 1: 'ring', 2: 'middle', 3: 'pointer1st', 4: 'pointer2nd',
    5: 'pointer1st', 6: 'middle', 7: 'ring', 8: 'pinky'
};
function fingerOf(id) {
    for (const col in FINGERS) if (FINGERS[col].includes(id)) return FINGER_CLASS[col];
    return 'pinky';
}

/* символ → { code, shift } */
const CHAR_MAP = {};
BDS_ROWS.flat().forEach(k => {
    CHAR_MAP[k.base] = { code: k.id, shift: false };
    CHAR_MAP[k.shift] = { code: k.id, shift: true };
});
CHAR_MAP[' '] = { code: 'Space', shift: false };

/* ============================ рендериране ============================ */

/* изграждане на редовете на клавиатурата (визуалът е от оригинала) */
const keyboardEl = document.getElementById('keyboard');
keyboardEl.innerHTML = '';
const keyEls = {};

function attachKeyEvents(el, id, kObj) {
    el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        pressKeyVisual(id, false);
        setTimeout(() => releaseKeyVisual(id, false), 220);

        if (!targetText || position >= targetText.length) return;
        const isShift = !!(keyEls.ShiftLeft?.classList.contains('active-pressed') || keyEls.ShiftRight?.classList.contains('active-pressed'));
        let char = '';
        if (id === 'Space') {
            char = ' ';
        } else if (kObj) {
            char = isShift ? kObj.shift : kObj.base;
        } else if (id === 'back') {
            processKeyInput('Backspace', 'Backspace', null, false);
            return;
        }
        processKeyInput(id, char, char, isShift);
    });
}

function li(id, cls, label, kObj) {
    const el = document.createElement('li');
    el.id = id;
    el.className = cls;
    el.innerHTML = `<span>${label}</span>`;
    keyEls[id] = el;
    attachKeyEvents(el, id, kObj);
    return el;
}

function buildRow(cls) {
    const ul = document.createElement('ul');
    ul.className = 'row ' + cls;
    return ul;
}

// ред 0: цифри + BACK
const r0 = buildRow('row-0');
BDS_ROWS[0].forEach(k => r0.appendChild(li(k.id, fingerOf(k.id), k.base, k)));
r0.appendChild(li('back', 'pinky fill-out-key', 'BACK'));
keyboardEl.appendChild(r0);

// ред 1: TAB + горен буквен ред
const r1 = buildRow('row-1');
r1.appendChild(li('tab', 'pinky fill-out-key', 'TAB'));
BDS_ROWS[1].forEach(k => r1.appendChild(li(k.id, fingerOf(k.id), k.base.toUpperCase(), k)));
keyboardEl.appendChild(r1);

// ред 2: CAPS + среден буквен ред + ENTER
const r2 = buildRow('row-2');
r2.appendChild(li('caps', 'pinky fill-out-key', 'CAPS'));
BDS_ROWS[2].forEach(k => r2.appendChild(li(k.id, fingerOf(k.id), k.base.toUpperCase(), k)));
r2.appendChild(li('enter', 'pinky fill-out-key', 'ENT'));
keyboardEl.appendChild(r2);

// ред 3: SHIFT + долен буквен ред + SHIFT
const r3 = buildRow('row-3');
r3.appendChild(li('ShiftLeft', 'pinky', 'SHIFT'));
BDS_ROWS[3].forEach(k => r3.appendChild(li(k.id, fingerOf(k.id), k.base.toUpperCase(), k)));
r3.appendChild(li('ShiftRight', 'pinky', 'SHIFT'));
keyboardEl.appendChild(r3);

// ред 4: SPACE
const r4 = buildRow('row-4');
r4.appendChild(li('Space', 'pinky', 'SPACE'));
keyboardEl.appendChild(r4);

/* ============================ тренировка ============================ */
const storyParagraph = document.getElementById('storyParagraph');
const storyTextArea = document.getElementById('storyTextArea');
const bookSelect = document.getElementById('bookSelect');
const statProgress = document.getElementById('statProgress');
const statWrong = document.getElementById('statWrong');
const statAccuracy = document.getElementById('statAccuracy');

const BUILTIN_BOOKS = [
    {
        title: "Иван Вазов — Под игото",
        file: "builtin-1",
        chapters: [
            "Тая прохладна майска вечер чорбаджи Марко вечеряше с челядта си на двора. Господарят на къщата беше около петдесетгодишен мъж, с черно строго лице и с живи очи.",
            "Той обичаше реда и трудолюбието. Децата слушаха всяка негова дума със страхопочитание и уважение. На трапезата цареше мир и сговор."
        ]
    },
    {
        title: "Антоан дьо Сент-Екзюпери — Малкият принц",
        file: "builtin-2",
        chapters: [
            "Всички възрастни хора са били най-напред деца, но малцина от тях си спомнят това. Истински се вижда само със сърцето. Същественото е невидимо за очите.",
            "Ако някой обича едно цвете, което съществува само в един екземпляр сред милиони и милиони звезди, това му стига, за да бъде щастлив, когато ги гледа."
        ]
    },
    {
        title: "Астрид Линдгрен — Пипи Дългото чорапче",
        file: "builtin-3",
        chapters: [
            "В края на малкото градинско градче имаше една запустяла градина. В градината стоеше една стара къща, а в къщата живееше Пипи Дългото чорапче с маймунката си.",
            "Пипи беше най-силното момиче на света. Тя можеше да вдигне цял кон на ръце, ако пожелае, и никой не можеше да я уплаши."
        ]
    }
];

let targetText = '';   // текст, който се преписва
let position = 0;      // докъде сме стигнали
let wrongCharacters = 0;
let totalKeystrokes = 0;
let books = [...BUILTIN_BOOKS]; // стартира с вградените книги за мигновен старт
let hasMistake = false;

// Създаване на речник за бързо търсене код -> БДС знаци
const CODE_TO_BDS = {};
BDS_ROWS.flat().forEach(k => {
    CODE_TO_BDS[k.id] = { base: k.base, shift: k.shift };
});
CODE_TO_BDS['Space'] = { base: ' ', shift: ' ' };

function clearSelection() {
    document.querySelectorAll('.keyboard .selected').forEach(el => el.classList.remove('selected'));
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTarget() {
    if (!targetText) {
        storyParagraph.textContent = 'Няма зареден текст.';
        return;
    }
    const typed = escapeHtml(targetText.slice(0, position));
    const current = position < targetText.length ? escapeHtml(targetText[position]) : '';
    const remaining = position + 1 < targetText.length ? escapeHtml(targetText.slice(position + 1)) : '';

    const currentHtml = current === ' '
        ? `<span class="current-char space-char" title="Интервал (Space)">␣</span>`
        : (current ? `<span class="current-char">${current}</span>` : '');

    storyParagraph.innerHTML =
        `<span class="typed-text">${typed}</span>${currentHtml}<span class="remaining-text">${remaining}</span>`;
}

function updateStats() {
    const total = targetText.length || 1;
    statProgress.textContent = Math.round((position / total) * 100) + '%';
    statWrong.textContent = wrongCharacters;
    statAccuracy.textContent = totalKeystrokes
        ? Math.max(0, Math.round(100 - (wrongCharacters / totalKeystrokes) * 100)) + '%'
        : '100%';
}

/* анимира следващия пореден символ (при главна буква — и двата SHIFT) */
function showNextKey() {
    clearSelection();
    if (position >= targetText.length) return;
    const ch = targetText[position];
    const map = CHAR_MAP[ch] || CHAR_MAP[ch.toLowerCase()];
    if (!map) return;

    const el = keyEls[map.code];
    if (el) {
        el.classList.add('selected');
        el.classList.add('hit');
        el.addEventListener('animationend', () => el.classList.remove('hit'), { once: true });
    }
    if (map.shift) {
        keyEls.ShiftLeft?.classList.add('selected');
        keyEls.ShiftRight?.classList.add('selected');
    }
}

function pressKeyVisual(code, isShift) {
    const pressed = keyEls[code];
    if (pressed) {
        pressed.classList.add('hit');
        pressed.classList.add('active-pressed');
        setTimeout(() => pressed.classList.remove('hit'), 220);
    }
    if (isShift || code === 'ShiftLeft' || code === 'ShiftRight') {
        keyEls.ShiftLeft?.classList.add('active-pressed');
        keyEls.ShiftRight?.classList.add('active-pressed');
    }
}

function releaseKeyVisual(code, isShift) {
    const released = keyEls[code];
    if (released) {
        released.classList.remove('active-pressed');
    }
    if (!isShift && code !== 'ShiftLeft' && code !== 'ShiftRight') {
        keyEls.ShiftLeft?.classList.remove('active-pressed');
        keyEls.ShiftRight?.classList.remove('active-pressed');
    }
}

/* глобална обработка на въвеждането */
function processKeyInput(code, key, explicitChar, isShift) {
    if (!targetText || position >= targetText.length) return;
    if (['Shift', 'Control', 'Alt', 'CapsLock', 'Meta', 'ContextMenu'].includes(key)) return;

    // Backspace — връщане с един символ назад
    if (key === 'Backspace' || code === 'Backspace') {
        if (position > 0) {
            position--;
            storyTextArea.value = targetText.slice(0, position);
            renderTarget();
            updateStats();
            showNextKey();
        }
        return;
    }

    if (key === 'Tab' || (typeof key === 'string' && key.startsWith('Arrow'))) {
        return;
    }

    const expected = targetText[position];
    const map = CHAR_MAP[expected] || CHAR_MAP[expected.toLowerCase()];

    // Ако очакваният символ не е в БДС подредбата (редки символи), преминава напред
    if (!map) {
        position++;
        storyTextArea.value = targetText.slice(0, position);
        renderTarget();
        updateStats();
        showNextKey();
        return;
    }

    totalKeystrokes++;

    // Определяне на въведения знак:
    // 1) Явно предаден знак от екранния клавиш
    // 2) ИЛИ съответствието от физическия клавиш спрямо БДС (CODE_TO_BDS)
    // 3) ИЛИ въведения знак от системната клавиатура
    const bdsChar = CODE_TO_BDS[code] ? (isShift ? CODE_TO_BDS[code].shift : CODE_TO_BDS[code].base) : null;
    const candidate = explicitChar || bdsChar || key;

    const codeMatch = map && (code === map.code && !isShift === !map.shift);
    const charMatch = (candidate === expected) || (key === expected) || (bdsChar === expected);

    if (codeMatch || charMatch) {
        position++;
        storyTextArea.value = targetText.slice(0, position);
        storyTextArea.scrollTop = storyTextArea.scrollHeight;
    } else {
        wrongCharacters++;
        const wrongEl = keyEls[code] || keyEls[CHAR_MAP[candidate]?.code];
        if (wrongEl) {
            wrongEl.classList.add('wrong-press');
            setTimeout(() => wrongEl.classList.remove('wrong-press'), 300);
        }
    }

    renderTarget();
    updateStats();

    if (position >= targetText.length) {
        clearSelection();
        storyTextArea.value = targetText +
            `\n\n🎉 Браво! Откъсът е преписан успешно!\nГрешки: ${wrongCharacters} от ${totalKeystrokes} натискания.\nТочност: ${statAccuracy.textContent}.`;
        storyTextArea.scrollTop = storyTextArea.scrollHeight;
        return;
    }
    showNextKey();
}

/* Слушане за натиснати клавиши — както в текстовото поле, така и на ниво прозорец */
window.addEventListener('keydown', (event) => {
    // Ако фокусът е върху падащото меню с книги, не прехващаме
    if (event.target === bookSelect) return;

    // Визуална реакция на клавиша винаги:
    pressKeyVisual(event.code, event.shiftKey);

    // Предотвратяваме стандартния скрол/въвеждане, за да гарантираме точно въвеждане в текстовото поле
    if (typeof event.preventDefault === 'function') event.preventDefault();

    processKeyInput(event.code, event.key, null, event.shiftKey);
});

window.addEventListener('keyup', (event) => {
    releaseKeyVisual(event.code, event.shiftKey);
});

storyTextArea.addEventListener('keydown', (event) => {
    // Вече се обработва от window listener-а
    event.stopPropagation();
    pressKeyVisual(event.code, event.shiftKey);
    if (typeof event.preventDefault === 'function') event.preventDefault();
    processKeyInput(event.code, event.key, null, event.shiftKey);
});

/* ============================ epub книги ============================ */

/* зарежда произволна глава от избраната книга като упражнение */
function loadRandomChapter() {
    const book = books.find(b => b.file === bookSelect.value) || books[0];
    if (!book || !book.chapters || !book.chapters.length) {
        targetText = '';
        renderTarget();
        updateStats();
        return;
    }
    const chapter = book.chapters[Math.floor(Math.random() * book.chapters.length)];
    const sentences = chapter.match(/[^.!?…]+[.!?…]*\s*/g) || [chapter];
    const start = Math.floor(Math.random() * sentences.length);
    let text = sentences.slice(start).join(' ').replace(/\s+/g, ' ').trim();
    if (text.length > 280) text = text.slice(0, 280);
    targetText = text;
    position = 0;
    wrongCharacters = 0;
    totalKeystrokes = 0;
    storyTextArea.value = '';
    renderTarget();
    updateStats();
    showNextKey();
    storyTextArea.focus();
}

/* чете epub (zip) -> container.xml -> OPF -> spine -> текст на главите */
async function readBook(book) {
    if (book.chapters) return;
    book.chapters = [];
    try {
        if (typeof JSZip === 'undefined') throw new Error('JSZip не е зареден (няма интернет връзка).');
        const res = await fetch(book.file);
        if (!res.ok) throw new Error(`Книгата "${book.file}" не е намерена.`);
        const zip = await JSZip.loadAsync(await res.arrayBuffer());

        const containerXml = await zip.file('META-INF/container.xml').async('string');
        const opfPath = new DOMParser().parseFromString(containerXml, 'application/xml')
            .querySelector('rootfile').getAttribute('full-path');
        const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';
        const opf = new DOMParser().parseFromString(await zip.file(opfPath).async('string'), 'application/xml');

        const manifest = {};
        opf.querySelectorAll('manifest > item').forEach(item => {
            manifest[item.getAttribute('id')] = item.getAttribute('href');
        });
        const chapterFiles = [];
        opf.querySelectorAll('spine > itemref').forEach(ref => {
            const href = manifest[ref.getAttribute('idref')];
            if (href) chapterFiles.push(opfDir + decodeURIComponent(href));
        });

        for (const path of chapterFiles) {
            const file = zip.file(path) || zip.file(path.replace(/^\//, ''));
            if (!file) continue;
            const html = await file.async('string');
            const doc = new DOMParser().parseFromString(html, 'application/xhtml+xml');
            const text = (doc.body ? doc.body.textContent : doc.textContent).replace(/\s+/g, ' ').trim();
            if (text.length > 200) book.chapters.push(text);
        }
    } catch (err) {
        console.error('Грешка при четене на книгата:', err);
    }
}

function populateBookSelect() {
    bookSelect.innerHTML = '';
    books.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.file;
        opt.textContent = b.title;
        bookSelect.appendChild(opt);
    });
}

async function loadBooks() {
    // 1. Моментално стартиране с вградените класически текстове
    populateBookSelect();
    loadRandomChapter();

    // 2. Асинхронно добавяне на външните книги от books.json, ако са налични
    try {
        const res = await fetch('/tools/bds/books/books.json');
        if (res.ok) {
            const external = await res.json();
            books = [...BUILTIN_BOOKS, ...external];
            const currentVal = bookSelect.value;
            populateBookSelect();
            if (currentVal) bookSelect.value = currentVal;
        }
    } catch (err) {
        // Вградените книги вече работят отлично
    }
}

bookSelect.addEventListener('change', async () => {
    const book = books.find(b => b.file === bookSelect.value);
    if (!book) return;
    if (!book.chapters || !book.chapters.length) {
        storyParagraph.textContent = 'Зареждане…';
        await readBook(book);
    }
    loadRandomChapter();
});
document.getElementById('newChapterBtn').addEventListener('click', loadRandomChapter);

loadBooks();
