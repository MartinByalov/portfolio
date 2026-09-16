// Central media URL resolver for lesson content hosted in the public assets repository.

export const MEDIA_BASE_URL = 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/';
export const RAW_GITHUB_BASE_URL = 'https://raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/';

const MEDIA_KEYS = new Set([
  'src',
  'image',
  'imagePath',
  'beforeImage',
  'afterImage',
  'poster',
  'assetPath',
  'thumbnail',
  'backgroundImage',
  'path',
  'fileName',
  'img',
  'logo',
  'iconImage'
]);

export function resolveMediaUrl(value) {
  if (typeof value !== 'string') return value;
  const path = value.trim();
  if (!path || path.includes('IMAGE_PLACEHOLDER')) return value;
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;

  const normalized = path
    .replace(/^\.\//, '')
    .replace(/^\/assets\//, '')
    .replace(/^assets\//, '')
    .replace(/^\/images\//, 'other/')
    .replace(/^images\//, 'other/')
    .replace(/^\/src\/assets\/images\//, 'other/')
    .replace(/^src\/assets\/images\//, 'other/');

  // Lesson-scoped, shared, and glossary assets hosted in external media repository
  if (!/^(?:it-\d+(?:-\d+)*|kaos-\d+(?:-\d+)*|other|glossary)\//i.test(normalized)) return value;

  return MEDIA_BASE_URL + normalized.split('/').map(encodeURIComponent).join('/');
}

export function resolveLessonMedia(value, key = '') {
  if (Array.isArray(value)) {
    return value.map(item => resolveLessonMedia(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        resolveLessonMedia(childValue, childKey)
      ])
    );
  }
  if (typeof value === 'string') {
    if (MEDIA_KEYS.has(key)) {
      return resolveMediaUrl(value);
    }
    // Also resolve relative image src in HTML content strings
    if (value.includes('<img') || value.includes('src=')) {
      return value.replace(/src=["']((?:\.?\/?assets\/)?(?:it-\d+(?:-\d+)+|kaos-\d+(?:-\d+)*|other)\/[^"']+)["']/gi, (match, p1) => {
        return `src="${resolveMediaUrl(p1)}"`;
      });
    }
  }
  return value;
}
