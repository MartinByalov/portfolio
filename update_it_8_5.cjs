const fs = require('fs');

let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

function traverse(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.type === 'image-with-instruction') {
      obj.type = 'titled-image';
      obj.src = obj.imagePath;
      obj.alt = obj.title;
      obj.caption = obj.title;
      delete obj.imagePath;
      delete obj.title;
      delete obj.userUploadInstruction;
    }
    for (const key in obj) {
      traverse(obj[key]);
    }
  }
}

traverse(data);

// Also let's fix \n\n to <br><br> in text contents, to match it-8-3?
// Actually markdown parses \n\n as <p>, which is fine. But wait, in it-8-3: "<br><br>**Примери... "
// Maybe we can just replace "\n\n•" with "<br><br>•" and "\n•" with "<br>•" for all text blocks to be safe?
// Let's just leave the text as is if it's already markdown, but check if there's any obvious issue.
function fixText(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(fixText);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.type === 'text' && obj.content) {
      // replace markdown lists with HTML <br> lists to match it-8-3 style if desired, 
      // but standard markdown lists usually work fine.
      // Wait, standard markdown lists:
      // - Item 1
      // - Item 2
      // Here they used "• " instead of "- ". Marked doesn't parse "• " as a list! It parses it as a paragraph.
      // That's why it looks glued together!
      obj.content = obj.content.replace(/\n\n• /g, '<br><br>• ');
      obj.content = obj.content.replace(/\n• /g, '<br>• ');
      
      // Also fix \n\n to <br><br> if there are plain paragraphs that are not bullet points
      // Actually standard \n\n works as paragraph.
    }
    for (const key in obj) {
      fixText(obj[key]);
    }
  }
}

fixText(data);

fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Updated lessons/it-8/it-8-5.json');
