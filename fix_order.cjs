const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const content = data.components[0].items.find(i => i.id === 'section-local-search-win11').content;
const subIndex = content.findIndex(c => c.id === 'local-search-win11-intro-sub');
const imgIndex = content.findIndex(c => c.id === 'img-concept-map');

if (subIndex !== -1 && imgIndex !== -1 && subIndex < imgIndex) {
  const temp = content[subIndex];
  content[subIndex] = content[imgIndex];
  content[imgIndex] = temp;
}

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Swapped image and text');
