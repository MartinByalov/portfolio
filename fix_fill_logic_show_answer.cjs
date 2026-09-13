const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(
  /\} else \{(\s+)r\.classList\.add\('fill-incorrect'\);(\s+)r\.classList\.remove\('fill-correct'\);(\s+)if \(ico\) ico\.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"><\\/i>';(\s+)\}/,
  `} else {
        r.classList.add('fill-incorrect');
        r.classList.remove('fill-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
        // Auto-fill correct answer if wrong
        if (inputType === 'text') {
          sel.value = target; // Show the correct answer
        }
      }`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Added auto-fill correct answer logic');
