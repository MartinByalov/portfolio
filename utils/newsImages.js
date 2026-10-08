// Prefer full-size article images, but retain the original URL if an upgraded version is unavailable.
export function upgradeNewsImageUrl(value) {
  if (typeof value !== 'string') return '';
  let url = value.trim();
  if (url.startsWith('//')) url = `https:${url}`;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    parsed.pathname = parsed.pathname
      .replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/i, '')
      .replace(/\/(?:s|w)\d+\//, '/')
      .replace(/\/p\d+x\d+\//, '/')
      .replace(/\/default\.jpg$/i, '/hqdefault.jpg');
    // Width parameters on image CDNs are explicit requests for a small image.
    if (/images\.unsplash\.com$/.test(parsed.hostname)) {
      parsed.searchParams.set('w', '1600');
      parsed.searchParams.set('q', '85');
    }
    return parsed.href;
  } catch {
    return '';
  }
}

function contentImages(html) {
  if (typeof html !== 'string') return [];
  return [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
}

export function newsImageCandidates(item) {
  const images = [
    item?.enclosure?.link,
    item?.['media:content']?.url,
    ...contentImages(item?.content || item?.description || item?.summary),
    item?.['media:thumbnail']?.url,
    item?.thumbnail,
    ...(Array.isArray(item?.images) ? item.images : []),
    item?.image
  ];
  const unique = new Set();
  for (const image of images) {
    const original = typeof image === 'string' ? image.trim() : '';
    const upgraded = upgradeNewsImageUrl(original);
    if (upgraded) unique.add(upgraded);
    if (original && upgraded !== original && upgraded) unique.add(original.startsWith('//') ? `https:${original}` : original);
  }
  return [...unique];
}