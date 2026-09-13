const fs = require('fs');
let css = fs.readFileSync('styles/components.css', 'utf8');

// For incorrect answers in input text, if we show the correct answer, we might want to make it look a bit different, 
// or at least not red if we are showing the *correct* text now. But standard behavior is fine.
// The user just requested that the text gets filled.

console.log('CSS OK');
