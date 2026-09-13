const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

css = css.replace(
  'margin: 0 auto 32px auto;',
  'margin: 0 auto 16px auto;'
);

fs.writeFileSync('styles/components.css', css);
console.log('Fixed titled-image margin');
