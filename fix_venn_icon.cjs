const fs = require('fs');
let code = fs.readFileSync('components/venn-logic-diagram.js', 'utf8');

// Also remove it completely from the JS rendering logic if it somehow comes back
code = code.replace(
  '<div class="interactive-card-badge">\n          <i class="fas fa-cubes"></i>',
  '<div class="interactive-card-badge">'
);

fs.writeFileSync('components/venn-logic-diagram.js', code);
console.log('Fixed venn icon');
