const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

css += `
input.fill-input-text {
  min-width: 180px;
  font-family: inherit;
}
`;

fs.writeFileSync('styles/components.css', css);
console.log('updated css');
