const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

// find "Задача 2. Провери съответствията" which is wb-task2-interactive
function traverse(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.id === 'wb-task2-interactive') {
      obj.inputType = 'text';
    }
    for (const key in obj) {
      traverse(obj[key]);
    }
  }
}

traverse(data);
fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Added inputType: text to wb-task2-interactive in it-8-5.json');
