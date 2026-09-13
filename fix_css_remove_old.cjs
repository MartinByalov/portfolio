const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

// The original one I added earlier:
// input.fill-input-text {
//   min-width: 180px;
//   font-family: inherit;
// }

css = css.replace(/input\.fill-input-text\s*\{\s*min-width: 180px;\s*font-family: inherit;\s*\}/g, '');

fs.writeFileSync('styles/components.css', css);
console.log('cleaned up old css');
