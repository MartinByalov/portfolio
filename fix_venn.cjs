const fs = require('fs');
let code = fs.readFileSync('components/venn-logic-diagram.js', 'utf8');

// The icon is inside the title badge in venn-logic-diagram:
// <div class="interactive-card-badge">
//   <i class="fas fa-cubes"></i>
//   <span>${esc(title)}</span>
// </div>

code = code.replace('<i class="fas fa-cubes"></i>', '');

fs.writeFileSync('components/venn-logic-diagram.js', code);
console.log('Fixed venn title icon');
