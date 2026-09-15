// Central media URL resolver for lesson content hosted in the public assets repository.

export const MEDIA_BASE_URL = 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/';

const MEDIA_KEYS = new Set([
  'src',
  'image',
  'imagePath',
  'beforeImage',
  'afterImage',
  'poster',
  'assetPath',
  'thumbnail',
  'backgroundImage'
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

  // Lesson-scoped and shared assets hosted in external media repository
  if (!/^(?:it-\d+(?:-\d+)+|kaos-\d+(?:-\d+)*|other)\//i.test(normalized)) return value;

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
  return MEDIA_KEYS.has(key) ? resolveMediaUrl(value) : value;
}