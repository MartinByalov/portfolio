const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

css += `
.fill-item-num {
  margin-top: 4px;
}
.fill-status-ico {
  display: inline-flex;
  margin-left: 6px;
}
`;
fs.writeFileSync('styles/components.css', css);
console.log('Fixed item num alignment');
