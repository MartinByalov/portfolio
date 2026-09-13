const fs = require('fs');

let css = fs.readFileSync('styles/components.css', 'utf8');

css = css.replace(
  /\.lb-viz \.lb-image,\n\.titled-image {\n  margin: 0 auto 32px auto;\n  max-width: 640px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}/g,
  `.lb-viz .lb-image,
.titled-image {
  margin: 0 auto 32px auto;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: none;
  background: transparent;
  padding: 0;
}`
);

fs.writeFileSync('styles/components.css', css);

let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const contentList = data.components[0].items[0].content;

// 1. Remove caption for img-concept-map
const conceptMap = contentList.find(c => c.id === 'img-concept-map');
if (conceptMap) {
  delete conceptMap.caption;
}

// 2. Remove the element with id windows11-search-comparison-image
const newContentList = contentList.filter(c => c.id !== 'windows11-search-comparison-image');
data.components[0].items[0].content = newContentList;

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
