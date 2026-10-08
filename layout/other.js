// Tutorials and practical projects catalog

import * as NftPopup from './nft-popup.js';

let liveGenerator = null;
let activeChartInstance = null;
let currentDemoNftId = null;

function esc(v) {
  return String(v || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

// Main view entry point
export function renderOtherPage(subRoute) {
  if (subRoute === 'nft-generator') {
    return renderNftTutorial();
  }
  if (subRoute === 'charts' || subRoute === 'graph-js') {
    return renderChartsTutorial();
  }
  if (subRoute === 'firestore-collections' || subRoute === 'firestore-classroom') {
    return renderFirestoreCollectionsTutorial();
  }
  return renderCardsCatalog();
}

export async function initOtherPage(subRoute) {
  // Enable code snippet copy buttons
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.innerText).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Копирано!';
        setTimeout(() => { btn.innerText = originalText; }, 1800);
      });
    });
  });

  if (subRoute === 'nft-generator') {
    initNftTutorialDemo();
  } else if (subRoute === 'charts' || subRoute === 'graph-js') {
    initChartsTutorialDemo();
  } else if (subRoute === 'firestore-collections' || subRoute === 'firestore-classroom') {
    initFirestoreCollectionsDemo();
  }
}

// =============================================================
// Catalog cards view
// =============================================================
function renderCardsCatalog() {
  return `
    <div class="other-catalog-container">
      <div class="other-cards-grid">
        <!-- КАРТА 1: NFT ГЕНЕРАТОР (с avatar.png за фон) -->
        <a href="#/blog/nft-generator" class="other-card nft-card" id="cardNftGenerator">
          <div class="other-card-content">
            <div class="other-card-badge-row">
              <span class="other-card-badge orange">
                <i class="fa-solid fa-cube"></i> Canvas &amp; Алгоритми
              </span>
              <span class="other-card-time">
                <i class="fa-regular fa-clock"></i> ~15 мин
              </span>
            </div>

            <div class="other-card-body">
              <h2 class="other-card-title">Създаване на генератор на NFT</h2>
              <p class="other-card-desc">
                Генератор на уникални пиксел-арт образи с HTML5 Canvas, PNG слоеве и различна рядкост на чертите.
              </p>
            </div>

            <div class="other-card-footer">
              <span class="other-card-cta">
                Прочети <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </a>

        <!-- КАРТА 2: ДИАГРАМИ С GRAPH.JS -->
        <a href="#/blog/charts" class="other-card charts-card" id="cardCharts">
          <div class="other-card-content">
            <div class="other-card-badge-row">
              <span class="other-card-badge blue">
                <i class="fa-solid fa-chart-line"></i> Визуализация на данни
              </span>
              <span class="other-card-time">
                <i class="fa-regular fa-clock"></i> ~18 мин
              </span>
            </div>

            <div class="other-card-body">
              <h2 class="other-card-title">Видове диаграми с Graph.js</h2>
              <p class="other-card-desc">
                Създаване на диаграми с Graph.js - линейни, стълбовидни, кръгови и радарни графики.
              </p>
            </div>

            <div class="other-card-footer">
              <span class="other-card-cta">
                Прочети <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </a>

        <!-- КАРТА 3: FIRESTORE КОЛЕКЦИИ -->
        <a href="#/blog/firestore-collections" class="other-card firestore-card" id="cardFirestoreClassroom">
          <div class="other-card-content">
            <div class="other-card-badge-row">
              <span class="other-card-badge green">
                <i class="fa-solid fa-database"></i> Firebase &amp; Firestore
              </span>
              <span class="other-card-time">
                <i class="fa-regular fa-clock"></i> ~25 мин
              </span>
            </div>

            <div class="other-card-body">
              <h2 class="other-card-title">Firestore колекции</h2>
              <p class="other-card-desc">
                Съхраняване на данни в колекции и документи в Cloud Firestore и извличане на записи със заявки.
              </p>
            </div>

            <div class="other-card-footer">
              <span class="other-card-cta">
                Прочети <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  `;
}

// =============================================================
// Firestore collections article
// =============================================================
function renderFirestoreCollectionsTutorial() {
  return `
    <div class="tutorial-view-container firestore-article">
      <div class="tutorial-top-bar">
        <a href="#/blog" class="tutorial-back-btn">
          <i class="fa-solid fa-arrow-left"></i> Обратно
        </a>
      </div>

      <header class="tut-header theme-firestore">
        <div class="tut-header-inner">
          <div class="tut-header-logo">
            <i class="fa-solid fa-database"></i>
          </div>
          <div>
            <div class="tut-header-meta">FIREBASE // CLOUD FIRESTORE</div>
            <h1>Firestore колекции</h1>
            <p>
              Как се съхраняват данни в Cloud Firestore и как приложението чете, записва и търси документи.
            </p>
            <div class="tut-header-nav">
              <a href="#tut-firestore-intro" class="tut-header-pill">1. Firebase и Firestore</a>
              <a href="#tut-firestore-model" class="tut-header-pill">2. Колекции и документи</a>
              <a href="#tut-firestore-queries" class="tut-header-pill">3. Запис и заявки</a>
              <a href="#tut-firestore-access" class="tut-header-pill">4. Достъп до данните</a>
            </div>
          </div>
        </div>
      </header>

      <main class="tut-main">
        <section class="tut-section firestore-section" id="tut-firestore-intro">
          <div class="sh"><span class="sh-badge bg-orange">01</span><h2>Какво са Firebase и Firestore?</h2><span class="line"></span></div>
          <p><strong>Firebase</strong> е платформа на Google с услуги за разработване на приложения. Една от тези услуги е <strong>Cloud Firestore</strong> - облачна база данни, в която приложението може да съхранява информация и да прави заявки към нея.</p>
          <p>Например каталог с книги може да запазва заглавие, автор и жанр за всяка книга. После може да извлече всички книги или само тези от определен жанр. Данните са достъпни за приложението чрез Firebase SDK, а правилата за сигурност определят кой има право да ги чете или променя.</p>
          <div class="callout-highlight-box"><span>Firestore съхранява структурирани данни като текст, числа и полета в документи. За самите изображения и други големи файлове се използва отделна услуга, например Cloud Storage for Firebase, а в документа може да се пази препратка към файла.</span></div>
        </section>

        <div class="overview">
          <div class="ov-card"><div class="icon">🗂️</div><h3>Колекция</h3><p>Група от документи, например <code>books</code>.</p></div>
          <div class="ov-card"><div class="icon">📄</div><h3>Документ</h3><p>Запис с уникален ID и полета, например <code>books/book-1</code>.</p></div>
          <div class="ov-card"><div class="icon">💾</div><h3>Запис</h3><p>Добавяне или промяна на полета в документ.</p></div>
          <div class="ov-card"><div class="icon">🔎</div><h3>Заявка</h3><p>Извличане на документи по зададено условие.</p></div>
        </div>

        <div class="live-sandbox-block firestore-demo" id="tut-firestore-demo">
          <div class="sandbox-header">
            <div class="sandbox-title"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i> Проследи операцията</div>
            <div class="sandbox-tabs" role="group" aria-label="Избери операция с Firestore">
              <button type="button" class="sandbox-tab-btn active" data-firestore-flow="write" aria-pressed="true">Запис</button>
              <button type="button" class="sandbox-tab-btn" data-firestore-flow="read" aria-pressed="false">Четене</button>
              <button type="button" class="sandbox-tab-btn" data-firestore-flow="query" aria-pressed="false">Заявка</button>
            </div>
          </div>
          <p class="firestore-demo-intro">Избери операция и щракни върху стъпка, за да видиш как се използват колекцията и документите. Примерът е локален и не изпраща данни към Firebase.</p>
          <div class="firestore-demo-grid">
            <ol class="firestore-demo-steps" id="firestoreDemoSteps" aria-label="Стъпки на избрания поток"></ol>
            <div class="firestore-demo-detail" aria-live="polite">
              <div class="firestore-demo-path" id="firestoreDemoPath"></div>
              <p id="firestoreDemoExplanation"></p>
              <div class="code-wrap">
                <div class="code-bar"><div class="code-bar-left"><div class="code-dots"><div class="code-dot d-r"></div><div class="code-dot d-y"></div><div class="code-dot d-g"></div></div><span class="code-fname">Пример с Firebase Web SDK</span></div><button type="button" class="code-copy-btn" data-target="firestoreDemoCode">Копирай</button></div>
                <pre class="code-body" id="firestoreDemoCode"></pre>
              </div>
            </div>
          </div>
        </div>

        <section class="tut-section firestore-section" id="tut-firestore-model">
          <div class="sh"><span class="sh-badge bg-orange">02</span><h2>Колекции, документи и полета</h2><span class="line"></span></div>
          <p>Cloud Firestore е документна NoSQL база данни. Колекцията събира документи по тема. Всеки документ има уникален ID в своята колекция и полета със стойности. Например колекция <code>books</code> съдържа отделен документ за всяка книга.</p>
          <div class="schema-diagram">
            <div class="schema-node schema-root"><strong>Cloud Firestore</strong><span>база данни</span></div>
            <div class="schema-arrow">↓</div>
            <div class="schema-node schema-collection"><strong>books</strong><span>колекция</span></div>
            <div class="schema-arrow">↓</div>
            <div class="schema-node schema-document"><strong>books/book-1</strong><span>документ с ID book-1</span></div>
            <div class="schema-arrow">↓</div>
            <div class="schema-fields"><span>title</span><span>author</span><span>genre</span></div>
          </div>
          <div class="code-wrap">
            <div class="code-bar"><div class="code-bar-left"><div class="code-dots"><div class="code-dot d-r"></div><div class="code-dot d-y"></div><div class="code-dot d-g"></div></div><span class="code-fname">book.json</span></div><button type="button" class="code-copy-btn" data-target="firestorePathCode">Копирай</button></div>
            <pre class="code-body" id="firestorePathCode">{
  "title": "Под игото",
  "author": "Иван Вазов",
  "genre": "Роман"
}</pre>
          </div>
          <div class="callout-highlight-box"><span>Пътят <code>books/book-1</code> означава документ <code>book-1</code> в колекция <code>books</code>. Полетата са вътре в документа, а не в самата колекция.</span></div>
        </section>

        <section class="tut-section firestore-section" id="tut-firestore-queries">
          <div class="sh"><span class="sh-badge bg-firestore-yellow">03</span><h2>Запис, четене и заявки</h2><span class="line"></span></div>
          <p>Firebase Web SDK предоставя функции за работа с Firestore. С <code>setDoc</code> записваме документ с избран ID, с <code>getDoc</code> четем един документ, а с <code>getDocs</code> извличаме резултатите от заявка. Условието <code>where</code> филтрира документите по стойност на поле.</p>
          <div class="code-wrap">
            <div class="code-bar"><div class="code-bar-left"><div class="code-dots"><div class="code-dot d-r"></div><div class="code-dot d-y"></div><div class="code-dot d-g"></div></div><span class="code-fname">firestore-books.js</span></div><button type="button" class="code-copy-btn" data-target="collectionsCode">Копирай</button></div>
            <pre class="code-body" id="collectionsCode">import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// db е вече инициализирана инстанция на Cloud Firestore.
const bookRef = doc(db, 'books', 'book-1');
await setDoc(bookRef, { title: 'Под игото', author: 'Иван Вазов', genre: 'Роман' });

const book = await getDoc(bookRef);
if (book.exists()) console.log(book.data());

const novels = query(collection(db, 'books'), where('genre', '==', 'Роман'));
const results = await getDocs(novels);
results.forEach(result => console.log(result.id, result.data()));</pre>
          </div>
          <p class="tut-note">Примерът показва основните операции, но не изпълнява реална заявка от тази страница. За свързване към база данни са нужни Firebase конфигурация, инициализиран <code>db</code> и подходящи правила за достъп.</p>
        </section>

        <section class="tut-section firestore-section" id="tut-firestore-access">
          <div class="sh"><span class="sh-badge bg-orange">04</span><h2>Кой може да чете и записва?</h2><span class="line"></span></div>
          <p>Приложението може да изпраща заявки към Firestore, но това не означава, че всеки трябва да има достъп до всички документи. <strong>Firestore Security Rules</strong> определят какви операции са разрешени за клиентските приложения. При нужда Firebase Authentication помага да се установи кой е потребителят.</p>
          <div class="callout-highlight-box"><span>Заявка не заобикаля правилата за сигурност. Ако заявката може да върне документи без разрешен достъп, тя се отхвърля, вместо правилата да скрият само част от резултатите.</span></div>
        </section>

        <section class="tut-section firestore-section tut-summary">
          <div class="sh"><span class="sh-badge bg-orange">Обобщение</span><h2>От данни към резултат</h2><span class="line"></span></div>
          <p><strong>Firebase</strong> предоставя услугата <strong>Cloud Firestore</strong>. В нея документите се групират в колекции. Приложението може да записва и чете документи, както и да извлича подходящите записи със заявки. Достъпът се управлява с правила за сигурност.</p>
        </section>
      </main>
    </div>
  `;
}

// Static examples for the article; no credentials or network requests.
const firestoreFlows = {
  write: [
    { title: 'Избор на документ', path: 'books/book-1', explanation: 'Посочваме колекция books и ID на документа book-1.', code: "const bookRef = doc(db, 'books', 'book-1');" },
    { title: 'Запис на полета', path: 'books/book-1', explanation: 'setDoc записва полетата на документа. Ако документ с този ID вече съществува, посочените данни го заместват.', code: "await setDoc(bookRef, { title: 'Под игото', author: 'Иван Вазов', genre: 'Роман' });" }
  ],
  read: [
    { title: 'Адрес на документа', path: 'books/book-1', explanation: 'ID позволява директно да се посочи точно един документ.', code: "const bookRef = doc(db, 'books', 'book-1');" },
    { title: 'Прочитане', path: 'books/book-1', explanation: 'getDoc връща снимка на документа. Проверяваме дали той съществува, преди да използваме полетата му.', code: "const book = await getDoc(bookRef);\nif (book.exists()) console.log(book.data());" }
  ],
  query: [
    { title: 'Избор на колекция', path: 'books', explanation: 'Заявката започва от колекцията, в която търсим книги.', code: "const booksRef = collection(db, 'books');" },
    { title: 'Условие по поле', path: 'books / genre == Роман', explanation: 'where ограничава резултатите до документи, при които полето genre има стойност Роман.', code: "const novels = query(booksRef, where('genre', '==', 'Роман'));" },
    { title: 'Получаване на резултати', path: 'books / резултати', explanation: 'getDocs връща документите, които отговарят на условието и до които приложението има достъп.', code: "const results = await getDocs(novels);\nresults.forEach(book => console.log(book.id, book.data()));" }
  ]
};

function initFirestoreCollectionsDemo() {
  const root = document.getElementById('tut-firestore-demo');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-firestore-flow]')];
  const steps = root.querySelector('#firestoreDemoSteps');
  const path = root.querySelector('#firestoreDemoPath');
  const explanation = root.querySelector('#firestoreDemoExplanation');
  const code = root.querySelector('#firestoreDemoCode');
  let flow = 'write';
  let index = 0;

  function render() {
    const current = firestoreFlows[flow];
    tabs.forEach(tab => {
      const selected = tab.dataset.firestoreFlow === flow;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    steps.innerHTML = current.map((step, i) => `<li><button type="button" class="firestore-demo-step${i === index ? ' active' : ''}" data-step="${i}" aria-current="${i === index ? 'step' : 'false'}"><span>${i + 1}</span>${esc(step.title)}</button></li>`).join('');
    const selected = current[index];
    path.textContent = selected.path;
    explanation.textContent = selected.explanation;
    code.textContent = selected.code;
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    flow = tab.dataset.firestoreFlow;
    index = 0;
    render();
  }));
  steps.addEventListener('click', event => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    index = Number(button.dataset.step);
    render();
  });
  render();
}

// =============================================================
// NFT generator tutorial view
// =============================================================
function renderNftTutorial() {
  return `
    <div class="tutorial-view-container">
      <div class="tutorial-top-bar">
        <a href="#/blog" class="tutorial-back-btn">
          <i class="fa-solid fa-arrow-left"></i> Обратно
        </a>
      </div>

      <!-- ХЕДЪР В СТИЛ MartinByalov/python - РАЗДЕЛЕН НА ДВЕ СЕКЦИИ -->
      <header class="tut-header tut-header-split">
        <div class="tut-header-inner">
          <div class="tut-header-left">
            <img src="https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/avatar.png" alt="Stonks Avatar" class="tut-header-avatar-large" />
          </div>
          <div class="tut-header-right">
            <div class="tut-header-meta">TUTORIAL // JAVASCRIPT &amp; HTML5 CANVAS // THE STONKS</div>
            <h1>Създаване на генератор на NFT колекция</h1>
            <p>
              Изграждане на браузърен и Node.js генератор за гарантирано уникални пиксел-арт персонажи чрез композиция на прозрачни PNG слоеве, математика на редкостта (Rarity) и Canvas API без външни библиотеки.
            </p>
            <div class="tut-header-nav">
              <a href="#tut-layers" class="tut-header-pill">1. Архитектура на слоевете</a>
              <a href="#tut-rarity" class="tut-header-pill">2. Математика на редкостта</a>
              <a href="#tut-uniqueness" class="tut-header-pill">3. Уникалност и Seed</a>
              <a href="#tut-canvas" class="tut-header-pill">4. Рендериране с Canvas</a>
            </div>
          </div>
        </div>
      </header>

      <main class="tut-main">
        <!-- ОБЩ ПРЕГЛЕД (OVERVIEW CARDS) -->
        <div class="overview">
          <div class="ov-card">
            <div class="icon">🎨</div>
            <h3>8 PNG Слоя</h3>
            <p>Фиксиран Z-индекс ред на наслагване върху 24×24 пикселова мрежа.</p>
          </div>
          <div class="ov-card">
            <div class="icon">🎲</div>
            <h3>Претеглен избор</h3>
            <p>Тегла на вероятност за всяка черта (напр. Златна свещ = 5.88%).</p>
          </div>
          <div class="ov-card">
            <div class="icon">🔒</div>
            <h3>Уникален Seed</h3>
            <p>Детерминиран псевдослучаен генератор предотвратява дубликати.</p>
          </div>
          <div class="ov-card">
            <div class="icon">🖼️</div>
            <h3>Canvas 2D API</h3>
            <p>Чист JavaScript без зависимост от тежки графични рамки.</p>
          </div>
        </div>

        <!-- ИНТЕРАКТИВНА СИМУЛАЦИЯ НА ЖИВО -->
        <div class="live-sandbox-block" id="tut-demo">
          <div class="sandbox-header">
            <div class="sandbox-title">
              <i class="fa-solid fa-dice" style="color: #f17a3e;"></i>
              Генератор в реално време
            </div>
            <div class="sandbox-actions" style="margin: 0;">
              <button type="button" class="btn-sandbox primary" id="tutRollBtn">
                <i class="fa-solid fa-dice"></i> Генерирай
              </button>
              <button type="button" class="btn-sandbox secondary" id="tutModalBtn" title="Отвори в цял прозорец" aria-label="Отвори в цял прозорец">
                <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
              </button>
            </div>
          </div>

          <div class="nft-demo-grid">
            <div class="nft-demo-preview">
              <canvas id="tutDemoCanvas" class="nft-demo-canvas" width="256" height="256"></canvas>
              <div id="tutDemoTokenName" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #ffffff;">
                Stonk #...
              </div>
            </div>
            <div class="nft-demo-info">
              <div style="font-size: 13px; color: #8b949e; font-family: 'JetBrains Mono', monospace;">
                ГЕНЕРИРАНИ ЧЕРТИ (TRAITS):
              </div>
              <div class="nft-demo-traits" id="tutDemoTraits">
                <div style="color: #64748b; font-size: 12px;">Зареждане на активите...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- СЕКЦИЯ 1: АРХИТЕКТУРА НА СЛОЕВЕТЕ -->
        <div class="sh" id="tut-layers">
          <span class="sh-badge bg-blue">СТЪПКА 1</span>
          <h2>Архитектура на визуалните слоеве</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Строг йерархичен ред на изчертаване (Layer Order)</h3>
          </div>
          <div class="step-body">
            <p>
              Всеки аватар от колекцията се генерира чрез наслагване на прозрачни PNG изображения с фиксиран размер <strong>24×24 пиксела</strong>. 
              За да се избегнат визуални артефакти (например шапка под косата или лаптоп под дрехата), слоевете се изчертават в стриктна Z-последователност:
            </p>

            <ul class="ilist blue">
              <li><strong>background</strong> - Цветов градиент на заден план (Gradient 1 до 10).</li>
              <li><strong>chart</strong> - Графична борсова линия от свещи (Chart 1 до 5).</li>
              <li><strong>body</strong> - Форма и цвят на свещта (Golden Candle, Bullish Green, Bearish Red).</li>
              <li><strong>dress</strong> - Облекло според типа тяло (костюм, верижка, вратовръзка).</li>
              <li><strong>hat</strong> - Аксесоар за глава (шапка с козирка, цилиндър, корона, слушалки).</li>
              <li><strong>faceFeature</strong> - Лицева черта (пура, мустак, брада, вежди).</li>
              <li><strong>eyes</strong> - Очи и очила (Nerd очила, очи Thug Life, златни очи).</li>
              <li><strong>bag</strong> - Предмет в преден план (лаптоп, куфар, сейф).</li>
            </ul>

            <div class="callout c-blue">
              <strong>Внимание при зависимости между активите:</strong> 
              Част от чертите (като дрехи и чанти) имат различна геометрия спрямо избрания тип тяло (<code>body_type_1</code>, <code>body_type_2</code>, <code>body_type_3</code>). Затова генераторът динамично замества шаблона <code>%TYPE%</code> в пътя до файла.
            </div>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">layer-order.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-layers">Копирай</button>
              </div>
              <pre class="code-body" id="code-layers"><span class="kw">const</span> <span class="at">LAYER_ORDER</span> = [
  <span class="st">'background'</span>,  <span class="cm">// Layer 0: Background</span>
  <span class="st">'chart'</span>,       <span class="cm">// Layer 1: Chart line</span>
  <span class="st">'body'</span>,        <span class="cm">// Layer 2: Character body</span>
  <span class="st">'dress'</span>,       <span class="cm">// Layer 3: Outfit / Suit</span>
  <span class="st">'hat'</span>,         <span class="cm">// Layer 4: Hat / Crown</span>
  <span class="st">'faceFeature'</span>, <span class="cm">// Layer 5: Face details</span>
  <span class="st">'eyes'</span>,        <span class="cm">// Layer 6: Eyes / Glasses</span>
  <span class="st">'bag'</span>          <span class="cm">// Layer 7: Foreground items</span>
];</pre>
            </div>
          </div>
        </div>

        <!-- СЕКЦИЯ 2: МАТЕМАТИКА НА РЕДКОСТТА -->
        <div class="sh" id="tut-rarity">
          <span class="sh-badge bg-orange">СТЪПКА 2</span>
          <h2>Математика на рядкостта (Rarity Weights)</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Претеглен случаен избор (Weighted Random Selection)</h3>
          </div>
          <div class="step-body">
            <p>
              Ако всяка черта имаше еднакъв шанс за поява, нямаше да съществуват редки и ценни персонажи. 
              Алгоритъмът присвоява цяло число <code>weight</code> за всеки вариант:
            </p>

            <ul class="ilist orange">
              <li>Пресмята се сумата от всички тегла в категорията: <code>TotalWeight = &Sigma; weight<sub>i</sub></code>.</li>
              <li>Генерира се случайно число в интервала <code>[0, TotalWeight)</code>.</li>
              <li>Обхождат се опциите с натрупване на частичните суми (кумулативен праг).</li>
            </ul>

            <div class="callout c-orange">
              <strong>Пример с телата на свещите:</strong>
              Червена свещ (тегло 32), Зелена свещ (тегло 32), Златна свещ (тегло 4).<br>
              Общо тегло = 68. Вероятност за златна свещ = <code>4 / 68 &asymp; 5.88%</code>.
            </div>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">weighted-random.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-rarity">Копирай</button>
              </div>
              <pre class="code-body" id="code-rarity"><span class="kw">function</span> <span class="fn">pickWeighted</span>(<span class="at">options</span>, <span class="at">rng</span>) {
  <span class="kw">const</span> <span class="at">totalWeight</span> = options.<span class="fn">reduce</span>((<span class="at">sum</span>, <span class="at">opt</span>) => sum + (opt.weight || <span class="num">1</span>), <span class="num">0</span>);
  <span class="kw">let</span> <span class="at">threshold</span> = rng() * totalWeight;

  <span class="kw">for</span> (<span class="kw">const</span> <span class="at">opt</span> <span class="kw">of</span> options) {
    threshold -= (opt.weight || <span class="num">1</span>);
    <span class="kw">if</span> (threshold &lt;= <span class="num">0</span>) {
      <span class="kw">return</span> opt.id;
    }
  }
  <span class="kw">return</span> options[options.length - <span class="num">1</span>].id;
}</pre>
            </div>
          </div>
        </div>

        <!-- СЕКЦИЯ 3: УНИКАЛНОСТ И SEED -->
        <div class="sh" id="tut-uniqueness">
          <span class="sh-badge bg-purple">СТЪПКА 3</span>
          <h2>Гарантиране на уникалност и детерминизъм</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>ДНК сигнатура и липса на дубликати</h3>
          </div>
          <div class="step-body">
            <p>
              При генериране на колекция от 10 000 елемента е задължително всеки аватар да бъде уникален.
              За тази цел се създава ДНК сигнатура като хеш низ от подредените черти:
            </p>

            <ul class="ilist purple">
              <li>Чертите на токена се сортират по ключ и се конкатенират: <code>bg:gradient5|body:golden|hat:hat10|...</code>.</li>
              <li>Сигнатурата се валидира в <code>Set</code> структура за търсене с константна сложност <code>O(1)</code>.</li>
              <li>Ако възникне колизия (вече съществуващ аватар), цикълът прегенерира чертите с нов псевдослучаен seed.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">uniqueness.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-unique">Копирай</button>
              </div>
              <pre class="code-body" id="code-unique"><span class="kw">function</span> <span class="fn">generateDnaSignature</span>(<span class="at">traits</span>) {
  <span class="kw">return</span> Object.<span class="fn">keys</span>(traits)
    .<span class="fn">sort</span>()
    .<span class="fn">map</span>(<span class="at">k</span> => <span class="st">\`\${k}:\${traits[k]}\`</span>)
    .<span class="fn">join</span>(<span class="st">'|'</span>);
}

<span class="kw">const</span> <span class="at">seenSignatures</span> = <span class="kw">new</span> <span class="fn">Set</span>();

<span class="kw">function</span> <span class="fn">mintUniqueStonk</span>(<span class="at">id</span>, <span class="at">rng</span>) {
  <span class="kw">while</span> (<span class="kw">true</span>) {
    <span class="kw">const</span> <span class="at">traits</span> = <span class="fn">rollTraits</span>(rng);
    <span class="kw">const</span> <span class="at">dna</span> = <span class="fn">generateDnaSignature</span>(traits);

    <span class="kw">if</span> (!seenSignatures.<span class="fn">has</span>(dna)) {
      seenSignatures.<span class="fn">add</span>(dna);
      <span class="kw">return</span> { id, traits, dna };
    }
  }
}</pre>
            </div>
          </div>
        </div>

        <!-- СЕКЦИЯ 4: РЕНДЕРИРАНЕ С CANVAS -->
        <div class="sh" id="tut-canvas">
          <span class="sh-badge bg-green">СТЪПКА 4</span>
          <h2>Рендериране с HTML5 Canvas без размазване</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Запазване на резки пиксели (Nearest-Neighbor Scaling)</h3>
          </div>
          <div class="step-body">
            <p>
              По подразбиране браузърният Canvas прилага билинейна интерполация (заглаждане), което прави пиксел-арт образите замъглени. 
              За да останат пикселите остри като диамант при мащабиране от 24px до 512px:
            </p>

            <ul class="ilist green">
              <li>Задава се <code>ctx.imageSmoothingEnabled = false;</code> преди изчертаване.</li>
              <li>В CSS се задава <code>image-rendering: pixelated;</code>.</li>
              <li>Слоевете се зареждат асинхронно чрез <code>Promise.all</code> и се кешират в паметта.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">canvas-renderer.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-canvas">Копирай</button>
              </div>
              <pre class="code-body" id="code-canvas"><span class="kw">async function</span> <span class="fn">renderStonkToCanvas</span>(<span class="at">canvas</span>, <span class="at">layers</span>) {
  <span class="kw">const</span> <span class="at">ctx</span> = canvas.<span class="fn">getContext</span>(<span class="st">'2d'</span>);
  <span class="cm">// Pixel-art rendering configuration</span>
  ctx.<span class="at">imageSmoothingEnabled</span> = <span class="kw">false</span>;

  ctx.<span class="fn">clearRect</span>(<span class="num">0</span>, <span class="num">0</span>, canvas.width, canvas.height);

  <span class="kw">for</span> (<span class="kw">const</span> <span class="at">layerImg</span> <span class="kw">of</span> layers) {
    <span class="kw">if</span> (layerImg) {
      ctx.<span class="fn">drawImage</span>(layerImg, <span class="num">0</span>, <span class="num">0</span>, canvas.width, canvas.height);
    }
  }
}</pre>
            </div>
          </div>
        </div>

      </main>
    </div>
  `;
}

// =============================================================
// Chart.js diagrams tutorial view
// =============================================================
function renderChartsTutorial() {
  return `
    <div class="tutorial-view-container">
      <div class="tutorial-top-bar">
        <a href="#/blog" class="tutorial-back-btn">
          <i class="fa-solid fa-arrow-left"></i> Обратно
        </a>
      </div>

      <!-- ХЕДЪР В СТИЛ MartinByalov/python -->
      <header class="tut-header theme-blue">
        <div class="tut-header-inner">
          <div class="tut-header-logo" style="color: #60a5fa;">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <div>
            <div class="tut-header-meta">TUTORIAL // DATA VISUALIZATION // GRAPH.JS &amp; CANVAS</div>
            <h1>Видове диаграми с Graph.js</h1>
            <p>
              Пълно практическо ръководство за визуализиране на данни: линейни (Line), стълбовидни (Bar), кръгови (Pie / Doughnut), радарни (Radar) и полярни графики с анимации и конзола за тестване в реално време.
            </p>
            <div class="tut-header-nav">
              <a href="#tut-chart-basics" class="tut-header-pill">1. Основа и Canvas</a>
              <a href="#tut-line-chart" class="tut-header-pill">2. Линейна графика</a>
              <a href="#tut-bar-chart" class="tut-header-pill">3. Стълбовидна графика</a>
              <a href="#tut-pie-chart" class="tut-header-pill">4. Кръгови графики</a>
              <a href="#tut-radar-chart" class="tut-header-pill">5. Радарна графика</a>
            </div>
          </div>
        </div>
      </header>

      <main class="tut-main">
        <!-- ОБЩ ПРЕГЛЕД (OVERVIEW CARDS) -->
        <div class="overview">
          <div class="ov-card">
            <div class="icon">📈</div>
            <h3>Линейна (Line)</h3>
            <p>Идеална за времеви серии, курсове, температури и динамични трендове.</p>
          </div>
          <div class="ov-card">
            <div class="icon">📊</div>
            <h3>Стълбовидна (Bar)</h3>
            <p>Сравнение на стойности между независими дискретни категории.</p>
          </div>
          <div class="ov-card">
            <div class="icon">🍩</div>
            <h3>Doughnut / Pie</h3>
            <p>Визуализация на процентни дялове и пропорции от едно цяло.</p>
          </div>
          <div class="ov-card">
            <div class="icon">🕸️</div>
            <h3>Радарна (Radar)</h3>
            <p>Многоосна съпоставка на профили, умения или характеристики на системи.</p>
          </div>
        </div>

        <!-- ИНТЕРАКТИВЕН PLAYGROUND С CHART.JS -->
        <div class="live-sandbox-block" id="tut-charts-demo">
          <div class="sandbox-header">
            <div class="sandbox-title">
              <i class="fa-solid fa-chart-pie" style="color: #38bdf8;"></i>
              Симулация
            </div>
            <div class="sandbox-tabs">
              <button type="button" class="sandbox-tab-btn active" data-chart-type="line">📈 Линейна</button>
              <button type="button" class="sandbox-tab-btn" data-chart-type="bar">📊 Стълбовидна</button>
              <button type="button" class="sandbox-tab-btn" data-chart-type="doughnut">🍩 Doughnut</button>
              <button type="button" class="sandbox-tab-btn" data-chart-type="pie">🥧 Pie</button>
              <button type="button" class="sandbox-tab-btn" data-chart-type="radar">🕸️ Radar</button>
              <button type="button" class="sandbox-tab-btn" data-chart-type="polarArea">📉 Polar Area</button>
            </div>
          </div>

          <div class="sandbox-canvas-wrapper" style="min-height: 340px;">
            <canvas id="liveInteractiveChart" style="max-height: 320px;"></canvas>
          </div>

          <div class="code-wrap" style="margin-top: 20px;">
            <div class="code-bar">
              <div class="code-bar-left">
                <div class="code-dots">
                  <div class="code-dot d-r"></div>
                  <div class="code-dot d-y"></div>
                  <div class="code-dot d-g"></div>
                </div>
                <span class="code-fname" id="liveChartCodeFilename">line-chart-config.js</span>
              </div>
              <button type="button" class="code-copy-btn" data-target="liveChartCodeDisplay">Копирай</button>
            </div>
            <pre class="code-body" id="liveChartCodeDisplay"></pre>
          </div>
        </div>

        <!-- СТЪПКА 1: ОСНОВА И ИНИЦИАЛИЗАЦИЯ -->
        <div class="sh" id="tut-chart-basics">
          <span class="sh-badge bg-blue">СТЪПКА 1</span>
          <h2>Свързване на библиотеката и HTML5 Canvas</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Инициализация на Chart инстанция върху Canvas елемент</h3>
          </div>
          <div class="step-body">
            <p>
              Библиотеката за диаграми (Chart.js / Graph.js) се свързва лесно чрез CDN или локален пакет. 
              Всяка графика изисква само един стандартен HTML5 <code>&lt;canvas&gt;</code> таг:
            </p>

            <ul class="ilist blue">
              <li>Добавяне на <code>&lt;canvas id="myChart"&gt;&lt;/canvas&gt;</code> в HTML документа.</li>
              <li>Извличане на 2D контекста чрез <code>document.getElementById('myChart')</code>.</li>
              <li>Създаване на обект <code>new Chart(ctx, config)</code> с тип, данни и опции.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">index.html</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-setup-html">Копирай</button>
              </div>
              <pre class="code-body" id="code-setup-html"><span class="cm">&lt;!-- Зареждане на библиотеката чрез CDN --&gt;</span>
<span class="tg">&lt;script</span> <span class="at">src</span>=<span class="st">"https://cdn.jsdelivr.net/npm/chart.js"</span><span class="tg">&gt;&lt;/script&gt;</span>

<span class="cm">&lt;!-- Контейнер за диаграмата --&gt;</span>
<span class="tg">&lt;div</span> <span class="at">style</span>=<span class="st">"max-width: 650px; margin: 0 auto;"</span><span class="tg">&gt;</span>
  <span class="tg">&lt;canvas</span> <span class="at">id</span>=<span class="st">"myChart"</span><span class="tg">&gt;&lt;/canvas&gt;</span>
<span class="tg">&lt;/div&gt;</span></pre>
            </div>
          </div>
        </div>

        <!-- СТЪПКА 2: ЛИНЕЙНА ДИАГРАМА -->
        <div class="sh" id="tut-line-chart">
          <span class="sh-badge bg-green">СТЪПКА 2</span>
          <h2>Линейна диаграма (Line Chart)</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Трендове, плавни Безриеви криви и градиенти</h3>
          </div>
          <div class="step-body">
            <p>
              Линейната графика е най-добрият инструмент за показване на непрекъснати данни във времето (дни, месеци, минути):
            </p>

            <ul class="ilist green">
              <li><code>type: 'line'</code> задава типа на графиката.</li>
              <li><code>tension: 0.35</code> превръща ъгловите начупени прави в естествени плавни криви на Безрие.</li>
              <li><code>fill: true</code> оцветява пространството под линията за по-добра визуална четимост.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">line-chart.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-line-chart">Копирай</button>
              </div>
              <pre class="code-body" id="code-line-chart"><span class="kw">const</span> <span class="at">ctx</span> = document.<span class="fn">getElementById</span>(<span class="st">'myChart'</span>);

<span class="kw">new</span> <span class="fn">Chart</span>(ctx, {
  <span class="at">type</span>: <span class="st">'line'</span>,
  <span class="at">data</span>: {
    <span class="at">labels</span>: [<span class="st">'Януари'</span>, <span class="st">'Февруари'</span>, <span class="st">'Март'</span>, <span class="st">'Април'</span>, <span class="st">'Май'</span>, <span class="st">'Юни'</span>],
    <span class="at">datasets</span>: [{
      <span class="at">label</span>: <span class="st">'Успеваемост (%)'</span>,
      <span class="at">data</span>: [<span class="num">65</span>, <span class="num">72</span>, <span class="num">78</span>, <span class="num">75</span>, <span class="num">88</span>, <span class="num">94</span>],
      <span class="at">borderColor</span>: <span class="st">'#3b82f6'</span>,
      <span class="at">backgroundColor</span>: <span class="st">'rgba(59, 130, 246, 0.15)'</span>,
      <span class="at">tension</span>: <span class="num">0.35</span>,
      <span class="at">fill</span>: <span class="kw">true</span>,
      <span class="at">pointBackgroundColor</span>: <span class="st">'#1d4ed8'</span>
    }]
  },
  <span class="at">options</span>: {
    <span class="at">responsive</span>: <span class="kw">true</span>,
    <span class="at">plugins</span>: {
      <span class="at">title</span>: { <span class="at">display</span>: <span class="kw">true</span>, <span class="at">text</span>: <span class="st">'Динамика на средния успех'</span> }
    }
  }
});</pre>
            </div>
          </div>
        </div>

        <!-- СТЪПКА 3: СТЪЛБОВИДНА ДИАГРАМА -->
        <div class="sh" id="tut-bar-chart">
          <span class="sh-badge bg-purple">СТЪПКА 3</span>
          <h2>Стълбовидна диаграма (Bar Chart)</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Вертикални, хоризонтални стълбове и заоблени ъгли</h3>
          </div>
          <div class="step-body">
            <p>
              Стълбовидните диаграми са златен стандарт за категориен анализ (брой ученици по предмети, брой изпълнени задачи):
            </p>

            <ul class="ilist purple">
              <li><code>borderRadius: 8</code> придава модерен заоблен вид на горните ръбове на колоните.</li>
              <li>С параметъра <code>indexAxis: 'y'</code> стълбовете се обръщат хоризонтално (подходящо при дълги имена на категории).</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">bar-chart.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-bar-chart">Копирай</button>
              </div>
              <pre class="code-body" id="code-bar-chart"><span class="kw">new</span> <span class="fn">Chart</span>(ctx, {
  <span class="at">type</span>: <span class="st">'bar'</span>,
  <span class="at">data</span>: {
    <span class="at">labels</span>: [<span class="st">'Информатика'</span>, <span class="st">'Математика'</span>, <span class="st">'Физика'</span>, <span class="st">'Английски'</span>, <span class="st">'История'</span>],
    <span class="at">datasets</span>: [{
      <span class="at">label</span>: <span class="st">'Брой отлични оценки'</span>,
      <span class="at">data</span>: [<span class="num">28</span>, <span class="num">22</span>, <span class="num">17</span>, <span class="num">25</span>, <span class="num">14</span>],
      <span class="at">backgroundColor</span>: [
        <span class="st">'#3b82f6'</span>, <span class="st">'#10b981'</span>, <span class="st">'#f59e0b'</span>, <span class="st">'#8b5cf6'</span>, <span class="st">'#ec4899'</span>
      ],
      <span class="at">borderRadius</span>: <span class="num">8</span>
    }]
  }
});</pre>
            </div>
          </div>
        </div>

        <!-- СТЪПКА 4: КРЪГОВИ ДИАГРАМИ (PIE & DOUGHNUT) -->
        <div class="sh" id="tut-pie-chart">
          <span class="sh-badge bg-orange">СТЪПКА 4</span>
          <h2>Кръгови диаграми (Pie &amp; Doughnut)</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Дялово разпределение от 100% и cutout отрязване</h3>
          </div>
          <div class="step-body">
            <p>
              Doughnut диаграмата е предпочитан вариант пред класическия Pie, защото празната централна зона позволява добавяне на обобщаваща стойност:
            </p>

            <ul class="ilist orange">
              <li><code>type: 'doughnut'</code> създава пръстеновидна диаграма.</li>
              <li>Параметърът <code>cutout: '65%'</code> определя диаметъра на вътрешния отвор.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">doughnut-chart.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-doughnut-chart">Копирай</button>
              </div>
              <pre class="code-body" id="code-doughnut-chart"><span class="kw">new</span> <span class="fn">Chart</span>(ctx, {
  <span class="at">type</span>: <span class="st">'doughnut'</span>,
  <span class="at">data</span>: {
    <span class="at">labels</span>: [<span class="st">'JavaScript'</span>, <span class="st">'Python'</span>, <span class="st">'HTML/CSS'</span>, <span class="st">'SQL'</span>],
    <span class="at">datasets</span>: [{
      <span class="at">data</span>: [<span class="num">40</span>, <span class="num">30</span>, <span class="num">20</span>, <span class="num">10</span>],
      <span class="at">backgroundColor</span>: [<span class="st">'#f59e0b'</span>, <span class="st">'#3b82f6'</span>, <span class="st">'#10b981'</span>, <span class="st">'#6366f1'</span>]
    }]
  },
  <span class="at">options</span>: {
    <span class="at">cutout</span>: <span class="st">'65%'</span>
  }
});</pre>
            </div>
          </div>
        </div>

        <!-- СТЪПКА 5: РАДАРНА ДИАГРАМА -->
        <div class="sh" id="tut-radar-chart">
          <span class="sh-badge bg-red">СТЪПКА 5</span>
          <h2>Радарна диаграма (Radar Chart)</h2>
          <div class="line"></div>
        </div>

        <div class="step-block">
          <div class="step-head">
            <h3>Многомерен профилен анализ (Spider Chart)</h3>
          </div>
          <div class="step-body">
            <p>
              Радарната диаграма визуализира три или повече количествени променливи, започващи от обща централна точка. 
              Изключително полезна е за сравнение на технологични умения или характеристика на профили:
            </p>

            <ul class="ilist red">
              <li><code>type: 'radar'</code> конфигурира полярна паяжинообразна координатна система.</li>
              <li><code>scales: { r: { beginAtZero: true } }</code> гарантира, че скалата започва от нула в центъра.</li>
            </ul>

            <div class="code-wrap">
              <div class="code-bar">
                <div class="code-bar-left">
                  <div class="code-dots">
                    <div class="code-dot d-r"></div>
                    <div class="code-dot d-y"></div>
                    <div class="code-dot d-g"></div>
                  </div>
                  <span class="code-fname">radar-chart.js</span>
                </div>
                <button type="button" class="code-copy-btn" data-target="code-radar-chart">Копирай</button>
              </div>
              <pre class="code-body" id="code-radar-chart"><span class="kw">new</span> <span class="fn">Chart</span>(ctx, {
  <span class="at">type</span>: <span class="st">'radar'</span>,
  <span class="at">data</span>: {
    <span class="at">labels</span>: [<span class="st">'Frontend'</span>, <span class="st">'Backend'</span>, <span class="st">'Алгоритми'</span>, <span class="st">'Бази данни'</span>, <span class="st">'DevOps'</span>, <span class="st">'UI/UX'</span>],
    <span class="at">datasets</span>: [{
      <span class="at">label</span>: <span class="st">'Текущо ниво'</span>,
      <span class="at">data</span>: [<span class="num">90</span>, <span class="num">75</span>, <span class="num">82</span>, <span class="num">70</span>, <span class="num">60</span>, <span class="num">85</span>],
      <span class="at">borderColor</span>: <span class="st">'#8b5cf6'</span>,
      <span class="at">backgroundColor</span>: <span class="st">'rgba(139, 92, 246, 0.25)'</span>
    }]
  },
  <span class="at">options</span>: {
    <span class="at">scales</span>: {
      <span class="at">r</span>: { <span class="at">beginAtZero</span>: <span class="kw">true</span>, <span class="at">max</span>: <span class="num">100</span> }
    }
  }
});</pre>
            </div>
          </div>
        </div>

      </main>
    </div>
  `;
}

// =============================================================
// Simulation helper functions
// =============================================================

// NFT DEMO
async function initNftTutorialDemo() {
  const canvas = document.getElementById('tutDemoCanvas');
  const tokenNameEl = document.getElementById('tutDemoTokenName');
  const traitsEl = document.getElementById('tutDemoTraits');
  const rollBtn = document.getElementById('tutRollBtn');
  const modalBtn = document.getElementById('tutModalBtn');

  if (!canvas) return;

  async function getGen() {
    if (liveGenerator) return liveGenerator;
    const module = await import('/tools/thestonks/js/stonk-generator.js');
    const gen = new module.StonkGenerator({ basePath: '/tools/thestonks' });
    await gen.load();
    liveGenerator = gen;
    return gen;
  }

  async function roll() {
    try {
      traitsEl.innerHTML = `<div style="color: #94a3b8; font-size: 12px;"><i class="fa-solid fa-spinner fa-spin"></i> Генериране...</div>`;
      const gen = await getGen();
      const id = gen.randomId();
      currentDemoNftId = id;

      await gen.render(id, canvas, { size: 256 });

      const details = gen.getStonk(id);
      tokenNameEl.innerText = `Stonk #${details.id}`;

      traitsEl.innerHTML = (details.traits || []).map(t => `
        <div class="nft-demo-trait-card">
          <div class="nft-demo-trait-cat">${esc(t.label || t.category)}</div>
          <div class="nft-demo-trait-val" title="${esc(t.name || 'None')}">${esc(t.name || 'None')}</div>
        </div>
      `).join('');
    } catch (err) {
      traitsEl.innerHTML = `<div style="color: #f87171; font-size: 12px;">Грешка при визуализацията: ${esc(err.message)}</div>`;
    }
  }

  rollBtn?.addEventListener('click', roll);
  modalBtn?.addEventListener('click', () => {
    NftPopup.open(currentDemoNftId);
  });

  roll();
}

// CHARTS DEMO
function loadChartJsLibrary() {
  if (window.Chart) return Promise.resolve(window.Chart);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.onload = () => resolve(window.Chart);
    s.onerror = () => reject(new Error('Неуспешно зареждане на Chart.js'));
    document.head.appendChild(s);
  });
}

const CHART_PRESETS = {
  line: {
    filename: 'line-chart-config.js',
    config: {
      type: 'line',
      data: {
        labels: ['Септември', 'Октомври', 'Ноември', 'Декември', 'Януари', 'Февруари'],
        datasets: [{
          label: 'Успеваемост по ИТ (%)',
          data: [68, 74, 82, 79, 89, 95],
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#0284c7',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e2e8f0' } }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' }, beginAtZero: true, max: 100 }
        }
      }
    },
    codeSnippet: `// Line chart
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Септември', 'Октомври', 'Ноември', 'Декември', 'Януари', 'Февруари'],
    datasets: [{
      label: 'Успеваемост по ИТ (%)',
      data: [68, 74, 82, 79, 89, 95],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      tension: 0.35,
      fill: true
    }]
  }
});`
  },

  bar: {
    filename: 'bar-chart-config.js',
    config: {
      type: 'bar',
      data: {
        labels: ['Информатика', 'Математика', 'Физика', 'Химия', 'Английски', 'БЕЛ'],
        datasets: [{
          label: 'Брой предадени проекти',
          data: [32, 28, 19, 15, 27, 24],
          backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#ec4899'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' }, beginAtZero: true }
        }
      }
    },
    codeSnippet: `// Bar chart
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Информатика', 'Математика', 'Физика', 'Химия', 'Английски', 'БЕЛ'],
    datasets: [{
      label: 'Брой предадени проекти',
      data: [32, 28, 19, 15, 27, 24],
      backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#ec4899'],
      borderRadius: 6
    }]
  }
});`
  },

  doughnut: {
    filename: 'doughnut-chart-config.js',
    config: {
      type: 'doughnut',
      data: {
        labels: ['Уеб програмиране', 'Алгоритми & C#', 'Бази данни', 'Компютърни мрежи'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e'],
          borderWidth: 2,
          borderColor: '#0d1117'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e2e8f0', padding: 16 } }
        }
      }
    },
    codeSnippet: `// Doughnut chart
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Уеб програмиране', 'Алгоритми & C#', 'Бази данни', 'Компютърни мрежи'],
    datasets: [{
      data: [42, 28, 18, 12],
      backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e']
    }]
  },
  options: {
    cutout: '65%'
  }
});`
  },

  pie: {
    filename: 'pie-chart-config.js',
    config: {
      type: 'pie',
      data: {
        labels: ['Отличен (6)', 'Мн. добър (5)', 'Добър (4)', 'Среден (3)'],
        datasets: [{
          data: [52, 30, 14, 4],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#0d1117'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e2e8f0', padding: 16 } }
        }
      }
    },
    codeSnippet: `// Pie chart
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Отличен (6)', 'Мн. добър (5)', 'Добър (4)', 'Среден (3)'],
    datasets: [{
      data: [52, 30, 14, 4],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
    }]
  }
});`
  },

  radar: {
    filename: 'radar-chart-config.js',
    config: {
      type: 'radar',
      data: {
        labels: ['Frontend', 'Backend', 'Алгоритми', 'SQL & Данни', 'Git & DevOps', 'UI Дизайн'],
        datasets: [
          {
            label: 'Ученик А',
            data: [92, 70, 85, 78, 65, 88],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            pointBackgroundColor: '#38bdf8'
          },
          {
            label: 'Средно за класа',
            data: [75, 68, 70, 65, 55, 72],
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.2)',
            pointBackgroundColor: '#a78bfa'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e2e8f0' } }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#cbd5e1', font: { size: 12 } },
            ticks: { display: false, beginAtZero: true, max: 100 }
          }
        }
      }
    },
    codeSnippet: `// Radar chart
new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Frontend', 'Backend', 'Алгоритми', 'SQL & Данни', 'Git & DevOps', 'UI Дизайн'],
    datasets: [
      {
        label: 'Ученик А',
        data: [92, 70, 85, 78, 65, 88],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.25)'
      },
      {
        label: 'Средно за класа',
        data: [75, 68, 70, 65, 55, 72],
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167, 139, 250, 0.2)'
      }
    ]
  },
  options: {
    scales: {
      r: { beginAtZero: true, max: 100 }
    }
  }
});`
  },

  polarArea: {
    filename: 'polar-chart-config.js',
    config: {
      type: 'polarArea',
      data: {
        labels: ['CPU Натоварване', 'RAM Памет', 'Дисково пространство', 'Мрежов трафик', 'Температура'],
        datasets: [{
          data: [65, 82, 45, 70, 55],
          backgroundColor: [
            'rgba(56, 189, 248, 0.65)',
            'rgba(52, 211, 153, 0.65)',
            'rgba(251, 191, 36, 0.65)',
            'rgba(244, 63, 94, 0.65)',
            'rgba(168, 85, 247, 0.65)'
          ],
          borderColor: '#0d1117'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e2e8f0', padding: 14 } }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { display: false }
          }
        }
      }
    },
    codeSnippet: `// Polar area chart
new Chart(ctx, {
  type: 'polarArea',
  data: {
    labels: ['CPU Натоварване', 'RAM Памет', 'Дисково пространство', 'Мрежов трафик', 'Температура'],
    datasets: [{
      data: [65, 82, 45, 70, 55],
      backgroundColor: [
        'rgba(56, 189, 248, 0.65)',
        'rgba(52, 211, 153, 0.65)',
        'rgba(251, 191, 36, 0.65)',
        'rgba(244, 63, 94, 0.65)',
        'rgba(168, 85, 247, 0.65)'
      ]
    }]
  }
});`
  }
};

async function initChartsTutorialDemo() {
  const canvas = document.getElementById('liveInteractiveChart');
  const codeDisplay = document.getElementById('liveChartCodeDisplay');
  const filenameEl = document.getElementById('liveChartCodeFilename');
  const tabButtons = document.querySelectorAll('.sandbox-tab-btn');

  if (!canvas) return;

  try {
    const ChartClass = await loadChartJsLibrary();

    function setChart(typeKey) {
      const preset = CHART_PRESETS[typeKey] || CHART_PRESETS.line;

      // Destroy previous chart instance
      if (activeChartInstance) {
        activeChartInstance.destroy();
      }

      // Update active tab button
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-chart-type') === typeKey);
      });

      // Display corresponding source code
      if (codeDisplay) codeDisplay.innerText = preset.codeSnippet;
      if (filenameEl) filenameEl.innerText = preset.filename;

      // Create new chart instance
      activeChartInstance = new ChartClass(canvas, preset.config);
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-chart-type');
        setChart(t);
      });
    });

    setChart('line');
  } catch (err) {
    if (codeDisplay) {
      codeDisplay.innerText = `Грешка при инициализация на Chart.js: ${err.message}`;
    }
  }
}
