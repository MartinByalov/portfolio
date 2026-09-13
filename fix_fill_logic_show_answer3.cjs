const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(
  "} else {\\n        r.classList.add('fill-incorrect');\\n        r.classList.remove('fill-correct');\\n        if (ico) ico.innerHTML = '<i class=\"fas fa-circle-xmark text-rose-600\"></i>';\\n      }",
  `} else {
        r.classList.add('fill-incorrect');
        r.classList.remove('fill-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
        if (sel.tagName.toUpperCase() === 'INPUT') {
          sel.value = target;
        }
      }`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Added auto-fill correct answer logic version 3');
