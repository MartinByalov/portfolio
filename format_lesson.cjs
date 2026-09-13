const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

// Go to the main accordion items
const items = data.components[0].items;

// Helper to convert text to HTML paragraphs if not already, and wrap in subsection
function convertTextToSubsection(textItem, heading = null) {
  let contentStr = textItem.content;
  // If it has <br>, split by <br> or <br><br> and wrap in <p>
  // Wait, if it's already using bullet points, maybe wrap the whole thing in <p> and <ul>?
  // Let's just create a subsection block with the same text, but maybe use <p> tags.
  // Actually, standard marked.js parses Markdown to HTML, but lb-subsection gives the bold left border!
  
  let sub = {
    type: "subsection",
    id: textItem.id + "-sub",
    content: [
      {
        type: "text",
        id: textItem.id,
        content: contentStr
      }
    ]
  };
  
  if (heading) {
    sub.heading = heading;
  }
  
  return sub;
}

items.forEach(section => {
  if (section.id === 'section-local-search-win11') {
    let content = section.content;
    
    // 1. Find img-concept-map and local-search-win11-intro
    const mapIndex = content.findIndex(c => c.id === 'img-concept-map');
    const introIndex = content.findIndex(c => c.id === 'local-search-win11-intro');
    
    if (mapIndex !== -1 && introIndex !== -1 && mapIndex < introIndex) {
      // Swap them
      const temp = content[mapIndex];
      content[mapIndex] = content[introIndex];
      content[introIndex] = temp;
    }
    
    // Now local-search-win11-intro is first. Let's make it a subsection
    const newIntroIndex = content.findIndex(c => c.id === 'local-search-win11-intro');
    if (newIntroIndex !== -1) {
      let t = content[newIntroIndex];
      // Convert to subsection
      content[newIntroIndex] = convertTextToSubsection(t);
    }
    
    const extIndex = content.findIndex(c => c.id === 'file-extensions-explanation');
    if (extIndex !== -1) {
      let t = content[extIndex];
      // The text has ### Търсене по име и разширение
      t.content = t.content.replace('### Търсене по име и разширение\n', '');
      content[extIndex] = convertTextToSubsection(t, "Търсене по име и разширение");
    }
    
    const filterDetailsIndex = content.findIndex(c => c.id === 'file-explorer-filters-details');
    if (filterDetailsIndex !== -1) {
      let t = content[filterDetailsIndex];
      t.content = t.content.replace('### Филтри за локално търсене във File Explorer\n', '');
      content[filterDetailsIndex] = convertTextToSubsection(t, "Филтри за локално търсене във File Explorer");
    }
  }
  
  if (section.id === 'section-web-search') {
    let content = section.content;
    
    const introIndex = content.findIndex(c => c.id === 'web-search-intro');
    if (introIndex !== -1) {
      let t = content[introIndex];
      content[introIndex] = convertTextToSubsection(t);
    }
    
    const logicSearchText = content.findIndex(c => c.id === 'logic-search-text');
    if (logicSearchText !== -1) {
      let t = content[logicSearchText];
      content[logicSearchText] = convertTextToSubsection(t, "Основни оператори за търсене");
    }
    
    const credibilityText = content.findIndex(c => c.id === 'credibility-criteria-text');
    if (credibilityText !== -1) {
      let t = content[credibilityText];
      content[credibilityText] = convertTextToSubsection(t, "Критерии за оценка на достоверността на източник");
    }
  }
});

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Formatted text to subsections');
