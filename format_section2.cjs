const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

function convertTextToSubsection(textItem, heading = null) {
  let sub = {
    type: "subsection",
    id: textItem.id + "-sub",
    content: [
      {
        type: "text",
        id: textItem.id,
        content: textItem.content
      }
    ]
  };
  if (heading) {
    sub.heading = heading;
  }
  return sub;
}

const items = data.components[0].items;

items.forEach(section => {
  if (section.id === 'section-web-search') {
    let content = section.content;
    const theoryIndex = content.findIndex(c => c.id === 'web-search-theory-text');
    if (theoryIndex !== -1) {
      let t = content[theoryIndex];
      t.content = t.content.replace('### Основни понятия<br>', '');
      content[theoryIndex] = convertTextToSubsection(t, "Основни понятия");
    }
  }
});

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Formatted web-search-theory-text');
