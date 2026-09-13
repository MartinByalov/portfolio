const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(
  /if \(sel\.value\.trim\(\)\.toLowerCase\(\) === target\.trim\(\)\.toLowerCase\(\)\) \{/,
  `const val = sel.value.trim().toLowerCase();
      if (val === '') {
        // If it's empty, we just skip styling for incorrect/correct, but we disable it
        r.classList.remove('fill-correct', 'fill-incorrect');
        if (ico) ico.innerHTML = '';
      } else if (val === target.trim().toLowerCase()) {`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Fixed fill empty logic');
