const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const contentList = data.components[0].items.find(i => i.id === 'section-local-search-win11').content;

const newContent = contentList.filter(c => c.id !== 'img-wildcards-table' && c.id !== 'wildcard-symbols-interactive');

data.components[0].items.find(i => i.id === 'section-local-search-win11').content = newContent;

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Removed wildcard blocks');
