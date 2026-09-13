const fs = require('fs');

let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

const contentList = data.components[0].items[0].content;

const galleryBlock = {
  "type": "image-gallery",
  "id": "search-comparison-gallery",
  "title": "Локално търсене: Taskbar Search срещу File Explorer",
  "items": [
    {
      "src": "assets/it-8-5/win11_search_ui.jpg",
      "alt": "Taskbar Search",
      "title": "Taskbar Search"
    },
    {
      "src": "assets/it-8-5/fileExplorer.png",
      "alt": "File Explorer",
      "title": "File Explorer"
    }
  ]
};

// Insert after 'local-search-win11-intro'
const insertIndex = contentList.findIndex(c => c.id === 'local-search-win11-intro') + 1;
contentList.splice(insertIndex, 0, galleryBlock);

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Gallery inserted');
