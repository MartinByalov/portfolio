import test from 'node:test';
import assert from 'node:assert/strict';
import { newsImageCandidates, upgradeNewsImageUrl } from './newsImages.js';

test('prefers full-size media and article content over the feed thumbnail', () => {
  const candidates = newsImageCandidates({
    enclosure: { link: 'https://example.com/article-1200x800.jpg' },
    content: '<p><img src="https://example.com/story-1000x600.webp"></p>',
    thumbnail: 'https://example.com/thumb-150x150.jpg'
  });
  assert.deepEqual(candidates, [
    'https://example.com/article.jpg',
    'https://example.com/article-1200x800.jpg',
    'https://example.com/story.webp',
    'https://example.com/story-1000x600.webp',
    'https://example.com/thumb.jpg',
    'https://example.com/thumb-150x150.jpg'
  ]);
});

test('rejects non-http images and upgrades explicitly small image URLs', () => {
  assert.equal(upgradeNewsImageUrl('javascript:alert(1)'), '');
  assert.equal(upgradeNewsImageUrl('//example.com/s120/photo.jpg'), 'https://example.com/photo.jpg');
  assert.deepEqual(newsImageCandidates({ image: 'https://example.com/cover.png' }), ['https://example.com/cover.png']);
});