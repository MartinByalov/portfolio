// Generates the SHA-256 hash used by the portfolio access gate.
//
// Run LOCALLY only - never commit the plaintext code to the repository:
//   node scripts/generate-portfolio-hash.js           -> random 6-character code
//   node scripts/generate-portfolio-hash.js "A4b!9z"  -> hash for your own code
//
// Copy the printed hash into PORTFOLIO_CODE_HASH in layout/about.js.
// The plaintext code itself must live nowhere in the repo (GitHub Pages
// serves static files, so anything committed is public).

import { createHash, randomInt } from 'node:crypto';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?';

let code = process.argv[2];
let generated = false;

if (code === undefined) {
  code = Array.from({ length: 6 }, () => CHARSET[randomInt(0, CHARSET.length)]).join('');
  generated = true;
}

if (!/^\S{6}$/.test(code)) {
  console.error('Грешка: кодът трябва да е точно 6 символа без интервали (напр. "A4b!9z").');
  process.exit(1);
}

const hash = createHash('sha256').update(code, 'utf8').digest('hex');

console.log('Хеш за layout/about.js -> PORTFOLIO_CODE_HASH:');
console.log(hash);
if (generated) {
  console.log('');
  console.log('Новият код (запишете го на сигурно място - няма да се покаже отново и не се съхранява никъде):');
  console.log(code);
}
