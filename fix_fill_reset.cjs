const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(/resetBtn\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/, `resetBtn.addEventListener('click', () => {
    let allCorrect = true;
    rows.forEach(r => {
      if (!r.classList.contains('fill-correct')) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      // If everything was correct and they clicked reset, they probably want to restart the whole task
      rows.forEach(r => {
        r.classList.remove('fill-correct', 'fill-incorrect');
        const sel = r.querySelector('.fill-select');
        if (sel) { sel.value = ''; sel.disabled = false; }
      });
    } else {
      // Partially correct, just keep the correct ones
      rows.forEach(r => {
        const isCorrect = r.classList.contains('fill-correct');
        const sel = r.querySelector('.fill-select');
        if (!isCorrect) {
          r.classList.remove('fill-correct', 'fill-incorrect');
          if (sel) { sel.value = ''; sel.disabled = false; }
        }
      });
    }

    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });`);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Fixed fill reset when all correct');
