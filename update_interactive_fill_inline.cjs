const fs = require('fs');

let js = fs.readFileSync('components/interactive-fill.js', 'utf8');

js = js.replace(
  /const rows = sentences\.map\(\(item, idx\) => \{([\s\S]*?)return `\s*<div class="fill-sentence-row"[\s\S]*?<\/div>\s*`;\s*\}\)\.join\(''\);/,
  `const rows = sentences.map((item, idx) => {
    let inputControl = '';
    if (inputType === 'text') {
      inputControl = \`<input type="text" class="fill-input-text fill-select" aria-label="Термин \${idx + 1}" placeholder="Въведете тук...">\`;
    } else {
      inputControl = \`<select class="fill-select" aria-label="Термин \${idx + 1}">\${optHtml}</select>\`;
    }
    const dropWrap = \`<span class="fill-drop-wrap">\${inputControl}<span class="fill-status-ico"></span></span>\`;
    
    let contentHtml = '';
    if (item.text.includes('[blank]')) {
      contentHtml = esc(item.text).replace('\\[blank\\]', dropWrap);
      if (item.prefix) contentHtml = \`<span class="fill-prefix">\${esc(item.prefix)} </span>\` + contentHtml;
      if (item.suffix) contentHtml = contentHtml + \`<span class="fill-suffix"> \${esc(item.suffix)}</span>\`;
    } else {
      contentHtml = (item.prefix ? \`<span class="fill-prefix">\${esc(item.prefix)} </span>\` : '') +
                    dropWrap +
                    \`<span class="fill-text"> \${esc(item.text)}</span>\` +
                    (item.suffix ? \`<span class="fill-suffix"> \${esc(item.suffix)}</span>\` : '');
    }

    return \`
      <div class="fill-sentence-row" data-answer="\${esc(item.answer)}">
        <span class="fill-item-num">\${idx + 1}.</span>
        <span class="fill-text-wrapper">\${contentHtml}</span>
      </div>
    \`;
  }).join('');`
);

fs.writeFileSync('components/interactive-fill.js', js);
console.log('interactive-fill.js updated for inline blank');
