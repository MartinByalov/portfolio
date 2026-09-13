const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace("if (ico) ico.innerHTML = '<i class=\"fas fa-circle-check text-emerald-600\"></i>';", "");
js = js.replace("if (ico) ico.innerHTML = '<i class=\"fas fa-circle-xmark text-rose-600\"></i>';", "");
js = js.replace("if (ico) ico.innerHTML = '';", "");
js = js.replace("if (ico) ico.innerHTML = '';", "");

js = js.replace(/resetBtn\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/, `resetBtn.addEventListener('click', () => {
    let allCorrect = true;
    rows.forEach(r => {
      const isCorrect = r.classList.contains('fill-correct');
      const sel = r.querySelector('.fill-select');
      
      if (isCorrect) {
        // Leave it as is.
      } else {
        allCorrect = false;
        r.classList.remove('fill-correct', 'fill-incorrect');
        if (sel) { sel.value = ''; sel.disabled = false; }
      }
    });
    feedback.style.display = 'none';
    if (!allCorrect) {
      submitBtn.style.display = 'inline-flex';
      resetBtn.style.display = 'none';
    }
  });`);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Fixed fill logic for icons and reset');
