const fs = require('fs');
let code = fs.readFileSync('components/venn-logic-diagram.js', 'utf8');

// The original code for tab buttons:
// <span class="venn-op-name">${esc(op.name)}</span>
// <span class="venn-op-query"><code>${esc(op.query)}</code></span>

// we just remove the op.name so it just shows the query
code = code.replace(
  '<span class="venn-op-name">${esc(op.name)}</span>',
  ''
);

fs.writeFileSync('components/venn-logic-diagram.js', code);
console.log('Fixed venn buttons');
