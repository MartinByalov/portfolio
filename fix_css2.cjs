const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

// The first element in accordion content has padding-top applied by the accordion-content itself.
// .component.accordion .accordion-content {
//   padding: 16px 22px 26px;
// }
// We can use a special class for the first titled-image inside accordion-content if it's the very first child.
css += `
.accordion-content > .titled-image:first-child {
  margin-top: -10px;
}
`;

fs.writeFileSync('styles/components.css', css);
console.log('Fixed css top margin');
