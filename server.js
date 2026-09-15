import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { buildRealisticImagePrompt, generateRealisticPromptWithGemini, STANDARD_NEGATIVE_PROMPT } from './utils/promptGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

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

// Serve static assets from project root and assets directory
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  index: ['index.html']
}));

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
        image: item.thumbnail || (item.enclosure && item.enclosure.link) || ''
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

// Verify Portfolio access code stored in .env
app.post('/api/portfolio/verify', (req, res) => {
  const { code } = req.body || {};
  const correctCode = String(process.env.PORTFOLIO_ACCESS_CODE || '123456').trim();
  const inputCode = String(code || '').trim();

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

// Realistic Image Generation for glossary & flashcards via Cloudflare Workers AI
app.post('/api/glossary/image', async (req, res) => {
  const { term, definition, prompt: customPrompt, negative_prompt: customNegativePrompt } = req.body || {};
  if (!term) {
    return res.status(400).json({ status: 'error', message: 'Missing term' });
  }

  const cacheKey = String(term).trim().toLowerCase();
  if (glossaryImageCache.has(cacheKey)) {
    const cachedItem = glossaryImageCache.get(cacheKey);
    const imageUrl = typeof cachedItem === 'string' ? cachedItem : cachedItem.imageUrl;
    const promptUsed = typeof cachedItem === 'string' ? '' : cachedItem.prompt;
    return res.json({ status: 'ok', imageUrl, prompt: promptUsed, cached: true, source: 'cache' });
  }

  // Derive photorealistic prompt and negative prompt
  let activePrompt = (customPrompt || '').trim();
  let activeNegativePrompt = (customNegativePrompt || '').trim();

  if (!activePrompt) {
    const promptObj = await generateRealisticPromptWithGemini(term, definition || '');
    activePrompt = promptObj.image_prompt;
    if (!activeNegativePrompt) activeNegativePrompt = promptObj.negative_prompt;
  }
  if (!activeNegativePrompt) {
    activeNegativePrompt = STANDARD_NEGATIVE_PROMPT;
  }

  const authToken = (process.env.CLOUDFLARE_AI_TOKEN || process.env.WORKER_AI_TOKEN || process.env.CF_AI_TOKEN || '').trim();

  // If a valid Cloudflare AI token is configured, execute realistic image generation
  if (authToken) {
    try {
      const endpoint = 'https://lucky-cloud-1c42.byalov-v-martin.workers.dev';
      const payload = {
        prompt: activePrompt,
        negative_prompt: activeNegativePrompt,
        width: 1024,
        height: 1024,
        steps: 4,
        guidance: 7.5
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && (contentType.includes('image') || contentType.includes('application/octet-stream'))) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = contentType.includes('jpeg') || contentType.includes('jpg') ? 'image/jpeg' : 'image/png';
        const dataUrl = `data:${mimeType};base64,${base64}`;
        glossaryImageCache.set(cacheKey, { imageUrl: dataUrl, prompt: activePrompt });
        return res.json({ status: 'ok', imageUrl: dataUrl, prompt: activePrompt, source: 'cloudflare-workers-ai' });
      }
    } catch (_) {
      // Fall through to fallback SVG below
    }
  }

  // Graceful fallback to SVG vector card for the term
  const fallbackSvg = generateTermFallbackSvg(term, definition);
  glossaryImageCache.set(cacheKey, { imageUrl: fallbackSvg, prompt: activePrompt });
  return res.json({ status: 'ok', imageUrl: fallbackSvg, prompt: activePrompt, source: 'vector-fallback' });
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
  console.log(`Server running on http://${HOST}:${PORT}`);
});
