const fs = require('fs');

let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

// We will change the HTML generation logic in interactive-fill.js
// From:
// const optHtml = `<option value="">-- Изберете термин --</option>`
//   + sortedOptions.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
//
// const rows = sentences.map((item, idx) => {
//   return `
//     <div class="fill-sentence-row" data-answer="${esc(item.answer)}">
//       <span class="fill-item-num">${idx + 1}.</span>
//       ${item.prefix ? `<span class="fill-prefix">${esc(item.prefix)} </span>` : ''}
//       <span class="fill-drop-wrap">
//         <select class="fill-select" aria-label="Термин ${idx + 1}">${optHtml}</select>
//         <span class="fill-status-ico"></span>
//       </span>
//       <span class="fill-text"> ${esc(item.text)}</span>
//       ${item.suffix ? `<span class="fill-suffix"> ${esc(item.suffix)}</span>` : ''}
//     </div>
//   `;
// }).join('');

// To: handle inputType
// We can use a regex to replace the render function body carefully.

js = js.replace(
  /const optHtml = `<option value="">-- Изберете термин --<\/option>`[\s\S]*?const rows = sentences.map\(\(item, idx\) => \{([\s\S]*?)return `\s*<div class="fill-sentence-row"[\s\S]*?<\/div>\s*`;\s*\}\)\.join\(''\);/,
  `const inputType = comp.inputType || 'select';
  const optHtml = \`<option value="">-- Изберете термин --</option>\`
    + sortedOptions.map(o => \`<option value="\${esc(o)}">\${esc(o)}</option>\`).join('');
  const rows = sentences.map((item, idx) => {
    let inputControl = '';
    if (inputType === 'text') {
      inputControl = \`<input type="text" class="fill-input-text fill-select" aria-label="Термин \${idx + 1}" placeholder="Въведете тук...">\`;
    } else {
      inputControl = \`<select class="fill-select" aria-label="Термин \${idx + 1}">\${optHtml}</select>\`;
    }
    return \`
      <div class="fill-sentence-row" data-answer="\${esc(item.answer)}">
        <span class="fill-item-num">\${idx + 1}.</span>
        \${item.prefix ? \`<span class="fill-prefix">\${esc(item.prefix)} </span>\` : ''}
        <span class="fill-drop-wrap">
          \${inputControl}
          <span class="fill-status-ico"></span>
        </span>
        <span class="fill-text"> \${esc(item.text)}</span>
        \${item.suffix ? \`<span class="fill-suffix"> \${esc(item.suffix)}</span>\` : ''}
      </div>
    \`;
  }).join('');`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('interactive-fill.js updated for inputType');
