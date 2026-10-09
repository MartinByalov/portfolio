// About page and portfolio access gate

const GATE_STORAGE_KEY = 'portfolio-unlocked';

// SHA-256 hash of the 6-character access code (letters, digits and symbols,
// case-sensitive). The site is static (GitHub Pages,
// no backend), so the plaintext code must never be committed to the repo -
// only this hash is stored here. To rotate the code, run locally:
//   node scripts/generate-portfolio-hash.js [new-code]
// and paste the printed hash below.
const PORTFOLIO_CODE_HASH = 'd147a8ba6e1f2d7b6354043749ef3d775fcf76e64e49ed49a543f4ae20227e4c';

const GATE_ATTEMPT_KEY = 'portfolio-gate-attempts';
const GATE_LOCK_KEY = 'portfolio-gate-locked-until';
const GATE_MAX_ATTEMPTS = 5;
const GATE_LOCK_MS = 5 * 60 * 1000;

function getGateAttempts() {
  try {
    return JSON.parse(sessionStorage.getItem(GATE_ATTEMPT_KEY) || '{"count":0}');
  } catch (err) {
    return { count: 0 };
  }
}

function recordFailedAttempt() {
  try {
    const state = getGateAttempts();
    state.count = (state.count || 0) + 1;
    if (state.count >= GATE_MAX_ATTEMPTS) {
      sessionStorage.setItem(GATE_LOCK_KEY, String(Date.now() + GATE_LOCK_MS));
      state.count = 0;
    }
    sessionStorage.setItem(GATE_ATTEMPT_KEY, JSON.stringify(state));
  } catch (err) {}
}

function clearGateAttempts() {
  try {
    sessionStorage.removeItem(GATE_ATTEMPT_KEY);
    sessionStorage.removeItem(GATE_LOCK_KEY);
  } catch (err) {}
}

function gateLockRemainingMs() {
  try {
    const until = Number(sessionStorage.getItem(GATE_LOCK_KEY) || 0);
    const remaining = until - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch (err) {
    return 0;
  }
}

async function hashGateCode(code) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function unlockGate() {
  try { sessionStorage.setItem(GATE_STORAGE_KEY, '1'); } catch (err) {}
  clearGateAttempts();
  closeGate();
  location.hash = '#/portfolio';
}

function showGateError(message) {
  const errorEl = document.getElementById('code-gate-error');
  if (errorEl) errorEl.textContent = message;
  const gate = gateOverlay();
  if (gate) {
    gate.classList.remove('shake');
    void gate.offsetWidth;
    gate.classList.add('shake');
  }
}

function resetGateInputs() {
  const digits = document.querySelectorAll('.code-gate-digit');
  digits.forEach(d => d.value = '');
  digits[0]?.focus();
}

// The public build must continue using the Cloudflare Worker. The local
// development server has its own server-side endpoint so localhost does not
// depend on the Worker's production CORS allowlist.
const PORTFOLIO_WORKER_VERIFY_URL = 'https://portfolio.byalov-v-martin.workers.dev/verify';

function isLocalDevelopment() {
  return window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || window.location.hostname === '::1';
}

function portfolioVerifyUrl() {
  return isLocalDevelopment() ? '/api/portfolio/verify' : PORTFOLIO_WORKER_VERIFY_URL;
}

async function verifyGateCodeRemotely(code) {
  const verifyUrl = portfolioVerifyUrl();
  if (!verifyUrl) return 'unavailable';
  try {
    const res = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (res.status === 429) return 'rate-limited';
    // 403 = Worker-ът отговори, че кодът е грешен. Всичко останало извън 200
    // (503 без secret, 404/405 грешен deploy, CORS/инфраструктурна грешка)
    // означава "не можах да проверя" - сайтът пада към локалния хеш.
    // вместо да броим фалшив грешен опит.
    if (res.status === 403) return 'rejected';
    if (res.status !== 200) return 'unavailable';
    const data = await res.json().catch(() => ({}));
    return data && data.success ? 'accepted' : 'rejected';
  } catch (err) {
    return 'unavailable';
  }
}

function failGateCode() {
  recordFailedAttempt();
  const attemptsLeft = GATE_MAX_ATTEMPTS - (getGateAttempts().count || 0);
  showGateError(attemptsLeft > 0
    ? `Грешен код. Остават ${attemptsLeft} опита.`
    : 'Грешен код. Достъпът е временно заключен.');
  resetGateInputs();
}

export function isPortfolioUnlocked() {
  try {
    return sessionStorage.getItem(GATE_STORAGE_KEY) === '1';
  } catch (err) {
    return false;
  }
}

export function renderAboutPage() {
  return `
    <audio id="about-bgMusic" src="audio/background_sound.mp3" autoplay loop preload="auto"></audio>

    <section class="about-hero-wrapper">
      <div class="about-hero-overlay"></div>

      <div class="about-hero-container">
        <header class="about-hero-header">
          <h1>Мартин Бялов</h1>
          <div class="about-underline"></div>
        </header>

        <main class="about-hero-content">
          <div class="about-philosophy-text">
            <p>Моята философия като учител се корени в убеждението, че всяко дете притежава уникален потенциал, който трябва да бъде открит и подхранен. Вярвам, че образованието не е просто предаване на факти, а процес на вдъхновяване на любопитство.</p>
            <p>Стремя се да създавам интерактивна учебна среда, където грешките се приемат като възможности за растеж, а технологиите са инструмент за изграждане на критично мислене.</p>
          </div>
          <div class="about-hero-actions">
            <button id="portfolio-gate-btn" class="about-btn-primary" type="button"><i class="fa-solid fa-graduation-cap"></i> ПОРТФОЛИО</button>
          </div>
        </main>

        <footer class="about-hero-footer">
          <div class="about-social-minimal">
            <a href="https://bg.linkedin.com/in/martin-byalov-42615392" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a>
            <a href="mailto:byalov.v.martin@gmail.com"><i class="fas fa-envelope"></i></a>
          </div>
          <p>© 2026 Мартин Бялов</p>
        </footer>
      </div>
    </section>
  `;
}

// Portfolio access code gate

function gateOverlay() {
  return document.getElementById('code-gate-overlay');
}

function closeGate() {
  gateOverlay()?.remove();
  document.removeEventListener('keydown', gateKeydown);
}

function gateKeydown(e) {
  if (e.key === 'Escape') closeGate();
  if (e.key === 'Enter') tryGateCode();
}

async function tryGateCode() {
  const digits = document.querySelectorAll('.code-gate-digit');
  const code = Array.from(digits).map(d => d.value).join('');
  const errorEl = document.getElementById('code-gate-error');
  if (code.length !== 6) {
    if (errorEl) errorEl.textContent = 'Моля въведете всички 6 символа.';
    return;
  }

  // Step 1: server-side check via Cloudflare Worker when configured.
  // Step 2: local SHA-256 fallback when the Worker is not set or unreachable.
  // The plaintext code is never stored in the repository.
  const lockedMs = gateLockRemainingMs();
  if (lockedMs > 0) {
    const minutes = Math.ceil(lockedMs / 60000);
    showGateError(`Твърде много грешни опити. Опитайте отново след около ${minutes} мин.`);
    resetGateInputs();
    return;
  }

  const remote = await verifyGateCodeRemotely(code);
  if (remote === 'accepted') {
    unlockGate();
    return;
  }
  if (remote === 'rate-limited') {
    showGateError('Твърде много опити към сървъра. Опитайте по-късно.');
    resetGateInputs();
    return;
  }
  if (remote === 'rejected') {
    failGateCode();
    return;
  }

  try {
    const codeHash = await hashGateCode(code);
    if (codeHash === PORTFOLIO_CODE_HASH) {
      unlockGate();
      return;
    }
  } catch (err) {
    showGateError('Възникна грешка при проверката. Опитайте пак.');
    resetGateInputs();
    return;
  }

  failGateCode();
}

function openPortfolioGate() {
  if (isPortfolioUnlocked()) {
    location.hash = '#/portfolio';
    return;
  }
  closeGate();
  const overlay = document.createElement('div');
  overlay.id = 'code-gate-overlay';
  overlay.className = 'code-gate-overlay';
  overlay.innerHTML = `
    <div class="code-gate" role="dialog" aria-modal="true" aria-label="Въведи код за достъп">
      <div class="code-gate-icon"><i class="fas fa-lock"></i></div>
      <h3>Защитено портфолио</h3>
      <p>Моля въведете код за достъп</p>
      <div class="code-gate-digits">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="0">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="1">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="2">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="3">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="4">
        <input type="text" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="code-gate-digit" data-index="5">
      </div>
      <p class="code-gate-error" id="code-gate-error"></p>
      <div class="code-gate-actions">
        <button type="button" class="code-gate-cancel" id="code-gate-cancel">Отказ</button>
        <button type="button" class="code-gate-ok" id="code-gate-ok">Вход</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGate(); });
  document.getElementById('code-gate-ok').addEventListener('click', tryGateCode);
  document.getElementById('code-gate-cancel').addEventListener('click', closeGate);
  document.addEventListener('keydown', gateKeydown);
  const digits = overlay.querySelectorAll('.code-gate-digit');
  digits.forEach((digit, i) => {
    digit.addEventListener('input', () => {
      // Letters, digits and symbols are allowed - only whitespace is stripped.
      // Case is preserved: the code is case-sensitive.
      const cleaned = digit.value.replace(/\s/g, '').slice(-1);
      digit.value = cleaned;
      if (digit.value && i < 5) digits[i + 1].focus();
      if (digits[5].value) tryGateCode();
    });
    digit.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !digit.value && i > 0) digits[i - 1].focus();
    });
    // Pasting the whole 6-character code fills all boxes at once.
    digit.addEventListener('paste', (e) => {
      const text = ((e.clipboardData || window.clipboardData || {}).getData('text') || '')
        .replace(/\s/g, '');
      if (!text) return;
      e.preventDefault();
      const chars = text.slice(0, 6).split('');
      digits.forEach((d, j) => { d.value = chars[j] || ''; });
      const filled = chars.length >= 6 ? digits[5] : digits[Math.min(chars.length, 5)];
      filled.focus();
      if (chars.length >= 6) tryGateCode();
    });
  });
  setTimeout(() => digits[0]?.focus(), 80);
}

// About page initialization

let aboutAudioCleanup = null;

export function initAboutPage() {
  document.getElementById('portfolio-gate-btn')?.addEventListener('click', openPortfolioGate);
}

export function initAboutAudio() {
  if (aboutAudioCleanup) return;
  const audio = document.getElementById('about-bgMusic');
  if (!audio) return;

  function startMusic() {
    if (audio && audio.paused) audio.play().catch(() => {});
    removeListeners();
  }
  function removeListeners() {
    document.removeEventListener('click', startMusic);
    document.removeEventListener('touchstart', startMusic);
    document.removeEventListener('keydown', startMusic);
  }

  document.addEventListener('click', startMusic);
  document.addEventListener('touchstart', startMusic);
  document.addEventListener('keydown', startMusic);

  aboutAudioCleanup = () => {
    removeListeners();
    closeGate();
    if (audio) { audio.pause(); audio.currentTime = 0; }
    aboutAudioCleanup = null;
  };
}

export function cleanupAboutAudio() {
  if (aboutAudioCleanup) aboutAudioCleanup();
}

export function cleanupAboutPage() {
  closeGate();
  if (aboutAudioCleanup) aboutAudioCleanup();
}