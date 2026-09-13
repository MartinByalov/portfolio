const fs = require('fs');
let data = JSON.parse(fs.readFileSync('lessons/it-8/it-8-5.json', 'utf8'));

function traverse(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.id === 'wb-task2-interactive') {
      obj.sentence1 = "[blank] са специални програми, които събират информация от всички достъпни страници в интернет, обработват я и я съхраняват в огромни бази от данни.";
      obj.sentence2 = "[blank] са програми, предоставящи възможност за търсене едновременно чрез няколко от популярните търсачки.";
      obj.sentence3 = "За да се свърже с търсещите машини, потребителят използва програма [blank], която отправя заявка и получава резултат.";
    }
    for (const key in obj) {
      traverse(obj[key]);
    }
  }
}

traverse(data);
fs.writeFileSync('lessons/it-8/it-8-5.json', JSON.stringify(data, null, 2));
console.log('Updated JSON with [blank] placeholders');
