import express from 'express';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import crypto from 'crypto';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { buildRealisticImagePrompt, generateRealisticPromptWithGemini, STANDARD_NEGATIVE_PROMPT } from './utils/promptGenerator.js';
import { resolveGlossaryImageUrl, getGlossaryFilename } from './utils/glossaryMedia.js';
import { newsImageCandidates } from './utils/newsImages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const archiver = require('archiver');
const classroomStorageRoot = path.join(__dirname, 'uploads', 'classroom-drop');
const classroomRooms = new Map();
fs.mkdirSync(classroomStorageRoot, { recursive: true });
const classroomUpload = multer({
  dest: classroomStorageRoot,
  limits: { fileSize: 25 * 1024 * 1024 }
});

const classroomAllowedExtensions = new Set([
  '.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.csv',
  '.txt', '.zip', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.odt', '.ods', '.odp'
]);

function classroomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function classroomToken() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`;
}

function classroomPublicFile(file) {
  return {
    id: file.id,
    name: file.originalName,
    ...(file.studentName ? { studentName: file.studentName } : {}),
    size: file.size,
    mimeType: file.mimeType,
    uploadedAt: file.uploadedAt
  };
}

function classroomRoomResponse(room, includeSubmissions = false) {
  return {
    id: room.id,
    title: room.title,
    instructions: room.instructions,
    createdAt: room.createdAt,
    expiresAt: room.expiresAt,
    materials: room.materials.map(classroomPublicFile),
    ...(includeSubmissions ? { submissions: room.submissions.map(classroomSubmissionResponse) } : {})
  };
}

function classroomSubmissionResponse(file) {
  return { ...classroomPublicFile(file), comment: file.comment || '', status: 'Предадено' };
}

function findClassroomRoom(req, res) {
  const room = classroomRooms.get(String(req.params.roomId || '').toUpperCase());
  if (!room || room.expiresAt < Date.now()) {
    if (room) classroomRooms.delete(room.id);
    res.status(404).json({ error: 'Стаята не е намерена или е изтекла.' });
    return null;
  }
  return room;
}

function classroomFileAllowed(originalName) {
  const extension = path.extname(originalName || '').toLowerCase();
  return classroomAllowedExtensions.has(extension);
}

function classroomOriginalName(originalName) {
  let name = String(originalName || 'file');
  // Some multipart clients expose UTF-8 filenames decoded as Latin-1.
  const mojibakeScore = value => (value.match(/[ÃÂÐÑ]/g) || []).length + (value.match(/�/g) || []).length * 3;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!/[ÃÂÐÑ]/.test(name)) break;
    try {
      const repaired = Buffer.from(name, 'latin1').toString('utf8');
      if (repaired.includes('�') || mojibakeScore(repaired) >= mojibakeScore(name)) break;
      name = repaired;
    } catch { break; }
  }
  return name;
}

// Helper to load .env variables into process.env if present
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          process.env[key] = val;
        }
      });
    } catch (e) {
      console.warn('Could not read .env:', e.message);
    }
  }
}
loadEnv();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const liveReloadClients = new Set();
const liveReloadExtensions = new Set(['.html', '.htm', '.css', '.js', '.json', '.md', '.mdx']);
const liveReloadIgnoredDirectories = new Set(['.git', 'node_modules']);
let liveReloadTimer = null;

app.use(express.json());

// Server-Sent Events endpoint for browser live reload during local development.
app.get('/__live_reload', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(': connected\n\n');

  liveReloadClients.add(res);
  req.on('close', () => liveReloadClients.delete(res));
});

function notifyLiveReload(filePath) {
  if (liveReloadTimer) clearTimeout(liveReloadTimer);
  liveReloadTimer = setTimeout(() => {
    liveReloadTimer = null;
    broadcastReload(filePath);
  }, 100);
}

function broadcastReload(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  const payload = JSON.stringify({ path: relativePath, timestamp: Date.now() });
  for (const client of liveReloadClients) {
    try {
      client.write(`event: reload\ndata: ${payload}\n\n`);
    } catch {
      liveReloadClients.delete(client);
    }
  }
}

function watchForLiveReload(directory) {
  if (!fs.existsSync(directory)) return;
  try {
    fs.watch(directory, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      const fileName = String(filename);
      const parts = fileName.split(/[\\/]/);
      if (parts.some(part => liveReloadIgnoredDirectories.has(part))) return;
      const extension = path.extname(fileName).toLowerCase();
      if (liveReloadExtensions.has(extension)) {
        notifyLiveReload(path.join(directory, fileName));
      }
    });
  } catch (error) {
    console.warn(`[live-reload] Could not watch ${directory}: ${error.message}`);
  }
}

// One recursive watcher covers the complete project and avoids duplicate events.
watchForLiveReload(__dirname);

// Lazy-initialized Gemini AI client
let genAI = null;
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

// Ensure proper mime type mapping for epub files
express.static.mime.define({
  'application/epub+zip': ['epub']
});

// Serve static assets from project root, assets directory, and lesson directories
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/lessons', express.static(path.join(__dirname, 'lessons')));
app.use('/it-8-2-5', express.static(path.join(__dirname, 'it-8-2-5')));
app.use('/it-8-2-5', express.static(path.join(__dirname, 'assets', 'it-8-2-5')));
app.use('/it-8-2-5', express.static(path.join(__dirname, 'lessons', 'it-8', 'it-8-2-5')));
// Keep the legacy root URL working for links that predate the tools directory.
app.get('/inv.html', (req, res) => {
  res.redirect('/tools/inv.html');
});
// Browsers request this conventional path when a page has no explicit icon.
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.svg'));
});
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  index: ['index.html']
}));

// Temporary no-account classroom rooms for distributing and collecting files.
app.post('/api/classroom/rooms', async (req, res) => {
  const title = String(req.body?.title || '').trim().slice(0, 120);
  const instructions = String(req.body?.instructions || '').trim().slice(0, 5000);
  if (!title) return res.status(400).json({ error: 'Заглавието е задължително.' });

  await fsp.mkdir(classroomStorageRoot, { recursive: true });
  let id;
  do { id = classroomId(); } while (classroomRooms.has(id));
  const room = {
    id,
    teacherToken: classroomToken(),
    title,
    instructions,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    materials: [],
    submissions: []
  };
  classroomRooms.set(id, room);
  await fsp.mkdir(path.join(classroomStorageRoot, id), { recursive: true });
  res.status(201).json({ ...classroomRoomResponse(room, true), teacherToken: room.teacherToken });
});

app.get('/api/classroom/rooms/:roomId', (req, res) => {
  const room = findClassroomRoom(req, res);
  if (!room) return;
  const isTeacher = req.query.teacherToken === room.teacherToken;
  const response = classroomRoomResponse(room, isTeacher);
  if (!isTeacher && req.query.studentKey) {
    response.submissions = room.submissions.filter(file => file.studentKey === String(req.query.studentKey)).map(classroomSubmissionResponse);
  }
  res.json({ ...response, isTeacher });
});

app.post('/api/classroom/rooms/:roomId/materials', classroomUpload.single('file'), async (req, res) => {
  const room = findClassroomRoom(req, res);
  if (!room) return;
  if (req.body?.teacherToken !== room.teacherToken) {
    if (req.file) await fsp.unlink(req.file.path).catch(() => {});
    return res.status(403).json({ error: 'Невалиден учителски ключ.' });
  }
  const originalName = classroomOriginalName(req.file?.originalname);
  if (!req.file || !classroomFileAllowed(originalName)) {
    if (req.file) await fsp.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ error: 'Файлът е задължителен или типът му не е разрешен.' });
  }
  const file = { id: crypto.randomUUID(), originalName, storedPath: req.file.path, size: req.file.size, mimeType: req.file.mimetype, uploadedAt: Date.now() };
  room.materials.push(file);
  res.status(201).json({ file: classroomPublicFile(file) });
});

app.post('/api/classroom/rooms/:roomId/submissions', classroomUpload.single('file'), async (req, res) => {
  const room = findClassroomRoom(req, res);
  if (!room) return;
  const originalName = classroomOriginalName(req.file?.originalname);
  if (!req.file || !classroomFileAllowed(originalName)) {
    if (req.file) await fsp.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ error: 'Файлът е задължителен или типът му не е разрешен.' });
  }
  const studentName = String(req.body?.studentName || '').trim().slice(0, 80);
  const studentKey = String(req.body?.studentKey || '').trim().slice(0, 120);
  const comment = String(req.body?.comment || '').trim().slice(0, 2000);
  if (!studentName || !studentKey) {
    await fsp.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ error: 'Името е задължително.' });
  }
  const file = { id: crypto.randomUUID(), originalName, storedPath: req.file.path, studentName, studentKey, comment, size: req.file.size, mimeType: req.file.mimetype, uploadedAt: Date.now() };
  room.submissions.push(file);
  res.status(201).json({ file: classroomPublicFile(file) });
});

app.get('/api/classroom/files/:fileId', async (req, res) => {
  for (const room of classroomRooms.values()) {
    const file = [...room.materials, ...room.submissions].find(item => item.id === req.params.fileId);
    if (file && room.expiresAt >= Date.now()) return res.download(file.storedPath, file.originalName);
  }
  res.status(404).json({ error: 'Файлът не е намерен.' });
});

app.get('/api/classroom/rooms/:roomId/submissions.zip', async (req, res) => {
  const room = findClassroomRoom(req, res);
  if (!room) return;
  if (req.query.teacherToken !== room.teacherToken) return res.status(403).json({ error: 'Невалиден учителски ключ.' });
  res.attachment(`${room.id}-zadaniya.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', error => { if (!res.headersSent) res.status(500).json({ error: error.message }); });
  archive.pipe(res);
  for (const file of room.submissions) archive.file(file.storedPath, { name: `${file.studentName} - ${file.originalName}` });
  await archive.finalize();
});

// In-memory news cache for resilient news feed
let newsCache = null;
let newsCacheTime = 0;
const NEWS_CACHE_DURATION = 15 * 60 * 1000; // 15 mins

const BACKEND_FALLBACK_NEWS = {
  Technologies: [
    { title: 'AI революция в образованието: Как изкуственият интелект променя начина на учене', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=90' },
    { title: 'Нови технологии за киберсигурност и защита на данните в училищата', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=90' },
    { title: 'Програмиране и компютърно моделиране в съвременното 8-класно образование', link: 'https://devstyler.bg', source: 'devstyler.bg', date: '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=90' },
    { title: 'Виртуалната и добавена реалност влизат в учебните кабинети по ИТ', link: 'https://technews.bg', source: 'technews.bg', date: '', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1600&q=90' }
  ],
  Education: [
    { title: 'МОН обяви нови стандарти и дигитални ресурси за българските училища', link: 'https://www.mon.bg', source: 'mon.bg', date: '', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90' },
    { title: 'Българските учители получиха нови интерактивни инструменти за обучение', link: 'https://prepodavame.bg', source: 'prepodavame.bg', date: '', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=90' },
    { title: 'Национална програма за подкрепа на STEM центрове в средните училища', link: 'https://ruo-sofia-grad.com', source: 'ruo-sofia-grad.com', date: '', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=90' },
    { title: 'Нови дигитални учебни платформи и ресурси за часовете по технологии', link: 'https://www.mon.bg', source: 'mon.bg', date: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=90' }
  ],
  Science: [
    { title: 'Български ученици спечелиха призови места на международна олимпиада по роботика', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=90' },
    { title: 'Пробив в квантовите изчисления и квантовата криптография', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&q=90' },
    { title: 'Научно изследване: Повишен интерес на учениците към инженерните науки и математиката', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&q=90' },
    { title: 'Български учени разработват нови методи за зелена и устойчива енергия', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=90' }
  ],
  Innovations: [
    { title: 'Български технологичен стартъп с престижно европейско признание за иновации', link: 'https://technews.bg', source: 'technews.bg', date: '', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=90' },
    { title: 'Иновативни методи за проектно-базирано обучение и работа в екип', link: 'https://prepodavame.bg', source: 'prepodavame.bg', date: '', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=90' },
    { title: 'Облачни среди и платформи за съвместна работа в училищната среда', link: 'https://devstyler.bg', source: 'devstyler.bg', date: '', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90' },
    { title: 'Дигитални иновации и автоматизация в съвременното образование', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=90' }
  ]
};

async function fetchFeedSafe(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url);
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'ok' && Array.isArray(data.items)) {
      return data.items.map(item => ({
        title: (item.title || '').replace(/<[^>]*>/g, '').trim(),
        link: item.link || '#',
        source: (item.author || (data.feed && data.feed.title) || 'Новини').replace(/<[^>]*>/g, '').trim(),
        date: item.pubDate || '',
        images: newsImageCandidates(item)
      })).filter(item => item.title && item.link && item.link !== '#');
    }
  } catch {}
  return null;
}

app.get('/api/news', async (req, res) => {
  const now = Date.now();
  if (newsCache && (now - newsCacheTime < NEWS_CACHE_DURATION)) {
    return res.json({ status: 'ok', data: newsCache, cached: true });
  }

  const result = { ...BACKEND_FALLBACK_NEWS };

  try {
    const [tech, edu, sci, inno] = await Promise.allSettled([
      fetchFeedSafe('https://www.kaldata.com/feed'),
      fetchFeedSafe('https://prepodavame.bg/feed'),
      fetchFeedSafe('https://www.sciencedaily.com/rss/all.xml'),
      fetchFeedSafe('https://devstyler.bg/blog/feed')
    ]);

    if (tech.status === 'fulfilled' && tech.value && tech.value.length) {
      result.Technologies = tech.value.slice(0, 8);
    }
    if (edu.status === 'fulfilled' && edu.value && edu.value.length) {
      result.Education = edu.value.slice(0, 8);
    }
    if (sci.status === 'fulfilled' && sci.value && sci.value.length) {
      result.Science = sci.value.slice(0, 8);
    }
    if (inno.status === 'fulfilled' && inno.value && inno.value.length) {
      result.Innovations = inno.value.slice(0, 8);
    }

    newsCache = result;
    newsCacheTime = now;
  } catch {}

  res.json({ status: 'ok', data: result, cached: false });
});

// Verify Portfolio access code (used only when the Node dev server runs -
// the public GitHub Pages build is static and verifies a SHA-256 hash in
// layout/about.js instead). The plaintext code must never be hardcoded here:
// set PORTFOLIO_ACCESS_CODE in the local environment.
app.post('/api/portfolio/verify', (req, res) => {
  const { code } = req.body || {};
  const correctCode = String(process.env.PORTFOLIO_ACCESS_CODE || '').trim();
  const inputCode = String(code || '').trim();

  if (!correctCode) {
    return res.status(503).json({ status: 'error', success: false, message: 'Достъпът не е конфигуриран.' });
  }

  if (inputCode && inputCode === correctCode) {
    return res.json({ status: 'ok', success: true });
  }
  return res.status(403).json({ status: 'error', success: false, message: 'Невалиден код за достъп.' });
});

// Clean vector illustration fallback for glossary flashcards
function generateTermFallbackSvg(term, definition) {
  const safeTerm = String(term || 'ИТ Понятие').replace(/[<>&"']/g, '').trim();
  const colors = [
    ['#1e1b4b', '#3b82f6'],
    ['#064e3b', '#10b981'],
    ['#4c1d95', '#8b5cf6'],
    ['#7c2d12', '#f97316'],
    ['#1e293b', '#06b6d4'],
    ['#14213d', '#fca311']
  ];
  const charCode = safeTerm.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const [bgDark, accent] = colors[charCode % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgDark}" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    <circle cx="320" cy="130" r="60" fill="${accent}" fill-opacity="0.15" />
    <circle cx="320" cy="130" r="42" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="6 4" />
    <circle cx="320" cy="130" r="32" fill="${accent}" fill-opacity="0.25" />
    <text x="320" y="140" text-anchor="middle" fill="#ffffff" font-size="24" font-family="system-ui, -apple-system, sans-serif" font-weight="bold">IT</text>
    <text x="320" y="220" text-anchor="middle" fill="#ffffff" font-size="22" font-family="system-ui, -apple-system, sans-serif" font-weight="700">${safeTerm}</text>
    <rect x="250" y="244" width="140" height="22" rx="11" fill="${accent}" fill-opacity="0.25" />
    <text x="320" y="259" text-anchor="middle" fill="${accent}" font-size="11" font-family="system-ui, -apple-system, sans-serif" font-weight="700" letter-spacing="1">ИТ РЕЧНИК</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// In-memory cache for generated glossary images
const glossaryImageCache = new Map();

// Generate realistic educational image prompts based on term & definition
app.post('/api/glossary/generate-prompt', async (req, res) => {
  const { term, definition } = req.body || {};
  if (!term) {
    return res.status(400).json({ status: 'error', message: 'Missing term' });
  }

  try {
    const result = await generateRealisticPromptWithGemini(term, definition || '');
    return res.json({
      status: 'ok',
      term,
      prompt: result.image_prompt,
      negative_prompt: result.negative_prompt
    });
  } catch (err) {
    const fallback = buildRealisticImagePrompt(term, definition || '');
    return res.json({
      status: 'ok',
      term,
      prompt: fallback.image_prompt,
      negative_prompt: fallback.negative_prompt
    });
  }
});

// Helper to check for local pre-rendered glossary image
function getLocalGlossaryImagePath(term) {
  if (!term) return null;
  const bgToLat = {
    "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"y",
    "к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u",
    "ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sht","ъ":"a","ь":"y","ю":"yu","я":"ya"
  };
  const s = String(term).toLowerCase().trim();
  let translit = "";
  for (let ch of s) {
    translit += bgToLat[ch] !== undefined ? bgToLat[ch] : ch;
  }
  const slug = translit.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const glossaryDir = path.join(__dirname, 'assets', 'glossary');
  if (fs.existsSync(glossaryDir)) {
    try {
      const files = fs.readdirSync(glossaryDir);
      for (const f of files) {
        const fLower = f.toLowerCase();
        const baseName = fLower.replace(/\.[^/.]+$/, '');
        if (baseName === slug || fLower === `${slug}.png` || baseName === s) {
          return `/glossary/${f}`;
        }
      }
    } catch (e) {
      console.warn('Error checking glossary images:', e);
    }
  }
  return null;
}

// Static Image URL resolver for glossary & flashcards
app.post('/api/glossary/image', async (req, res) => {
  const { term } = req.body || {};
  if (!term) {
    return res.status(400).json({ status: 'error', message: 'Missing term' });
  }

  // 1. Check if a local pre-generated image exists in assets/glossary/
  const localImage = getLocalGlossaryImagePath(term);
  if (localImage) {
    return res.json({ status: 'ok', imageUrl: localImage, fileName: getGlossaryFilename(term), source: 'local_file' });
  }

  // 2. Return primary CDN URL for ready-made glossary image
  const cdnUrl = resolveGlossaryImageUrl(term);
  const fileName = getGlossaryFilename(term);
  return res.json({
    status: 'ok',
    imageUrl: cdnUrl,
    fileName,
    source: 'static_assets'
  });
});

// Dynamic AI explanation for glossary flashcards on the fly
app.post('/api/glossary/explain', async (req, res) => {
  const { term, definition } = req.body || {};
  if (!term) {
    return res.status(400).json({ status: 'error', message: 'Missing term' });
  }

  try {
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Ти си учител по информационни технологии за 8-12 клас. Обясни на разбираем български език следното понятие: "${term}".
Дефиниция: "${definition || ''}".
Дай кратък, ясен практически пример от практиката или ежедневието (2-3 кратки изречения). Не слагай сложни въвеждащи думи, а директно полезното обяснение и пример.`
      });
      const text = response.text ? response.text.trim() : null;
      if (text) {
        return res.json({ status: 'ok', explanation: text, source: 'gemini-ai' });
      }
    }
  } catch (err) {
    console.warn('[glossary/explain] AI generation error:', err.message);
  }

  // Graceful smart educational fallback
  const fallback = `Практическо приложение: Понятието „${term}“ се прилага ежедневно в дигиталната среда за оптимизация на работните процеси и сигурността на потребителските данни.`;
  res.json({ status: 'ok', explanation: fallback, source: 'system-fallback' });
});

// Route fallback to index.html for root or SPA paths
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
