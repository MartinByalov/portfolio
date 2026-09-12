import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

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

// Serve static assets from project root
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

// In-memory cache for generated glossary images
const glossaryImageCache = new Map();

// Cloudflare Workers AI Image Generation for glossary & flashcards
app.post('/api/glossary/image', async (req, res) => {
  const { term, definition } = req.body || {};
  if (!term) {
    return res.status(400).json({ status: 'error', message: 'Missing term' });
  }

  const cacheKey = String(term).trim().toLowerCase();
  if (glossaryImageCache.has(cacheKey)) {
    return res.json({ status: 'ok', imageUrl: glossaryImageCache.get(cacheKey), cached: true, source: 'cloudflare-workers-ai' });
  }

  const endpoint = 'https://lucky-cloud-1c42.byalov-v-martin.workers.dev';
  const prompt = `3D isometric digital art illustration of ${term}, clean tech icon style, vibrant educational computer science concept, studio lighting`;
  
  const payload = {
    prompt: prompt,
    negative_prompt: 'blurry, low quality, distorted',
    width: 1024,
    height: 1024,
    steps: 4,
    guidance: 7.5
  };

  const headers = { 'Content-Type': 'application/json' };
  const authToken = (process.env.CLOUDFLARE_AI_TOKEN || process.env.WORKER_AI_TOKEN || process.env.CF_AI_TOKEN || '').trim();
  if (authToken) {
    headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type') || '';

    if (response.ok && contentType.includes('image')) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;
      glossaryImageCache.set(cacheKey, dataUrl);
      return res.json({ status: 'ok', imageUrl: dataUrl, source: 'cloudflare-workers-ai' });
    }

    // If worker returned JSON error (e.g. { error: '...', details: '...' })
    let errorInfo = null;
    try {
      errorInfo = await response.json();
    } catch (_) {}

    console.warn('[glossary/image] Cloudflare Workers AI response:', response.status, errorInfo);
    return res.json({
      status: 'error',
      imageUrl: null,
      error: errorInfo?.error || `HTTP ${response.status}`,
      details: errorInfo?.details || null
    });
  } catch (err) {
    console.warn('[glossary/image] Network error calling Cloudflare Workers AI:', err.message);
    return res.status(500).json({ status: 'error', imageUrl: null, message: err.message });
  }
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
