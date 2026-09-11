import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

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

// Route fallback to index.html for root or SPA paths
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
