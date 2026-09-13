const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

css = css.replace(
  '.fill-sentence-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;',
  '.fill-sentence-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;'
);

fs.writeFileSync('styles/components.css', css);
console.log('Fixed row alignment to top');
