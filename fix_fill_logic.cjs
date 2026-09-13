const fs = require('fs');
let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(
  /if \(answered < rows\.length\) \{[\s\S]*?return;\s*\}/,
  `if (answered === 0) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, попълнете поне едно изречение!';
      feedback.className = 'fill-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('Fixed fill logic');
