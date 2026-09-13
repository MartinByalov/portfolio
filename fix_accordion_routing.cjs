const fs = require('fs');
let code = fs.readFileSync('components/accordion.js', 'utf8');

code = code.replace(
  "case 'interactive-matching':\n    case 'match-pairs':            return InteractiveMatching.render(b);",
  "case 'interactive-matching':\n    case 'scattered-matching':\n    case 'match-pairs':            return InteractiveMatching.render(b);"
);

code = code.replace(
  "if (b.type === 'interactive-matching' || b.type === 'match-pairs') InteractiveMatching.init(b);",
  "if (b.type === 'interactive-matching' || b.type === 'scattered-matching' || b.type === 'match-pairs') InteractiveMatching.init(b);"
);

fs.writeFileSync('components/accordion.js', code);
console.log('Updated accordion.js routing for scattered-matching');
